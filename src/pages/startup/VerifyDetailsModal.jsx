import React, { useContext, useEffect, useState } from "react";
import { Button, Modal, Form, Input, message, Typography } from "antd";
import {
  GoogleOutlined,
  LockOutlined,
  UserOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../../auth/AuthContext";
import { useMutation } from "@apollo/client";
import { SAVE_STD_CREDENTIALS } from "../../gql/mutation";

const VerifyDetailsModal = () => {
  const authContext = useContext(AuthContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [saveStdCredentials, { error, loading, data }] =
    useMutation(SAVE_STD_CREDENTIALS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (error) {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    }
  }, [error]);

  useEffect(() => {
    if (
      authContext.changePwdModalVisible == false &&
      authContext.tokenDetails?.validate_credentials
    ) {
      setIsModalOpen(true);
    }
  }, [authContext.changePwdModalVisible, authContext.tokenDetails]);

  const [form] = Form.useForm();

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
      const res = await saveStdCredentials({
        variables: {
          phoneNo: values.telno,
          email: values.email,
        },
      });

      messageApi.open({
        type: "success",
        content: res.data.saveStdCredentials.message,
      });
      setIsModalOpen(false);
    }

    // navigate("/home");
  };
  return (
    <>
      <Modal
        maskClosable={false}
        title={
          <>
            <Typography.Title
              level={4}
              style={{
                margin: 0,
                padding: 0,
              }}
            >
              Verify Your Details
            </Typography.Title>
            <Typography.Text type="secondary">
              These are so crucial as they will aid in payments, communications
              and posssibly resetting your passsword.
            </Typography.Text>
          </>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        cancelButtonProps={{
          style: {
            display: "none",
          },
        }}
        okText="Save"
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
          initialValues={{
            email: authContext?.tokenDetails?.email || null,
            telno: authContext?.tokenDetails?.phone_no || null,
          }}
          //   onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label="Email"
            name="email"
            // rules={[{ required: true, message: "Please en" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item label="Phone Number" name="telno">
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Phone Number"
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default VerifyDetailsModal;
