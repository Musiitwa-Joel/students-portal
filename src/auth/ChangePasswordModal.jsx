import React, { useContext, useEffect, useState } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import { GoogleOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { AuthContext } from "./AuthContext";
import { jwtDecode } from "jwt-decode";
import { CHANGE_STD_PWD } from "../gql/mutation";
import { useMutation } from "@apollo/client";

const ChangePasswordModal = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const authContext = useContext(AuthContext);
  const [changeStdPwd, { error, loading, data }] = useMutation(CHANGE_STD_PWD);
  const [form] = Form.useForm();

  useEffect(() => {
    if (error) {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    }
  }, [error]);

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async () => {
    const valid = await form.validateFields();

    if (valid) {
      const values = form.getFieldsValue();
      if (values.password != values.confirm_password) {
        messageApi.open({
          type: "error",
          content: "Password Match, Please try again",
        });
        return;
      }
      //   console.log("Success:", values);

      const res = await changeStdPwd({
        variables: {
          password: values.password,
        },
      });

      messageApi.open({
        type: "success",
        content: res.data.changeStdPwd.message,
      });

      authContext.setChangePwdModalVisible(false);
    }

    // navigate("/home");
  };
  return (
    <>
      <Modal
        maskClosable={false}
        title="Change Password"
        open={authContext?.changePwdModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        cancelButtonProps={{
          style: {
            display: "none",
          },
        }}
        okText="Change Password"
        okButtonProps={{
          onClick: () => onFinish(),
          loading,
          disabled: loading,
        }}
      >
        {contextHolder}
        <Form
          name="login"
          form={form}
          initialValues={{ remember: true }}
          //   onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
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

          <Form.Item
            label="Confirm Password"
            name="confirm_password"
            rules={[{ required: true, message: "Please confirm password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          {/* 
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Sign in
            </Button>
          </Form.Item> */}

          {/* <div style={{ textAlign: "center" }}>
            <Text type="secondary">
              Don't have an account? <a href="/signup">Create one</a>
            </Text>
          </div> */}
        </Form>
      </Modal>
    </>
  );
};
export default ChangePasswordModal;
