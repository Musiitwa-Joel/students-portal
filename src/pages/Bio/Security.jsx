import React from "react";
import { Form, Input, Button, message } from "antd";
import { Helmet } from "react-helmet";
import { gql, useMutation } from "@apollo/client";

const PASSWORD_CHANGE = gql`
  mutation Change_my_password($oldPassword: String!, $newPassword: String!) {
    change_my_password(old_password: $oldPassword, new_password: $newPassword) {
      success
      message
    }
  }
`;

const SecurityTab = () => {
  const [form] = Form.useForm();
  const [changePassword, { loading }] = useMutation(PASSWORD_CHANGE, {
    onCompleted: (data) => {
      const { success, message: responseMessage } = data.change_my_password;
      if (success) {
        message.success(responseMessage || "Password updated successfully!");
        form.resetFields();
      } else {
        message.error(responseMessage || "Failed to update password.");
      }
    },
    onError: (error) => {
      message.error(
        error.message || "An error occurred while updating password."
      );
    },
  });

  const onFinish = (values) => {
    changePassword({
      variables: {
        oldPassword: values.currentPassword,
        newPassword: values.newPassword,
      },
    });
  };

  return (
    <div style={{ maxWidth: "400px", margin: "16px" }}>
      <Helmet>
        <title>Security Settings - Nkumba University</title>
        <meta
          name="description"
          content="Update your password securely at Nkumba University to protect your account."
        />
        <meta
          name="keywords"
          content="password update, security settings, Nkumba University, account security"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Nkumba University" />
      </Helmet>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ width: "100%" }}
      >
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[
            { required: true, message: "Please enter your current password" },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: "Please enter a new password" },
            { min: 8, message: "Password must be at least 8 characters" },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirm New Password"
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "Please confirm your new password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button
            size="small"
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: "100%" }}
          >
            Update Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SecurityTab;
