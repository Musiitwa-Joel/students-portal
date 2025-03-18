import React, { useContext, useEffect } from "react";
import {
  Alert,
  Form,
  Space,
  Typography,
  Row,
  Col,
  Select,
  ConfigProvider,
  Button,
  Modal,
  Card,
  message,
} from "antd";
import { useMutation } from "@apollo/client";

import AppContext from "../../../context/appContext";
import { XIcon } from "lucide-react";
import { REGISTER_MODULE } from "../../../gql/queries";

const { Option } = Select;

const { Text } = Typography;

const options = [
  { value: "normal", label: "NORMAL" },
  { value: "missed", label: "MISSED" },
  { value: "retake", label: "RETAKE" },
  { value: "suplementary", label: "SUPLEMENTARY" },
];

function EnrollmentModal({ isVisible, _module, handleClose }) {
  //   console.log("module", _module);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const { studentFile } = useContext(AppContext);

  //   console.log("selected enrollment", selectedEnrollment);

  const [registerModule, { error, loading, data }] = useMutation(
    REGISTER_MODULE,
    {
      refetchQueries: ["getStudentSelectedModules"],
    }
  );

  useEffect(() => {
    if (error) {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    }
  }, [error]);

  const onFinish = async (values) => {
    const payload = {
      payload: {
        course_unit_code: _module?.course_unit_code,
        status: values.status,
        study_yr: parseInt(
          studentFile?.current_info?.recent_enrollment?.study_yr
        ),
        sem: parseInt(studentFile?.current_info?.recent_enrollment?.sem),
        acc_yr_id: studentFile?.current_info?.recent_enrollment?.acc_yr,
      },
    };

    console.log("values from form", payload);

    // console.log("the payload", payload);
    const res = await registerModule({
      variables: payload,
    });

    if (res.data.std_module_registration) {
      messageApi.open({
        type: "success",
        content: res.data.std_module_registration.message,
      });

      // reset the form
      form.resetFields();

      // close the modal
      handleClose();
    }
  };
  return (
    <div>
      {contextHolder}
      <Modal
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography.Title
              level={5}
              style={{
                padding: 0,
                margin: 0,
              }}
            >
              {_module?.course_unit_title}
            </Typography.Title>

            <Button
              size="small"
              ghost
              type="primary"
              icon={<XIcon />}
              onClick={handleClose}
            />
          </div>
        }
        open={isVisible}
        // onOk={handleOk}
        onCancel={handleClose}
        footer={false}
        width={500}
        closable={false}
        centered
        maskClosable={false}
      >
        <div className="max-w-full relative">
          <div
            // component="form"

            autoComplete="off"
            className={"max-w-full"}
            style={{
              padding: 0,
              // backgroundColor: "green",
            }}
          >
            <Alert
              style={{
                padding: 5,
                marginTop: 10,
              }}
              message={
                <Space size={20} wrap>
                  <div>
                    <Text strong>MODULE CODE:</Text> {_module?.course_unit_code}
                  </div>

                  <div>
                    <Text strong>CREDIT UNITS:</Text> {_module?.credit_units}
                  </div>

                  <div>
                    <Text strong>LEVEL:</Text>{" "}
                    {_module?.course_unit_level?.toUpperCase()}
                  </div>
                </Space>
              }
            ></Alert>

            <div
              style={{
                marginTop: 10,
                // backgroundColor: "red",
              }}
            >
              <Form
                // initialValues={_applicantFillForm}
                form={form}
                name="fee_item_form"
                layout="vertical"
                //   style={formStyle}
                onFinish={onFinish}
              >
                <Row gutter={24} align="middle">
                  <Col
                    span={24}
                    style={{
                      paddingBottom: 0,
                    }}
                  >
                    <ConfigProvider
                      theme={{
                        components: {
                          Select: {
                            zIndexPopup: 99999,
                          },
                        },
                      }}
                    >
                      <Form.Item
                        name={`status`}
                        label={`Enroll as`}
                        rules={[
                          {
                            required: true,
                            message: "Field is Required",
                          },
                        ]}
                        style={{
                          paddingBottom: 0,
                          marginBottom: 0,
                          //   width: 200,
                        }}
                      >
                        <Select
                          //   loading={loadingReqs2}
                          placeholder="Select status"
                          style={{
                            zIndex: 9999999,
                          }}
                        >
                          {options.map((opt) => (
                            <Option value={opt.value}>{opt.label}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </ConfigProvider>
                  </Col>
                </Row>

                <div
                  style={{
                    display: "flex",
                    marginTop: 15,
                    justifyContent: "flex-end",
                  }}
                >
                  <Space>
                    <Form.Item>
                      <Button onClick={handleClose}>Cancel</Button>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        loading={loading}
                        disabled={loading}
                        type="primary"
                        htmlType="submit"
                      >
                        Enroll
                      </Button>
                    </Form.Item>
                  </Space>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default EnrollmentModal;
