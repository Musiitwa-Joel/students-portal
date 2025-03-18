import React, { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Typography,
  Tabs,
  Form,
  Input,
  Select,
  Button,
  message,
  Card,
  List,
} from "antd";
import {
  BugOutlined,
  BulbOutlined,
  SendOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
// import "./StudentSupportForm.css";

const { Content } = Layout;
const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

const StudentSupportPanel = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Set initial state based on window size

  // Effect to handle window resizing
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onFinish = (values) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      message.success(
        "Your submission has been received. Thank you for your feedback!"
      );
      form.resetFields();
    }, 1500);
  };

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const precautions = [
    "Ensure you are logged in to your student account.",
    "Check if the issue has already been reported in the FAQ section.",
    "Provide as much detail as possible in your description.",
    "Include screenshots if applicable (you can upload them after submitting the form).",
  ];

  return (
    <div style={{ maxHeight: "calc(100vh - 135px)", overflowY: "auto" }}>
      <Layout className="student-support-layout">
        <Content className="student-support-content">
          <Card className="support-panel" style={{ backgroundColor: "" }}>
            <Row gutter={[10, 10]}>
              <Col
                xs={24}
                lg={10}
                style={{ display: isMobile ? "none" : "block" }}
              >
                <div className="info-section">
                  <Title level={3}>Student Support Center</Title>
                  <Paragraph>
                    Welcome to the Student Support Center. Here you can report
                    issues or request new features for our system.
                  </Paragraph>
                  <Title color="red" level={4}>
                    <InfoCircleOutlined /> Precautions
                  </Title>
                  <List
                    // style={{ color: "red" }}
                    size="small"
                    dataSource={precautions}
                    renderItem={(item) => <List.Item>{item}</List.Item>}
                  />
                </div>
              </Col>
              <Col xs={24} lg={14}>
                <div className="form-section">
                  <Tabs defaultActiveKey="1">
                    <TabPane
                      tab={
                        <span>
                          <BugOutlined /> Report an Issue
                        </span>
                      }
                      key="1"
                    >
                      <Form
                        form={form}
                        name="issue_report"
                        onFinish={onFinish}
                        layout="vertical"
                      >
                        <Form.Item
                          name="issue_title"
                          label="Issue Title"
                          rules={[
                            {
                              required: true,
                              message: "Please enter the issue title",
                            },
                          ]}
                        >
                          <Input placeholder="Enter a brief title for the issue" />
                        </Form.Item>
                        <Form.Item
                          name="issue_description"
                          label="Issue Description"
                          rules={[
                            {
                              required: true,
                              message: "Please describe the issue",
                            },
                          ]}
                        >
                          <TextArea
                            rows={4}
                            placeholder="Provide details about the issue you're experiencing"
                          />
                        </Form.Item>
                        <Form.Item
                          name="priority"
                          label="Priority"
                          rules={[
                            {
                              required: true,
                              message: "Please select a priority",
                            },
                          ]}
                        >
                          <Select placeholder="Select the issue priority">
                            {priorityOptions.map((option) => (
                              <Option key={option.value} value={option.value}>
                                {option.label}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item>
                          <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SendOutlined />}
                            loading={loading}
                            block
                          >
                            Submit Issue
                          </Button>
                        </Form.Item>
                      </Form>
                    </TabPane>
                    <TabPane
                      tab={
                        <span>
                          <BulbOutlined /> Request a Feature
                        </span>
                      }
                      key="2"
                    >
                      <Form
                        form={form}
                        name="feature_request"
                        onFinish={onFinish}
                        layout="vertical"
                      >
                        <Form.Item
                          name="feature_title"
                          label="Feature Title"
                          rules={[
                            {
                              required: true,
                              message: "Please enter the feature title",
                            },
                          ]}
                        >
                          <Input placeholder="Enter a brief title for the feature request" />
                        </Form.Item>
                        <Form.Item
                          name="feature_description"
                          label="Feature Description"
                          rules={[
                            {
                              required: true,
                              message: "Please describe the feature",
                            },
                          ]}
                        >
                          <TextArea
                            rows={4}
                            placeholder="Describe the feature you'd like to see implemented"
                          />
                        </Form.Item>
                        <Form.Item
                          name="importance"
                          label="Importance"
                          rules={[
                            {
                              required: true,
                              message: "Please select the importance",
                            },
                          ]}
                        >
                          <Select placeholder="Select the feature importance">
                            {priorityOptions.map((option) => (
                              <Option key={option.value} value={option.value}>
                                {option.label}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                        <Form.Item>
                          <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SendOutlined />}
                            loading={loading}
                            block
                          >
                            Submit Feature Request
                          </Button>
                        </Form.Item>
                      </Form>
                    </TabPane>
                  </Tabs>
                </div>
              </Col>
            </Row>
          </Card>
        </Content>
      </Layout>
    </div>
  );
};

export default StudentSupportPanel;
