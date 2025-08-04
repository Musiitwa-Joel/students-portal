import { useState, useEffect, useContext } from "react";
import {
  Input,
  Button,
  Typography,
  Image,
  theme,
  message,
  Row,
  Col,
  Divider,
  Checkbox,
  Collapse,
} from "antd";
import {
  LockOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CheckCircleOutlined,
  FileProtectOutlined,
  SafetyOutlined,
  InfoCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AppContext from "../../context/appContext";
import { gql, useMutation, useLazyQuery } from "@apollo/client";
const { useToken } = theme;
const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
import { VOTER_AUTHENTICATION } from "../../gql/mutation";
import { VERIFY_VOTING_OTP } from "../../gql/queries";
import OngoingElections from "./OngoingElections";
import { Helmet } from "react-helmet";

const VotingLoginPage = () => {
  const { token } = useToken();
  const { studentFile } = useContext(AppContext);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [canResend, setCanResend] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [authenticateVoter] = useMutation(VOTER_AUTHENTICATION);
  const [verifyVotingOtp, { loading: verifying }] =
    useLazyQuery(VERIFY_VOTING_OTP);

  // console.log(studentFile);
  // Timer effect
  useEffect(() => {
    // Only start the timer when OTP screen is shown and instructions are not shown
    if (!showOtpScreen || showInstructions || showDashboard) return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerInterval);
          messageApi.open({
            type: "error",
            content: "OTP has expired. Please request a new one.",
          });
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Clean up interval on unmount or when OTP screen is hidden
    return () => clearInterval(timerInterval);
  }, [showOtpScreen, showInstructions, showDashboard, messageApi]);

  // Format time function
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const startResendTimer = () => {
    setCanResend(false);
    setTimeLeft(300);
  };

  useEffect(() => {
    let timer;

    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else {
      setCanResend(true);
    }

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Pre-filled voter information
  const voterInfo = {
    regNumber: studentFile.registration_no,
    email: studentFile.biodata.email || "NOT PROVIDED",
    phone: studentFile.biodata.phone_no || "NOT PROVIDED",
  };

  const handleAuthenticate = async () => {
    setLoading(true);

    try {
      const { data } = await authenticateVoter();

      if (data?.authenticate_voter?.success) {
        messageApi.open({
          type: "success",
          content:
            data.authenticate_voter.message ||
            "OTP sent to your email and phone number",
        });
        setTimeLeft(300); // 5 minutes
        setShowOtpScreen(true);
      } else {
        messageApi.open({
          type: "error",
          content: data.authenticate_voter.message || "Failed to send OTP.",
        });
      }
    } catch (error) {
      console.error("OTP Error:", error);
      messageApi.open({
        type: "error",
        content: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // only digits
    const updated = [...otpValues];
    updated[index] = value;
    setOtpValues(updated);

    // Auto-focus next input
    if (value && index < 5) {
      const next = document.getElementById(`otp-input-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handleResendOtp = async (e) => {
    e.preventDefault();
    if (!canResend) return;

    setLoading(true);
    try {
      const { data } = await authenticateVoter();

      if (data?.authenticate_voter?.success) {
        startResendTimer(); // <== reset the timer
        messageApi.open({
          type: "success",
          content: data.authenticate_voter.message || "New OTP sent.",
        });
      } else {
        messageApi.open({
          type: "error",
          content: data.authenticate_voter.message || "Resend failed.",
        });
      }
    } catch (err) {
      messageApi.open({
        type: "error",
        content: "An error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetTimer = () => {
    setTimeLeft(300); // Reset to 5 minutes
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prev = document.getElementById(`otp-input-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otpValues.join("").trim();

    if (otpCode.length !== 6) {
      messageApi.open({
        type: "error",
        content: "Please enter the full 6-digit OTP.",
      });
      return;
    }

    try {
      const { data, error } = await verifyVotingOtp({
        variables: { otpCode },
        fetchPolicy: "network-only",
      });

      if (error) {
        console.error("GraphQL error:", error);
        messageApi.open({
          type: "error",
          content: error.message || "Failed to verify OTP.",
        });
        return;
      }

      if (data?.verify_voting_otp?.success) {
        messageApi.open({
          type: "success",
          content:
            data.verify_voting_otp.message || "OTP verified successfully.",
        });
        setShowInstructions(true);
      } else {
        messageApi.open({
          type: "error",
          content: data.verify_voting_otp.message || "Invalid OTP.",
        });
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      messageApi.open({
        type: "error",
        content: error.message,
      });
    }
  };

  const handleProceedToVoting = () => {
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      // messageApi.open({
      //   type: "success",
      //   content: "Redirecting to voting dashboard...",
      // });

      // Show dashboard instead of redirecting
      setTimeout(() => {
        setShowDashboard(true);
      }, 1000);
    }, 1000);
  };

  const isOtpComplete = otpValues.every((value) => value !== "");

  // Custom expand icon for accordion
  const expandIcon = ({ isActive }) => (
    <RightOutlined rotate={isActive ? 90 : 0} className="accordion-arrow" />
  );

  // If dashboard should be shown, render only the dashboard
  if (showDashboard) {
    return (
      <div className="dashboard-container">
        <OngoingElections />
      </div>
    );
  }
  return (
    <>
      <Helmet>
        <title>
          {showDashboard
            ? `${studentFile.biodata.surname} ${studentFile.biodata.other_names} - Ongoing Elections`
            : showInstructions
            ? `${studentFile.biodata.surname} ${studentFile.biodata.other_names} - Voting Instructions`
            : showOtpScreen
            ? `${studentFile.biodata.surname} ${studentFile.biodata.other_names} - OTP Verification`
            : `${studentFile.biodata.surname} ${studentFile.biodata.other_names} - Voter Authentication`}{" "}
          - Nkumba University
        </title>
        <meta
          name="description"
          content={
            showDashboard
              ? `Join ${studentFile.biodata.surname} ${studentFile.biodata.other_names} in participating in ongoing elections at Nkumba University and cast your vote securely.`
              : showInstructions
              ? `${studentFile.biodata.surname} ${studentFile.biodata.other_names}, review the voting instructions and guidelines before casting your vote at Nkumba University.`
              : showOtpScreen
              ? `${studentFile.biodata.surname} ${studentFile.biodata.other_names}, verify your identity with the OTP sent to your email and phone to access the voting system at Nkumba University.`
              : `${studentFile.biodata.surname} ${studentFile.biodata.other_names}, authenticate your voter information to access the secure electronic voting system at Nkumba University.`
          }
        />
        <meta
          name="keywords"
          content={`${
            showDashboard
              ? "ongoing elections, voting, cast vote"
              : showInstructions
              ? "voting instructions, election guidelines"
              : showOtpScreen
              ? "OTP verification, voter authentication"
              : "voter authentication, electronic voting"
          }, ${studentFile.biodata.surname} ${
            studentFile.biodata.other_names
          }, Nkumba University`}
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Nkumba University" />
      </Helmet>
      <div className="voting-container">
        {contextHolder}
        <div className="voting-card-wrapper">
          {showInstructions ? (
            // Full-width Instructions Screen after OTP verification
            <div className="voting-instructions-card">
              <div className="instructions-header">
                <div className="logo-container">
                  <Image
                    preview={false}
                    width={120}
                    src="https://pay-nkumba.vercel.app/assets/darkmode-BT18pDMC.png"
                    alt="Voting System Logo"
                  />
                </div>
                <div className="header-content">
                  <Title level={3} className="instructions-title">
                    Voting Instructions
                  </Title>
                  <Text className="instructions-subtitle">
                    Please review the following information carefully before
                    proceeding to vote
                  </Text>
                </div>
              </div>

              <div className="instructions-body">
                <div className="instructions-intro">
                  <p>
                    Welcome to the Electronic Voting System. Before you proceed
                    to cast your vote, please take a moment to review the
                    following important information. This will ensure that you
                    understand the voting process and your rights as a voter.
                  </p>
                </div>

                <Collapse
                  defaultActiveKey={["1"]}
                  expandIcon={expandIcon}
                  className="instructions-accordion"
                >
                  <Panel
                    header={
                      <div className="panel-header">
                        <CheckCircleOutlined className="panel-icon" />
                        <span>Voting Process</span>
                      </div>
                    }
                    key="1"
                    className="accordion-panel"
                  >
                    <div className="panel-content">
                      <p>The voting process consists of the following steps:</p>
                      <ol className="numbered-list">
                        <li>
                          <strong>Candidate Selection:</strong> You will be
                          presented with a list of candidates for each position.
                          Review their information carefully before making your
                          selection.
                        </li>
                        <li>
                          <strong>Making Your Choice:</strong> Select one
                          candidate per position by clicking on their name or
                          the corresponding selection button.
                        </li>
                        <li>
                          <strong>Review:</strong> Before final submission, you
                          will have the opportunity to review all your
                          selections. Ensure they accurately reflect your
                          intended votes.
                        </li>
                        <li>
                          <strong>Confirmation:</strong> After reviewing,
                          confirm your selections to cast your vote. This action
                          is final and cannot be changed.
                        </li>
                        <li>
                          <strong>Receipt:</strong> Upon successful submission,
                          you will receive a digital receipt as confirmation of
                          your participation in the election.
                        </li>
                      </ol>
                    </div>
                  </Panel>

                  <Panel
                    header={
                      <div className="panel-header">
                        <FileProtectOutlined className="panel-icon" />
                        <span>Voting Methods</span>
                      </div>
                    }
                    key="2"
                    className="accordion-panel"
                  >
                    <div className="panel-content">
                      <p>
                        The electronic voting system provides a straightforward
                        method for casting your vote:
                      </p>
                      <ul className="bullet-list">
                        <li>
                          <strong>Selection Interface:</strong> Click or tap on
                          your preferred candidate's name or the selection
                          button next to it.
                        </li>
                        <li>
                          <strong>Visual Confirmation:</strong> A visual
                          indicator will appear to confirm your selection for
                          each position.
                        </li>
                        <li>
                          <strong>Navigation:</strong> Use the "Next" and
                          "Previous" buttons to move between different positions
                          or categories.
                        </li>
                        <li>
                          <strong>Changing Selections:</strong> You can change
                          your selection at any time before final submission by
                          simply selecting a different candidate.
                        </li>
                        <li>
                          <strong>Abstaining:</strong> If you wish to abstain
                          from voting for a particular position, select the
                          "Abstain" option where available.
                        </li>
                      </ul>
                    </div>
                  </Panel>

                  <Panel
                    header={
                      <div className="panel-header">
                        <LockOutlined className="panel-icon" />
                        <span>Security and Privacy</span>
                      </div>
                    }
                    key="3"
                    className="accordion-panel"
                  >
                    <div className="panel-content">
                      <p>
                        Your security and privacy are our highest priorities:
                      </p>
                      <ul className="bullet-list">
                        <li>
                          <strong>Anonymity:</strong> Your vote is completely
                          anonymous. Once cast, it cannot be traced back to you
                          personally.
                        </li>
                        <li>
                          <strong>Encryption:</strong> All data is encrypted
                          using industry-standard protocols to ensure the
                          integrity and confidentiality of your vote.
                        </li>
                        <li>
                          <strong>Secure Authentication:</strong> The
                          multi-factor authentication process (including OTP)
                          ensures that only eligible voters can access the
                          system.
                        </li>
                        <li>
                          <strong>Data Protection:</strong> Your personal
                          information is protected in accordance with data
                          protection regulations and is only used for voter
                          verification.
                        </li>
                        <li>
                          <strong>Audit Trail:</strong> While maintaining voter
                          anonymity, the system maintains a secure audit trail
                          to verify the integrity of the election process.
                        </li>
                      </ul>
                    </div>
                  </Panel>

                  <Panel
                    header={
                      <div className="panel-header">
                        <InfoCircleOutlined className="panel-icon" />
                        <span>Important Notes</span>
                      </div>
                    }
                    key="4"
                    className="accordion-panel"
                  >
                    <div className="panel-content">
                      <p>
                        Please be aware of the following important information:
                      </p>
                      <ul className="bullet-list">
                        <li>
                          <strong>Single Vote:</strong> You can only vote once
                          in this election. Once your ballot is submitted, you
                          cannot vote again.
                        </li>
                        <li>
                          <strong>Session Timeout:</strong> For security
                          reasons, your voting session will expire after 15
                          minutes of inactivity. If this happens, you will need
                          to authenticate again.
                        </li>
                        <li>
                          <strong>Device Compatibility:</strong> The voting
                          system works on most modern devices and browsers. For
                          optimal experience, use the latest version of Chrome,
                          Firefox, Safari, or Edge.
                        </li>
                        <li>
                          <strong>Technical Issues:</strong> If you encounter
                          any technical difficulties during the voting process,
                          please contact the support team immediately at the
                          contact information provided below.
                        </li>
                        <li>
                          <strong>Voting Period:</strong> The voting period is
                          strictly enforced. Ensure you complete your voting
                          process within the designated timeframe.
                        </li>
                      </ul>
                    </div>
                  </Panel>
                </Collapse>

                <div className="help-section">
                  <div className="help-header">
                    <SafetyOutlined className="help-icon" />
                    <h3>Need Assistance?</h3>
                  </div>
                  <div className="help-content">
                    <p>
                      If you require any assistance during the voting process,
                      please contact:
                    </p>
                    <div className="contact-info">
                      <div className="contact-item">
                        <strong>Email:</strong> voting@tredumo.org
                      </div>
                      <div className="contact-item">
                        <strong>Phone:</strong> +123 456 7890
                      </div>
                      <div className="contact-item">
                        <strong>Support Hours:</strong> 8:00 AM - 8:00 PM
                        (Monday - Sunday)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="consent-section">
                  <Checkbox
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="consent-checkbox"
                  >
                    I have read and understood the voting instructions and agree
                    to proceed with the voting process
                  </Checkbox>

                  <Button
                    type="primary"
                    size="large"
                    className="proceed-button"
                    onClick={handleProceedToVoting}
                    loading={loading}
                    disabled={!consentChecked}
                  >
                    Proceed to Voting
                  </Button>
                </div>

                <div className="footer-text">
                  © {new Date().getFullYear()} Electoral Commission | Secure
                  Electronic Voting System
                </div>
              </div>
            </div>
          ) : (
            // Original two-column layout for authentication and OTP
            <Row className="voting-row">
              <Col xs={24} md={12} className="instructions-panel">
                <div className="instructions-content">
                  <div className="logo-container">
                    <Image
                      preview={false}
                      width={180}
                      src="https://pay-nkumba.vercel.app/assets/darkmode-BT18pDMC.png"
                      alt="Voting System Logo"
                    />
                  </div>
                  <Title level={3} className="instructions-title">
                    Electronic Voting System
                  </Title>
                  <div className="accent-bar"></div>

                  <div className="instruction-section">
                    <div className="section-icon">
                      <SafetyOutlined />
                    </div>
                    <div className="section-content">
                      <Paragraph className="section-heading">
                        {showOtpScreen
                          ? "OTP Verification"
                          : "Voting Instructions"}
                      </Paragraph>
                      {showOtpScreen ? (
                        <ul className="instruction-list">
                          <li>
                            Enter the 6-digit OTP sent to your email and phone
                          </li>
                          <li>OTP is valid for 5 minutes only</li>
                          <li>Do not share your OTP with anyone</li>
                          <li>Contact support if you didn't receive the OTP</li>
                        </ul>
                      ) : (
                        <ul className="instruction-list">
                          <li>Verify your voter information</li>
                          <li>You can only vote once per election</li>
                          <li>You only vote during the specified time</li>
                          <li>Your vote is confidential and secure</li>
                        </ul>
                      )}
                    </div>
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

              <Col xs={24} md={12} className="login-form-panel">
                <div className="login-form-container">
                  {showOtpScreen ? (
                    // OTP Verification Screen
                    <div className="otp-container">
                      <div className="login-header">
                        <Title level={3} className="login-title">
                          OTP Verification
                        </Title>
                        <Text className="login-subtitle">
                          Enter the 6-digit code sent to your email and phone
                        </Text>
                      </div>

                      <div className="otp-form">
                        <div className="otp-inputs">
                          {otpValues.map((value, index) => (
                            <Input
                              key={index}
                              id={`otp-input-${index}`}
                              className="otp-input"
                              value={value}
                              onChange={(e) =>
                                handleOtpChange(index, e.target.value)
                              }
                              onKeyDown={(e) => handleOtpKeyDown(index, e)}
                              maxLength={1}
                              autoFocus={index === 0}
                            />
                          ))}
                        </div>

                        <div className="otp-timer">
                          <Text className="timer-text">
                            OTP expires in: {formatTime(timeLeft)}
                          </Text>
                        </div>

                        <Button
                          type="primary"
                          block
                          size="large"
                          className="submit-button"
                          onClick={handleVerifyOtp}
                          loading={verifying}
                          disabled={otpValues.join("").length !== 6}
                        >
                          Verify OTP
                        </Button>

                        <div className="resend-otp">
                          <Text className="resend-text">
                            Didn't receive the code?{" "}
                            {!canResend ? (
                              <span style={{ color: "#aaa" }}>
                                Resend in{" "}
                                {Math.floor(timeLeft / 60)
                                  .toString()
                                  .padStart(2, "0")}
                                :{(timeLeft % 60).toString().padStart(2, "0")}
                              </span>
                            ) : (
                              <a
                                href="#"
                                onClick={handleResendOtp}
                                style={{
                                  cursor: loading ? "not-allowed" : "pointer",
                                }}
                              >
                                {loading ? "Sending..." : "Resend OTP"}
                              </a>
                            )}
                          </Text>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Voter Information Screen
                    <>
                      <div className="login-header">
                        <Title level={3} className="login-title">
                          Voter Authentication
                        </Title>
                        <Text className="login-subtitle">
                          Ensure these credentials are correct for voting and
                          OTP access.
                        </Text>
                      </div>

                      <div className="voter-info-form">
                        <div className="info-item">
                          <label className="info-label">
                            Registration Number
                          </label>
                          <div className="info-value-container">
                            <UserOutlined className="info-icon" />
                            <div className="info-value">
                              {voterInfo.regNumber}
                            </div>
                          </div>
                        </div>

                        <div className="info-item">
                          <label className="info-label">Student Email</label>
                          <div className="info-value-container">
                            <MailOutlined className="info-icon" />
                            <div className="info-value">{voterInfo.email}</div>
                          </div>
                        </div>

                        <div className="info-item">
                          <label className="info-label">Phone Number</label>
                          <div className="info-value-container">
                            <PhoneOutlined className="info-icon" />
                            <div className="info-value">{voterInfo.phone}</div>
                          </div>
                        </div>

                        <Button
                          type="primary"
                          block
                          size="large"
                          className="submit-button"
                          onClick={handleAuthenticate}
                          loading={loading}
                        >
                          Authenticate
                        </Button>

                        <div className="security-notice">
                          <LockOutlined className="security-icon" />
                          <Text className="security-text">
                            Secure connection. Your information is protected.
                          </Text>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Col>
            </Row>
          )}
        </div>

        {/* Internal CSS */}
        <style jsx>{`
          /* Global container */
          .voting-container {
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
          .voting-card-wrapper {
            width: 90%;
            max-width: 900px;
          }

          /* Main row container */
          .voting-row {
            width: 100%;
            min-height: 480px;
            max-height: 650px;
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            overflow: hidden;
          }

          /* Instructions panel */
          .instructions-panel {
            background: linear-gradient(135deg, #1a3a5f 0%, #0d2b4d 100%);
            color: white;
            padding: 30px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
          }

          .instructions-content {
            max-width: 320px;
            margin: 0 auto;
            position: relative;
            z-index: 2;
          }

          .logo-container {
            margin-bottom: 15px;
          }

          .instructions-title {
            color: white !important;
            margin-bottom: 12px !important;
            font-weight: 600 !important;
            font-size: 22px !important;
          }

          .accent-bar {
            height: 3px;
            width: 50px;
            background-color: #4caf50;
            margin-bottom: 20px;
            border-radius: 2px;
          }

          .instruction-section {
            display: flex;
            margin-bottom: 20px;
          }

          .section-icon {
            font-size: 20px;
            color: #4caf50;
            margin-right: 12px;
            margin-top: 4px;
          }

          .section-content {
            flex: 1;
          }

          .section-heading {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px !important;
            color: white;
          }

          .instruction-list {
            padding-left: 18px;
            margin: 0;
          }

          .instruction-list li {
            margin-bottom: 6px;
            color: rgba(255, 255, 255, 0.85);
            line-height: 1.5;
            font-size: 14px;
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
            margin-top: 20px;
            font-size: 12px;
            color: rgba(0, 0, 0, 0.6);
            text-align: center;
          }

          /* Login form panel */
          .login-form-panel {
            padding: 0;
            background-color: white;
          }

          .login-form-container {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 30px;
            overflow-y: auto;
          }

          .login-header {
            text-align: center;
            margin-bottom: 0px;
          }

          .login-title {
            font-size: 22px !important;
            font-weight: 700 !important;
            margin-bottom: 6px !important;
            color: #1a3a5f !important;
          }

          .login-subtitle {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.6);
            display: block;
            margin-top: 8px;
            padding-left: 32px;
            padding-bottom: 10px;
          }

          /* Voter Info Form Styling */
          .voter-info-form {
            max-width: 320px;
            margin: 0 auto;
          }

          .info-item {
            margin-bottom: 20px;
          }

          .info-label {
            display: block;
            font-weight: 500;
            color: #333;
            margin-bottom: 8px;
            font-size: 14px;
          }

          .info-value-container {
            display: flex;
            align-items: center;
            background-color: #f9f9f9;
            border: 1px solid #e8e8e8;
            border-radius: 6px;
            padding: 10px 12px;
          }

          .info-icon {
            color: #1a3a5f;
            font-size: 16px;
            margin-right: 10px;
          }

          .info-value {
            font-size: 15px;
            color: #333;
          }

          /* OTP Screen Styling */
          .otp-container {
            width: 100%;
            max-width: 320px;
            margin: 0 auto;
          }

          .otp-form {
            margin-top: 20px;
          }

          .otp-inputs {
            display: flex;
            justify-content: space-between;
            margin-bottom: 24px;
          }

          .otp-input {
            width: 45px;
            height: 50px;
            font-size: 20px;
            text-align: center;
            border: 1px solid #d9d9d9;
            border-radius: 6px;
            margin: 0 4px;
            transition: all 0.3s;
          }

          .otp-input:focus {
            border-color: #1a3a5f;
            box-shadow: 0 0 0 2px rgba(26, 58, 95, 0.2);
          }

          .otp-timer {
            text-align: center;
            margin-bottom: 24px;
          }

          .timer-text {
            font-size: 14px;
            color: #ff4d4f;
            font-weight: 500;
          }

          .resend-otp {
            text-align: center;
            margin-top: 16px;
          }

          .resend-text {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.65);
          }

          .resend-text a {
            color: #1a3a5f;
            font-weight: 500;
          }

          .resend-text a:hover {
            color: #4caf50;
          }

          /* Full-width Instructions Card Styling */
          .voting-instructions-card {
            width: 100%;
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            overflow: hidden;
          }

          .instructions-header {
            background: linear-gradient(135deg, #1a3a5f 0%, #0d2b4d 100%);
            color: white;
            padding: 24px 30px;
            display: flex;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }

          .header-content {
            margin-left: 20px;
          }

          .instructions-title {
            color: white !important;
            margin-bottom: 6px !important;
            font-weight: 600 !important;
            font-size: 24px !important;
          }

          .instructions-subtitle {
            color: rgba(255, 255, 255, 0.85);
            font-size: 14px;
          }

          .instructions-body {
            padding: 30px;
            max-height: 600px;
            overflow-y: auto;
          }

          .instructions-intro {
            margin-bottom: 24px;
            padding: 0 5px;
          }

          .instructions-intro p {
            font-size: 15px;
            line-height: 1.6;
            color: #555;
          }

          /* Accordion Styling */
          .instructions-accordion {
            margin-bottom: 30px;
            background-color: transparent;
            border: none;
          }

          .accordion-panel {
            margin-bottom: 12px;
            border: 1px solid #e8e8e8 !important;
            border-radius: 8px;
            overflow: hidden;
          }

          .accordion-arrow {
            color: #1a3a5f;
            font-size: 12px;
          }

          .panel-header {
            display: flex;
            align-items: center;
            font-size: 16px;
            font-weight: 600;
            color: #1a3a5f;
          }

          .panel-icon {
            margin-right: 12px;
            color: #4caf50;
            font-size: 18px;
          }

          .panel-content {
            padding: 5px 0 10px;
          }

          .panel-content p {
            margin-top: 0;
            margin-bottom: 12px;
            color: #555;
            font-size: 14px;
            line-height: 1.6;
          }

          .numbered-list,
          .bullet-list {
            margin: 0;
            padding-left: 20px;
          }

          .numbered-list li,
          .bullet-list li {
            margin-bottom: 10px;
            color: #555;
            font-size: 14px;
            line-height: 1.5;
          }

          .numbered-list li strong,
          .bullet-list li strong {
            color: #333;
          }

          /* Help Section Styling */
          .help-section {
            margin-bottom: 20px;
          }

          .help-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
          }

          .help-icon {
            font-size: 20px;
            color: #4caf50;
            margin-right: 12px;
          }

          .help-header h3 {
            margin: 0;
            font-size: 18px;
            color: #1a3a5f;
            font-weight: 600;
          }

          .help-content p {
            margin-top: 0;
            margin-bottom: 12px;
            color: #555;
            font-size: 14px;
            line-height: 1.5;
          }

          .help-content .contact-info {
            background-color: white;
            border-radius: 6px;
            padding: 15px;
            margin-top: 10px;
          }

          .help-content .contact-item {
            margin-bottom: 8px;
            color: #555;
            font-size: 14px;
          }

          .help-content .contact-item:last-child {
            margin-bottom: 0;
          }

          /* Consent Section Styling */
          .consent-section {
            margin-bottom: 20px;
          }

          .consent-checkbox {
            font-size: 14px;
            margin-bottom: 20px;
          }

          .proceed-button {
            height: 44px;
            font-size: 16px;
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

          .footer-text {
            margin-top: 30px;
            font-size: 12px;
            color: rgba(0, 0, 0, 0.5);
            text-align: center;
          }

          .submit-button {
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
            margin-top: 8px;
          }

          .submit-button:hover {
            background: linear-gradient(
              135deg,
              #0d2b4d 0%,
              #1a3a5f 100%
            ) !important;
            transform: translateY(-1px);
          }

          .security-notice {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 16px;
          }

          .security-icon {
            color: #4caf50;
            margin-right: 6px;
          }

          .security-text {
            font-size: 12px;
            color: rgba(0, 0, 0, 0.5);
          }

          /* Responsive styles */
          @media (max-width: 767px) {
            .voting-card-wrapper {
              width: 95%;
            }

            .voting-row {
              flex-direction: column;
              min-height: auto;
              max-height: none;
            }

            .instructions-panel {
              padding: 24px 20px;
              order: 2;
            }

            .login-form-panel {
              order: 1;
            }

            .login-form-container {
              padding: 24px 20px;
            }

            .otp-input {
              width: 40px;
              height: 45px;
              font-size: 18px;
            }

            .instructions-header {
              flex-direction: column;
              text-align: center;
              padding: 20px;
            }

            .header-content {
              margin-left: 0;
              margin-top: 15px;
            }

            .instructions-body {
              padding: 20px;
            }
          }

          @media (max-width: 480px) {
            .voting-container {
              padding: 12px;
            }

            .voting-card-wrapper {
              width: 100%;
            }

            .otp-input {
              width: 35px;
              height: 40px;
              font-size: 16px;
              margin: 0 2px;
            }

            .panel-header {
              font-size: 15px;
            }

            .panel-icon {
              font-size: 16px;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default VotingLoginPage;
