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
import { GoogleOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import Loading from "../SplashScreen/Loading";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../gql/mutation";
import { AuthContext } from "./AuthContext";

const { useToken } = theme;
const { Title, Text } = Typography;

const LoginPage = () => {
  const { token } = useToken();
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [login, { error, loading: logingIn, data }] = useMutation(LOGIN);

  useEffect(() => {
    if (error) {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    }
  }, [error]);
  const onFinish = async (values) => {
    // console.log("Success:", values);

    const res = await login({
      variables: {
        userId: values.user_id,
        password: values.password,
      },
    });

    // console.log("respose", res.data);

    authContext.setToken(res.data.studentPortalLogin.token);

    navigate("/home");
  };

  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       await new Promise((resolve) => setTimeout(resolve, 1000));
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // if (loading) {
  //   return <Loading />;
  // }

  return (
    <div
      className="login-container"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: "16px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {contextHolder}
      <Card
        className="login-card"
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
            preview={false}
            width={200}
            src="https://cdn.worldvectorlogo.com/logos/nkumba-uninersity.svg"
          />
          <Title level={2} style={{ marginBottom: 8 }}>
            Log in to your account
          </Title>
          <Text type="secondary">Welcome back! Please enter your details.</Text>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label="Student No / Regno"
            name="user_id"
            rules={[
              {
                required: true,
                message: "Please enter your student no or Reg no",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Enter your student number or reg no"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Checkbox>Remember me</Checkbox>
              <Link to="/forgot-password">Forgot password</Link>
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
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
