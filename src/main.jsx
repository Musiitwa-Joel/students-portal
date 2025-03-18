import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { ConfigProvider, theme } from "antd";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Loading from "./SplashScreen/Loading.jsx";
import { AuthProvider } from "./auth/AuthContext.jsx";
import ApolloSetup from "./ApolloSetup.jsx";
import ForgotPasswordPage from "./auth/ForgotPassword.jsx";
import App from "./App.jsx";

const Login = lazy(() => import("./auth/Login.jsx"));
// const App = lazy(() => import("./App.jsx"));

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
              algorithm: [defaultAlgorithm, compactAlgorithm],
            }}
            direction="ltr"
          >
            <RouterProvider router={router} />
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
    }, 400); // Matches the CSS transition
  }
});
