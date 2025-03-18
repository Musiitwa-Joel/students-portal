import React, { useState, useEffect } from "react";
import {
  Form,
  Select,
  Button,
  Card,
  Typography,
  Alert,
  Row,
  Col,
  Steps,
  message,
  Divider,
  Descriptions,
} from "antd";

const { Option } = Select;
const { Title, Paragraph } = Typography;
const { Step } = Steps;

export default function ChangeoverProgram() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(
    30 * 24 * 60 * 60 + 23 * 60 * 60 + 45 * 60 + 12
  ); // initial time in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;
    return `${days} days ${hours}hrs ${minutes}min`;
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      setSubmitError("");

      // Simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Selected Values:", values);
      setFormData(values);
      setSubmitSuccess(true);
      setCurrentStep(3);
      // Move to the last step
      message.success(
        "Your change program request has been submitted successfully."
      );
    } catch (error) {
      if (error.errorFields) {
        message.error("Please fill in all required fields.");
      } else {
        setSubmitError("An error occurred while submitting the form.");
        message.error("An error occurred while submitting the form.");
      }
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields(["program"]);
      } else if (currentStep === 1) {
        await form.validateFields(["campus"]);
      }
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const getProgramName = (value) => {
    const programs = {
      "computer-science": "Computer Science",
      "business-administration": "Business Administration",
      law: "Law",
      engineering: "Engineering",
      medicine: "Medicine",
      psychology: "Psychology",
    };
    return programs[value] || value;
  };

  const getCampusName = (value) => {
    const campuses = {
      "main-kampala": "Main Kampala Campus",
      entebbe: "Entebbe Campus",
      jinja: "Jinja Campus",
      mbarara: "Mbarara Campus",
    };
    return campuses[value] || value;
  };

  const getStudyTimeName = (value) => {
    const studyTimes = {
      day: "Day",
      evening: "Evening",
      weekend: "Weekend",
      distance: "Distance Learning",
    };
    return studyTimes[value] || value;
  };

  const steps = [
    {
      title: "Program",
      content: (
        <Form.Item
          name="newProgram"
          label="Select Program"
          rules={[{ required: true, message: "Please select a program!" }]}
        >
          <Select placeholder="Choose your new program">
            <Option value="computer-science">Computer Science</Option>
            <Option value="business-administration">
              Business Administration
            </Option>
            <Option value="law">Law</Option>
            <Option value="engineering">Engineering</Option>
            <Option value="medicine">Medicine</Option>
            <Option value="psychology">Psychology</Option>
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Campus",
      content: (
        <Form.Item
          name="newCampus"
          label="Select Campus"
          rules={[{ required: true, message: "Please select a campus!" }]}
        >
          <Select placeholder="Choose your campus">
            <Option value="main-kampala">Main Kampala Campus</Option>
            <Option value="entebbe">Entebbe Campus</Option>
            <Option value="jinja">Jinja Campus</Option>
            <Option value="mbarara">Mbarara Campus</Option>
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Study Time",
      content: (
        <Form.Item
          name="studyTime"
          label="Select Study Time"
          rules={[{ required: true, message: "Please select a study time!" }]}
        >
          <Select placeholder="Choose study time">
            <Option value="day">Day</Option>
            <Option value="evening">Evening</Option>
            <Option value="weekend">Weekend</Option>
            <Option value="distance">Distance Learning</Option>
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Completed",
      content: (
        <div>
          <Alert
            message="Request Submitted Successfully"
            description="Your change of program request has been successfully submitted. You will receive further instructions via email."
            type="success"
            showIcon
            style={{ marginBottom: 24 }}
          />
          <Card title="Change Program Request Summary" bordered={false}>
            <Descriptions column={1}>
              <Descriptions.Item label="New Program">
                {getProgramName(formData.newProgram)}
              </Descriptions.Item>
              <Descriptions.Item label="Campus">
                {getCampusName(formData.newCampus)}
              </Descriptions.Item>
              <Descriptions.Item label="Study Time">
                {getStudyTimeName(formData.studyTime)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
          <Paragraph style={{ marginTop: 24 }}>
            Please keep this summary for your records. If you need to make any
            changes or have any questions, please contact the registrar's
            office.
          </Paragraph>
        </div>
      ),
    },
  ];

  return (
    <Card className="max-w-4xl mx-auto shadow-lg">
      <Title
        level={2}
        className="text-center mb-8"
        style={{ textAlign: "unset" }}
      >
        Change Program Request{" "}
        <span
          style={{ fontSize: "20px", marginLeft: "50px", color: "darkblue" }}
        >
          Expires in {formatTime(timeRemaining)}
        </span>
      </Title>

      <Steps
        style={{ marginBottom: 20 }}
        current={currentStep}
        className="mb-8"
      >
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      {submitError && (
        <Alert
          message="Error"
          description={submitError}
          type="error"
          showIcon
          className="mb-6"
        />
      )}
      <div style={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
        {" "}
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={[16, 16]}>
            <Col
              xs={0}
              md={8}
              className="h-full bg-gray-50"
              style={{ borderColor: "darkblue" }}
            >
              <Card>
                <Title level={4} className="mb-4">
                  Instructions
                </Title>
                <Paragraph>
                  Please follow the steps below to change your program:
                </Paragraph>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Select the new program you wish to switch to.</li>
                  <li>Choose the campus you want to attend.</li>
                  <li>Indicate your preferred study time.</li>
                  <li>Review your selections and submit the request.</li>
                </ul>
              </Card>
            </Col>

            <Col xs={24} md={16}>
              <div className="steps-content">{steps[currentStep].content}</div>
              <Divider />
              <div className="steps-action text-right">
                {currentStep > 0 && (
                  <Button style={{ margin: "0 8px" }} onClick={prevStep}>
                    Previous
                  </Button>
                )}
                {currentStep < steps.length - 1 && (
                  <Button
                    type="primary"
                    onClick={nextStep}
                    loading={loading}
                    disabled={loading}
                  >
                    Next
                  </Button>
                )}
                {currentStep === steps.length - 1 && (
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    disabled={loading}
                  >
                    Submit
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
