import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  Alert,
  Row,
  Col,
  Steps,
  message,
  Radio,
  Space,
  Descriptions,
  InputNumber,
} from "antd";
import { CreditCardOutlined, CheckCircleOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const { Step } = Steps;
const { TextArea } = Input;

export default function StudentIDRequest() {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({});
  const [paymentReference, setPaymentReference] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Check if the screen is mobile size

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate a random payment reference
      const paymentRef =
        "PAY-" + Math.random().toString(36).substr(2, 9).toUpperCase();
      setPaymentReference(paymentRef);

      console.log("Form Values:", values);
      setFormData({ ...values, paymentReference: paymentRef });
      setSubmitSuccess(true);
      setCurrentStep(3);
      message.success(
        "Your new ID card request has been submitted successfully."
      );
    } catch (error) {
      if (error.errorFields) {
        message.error("Please fill in all required fields.");
      } else {
        message.error("An error occurred while submitting the form.");
      }
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields(["reason"]);
      } else if (currentStep === 1) {
        await form.validateFields(["paymentMethod"]);
      } else if (currentStep === 2) {
        await form.validateFields(["mobileNumber"]);
      }
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = [
    {
      title: "Reason",
      content: (
        <Form.Item
          name="reason"
          label="Reason for New ID Card"
          rules={[
            {
              required: true,
              message: "Please provide a reason for requesting a new ID card!",
            },
          ]}
        >
          <TextArea rows={4} placeholder="Explain why you need a new ID card" />
        </Form.Item>
      ),
    },
    {
      title: "Payment Method",
      content: (
        <Form.Item
          name="paymentMethod"
          label="Select Payment Method"
          rules={[
            { required: true, message: "Please select a payment method!" },
          ]}
        >
          <Radio.Group>
            <Space direction="vertical">
              <Radio value="airtel">
                <Space>
                  <img
                    src="https://cdn.worldvectorlogo.com/logos/bharti-airtel-limited.svg"
                    alt="Airtel Logo"
                    style={{ width: 30, height: 30 }}
                  />
                  Airtel Money
                </Space>
              </Radio>
              <Radio value="mtn">
                <Space>
                  <img
                    src="https://cdn.worldvectorlogo.com/logos/mtn-3.svg"
                    alt="MTN Logo"
                    style={{ width: 50, height: 50 }}
                  />
                  MTN Mobile Money
                </Space>
              </Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
      ),
    },
    {
      title: "Payment",
      content: (
        <>
          <Form.Item
            name="mobileNumber"
            label="Mobile Number"
            rules={[
              { required: true, message: "Please enter your mobile number!" },
              {
                pattern: /^[0-9]{10}$/,
                message: "Please enter a valid 10-digit mobile number!",
              },
            ]}
          >
            <Input placeholder="Enter your 10-digit mobile number" />
          </Form.Item>
          <Form.Item name="amount" label="Amount to Pay" initialValue={20000}>
            <InputNumber
              formatter={(value) =>
                `UGX ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value.replace(/UGX\s?|(,*)/g, "")}
              style={{ width: "100%" }}
              disabled
            />
          </Form.Item>
        </>
      ),
    },
    {
      title: "Completed",
      content: (
        <div>
          <Alert
            message="Request Submitted Successfully"
            description="Your new ID card request has been successfully submitted and payment processed. You will receive further instructions via email."
            type="success"
            showIcon
            style={{ marginBottom: 24 }}
          />
          <Card title="New ID Card Request Summary" bordered={true}>
            <Descriptions column={1}>
              <Descriptions.Item label="Reason for New ID Card">
                {formData.reason}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                {formData.paymentMethod === "airtel"
                  ? "Airtel Money"
                  : "MTN Mobile Money"}
              </Descriptions.Item>
              <Descriptions.Item label="Mobile Number">
                {formData.mobileNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Amount Paid">
                UGX 20,000
              </Descriptions.Item>
              <Descriptions.Item label="Payment Reference">
                {formData.paymentReference}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Paragraph style={{ marginTop: 24 }}>
            Please keep this summary for your records. If you need to make any
            changes or have any questions, please contact the student affairs
            office.
          </Paragraph>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <Title level={2} className="text-center mb-8">
        Request New Student ID Card
      </Title>

      <Steps current={currentStep} className="mb-8">
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <div style={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 20 }}
        >
          <Row gutter={32}>
            <Col xs={24} md={8}>
              <Card
                className="h-full bg-gray-50"
                style={{
                  borderColor: "darkblue",
                  display: isMobile ? "none" : "block", // Hide on mobile
                }}
              >
                <Title level={4} className="mb-4">
                  Instructions
                </Title>
                <Paragraph>
                  Please follow the steps below to request a new ID card:
                </Paragraph>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Provide a reason for requesting a new ID card.</li>
                  <li>Select your preferred payment method.</li>
                  <li>Enter your mobile number for payment.</li>
                  <li>Review your information and submit the request.</li>
                </ul>
              </Card>
            </Col>

            <Col xs={24} md={16}>
              <div className="steps-content">{steps[currentStep].content}</div>
              <div className="steps-action text-right mt-4">
                {currentStep > 0 && (
                  <Button style={{ margin: "0 8px" }} onClick={prevStep}>
                    Previous
                  </Button>
                )}
                {currentStep < steps.length - 1 && (
                  <Button type="primary" onClick={nextStep}>
                    Next
                  </Button>
                )}
                {currentStep === steps.length - 2 && (
                  <Button
                    type="primary"
                    onClick={handleSubmit}
                    style={{ marginLeft: 15 }}
                    loading={loading}
                  >
                    Submit Request and Pay
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </Card>
  );
}
