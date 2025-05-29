import { useState } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Modal,
  Typography,
  Divider,
  Space,
  Radio,
  Progress,
  Card,
  Badge,
  Upload,
  message,
  Spin,
} from "antd";
import {
  BookOutlined,
  SendOutlined,
  CheckCircleFilled,
  FileTextOutlined,
  BuildOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  LockOutlined,
  UploadOutlined,
  EyeInvisibleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  DeleteOutlined,
  SafetyOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;

const AnonymousSuggestionBox = () => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageLength, setMessageLength] = useState(0);
  const [urgency, setUrgency] = useState("normal");
  const [formTouched, setFormTouched] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [trackingToken, setTrackingToken] = useState("");

  const maxMessageLength = 1000;

  // University details
  const universityDetails = {
    name: "Nkumba University",
    logo: "/placeholder.svg?height=40&width=40",
  };

  // Generate a random tracking token
  const generateTrackingToken = () => {
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  // Mock API call
  const submitSuggestion = (values) => {
    setIsSubmitting(true);

    // Simulate API call with timeout
    setTimeout(() => {
      console.log("Submitted values:", {
        ...values,
        urgency,
        feedbackType,
        files: fileList,
      });
      setIsSubmitting(false);
      setIsModalVisible(true);

      // Generate tracking token
      const token = generateTrackingToken();
      setTrackingToken(token);

      // Reset form
      form.resetFields();
      setMessageLength(0);
      setFormTouched(false);
      setUrgency("normal");
      setFileList([]);
      setFeedbackType("suggestion");

      // After animation completes (approximately 3 seconds)
      setTimeout(() => {
        setIsAnimationComplete(true);
      }, 3000);
    }, 2000);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setIsAnimationComplete(false);
  };

  const handleMessageChange = (e) => {
    setMessageLength(e.target.value.length);
    if (!formTouched) setFormTouched(true);
  };

  const handleFormValuesChange = () => {
    if (!formTouched) setFormTouched(true);
  };

  const handleResetForm = () => {
    form.resetFields();
    setMessageLength(0);
    setFormTouched(false);
    setUrgency("normal");
    setFileList([]);
    setFeedbackType("suggestion");
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList.slice(-3)); // Limit to 3 files
  };

  const uploadProps = {
    name: "file",
    multiple: true,
    fileList,
    onChange: handleFileChange,
    beforeUpload: (file) => {
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("File must be smaller than 5MB!");
      }
      return false; // Prevent actual upload
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
  };

  return (
    <div className="suggestion-box-container">
      <div className="suggestion-box-wrapper">
        <Card className="suggestion-box-card">
          <div className="form-container">
            <div className="form-header">
              <Paragraph className="form-description">
                Share your feedback without revealing your identity. All
                submissions are completely anonymous.
              </Paragraph>
              <div className="privacy-banner">
                <SafetyOutlined className="privacy-icon" />
                <Text className="privacy-text">
                  Your privacy is guaranteed. No personal data is collected or
                  stored.
                </Text>
              </div>
            </div>

            <Form
              form={form}
              layout="vertical"
              onFinish={submitSuggestion}
              onValuesChange={handleFormValuesChange}
              requiredMark={false}
              className="suggestion-form"
            >
              <div className="feedback-type-selector">
                <Title level={5} className="section-title">
                  <span className="section-icon">
                    <FileTextOutlined />
                  </span>
                  Feedback Type
                </Title>
                <Radio.Group
                  value={feedbackType}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="feedback-type-group"
                >
                  <Radio.Button
                    value="suggestion"
                    className="feedback-type-button"
                  >
                    <div className="feedback-type-content">
                      <BookOutlined className="feedback-type-icon" />
                      <div>
                        <div className="feedback-type-label">Suggestion</div>
                        <div className="feedback-type-desc">
                          Propose an improvement
                        </div>
                      </div>
                    </div>
                  </Radio.Button>
                  <Radio.Button value="issue" className="feedback-type-button">
                    <div className="feedback-type-content">
                      <WarningOutlined className="feedback-type-icon" />
                      <div>
                        <div className="feedback-type-label">Issue</div>
                        <div className="feedback-type-desc">
                          Report a problem
                        </div>
                      </div>
                    </div>
                  </Radio.Button>
                  <Radio.Button
                    value="question"
                    className="feedback-type-button"
                  >
                    <div className="feedback-type-content">
                      <InfoCircleOutlined className="feedback-type-icon" />
                      <div>
                        <div className="feedback-type-label">Question</div>
                        <div className="feedback-type-desc">
                          Ask for information
                        </div>
                      </div>
                    </div>
                  </Radio.Button>
                </Radio.Group>
              </div>

              <div className="form-grid">
                <div className="form-col">
                  <Form.Item
                    name="subject"
                    label="Subject"
                    rules={[
                      { required: true, message: "Please enter a subject" },
                    ]}
                    tooltip="A brief title for your feedback"
                  >
                    <Input
                      prefix={<FileTextOutlined className="input-icon" />}
                      placeholder="What's your feedback about?"
                      //   className="custom-input"
                    />
                  </Form.Item>
                </div>
                <div className="form-col">
                  <Form.Item
                    name="category"
                    label="Category"
                    rules={[
                      { required: true, message: "Please select a category" },
                    ]}
                    tooltip="Select the area your feedback relates to"
                  >
                    <Select
                      placeholder="Select a category"
                      //   className="custom-select"
                    >
                      <Option value="academics">
                        <Space>
                          <BookOutlined />
                          Academics
                        </Space>
                      </Option>
                      <Option value="facilities">
                        <Space>
                          <BuildOutlined />
                          Facilities
                        </Space>
                      </Option>
                      <Option value="faculty">
                        <Space>
                          <TeamOutlined />
                          Faculty & Staff
                        </Space>
                      </Option>
                      <Option value="campus">
                        <Space>
                          <EnvironmentOutlined />
                          Campus Life
                        </Space>
                      </Option>
                      <Option value="events">
                        <Space>
                          <CalendarOutlined />
                          Events & Activities
                        </Space>
                      </Option>
                      <Option value="others">Other</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>

              <Form.Item
                name="message"
                label={
                  <div className="message-label">
                    <span>Your Feedback</span>
                    <span
                      className={`character-count ${
                        messageLength > maxMessageLength
                          ? "character-count-exceeded"
                          : ""
                      }`}
                    >
                      {messageLength}/{maxMessageLength}
                    </span>
                  </div>
                }
                rules={[
                  { required: true, message: "Please enter your feedback" },
                  {
                    max: maxMessageLength,
                    message: `Maximum ${maxMessageLength} characters allowed`,
                  },
                ]}
                tooltip="Be specific and constructive with your feedback"
              >
                <TextArea
                  rows={6}
                  placeholder="Describe your feedback in detail. What would you like to improve or report at the university? Please do not include any personally identifiable information."
                  onChange={handleMessageChange}
                  className="custom-textarea"
                  showCount
                  maxLength={maxMessageLength}
                />
              </Form.Item>

              <div className="urgency-section">
                <Title level={5} className="section-title">
                  <span className="section-icon">
                    <ClockCircleOutlined />
                  </span>
                  Urgency Level
                </Title>
                <Radio.Group
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="urgency-group"
                >
                  <Radio.Button value="low" className="urgency-button">
                    <div className="urgency-content">
                      <Badge color="green" />
                      <span>Low</span>
                    </div>
                  </Radio.Button>
                  <Radio.Button value="normal" className="urgency-button">
                    <div className="urgency-content">
                      <Badge color="blue" />
                      <span>Normal</span>
                    </div>
                  </Radio.Button>
                  <Radio.Button value="high" className="urgency-button">
                    <div className="urgency-content">
                      <Badge color="orange" />
                      <span>High</span>
                    </div>
                  </Radio.Button>
                  <Radio.Button value="critical" className="urgency-button">
                    <div className="urgency-content">
                      <Badge color="red" />
                      <span>Critical</span>
                    </div>
                  </Radio.Button>
                </Radio.Group>
              </div>

              <div className="attachment-section">
                <Title level={5} className="section-title">
                  <span className="section-icon">
                    <UploadOutlined />
                  </span>
                  Attachments (Optional)
                </Title>
                <Dragger {...uploadProps} className="custom-upload">
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag files to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for images, PDFs, and documents. Max 3 files, 5MB
                    each.
                  </p>
                  <p className="upload-privacy-note">
                    <EyeInvisibleOutlined /> Files are automatically scrubbed of
                    metadata
                  </p>
                </Dragger>
                {fileList.length > 0 && (
                  <div className="file-list">
                    {fileList.map((file, index) => (
                      <div key={index} className="file-item">
                        <div className="file-info">
                          {file.type?.includes("image") ? (
                            <FileImageOutlined className="file-icon" />
                          ) : file.type?.includes("pdf") ? (
                            <FilePdfOutlined className="file-icon" />
                          ) : (
                            <FileWordOutlined className="file-icon" />
                          )}
                          <span className="file-name">{file.name}</span>
                        </div>
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={() => {
                            const newFileList = [...fileList];
                            newFileList.splice(index, 1);
                            setFileList(newFileList);
                          }}
                          className="file-delete"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Divider className="form-divider" />

              <div className="form-actions">
                <Button
                  onClick={handleResetForm}
                  disabled={!formTouched || isSubmitting}
                  className="reset-button"
                >
                  Clear Form
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  icon={<SendOutlined />}
                  className="submit-button"
                  disabled={messageLength > maxMessageLength}
                >
                  Submit Anonymously
                </Button>
              </div>
            </Form>
          </div>

          <div className="form-footer">
            <LockOutlined className="footer-icon" />
            <Text className="footer-text">
              Secured with end-to-end encryption. Your IP address is not logged.
            </Text>
          </div>
        </Card>

        <div className="footer-note">
          <SafetyOutlined className="footer-note-icon" />
          <Text className="footer-note-text">
            This form adheres to GDPR and university privacy policies
          </Text>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        open={isModalVisible}
        footer={null}
        closable={isAnimationComplete}
        maskClosable={isAnimationComplete}
        onCancel={handleModalClose}
        width={500}
        centered
        className="suggestion-modal"
      >
        {!isAnimationComplete ? (
          <div className="processing-container">
            <Progress
              type="circle"
              percent={100}
              status="active"
              className="processing-progress"
              strokeColor={{
                "0%": "#108ee9",
                "100%": "#87d068",
              }}
            />
            <div className="processing-steps">
              <div className="processing-step">
                <CheckCircleFilled className="step-complete" /> Encrypting data
              </div>
              <div className="processing-step">
                <CheckCircleFilled className="step-complete" /> Removing
                identifiers
              </div>
              <div className="processing-step active">
                <Spin className="step-active" /> Submitting feedback
              </div>
            </div>
          </div>
        ) : (
          <div className="success-container">
            <div className="success-icon-container">
              <CheckCircleFilled className="success-icon" />
            </div>
            <Title level={3} className="success-title">
              Feedback Submitted Successfully!
            </Title>
            <div className="tracking-container">
              <div className="tracking-header">
                Your Anonymous Tracking Code
              </div>
              <div className="tracking-code">{trackingToken}</div>
              <div className="tracking-note">
                Save this code to check the status of your feedback later
              </div>
            </div>
            <div className="success-message">
              <p>
                Your feedback has been submitted anonymously and will be
                reviewed by the appropriate department.
              </p>
              <p>Thank you for helping improve {universityDetails.name}!</p>
            </div>
            <Button
              type="primary"
              size="large"
              onClick={handleModalClose}
              className="close-button"
            >
              Close
            </Button>
          </div>
        )}
      </Modal>

      <style jsx>{`
        .suggestion-box-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, sans-serif;
        }

        .suggestion-box-wrapper {
          max-width: 800px;
          width: 100%;
        }

        .suggestion-box-card {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          overflow: hidden;
          padding: 0;
          border: none;
          transition: all 0.3s ease;
        }

        .suggestion-box-card:hover {
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }

        .university-header {
          background: linear-gradient(135deg, #1a365d 0%, #2a4365 100%);
          padding: 24px;
          color: white;
        }

        .university-logo-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .university-logo {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background: white;
          padding: 4px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .university-name {
          color: white !important;
          margin: 0 !important;
          font-weight: 600 !important;
        }

        .anonymous-badge {
          display: inline-flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 4px;
          padding: 4px 10px;
          margin-top: 8px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(4px);
        }

        .form-container {
          padding: 28px;
        }

        .form-header {
          margin-bottom: 28px;
          text-align: center;
        }

        .form-title {
          margin-bottom: 12px !important;
          color: #2a4365 !important;
          font-weight: 600 !important;
        }

        .form-description {
          color: #4a5568 !important;
          font-size: 16px !important;
          max-width: 600px;
          margin: 0 auto 20px !important;
        }

        .privacy-banner {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #ebf8ff;
          border-radius: 8px;
          padding: 12px;
          margin-top: 16px;
        }

        .privacy-icon {
          color: #3182ce;
          font-size: 18px;
          margin-right: 10px;
        }

        .privacy-text {
          color: #2c5282;
          font-size: 14px;
        }

        .form-grid {
          display: flex;
          gap: 24px;
          margin-bottom: 24px;
        }

        .form-col {
          flex: 1;
        }

        .section-title {
          display: flex;
          align-items: center;
          margin-bottom: 16px !important;
          color: #2d3748 !important;
          font-weight: 500 !important;
        }

        .section-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background-color: #ebf8ff;
          border-radius: 6px;
          margin-right: 10px;
          color: #3182ce;
        }

        .feedback-type-selector {
          margin-bottom: 24px;
        }

        .feedback-type-group {
          display: flex;
          width: 100%;
          gap: 12px;
        }

        .feedback-type-button {
          flex: 1;
          height: auto !important;
          padding: 0 !important;
          border-radius: 8px !important;
          overflow: hidden;
          border-color: #e2e8f0 !important;
          transition: all 0.2s ease;
        }

        .feedback-type-button:hover {
          border-color: #3182ce !important;
        }

        .feedback-type-content {
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .feedback-type-icon {
          font-size: 20px;
          color: #3182ce;
        }

        .feedback-type-label {
          font-weight: 500;
          margin-bottom: 4px;
        }

        .feedback-type-desc {
          font-size: 12px;
          color: #718096;
        }

        .custom-input,
        .custom-select,
        .custom-textarea {
          border-radius: 8px !important;
          border-color: #e2e8f0 !important;
          padding: 10px 12px !important;
          transition: all 0.3s ease !important;
        }

        .custom-input:hover,
        .custom-select:hover,
        .custom-textarea:hover {
          border-color: #cbd5e0 !important;
        }

        .custom-input:focus,
        .custom-select:focus,
        .custom-textarea:focus {
          border-color: #3182ce !important;
          box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.1) !important;
        }

        .input-icon {
          color: #a0aec0;
        }

        .message-label {
          display: flex;
          justify-content: space-between;
          width: 100%;
        }

        .character-count {
          font-size: 12px;
          color: #718096;
        }

        .character-count-exceeded {
          color: #e53e3e !important;
        }

        .urgency-section {
          margin-bottom: 24px;
          background-color: #f7fafc;
          border-radius: 8px;
          padding: 16px;
        }

        .urgency-group {
          display: flex;
          width: 100%;
        }

        .urgency-button {
          flex: 1;
          text-align: center;
          height: auto !important;
          padding: 8px 0 !important;
          transition: all 0.2s ease;
        }

        .urgency-button:first-child {
          border-top-left-radius: 8px !important;
          border-bottom-left-radius: 8px !important;
        }

        .urgency-button:last-child {
          border-top-right-radius: 8px !important;
          border-bottom-right-radius: 8px !important;
        }

        .urgency-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .attachment-section {
          margin-bottom: 24px;
        }

        .custom-upload {
          border-radius: 8px !important;
          background-color: #f7fafc !important;
          border: 2px dashed #e2e8f0 !important;
          padding: 16px !important;
          transition: all 0.3s ease !important;
        }

        .custom-upload:hover {
          border-color: #3182ce !important;
        }

        .upload-privacy-note {
          font-size: 12px;
          color: #718096;
          margin-top: 8px;
        }

        .file-list {
          margin-top: 16px;
        }

        .file-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #f7fafc;
          border-radius: 6px;
          padding: 8px 12px;
          margin-bottom: 8px;
        }

        .file-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .file-icon {
          color: #3182ce;
        }

        .file-name {
          font-size: 14px;
          color: #4a5568;
        }

        .file-delete {
          color: #a0aec0;
        }

        .file-delete:hover {
          color: #e53e3e;
        }

        .form-divider {
          margin: 24px 0 !important;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
        }

        .reset-button {
          color: #4a5568;
          border-color: #e2e8f0;
          border-radius: 8px;
          padding: 0 16px;
          height: 40px;
          transition: all 0.3s ease;
        }

        .reset-button:hover {
          color: #2d3748;
          border-color: #cbd5e0;
        }

        .submit-button {
          background: linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%);
          border: none;
          border-radius: 8px;
          padding: 0 20px;
          height: 40px;
          font-weight: 500;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(49, 130, 206, 0.1);
        }

        .submit-button:hover {
          background: linear-gradient(135deg, #2b6cb0 0%, #2c5282 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 8px rgba(49, 130, 206, 0.15);
        }

        .form-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          background-color: #f7fafc;
          border-top: 1px solid #edf2f7;
          color: #718096;
          font-size: 14px;
        }

        .footer-icon {
          margin-right: 8px;
        }

        .footer-text {
          color: #718096 !important;
        }

        .footer-note {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 16px;
        }

        .footer-note-icon {
          color: #718096;
          margin-right: 6px;
        }

        .footer-note-text {
          color: #718096 !important;
          font-size: 12px !important;
        }

        .suggestion-modal .ant-modal-content {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .processing-container {
          padding: 40px 20px;
          text-align: center;
        }

        .processing-progress {
          margin-bottom: 24px;
        }

        .processing-steps {
          max-width: 300px;
          margin: 0 auto;
          text-align: left;
        }

        .processing-step {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          color: #718096;
          padding: 8px 12px;
          border-radius: 6px;
        }

        .processing-step.active {
          background-color: #ebf8ff;
          color: #2b6cb0;
        }

        .step-complete {
          color: #48bb78;
        }

        .step-active {
          color: #3182ce;
        }

        .success-container {
          padding: 40px 24px;
          text-align: center;
        }

        .success-icon-container {
          width: 80px;
          height: 80px;
          background-color: #f0fff4;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          border: 4px solid #c6f6d5;
        }

        .success-icon {
          font-size: 40px;
          color: #48bb78;
        }

        .success-title {
          color: #2d3748 !important;
          margin-bottom: 24px !important;
        }

        .tracking-container {
          background-color: #f7fafc;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .tracking-header {
          font-size: 14px;
          color: #4a5568;
          margin-bottom: 8px;
        }

        .tracking-code {
          font-size: 24px;
          font-weight: 600;
          color: #2d3748;
          letter-spacing: 2px;
          background-color: #edf2f7;
          padding: 8px 16px;
          border-radius: 6px;
          margin: 8px 0;
          font-family: monospace;
        }

        .tracking-note {
          font-size: 12px;
          color: #718096;
          margin-top: 8px;
        }

        .success-message {
          color: #4a5568;
          margin-bottom: 24px;
        }

        .close-button {
          background: linear-gradient(135deg, #3182ce 0%, #2b6cb0 100%);
          border: none;
          border-radius: 8px;
          padding: 0 32px;
          height: 44px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .close-button:hover {
          background: linear-gradient(135deg, #2b6cb0 0%, #2c5282 100%);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .feedback-type-group {
            flex-direction: column;
          }

          .feedback-type-button {
            margin-bottom: 8px;
          }

          .form-grid {
            flex-direction: column;
            gap: 0;
          }

          .urgency-group {
            flex-wrap: wrap;
          }

          .urgency-button {
            flex: 1 0 50%;
            padding: 6px 0 !important;
          }

          .form-actions {
            flex-direction: column;
            gap: 12px;
          }

          .reset-button,
          .submit-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AnonymousSuggestionBox;
