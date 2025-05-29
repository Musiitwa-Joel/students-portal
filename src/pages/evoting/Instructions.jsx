import { useState } from "react";
import {
  Typography,
  Button,
  Checkbox,
  Divider,
  Steps,
  Card,
  Row,
  Col,
  Alert,
  message,
} from "antd";
import {
  LockOutlined,
  EyeInvisibleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;

const ElectionInstructionsPage = ({ onProceed }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [consentChecked, setConsentChecked] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleProceed = () => {
    if (!consentChecked) {
      messageApi.open({
        type: "error",
        content: "Please read and accept the guidelines to proceed",
      });
      return;
    }

    messageApi.open({
      type: "success",
      content: "Proceeding to voting booth...",
    });

    // Call the onProceed callback to move to the next screen
    setTimeout(() => {
      onProceed();
    }, 1500);
  };

  const steps = [
    {
      title: "Voting Process",
      content: (
        <div className="step-content">
          <Title level={4}>How to Vote</Title>
          <Paragraph>
            The electronic voting system uses a secure and straightforward
            process:
          </Paragraph>
          <ol className="instruction-list">
            <li>Review the list of candidates for each position</li>
            <li>Select your preferred candidate by clicking on their card</li>
            <li>Confirm your selection when prompted</li>
            <li>
              Proceed to the next position until all selections are complete
            </li>
            <li>Review your choices on the summary page</li>
            <li>Submit your final ballot</li>
          </ol>
          <Alert
            message="Important"
            description="You can only vote once. Make sure your selections are final before submission."
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            className="info-alert"
          />
        </div>
      ),
    },
    {
      title: "Security Measures",
      content: (
        <div className="step-content">
          <Title level={4}>Security Protocols</Title>
          <Paragraph>
            Your vote is protected by multiple layers of security:
          </Paragraph>
          <ul className="instruction-list">
            <li>End-to-end encryption of all voting data</li>
            <li>Two-factor authentication via OTP verification</li>
            <li>Secure audit trails that preserve anonymity</li>
            <li>Protection against double-voting</li>
            <li>Regular security audits and penetration testing</li>
          </ul>
          <Alert
            message="Security Notice"
            description="Do not share your screen or allow others to observe your voting process. Vote in a private location."
            type="warning"
            showIcon
            icon={<LockOutlined />}
            className="warning-alert"
          />
        </div>
      ),
    },
    {
      title: "Privacy Policy",
      content: (
        <div className="step-content">
          <Title level={4}>Your Privacy</Title>
          <Paragraph>
            We are committed to protecting your privacy during the election:
          </Paragraph>
          <ul className="instruction-list">
            <li>
              Your identity is verified but your specific votes remain anonymous
            </li>
            <li>Vote tallying is separated from voter identification</li>
            <li>Personal data is encrypted and protected</li>
            <li>All personal data is deleted after the election period</li>
            <li>Only aggregated results are published</li>
          </ul>
          <Alert
            message="Privacy Guarantee"
            description="No one, including system administrators, can link your identity to your specific voting choices."
            type="success"
            showIcon
            icon={<EyeInvisibleOutlined />}
            className="success-alert"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="election-instructions-container">
      {contextHolder}
      <div className="instructions-card-wrapper">
        <Row className="instructions-row">
          <Col xs={24} md={8} className="sidebar-panel">
            <div className="sidebar-content">
              <div className="logo-container">
                <img
                  width={150}
                  src="https://pay-nkumba.vercel.app/assets/darkmode-BT18pDMC.png"
                  alt="Voting System Logo"
                />
              </div>
              <Title level={3} className="sidebar-title">
                Election Guidelines
              </Title>
              <div className="accent-bar"></div>

              <div className="sidebar-steps">
                <Steps
                  direction="vertical"
                  current={currentStep}
                  onChange={setCurrentStep}
                  className="custom-steps"
                >
                  <Step title="Voting Process" />
                  <Step title="Security Measures" />
                  <Step title="Privacy Policy" />
                </Steps>
              </div>

              <Divider className="custom-divider" />

              <div className="help-section">
                <Paragraph className="help-heading">Need Help?</Paragraph>
                <div className="contact-info">
                  <div className="contact-item">
                    <strong>Email:</strong> voting@tredumo.org
                  </div>
                  <div className="contact-item">
                    <strong>Phone:</strong> +123 456 7890
                  </div>
                </div>
              </div>

              <div className="footer-text">
                © {new Date().getFullYear()} Electoral Commission
              </div>
            </div>
          </Col>

          <Col xs={24} md={16} className="main-content-panel">
            <div className="main-content-container">
              <div className="header-section">
                <Title level={2} className="content-title">
                  Election Instructions and Guidelines
                </Title>
                <Text className="content-subtitle">
                  Please review the following information carefully before
                  proceeding to vote
                </Text>
              </div>

              <Card className="content-card">
                {steps[currentStep].content}

                <div className="step-navigation">
                  <Button
                    type="default"
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    type="primary"
                    onClick={() =>
                      setCurrentStep(
                        Math.min(steps.length - 1, currentStep + 1)
                      )
                    }
                    disabled={currentStep === steps.length - 1}
                  >
                    Next
                  </Button>
                </div>
              </Card>

              <div className="consent-section">
                <Checkbox
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="consent-checkbox"
                >
                  <Text className="consent-text">
                    I have read and understood the guidelines and agree to abide
                    by the election rules
                  </Text>
                </Checkbox>
              </div>

              <div className="action-buttons">
                <Button
                  type="primary"
                  size="large"
                  className="proceed-button"
                  onClick={handleProceed}
                  disabled={!consentChecked}
                >
                  Proceed to Voting
                </Button>
              </div>

              <Alert
                message="Important Notice"
                description="Once you proceed to the voting booth, you cannot return to these instructions. Make sure you understand all guidelines before continuing."
                type="warning"
                showIcon
                icon={<WarningOutlined />}
                className="final-alert"
              />
            </div>
          </Col>
        </Row>
      </div>

      {/* Internal CSS */}
      <style jsx>{`
        /* Global container */
        .election-instructions-container {
          min-height: 60vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          padding: 24px;
          box-sizing: border-box;
          position: relative;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, sans-serif;
        }

        /* Card wrapper to control size */
        .instructions-card-wrapper {
          width: 90%;
          max-width: 1000px;
        }

        /* Main row container */
        .instructions-row {
          width: 100%;
          min-height: 600px;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }

        /* Sidebar panel */
        .sidebar-panel {
          background: linear-gradient(135deg, #1a3a5f 0%, #0d2b4d 100%);
          color: white;
          padding: 30px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          position: relative;
        }

        .sidebar-content {
          max-width: 320px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .logo-container {
          margin-bottom: 15px;
          text-align: center;
        }

        .sidebar-title {
          color: white !important;
          margin-bottom: 12px !important;
          font-weight: 600 !important;
          font-size: 22px !important;
          text-align: center;
        }

        .accent-bar {
          height: 3px;
          width: 50px;
          background-color: #4caf50;
          margin: 0 auto 20px;
          border-radius: 2px;
        }

        .sidebar-steps {
          margin: 20px 0;
          flex-grow: 1;
        }

        .custom-steps {
          color: white !important;
        }

        .custom-divider {
          background-color: rgba(255, 255, 255, 0.1) !important;
          margin: 16px 0 !important;
        }

        .help-section {
          margin-bottom: 20px;
        }

        .help-heading {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px !important;
          color: white;
        }

        .contact-info {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 12px;
          font-size: 14px;
        }

        .contact-item {
          margin-bottom: 6px;
          color: rgba(255, 255, 255, 0.9);
        }

        .footer-text {
          margin-top: auto;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          text-align: center;
        }

        /* Main content panel */
        .main-content-panel {
          padding: 0;
          background-color: white;
        }

        .main-content-container {
          height: 100%;
          display: flex;
          flex-direction: column;
          padding: 30px;
        }

        .header-section {
          margin-bottom: 20px;
        }

        .content-title {
          font-size: 24px !important;
          font-weight: 700 !important;
          margin-bottom: 6px !important;
          color: #1a3a5f !important;
        }

        .content-subtitle {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.6);
          display: block;
        }

        .content-card {
          margin-bottom: 20px;
          border-radius: 8px;
        }

        .step-content {
          padding: 10px 0;
        }

        .instruction-list {
          padding-left: 20px;
          margin-bottom: 20px;
        }

        .instruction-list li {
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .step-navigation {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }

        .info-alert,
        .warning-alert,
        .success-alert,
        .final-alert {
          margin-top: 16px;
        }

        .consent-section {
          margin: 20px 0;
        }

        .consent-checkbox {
          font-size: 15px;
        }

        .consent-text {
          font-size: 15px;
        }

        .action-buttons {
          margin-bottom: 20px;
        }

        .proceed-button {
          height: 42px;
          font-size: 15px;
          font-weight: 500;
          background: linear-gradient(
            135deg,
            #1a3a5f 0%,
            #0d2b4d 100%
          ) !important;
          border: none !important;
          box-shadow: 0 4px 12px rgba(26, 58, 95, 0.3) !important;
          width: 100%;
        }

        .proceed-button:hover {
          background: linear-gradient(
            135deg,
            #0d2b4d 0%,
            #1a3a5f 100%
          ) !important;
          transform: translateY(-1px);
        }

        /* Responsive styles */
        @media (max-width: 767px) {
          .instructions-card-wrapper {
            width: 95%;
          }

          .instructions-row {
            flex-direction: column;
            min-height: auto;
          }

          .sidebar-panel {
            padding: 24px 20px;
          }

          .main-content-container {
            padding: 24px 20px;
          }
        }

        @media (max-width: 480px) {
          .election-instructions-container {
            padding: 12px;
          }

          .instructions-card-wrapper {
            width: 100%;
          }

          .content-title {
            font-size: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ElectionInstructionsPage;
