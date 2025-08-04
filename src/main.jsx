import { useState, useEffect, StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider, theme } from "antd";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Loading from "./SplashScreen/Loading.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import ApolloSetup from "./ApolloSetup.jsx";
import ForgotPasswordPage from "./auth/ForgotPassword.jsx";
import Instructions from "./pages/evoting/Instructions.jsx";
import App from "./App.jsx";
import MobileLanding from "./mobile/mobile-landing.jsx";
import UpcomingElections from "./pages/evoting/UpcomingElections.jsx";
import NetworkStatusIndicator from "./network/NetworkStatusIndicator.jsx"; // Import the new component

const Login = lazy(() => import("./auth/Login.jsx"));

function useMobileDetect() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function checkMobile() {
      const userAgent = window.navigator.userAgent;
      const iPad = userAgent.match(/iPad/i);
      const iPadPro =
        iPad &&
        window.devicePixelRatio >= 2 &&
        window.matchMedia("(min-width: 1024px)").matches;

      const mobile = Boolean(
        userAgent.match(
          /Android|BlackBerry|iPhone|iPod|Opera Mini|IEMobile|WPDesktop/i
        ) ||
          (iPad && !iPadPro)
      );

      const isMobileView = window.innerWidth <= 1024;
      setIsMobile(mobile && isMobileView);
    }

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

function MobileRedirect({ children }) {
  const isMobile = useMobileDetect();

  if (isMobile) {
    return <MobileLanding />;
  }

  return children;
}

const router = createMemoryRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/home",
    element: <App />,
  },
  {
    path: "/instructions",
    element: <Instructions />,
  },
  {
    path: "/upcoming-elections",
    element: <UpcomingElections />,
  },
]);

const { defaultAlgorithm, compactAlgorithm } = theme;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense fallback={<Loading />}>
      <AuthProvider>
        <ApolloSetup>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#0832b7",
                colorTextBase: "#0832b7",
                colorWarning: "#faad14",
                colorPrime: "#91a4df",
                colorBgBase: "",
              },
              algorithm: [compactAlgorithm],
            }}
            direction="ltr"
          >
            <MobileRedirect>
              <NetworkStatusIndicator /> {/* Add component here */}
              <RouterProvider router={router} />
            </MobileRedirect>
          </ConfigProvider>
        </ApolloSetup>
      </AuthProvider>
    </Suspense>
  </StrictMode>
);

window.addEventListener("load", () => {
  const splashScreen = document.getElementById("splash-screen");
  if (splashScreen) {
    splashScreen.style.opacity = "0";
    setTimeout(() => {
      splashScreen.style.display = "none";
    }, 400);
  }
});
