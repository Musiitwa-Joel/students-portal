import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Image,
  Alert,
  theme,
  message,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "./ForgotPassword.css";

const { useToken } = theme;
const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
  const { token } = useToken();
  const [currentStep, setCurrentStep] = useState("studentNumber");
  const [verificationCode, setVerificationCode] = useState(Array(10).fill(""));
  const navigate = useNavigate(); // useNavigate hook

  const onStudentNumberSubmit = (values) => {
    console.log("Student number submitted:", values.studentNumber);
    setCurrentStep("verificationCode");
  };

  const handleCodeChange = (index, value) => {
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < 9) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleVerificationSubmit = () => {
    const code = verificationCode.join("");
    console.log("Verification code submitted:", code);
    setCurrentStep("newPassword");
  };

  const onNewPasswordSubmit = (values) => {
    console.log("New password submitted:", values);
    message.success("Password reset successfully. Redirecting to dashboard...");
    // Simulate redirection to dashboard
    setTimeout(() => {
      navigate("/home"); // use navigate instead of window.location.href
    }, 2000);
  };

  const renderStep = () => {
    switch (currentStep) {
      case "studentNumber":
        return (
          <Form
            name="forgotPassword"
            onFinish={onStudentNumberSubmit}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="studentNumber"
              rules={[
                { required: true, message: "Please enter your student number" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your student number"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                Send Verification Code
              </Button>
            </Form.Item>
          </Form>
        );

      case "verificationCode":
        return (
          <div>
            <Alert
              message="Verification code sent!"
              description="Please check your registered email for the 10-digit code."
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />
            <div className="verification-code-container">
              {verificationCode.map((digit, index) => (
                <Input
                  key={index}
                  id={`code-${index}`}
                  className="verification-code-input"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                />
              ))}
            </div>
            <Button
              type="primary"
              block
              size="large"
              onClick={handleVerificationSubmit}
              disabled={verificationCode.some((digit) => !digit)}
            >
              Verify Code
            </Button>
          </div>
        );

      case "newPassword":
        return (
          <Form
            name="resetPassword"
            onFinish={onNewPasswordSubmit}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="newPassword"
              rules={[
                { required: true, message: "Please enter your new password" },
                { min: 8, message: "Password must be at least 8 characters" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter new password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm your new password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm new password"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="forgot-password-container login-container">
      <Card
        className="forgot-password-card login-card"
        size="small"
        style={{
          borderColor: token.colorPrimary,
          width: "100%",
          maxWidth: 400,
          padding: "24px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <Image
            width={200}
            src="https://cdn.worldvectorlogo.com/logos/nkumba-uninersity.svg"
          />
          <Title level={2} style={{ marginBottom: 8 }}>
            Forgot Password
          </Title>
          <Text type="secondary">
            {currentStep === "studentNumber"
              ? "Enter your student ID to receive a verification code"
              : currentStep === "verificationCode"
              ? "Enter the 10-digit code sent to your registered email"
              : "Enter your new password"}
          </Text>
        </div>

        {renderStep()}

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Text type="secondary">
            Remember your password? <Link to="/">Log in</Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
