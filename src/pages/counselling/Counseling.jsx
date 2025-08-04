import React, { useState } from "react";
import {
  Layout,
  Card,
  Button,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Rate,
  Space,
  Typography,
  Row,
  Col,
  Statistic,
  Modal,
  Popconfirm,
  Avatar,
  List,
  Drawer,
  Empty,
} from "antd";
import {
  BsCalendarCheck,
  BsClock,
  BsStarFill,
  BsPerson,
  BsChatDots,
  BsBookmark,
  BsCheckCircle,
  BsCalendarPlus,
} from "react-icons/bs";
import toast, { Toaster } from "react-hot-toast";
import { Helmet } from "react-helmet";

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const counselors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Cognitive Behavioral Therapy",
    experience: "15 years",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
    rating: 4.8,
    availability: "Available today",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialization: "Family Therapy",
    experience: "12 years",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop",
    rating: 4.9,
    availability: "Next available: Tomorrow",
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialization: "Anxiety & Depression",
    experience: "10 years",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=150&h=150&fit=crop",
    rating: 4.7,
    availability: "Available today",
  },
];

function App() {
  const [sessions, setSessions] = useState([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [form] = Form.useForm();

  const handleBookSession = (values) => {
    const newSession = {
      id: sessions.length + 1,
      title: values.sessionType,
      therapist: values.therapist,
      date: values.date.format("YYYY-MM-DD"),
      time: values.time.format("HH:mm"),
    };

    setSessions([...sessions, newSession]);
    setIsBookingModalOpen(false);
    form.resetFields();
    toast.success("Session booked successfully!", {
      style: {
        background: "#10B981",
        color: "#fff",
        borderRadius: "8px",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#10B981",
      },
    });
  };

  const handleCancelSession = (sessionId) => {
    setSessions(sessions.filter((session) => session.id !== sessionId));
    toast.success("Session cancelled successfully!");
  };

  const handleRateSession = (sessionId, rating) => {
    setSessions(
      sessions.map((session) =>
        session.id === sessionId ? { ...session, rating } : session
      )
    );
    toast.success("Thank you for your feedback!");
  };

  const handleStartChat = (counselor) => {
    setSelectedCounselor(counselor);
    setIsChatDrawerOpen(true);
    setMessages([
      {
        id: 1,
        sender: counselor.name,
        content: `Hello! I'm ${counselor.name}. How can I help you today?`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedCounselor) return;

    const userMessage = {
      id: messages.length + 1,
      sender: "You",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    const counselorResponse = {
      id: messages.length + 2,
      sender: selectedCounselor.name,
      content:
        "Thank you for sharing. I understand how you feel. Would you like to schedule a session to discuss this further?",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages([...messages, userMessage, counselorResponse]);
    setNewMessage("");
  };

  return (
    <Layout style={{ minHeight: "100vh", background: "#f7f9fc" }}>
      <Toaster position="top-right" />

      <div style={{ padding: "0 48px", maxWidth: "1400px", margin: "0 auto" }}>
        <Helmet>
          <title>Counseling Services - Nkumba University</title>
          <meta
            name="description"
            content="Book and manage counseling sessions with expert counselors at Nkumba University. Schedule sessions, chat with therapists, and track your wellness journey."
          />
          <meta
            name="keywords"
            content="counseling services, book session, therapist chat, mental health, Nkumba University"
          />
          <meta name="robots" content="index, follow" />
          <meta name="author" content="Nkumba University" />
        </Helmet>
        <Row gutter={24} style={{ marginBottom: "48px" }}>
          <Col span={6}>
            <Card className="stats-card" style={{ borderColor: "#0EA5E9" }}>
              <Statistic
                title="Total Sessions"
                value={sessions.length}
                prefix={<BsCalendarCheck style={{ color: "#0EA5E9" }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="stats-card" style={{ borderColor: "#0EA5E9" }}>
              <Statistic
                title="Hours of Counseling"
                value={sessions.length * 1.5}
                suffix="hrs"
                prefix={<BsClock style={{ color: "#0EA5E9" }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="stats-card" style={{ borderColor: "#F59E0B" }}>
              <Statistic
                title="Average Rating"
                value={
                  sessions.reduce((acc, curr) => acc + (curr.rating || 0), 0) /
                    sessions.filter((s) => s.rating).length || 0
                }
                precision={1}
                prefix={<BsStarFill style={{ color: "#F59E0B" }} />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card className="stats-card" style={{ borderColor: "#0EA5E9" }}>
              <Statistic
                title="Active Therapists"
                value={counselors.length}
                prefix={<BsPerson style={{ color: "#0EA5E9" }} />}
              />
            </Card>
          </Col>
        </Row>

        <Title level={2} className="section-title">
          Our Expert Counselors
        </Title>
        <List
          grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 3 }}
          dataSource={counselors}
          renderItem={(counselor) => (
            <List.Item>
              <Card
                hoverable
                className="counselor-card"
                actions={[
                  <Button
                    type="primary"
                    icon={<BsChatDots />}
                    onClick={() => handleStartChat(counselor)}
                  >
                    Start Chat
                  </Button>,
                  <Button
                    icon={<BsBookmark />}
                    onClick={() => {
                      form.setFieldValue("therapist", counselor.name);
                      setIsBookingModalOpen(true);
                    }}
                  >
                    Book Session
                  </Button>,
                ]}
              >
                <Card.Meta
                  avatar={<Avatar size={80} src={counselor.image} />}
                  title={counselor.name}
                  description={
                    <Space direction="vertical" size={4}>
                      <div style={{ color: "#4B5563", fontWeight: "500" }}>
                        {counselor.specialization}
                      </div>
                      <div style={{ color: "#6B7280" }}>
                        Experience: {counselor.experience}
                      </div>
                      <Rate disabled defaultValue={counselor.rating} />
                      <div style={{ color: "#059669", fontSize: "14px" }}>
                        <BsCheckCircle style={{ marginRight: "4px" }} />
                        {counselor.availability}
                      </div>
                    </Space>
                  }
                />
              </Card>
            </List.Item>
          )}
        />

        <Title
          level={2}
          className="section-title"
          style={{ marginTop: "48px" }}
        >
          Your Sessions
        </Title>
        {sessions.length === 0 ? (
          <Card className="empty-sessions-card">
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{ height: 160 }}
              description={
                <Space direction="vertical" align="center" size={16}>
                  <Title level={4} style={{ margin: 0, color: "#6B7280" }}>
                    No Sessions Scheduled
                  </Title>
                  <Paragraph style={{ color: "#9CA3AF", margin: 0 }}>
                    Start your wellness journey by booking your first session
                    with one of our expert counselors.
                  </Paragraph>
                  <Button
                    type="primary"
                    icon={<BsCalendarPlus />}
                    onClick={() => setIsBookingModalOpen(true)}
                    size="large"
                  >
                    Schedule Your First Session
                  </Button>
                </Space>
              }
            />
          </Card>
        ) : (
          <Row gutter={24}>
            {sessions.map((session) => (
              <Col span={8} key={session.id}>
                <Card
                  className="counseling-card session-card"
                  title={session.title}
                  extra={
                    <Popconfirm
                      title="Cancel this session?"
                      description="Are you sure you want to cancel this counseling session?"
                      onConfirm={() => handleCancelSession(session.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button danger>Cancel</Button>
                    </Popconfirm>
                  }
                >
                  <Space direction="vertical" size={12}>
                    <div>
                      <BsPerson /> Therapist: {session.therapist}
                    </div>
                    <div>
                      <BsCalendarCheck /> Date: {session.date}
                    </div>
                    <div>
                      <BsClock /> Time: {session.time}
                    </div>
                    {!session.rating && (
                      <div style={{ marginTop: "16px" }}>
                        <Rate
                          onChange={(value) =>
                            handleRateSession(session.id, value)
                          }
                          style={{ color: "#F59E0B" }}
                        />
                      </div>
                    )}
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        )}

        <Modal
          title="Book a Counseling Session"
          open={isBookingModalOpen}
          onCancel={() => setIsBookingModalOpen(false)}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleBookSession}
            className="booking-form"
          >
            <Form.Item
              name="sessionType"
              label="Session Type"
              rules={[
                { required: true, message: "Please select session type" },
              ]}
            >
              <Input placeholder="e.g., Individual Counseling, Couples Therapy" />
            </Form.Item>

            <Form.Item
              name="therapist"
              label="Preferred Therapist"
              rules={[{ required: true, message: "Please select a therapist" }]}
            >
              <Input placeholder="Enter therapist name" />
            </Form.Item>

            <Form.Item
              name="date"
              label="Session Date"
              rules={[{ required: true, message: "Please select a date" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="time"
              label="Session Time"
              rules={[{ required: true, message: "Please select a time" }]}
            >
              <TimePicker format="HH:mm" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<BsCheckCircle />}
                >
                  Book Session
                </Button>
                <Button onClick={() => setIsBookingModalOpen(false)}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>

        <Drawer
          title={
            selectedCounselor ? `Chat with ${selectedCounselor.name}` : "Chat"
          }
          placement="right"
          width={400}
          open={isChatDrawerOpen}
          onClose={() => setIsChatDrawerOpen(false)}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "calc(100vh - 150px)",
            }}
          >
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                marginBottom: "16px",
                padding: "16px",
              }}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`chat-message ${
                    message.sender === "You" ? "user" : "counselor"
                  }`}
                >
                  <p style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>
                    {message.sender}
                  </p>
                  <p style={{ margin: "8px 0" }}>{message.content}</p>
                  <p style={{ margin: 0, fontSize: "12px", color: "#6B7280" }}>
                    {message.timestamp}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ padding: "16px", borderTop: "1px solid #E5E7EB" }}>
              <Space.Compact style={{ width: "100%" }}>
                <TextArea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  autoSize={{ minRows: 2, maxRows: 4 }}
                  onPressEnter={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                />
                <Button
                  type="primary"
                  onClick={handleSendMessage}
                  style={{
                    height: "auto",
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                  }}
                >
                  Send
                </Button>
              </Space.Compact>
            </div>
          </div>
        </Drawer>
      </div>
    </Layout>
  );
}

export default App;
