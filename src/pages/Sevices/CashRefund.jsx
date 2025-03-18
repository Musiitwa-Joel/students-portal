import React, { useState } from "react";
import {
  Layout,
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Table,
  Typography,
  message,
  Statistic,
  DatePicker,
  Select,
  Tooltip,
} from "antd";
import { DollarOutlined, InfoCircleOutlined } from "@ant-design/icons";
import moment from "moment";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// Mock data for demonstration
const initialBalance = 1000;
const initialRefunds = [
  {
    id: 1,
    amount: 100,
    reason: "Overpayment",
    status: "Approved",
    date: "2023-05-01",
    type: "Tuition",
  },
  {
    id: 2,
    amount: 200,
    reason: "Course withdrawal",
    status: "Pending",
    date: "2023-05-10",
    type: "Housing",
  },
  {
    id: 3,
    amount: 150,
    reason: "Meal plan change",
    status: "Processing",
    date: "2023-05-15",
    type: "Meal Plan",
  },
];

const refundTypes = ["Tuition", "Housing", "Meal Plan", "Books", "Other"];

export default function RefundSystem() {
  const [balance, setBalance] = useState(initialBalance);
  const [refunds, setRefunds] = useState(initialRefunds);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    if (values.amount > balance) {
      message.error("Refund amount cannot exceed your current balance.");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const newRefund = {
        id: refunds.length + 1,
        amount: values.amount,
        reason: values.reason,
        status: "Pending",
        date: values.date.format("YYYY-MM-DD"),
        type: values.type,
      };

      setRefunds([newRefund, ...refunds]);
      setBalance(balance - values.amount);
      form.resetFields();
      message.success("Refund request submitted successfully.");
      setLoading(false);
    }, 1500);
  };

  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => (
        <Text strong style={{ color: "#1890ff" }}>
          ${amount.toFixed(2)}
        </Text>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status === "Approved"
            ? "#52c41a"
            : status === "Pending"
            ? "#faad14"
            : "#1890ff";
        return <Text style={{ color }}>{status.toUpperCase()}</Text>;
      },
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header style={{ background: "#fff", padding: "0 50px" }}></Header>
      <Content style={{ padding: "0 50px", flex: 1 }}>
        <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Request Refund" key="1">
                <Card style={{ marginBottom: "24px" }}>
                  <Statistic
                    title="Current Balance"
                    value={balance}
                    precision={2}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: "#3f8600" }}
                  />
                  <Tooltip title="This is the amount available for refund based on your account status.">
                    <InfoCircleOutlined style={{ marginLeft: "8px" }} />
                  </Tooltip>
                </Card>
                <Form
                  form={form}
                  name="refundForm"
                  onFinish={onFinish}
                  layout="vertical"
                >
                  <Form.Item
                    name="amount"
                    label="Refund Amount"
                    rules={[
                      {
                        required: true,
                        message: "Please enter the refund amount",
                      },
                      {
                        type: "number",
                        min: 0.01,
                        message: "Amount must be greater than 0",
                      },
                      {
                        type: "number",
                        max: balance,
                        message: "Amount cannot exceed your current balance",
                      },
                    ]}
                  >
                    <Input prefix="$" type="number" step="0.01" />
                  </Form.Item>
                  <Form.Item
                    name="type"
                    label="Refund Type"
                    rules={[
                      {
                        required: true,
                        message: "Please select a refund type",
                      },
                    ]}
                  >
                    <Select placeholder="Select a refund type">
                      {refundTypes.map((type) => (
                        <Option key={type} value={type}>
                          {type}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="reason"
                    label="Reason for Refund"
                    rules={[
                      {
                        required: true,
                        message: "Please provide a reason for the refund",
                      },
                    ]}
                  >
                    <Input.TextArea rows={4} />
                  </Form.Item>
                  <Form.Item
                    name="date"
                    label="Date of Request"
                    rules={[
                      { required: true, message: "Please select a date" },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                    >
                      Submit Refund Request
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
              <TabPane tab="Refund History" key="2">
                <Table
                  columns={columns}
                  dataSource={refunds}
                  rowKey="id"
                  pagination={{ pageSize: 5 }}
                />
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </Content>
    </Layout>
  );
}
