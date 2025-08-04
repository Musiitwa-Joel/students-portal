import React, { useContext, useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Card,
  Typography,
  Image,
  theme,
  message,
} from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../gql/mutation";
import { AuthContext } from "./AuthContext";
import { ChevronRight } from "lucide-react";
import { motion, useAnimation } from "framer-motion";

const { useToken } = theme;
const { Title, Text } = Typography;

const LoginPage = () => {
  const controls = useAnimation();
  const { token } = useToken();
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [login, { error, loading: logingIn, data }] = useMutation(LOGIN);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [backgroundStyles, setBackgroundStyles] = useState({});
  const [colorConfig, setColorConfig] = useState({
    primaryColor: token.colorPrimary,
    textColor: "#000000",
    secondaryTextColor: "#6b7280",
    buttonTextColor: "#ffffff",
    cardBackground: "rgba(255, 255, 255, 0.9)",
    cardBorderColor: token.colorPrimary,
  });
  useEffect(() => {
    const interval = setInterval(() => {
      controls.start({
        y: [0, -2, 0], // subtle bounce
        transition: { duration: 0.6, ease: "easeInOut" },
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [controls]);

  const handleClick = () => {
    window.open("https://tredumo.com/privacy", "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    if (error) {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    }
  }, [error]);

  // Check for holidays and set background image, styles, and color config
  useEffect(() => {
    const today = new Date();
    const month = today.getMonth(); // 0-based (0 = January, 11 = December)
    const day = today.getDate();

    // Define holidays with dates, images, styles, and color configurations
    const holidays = [
      {
        month: 11,
        day: 25,
        image: "https://tredumo.com/uploads/christmas.svg", // Christmas SVG
        styles: {
          backgroundSize: "contain",
          backgroundPosition: "right top", // Stick to top-left corner
          backgroundRepeat: "no-repeat",
          opacity: 1, // Full opacity for clear visibility
          filter: "saturate(1.5)",
        },
        colors: {
          primaryColor: "#D4A017", // Gold for Christmas
          textColor: "#3C2F2F", // Brown for text
          secondaryTextColor: "#4A3728", // Darker brown for secondary text
          buttonTextColor: "#FFFFFF", // White for button text
          cardBackground: "rgba(255, 245, 224, 0.85)", // Slightly more transparent for visibility
          cardBorderColor: "#D4A017", // Gold border
        },
      },
      {
        month: 1, // March
        day: 14,
        image: "https://tredumo.com/uploads/valentine.svg",
        styles: {
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          opacity: 1, // Full opacity for clear visibility
          filter: "saturate(1.5)",
        },
        colors: {
          primaryColor: "#C71585", // Vibrant pink for Women's Day
          textColor: "#333333", // Dark gray for text
          secondaryTextColor: "#666666", // Lighter gray for secondary text
          buttonTextColor: "#FFFFFF", // White for button text
          cardBackground: "rgba(255, 235, 245, 0.85)", // Slightly more transparent
          cardBorderColor: "#C71585", // Pink border
        },
      },
      {
        month: 9,
        day: 9,
        image: "https://tredumo.com/uploads/independence.svg",
        styles: {
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          opacity: 1, // Full opacity for clear visibility
          filter: "saturate(1.5)",
        },
        colors: {
          primaryColor: "#FF0000", // Yellow
          textColor: "#000000", // Black
          secondaryTextColor: "#000000", // Red
          buttonTextColor: "#FFFFFF", // White for contrast
          cardBackground: "rgba(255, 255, 255, 0.9)", // Light transparent white
          cardBorderColor: "#080701ff", // Black border
        },
      },
      {
        month: 4,
        day: 1,
        image: "https://tredumo.com/uploads/labor.svg",
        styles: {
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          opacity: 1, // Full opacity for clear visibility
          filter: "saturate(1.5)",
        },
        colors: {
          primaryColor: "#FF0000", // Yellow
          textColor: "#000000", // Black
          secondaryTextColor: "#000000", // Red
          buttonTextColor: "#FFFFFF", // White for contrast
          cardBackground: "rgba(255, 255, 255, 0.9)", // Light transparent white
          cardBorderColor: "#080701ff", // Black border
        },
      },
      {
        month: 0,
        day: 1,
        image: "https://tredumo.com/uploads/happy_newyr.svg",
        styles: {
          backgroundSize: "30%", // Reduce image size to 30% of container
          backgroundPosition: "left center", // Keep it centered at the top
          backgroundRepeat: "no-repeat",
          opacity: 1,
          filter: "saturate(1.5)",
        },
        colors: {
          primaryColor: "#000000", // Red
          textColor: "#000000", // Black
          secondaryTextColor: "#000000", // Black (you can change if needed)
          buttonTextColor: "#FFFFFF", // White
          cardBackground: "rgba(255, 255, 255, 0.9)",
          cardBorderColor: "#080701ff", // Dark border
        },
      },
      {
        month: 2,
        day: 8,
        image: "https://tredumo.com/uploads/WomensDay.gif",
        styles: {
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
          opacity: 1,
          filter: "saturate(1.5)",
        },
        colors: {
          primaryColor: "#e91e63", // Pink (from flowers and main text)
          textColor: "#d81b60", // Deep pink
          secondaryTextColor: "#f8bbd0", // Pastel pink
          buttonTextColor: "#ffffff", // White
          cardBackground: "rgba(255, 255, 255, 0.9)", // Light white card
          cardBorderColor: "#c2185b", // Darker pink-red for contrast
        },
      },
      {
        month: 9, // October for Halloween
        day: 31, // Halloween date
        image: "https://tredumo.com/uploads/halloween.gif",
        styles: {
          backgroundSize: "cover",
          backgroundPosition: "left center",
          backgroundRepeat: "no-repeat",
          opacity: 1,
          filter: "saturate(1.5)",
        },
        colors: {
          primaryColor: "#FF8C00", // Halloween orange (matching the background)
          textColor: "#000000", // Black (like the pumpkins and bats)
          secondaryTextColor: "#FFA500", // Lighter orange for accent
          buttonTextColor: "#FFFFFF", // White for contrast on dark elements
          cardBackground: "#FFF8DC", // Cornsilk - warm light background
          cardBorderColor: "#2F2F2F", // Dark gray-black (softer than pure black)
        },
      },
      {
        month: 11, // December for Christmas
        day: 25, // Christmas Day
        image: "https://tredumo.com/uploads/boxing.gif",
        styles: {
          backgroundSize: "cover",
          backgroundPosition: "left center",
          backgroundRepeat: "no-repeat",
          opacity: 1,
          filter: "saturate(1.5)",
        },
        colors: {
          primaryColor: "#DC143C", // Christmas red (crimson)
          textColor: "#2F2F2F", // Dark gray for readability on white
          secondaryTextColor: "#B22222", // Darker red for accents
          buttonTextColor: "#FFFFFF", // White text on red buttons
          cardBackground: "#FEFEFE", // Pure white (matching the background)
          cardBorderColor: "#E5E5E5", // Light gray border for subtle definition
        },
      },
      {
        month: 3, // April
        day: 1, // April Fools' Day
        image: "https://tredumo.com/uploads/fools.svg",
        styles: {
          backgroundSize: "cover",
          backgroundPosition: "left center",
          backgroundRepeat: "no-repeat",
          opacity: 1,
          filter: "saturate(1.5)",
        },
        colors: {
          primaryColor: "#4A90E2", // Bright blue (matching the background)
          textColor: "#4A90E2", // White (like the clown faces and text)
          secondaryTextColor: "#FF4757", // Bright red (matching the clown noses)
          buttonTextColor: "#FFFFFF", // White for contrast
          cardBackground: "#F8F9FA", // Light gray-white for subtle contrast
          cardBorderColor: "#E74C3C", // Red border for playful accent
        },
      },
      {
        month: 11, // December
        day: 1, // World AIDS Day - December 1st
        image: "https://tredumo.com/uploads/aids.gif",
        styles: {
          backgroundSize: "cover",
          backgroundPosition: "left center",
          backgroundRepeat: "no-repeat",
          opacity: 1,
          filter: "saturate(1.5)",
        },
        colors: {
          primaryColor: "#E53E3E", // AIDS ribbon red
          textColor: "#4A5568", // Dark gray (matching the text style)
          secondaryTextColor: "#C53030", // Deeper red for emphasis
          buttonTextColor: "#FFFFFF", // White text on red buttons
          cardBackground: "#FFFFFF", // Pure white (matching the clean background)
          cardBorderColor: "#E2E8F0", // Very light gray for subtle definition
        },
      },
    ];

    // Find matching holiday
    const currentHoliday = holidays.find(
      (h) => h.month === month && h.day === day
    );

    // Set background image, styles, and color config
    setBackgroundImage(currentHoliday ? currentHoliday.image : "");
    setBackgroundStyles(
      currentHoliday
        ? currentHoliday.styles
        : {
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 1,
            filter: "none",
          }
    );
    setColorConfig(
      currentHoliday
        ? currentHoliday.colors
        : {
            primaryColor: token.colorPrimary,
            textColor: "#000000",
            secondaryTextColor: "#6b7280",
            buttonTextColor: "#ffffff",
            cardBackground: "rgba(255, 255, 255, 0.9)",
            cardBorderColor: token.colorPrimary,
          }
    );
  }, [token.colorPrimary]);

  const onFinish = async (values) => {
    const res = await login({
      variables: {
        userId: values.user_id,
        password: values.password,
      },
    });

    authContext.setToken(res.data.studentPortalLogin.token);
    navigate("/home");
  };

  return (
    <div
      className="login-container"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${backgroundImage})`,
        padding: "16px",
        boxSizing: "border-box",
        position: "relative",
        ...backgroundStyles,
      }}
    >
      {contextHolder}
      <Card
        className="login-card"
        size="small"
        style={{
          borderColor: colorConfig.cardBorderColor,
          width: "100%",
          maxWidth: 400,
          padding: "24px",
          backgroundColor: colorConfig.cardBackground,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <Image
            preview={false}
            width={200}
            src="https://cdn.worldvectorlogo.com/logos/nkumba-uninersity.svg"
          />
          <Title
            level={2}
            style={{ marginBottom: 8, color: colorConfig.textColor }}
          >
            Log in to your account
          </Title>
          <Text style={{ color: colorConfig.secondaryTextColor }}>
            Welcome back! Please enter your details.
          </Text>
        </div>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label={
              <span style={{ color: colorConfig.textColor }}>
                Student No / Regno
              </span>
            }
            name="user_id"
            rules={[
              {
                required: true,
                message: "Please enter your student no or Reg no",
              },
            ]}
          >
            <Input
              prefix={
                <UserOutlined style={{ color: colorConfig.primaryColor }} />
              }
              placeholder="Enter your student number or reg no"
              size="large"
              style={{
                borderColor: colorConfig.primaryColor,
                color: colorConfig.textColor,
                "::placeholder": {
                  color: colorConfig.secondaryTextColor,
                  opacity: 1, // Ensure placeholder is fully visible
                },
              }}
            />
          </Form.Item>

          <Form.Item
            label={
              <span style={{ color: colorConfig.textColor }}>Password</span>
            }
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={
                <LockOutlined style={{ color: colorConfig.primaryColor }} />
              }
              placeholder="Password"
              size="large"
              style={{
                borderColor: colorConfig.primaryColor,
                color: colorConfig.textColor,
                "::placeholder": {
                  color: colorConfig.secondaryTextColor,
                  opacity: 1, // Ensure placeholder is fully visible
                },
              }}
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Checkbox style={{ color: colorConfig.textColor }}>
                Remember me
              </Checkbox>
              <Link
                to="/forgot-password"
                style={{ color: colorConfig.primaryColor }}
              >
                Forgot password
              </Link>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={logingIn}
              disabled={logingIn}
              style={{
                backgroundColor: colorConfig.primaryColor,
                borderColor: colorConfig.primaryColor,
                color: colorConfig.buttonTextColor,
              }}
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>
        <motion.div
          animate={controls}
          whileHover={{
            scale: 1.03,
            color: "#1a7de7",
            transition: { duration: 0.3 },
          }}
          onClick={handleClick}
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontWeight: 600,
            fontSize: "13px",
            color: "#0F1419",
            cursor: "pointer",
            borderBottom: "2px solid #1a7de7",
            // paddingBottom: "2px",
            width: "fit-content",
          }}
        >
          <span style={{ marginRight: "6px" }}>
            Is it okay if we explain how your data is used?
          </span>
          <ChevronRight size={16} />
        </motion.div>
      </Card>
      {/* <div>Is it okay if we explain how your data is used?</div>{" "} */}
    </div>
  );
};

export default LoginPage;
