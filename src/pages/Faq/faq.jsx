import React from "react";
import { Layout, Typography, Collapse, Card, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;
const { Panel } = Collapse;

const faqItems = [
  {
    question: "How do I reset my student portal password?",
    answer:
      "To reset your student portal password, go to the login page and click on the 'Forgot Password' link. Enter your email address or username associated with your account and submit. You will receive an email with password reset instructions; check your inbox and spam folder. Follow the instructions in the email to set a new password. Once done, return to the login page and log in with your new password. If you experience any issues or do not receive the reset email, please contact our technical support team for assistance.",
  },
  {
    question: "Where can I find my class schedule?",
    answer:
      "Your class schedule is available in the 'Academics' section of the student portal. Click on 'Class Schedule' to view your current semester's timetable.",
  },
  {
    question: "How do I register for courses?",
    answer:
      "Course registration is typically done through the 'Course Registration' module in the student portal. The exact dates for registration are announced by the Registrar's office each semester.",
  },
  {
    question: "Where can I view my grades?",
    answer:
      "Your grades are accessible in the 'Academics' section. Click on 'Grade Report' to view your current and past semester grades.",
  },
  {
    question: "How do I contact my academic advisor?",
    answer:
      "Your academic advisor's contact information can be found in the 'Advising' section of the portal. You can usually schedule appointments or send messages directly through this section.",
  },
  {
    question:
      "What should I do if I'm having technical issues with the portal?",
    answer:
      "If you are experiencing technical issues with the portal, start by checking the available help resources. The FAQs and help guides on the portal are designed to address common problems and provide step-by-step solutions. Additionally, clearing your browser's cache and cookies can often resolve many technical issues. It might also help to access the portal using a different web browser or device to see if the issue persists. Ensuring your web browser is up-to-date and disabling any browser extensions that might interfere with the portal's functionality are also recommended steps.If these steps do not resolve the issue, please contact our technical support team for further assistance. When reaching out, provide as much detail as possible about the problem, including any error messages you have encountered and the steps you have already taken to try and resolve the issue. Our support team is here to help you and will work to ensure that you can access and use the portal without further problems.",
  },
];

export default function FAQPage() {
  return (
    <Layout className="min-h-screen bg-gray-100">
      <Content className="p-6">
        <Card className="max-w-3xl mx-auto">
          <Input
            size="large"
            placeholder="Search FAQ..."
            prefix={<SearchOutlined />}
            className="mb-6"
          />
          <Paragraph className="text-center mb-6">
            Find answers to frequently asked questions about the student portal
            below. If you can't find what you're looking for, please contact the
            support team.
          </Paragraph>
          <Collapse accordion>
            {faqItems.map((item, index) => (
              <Panel header={item.question} key={index}>
                <p>{item.answer}</p>
              </Panel>
            ))}
          </Collapse>
        </Card>
      </Content>
    </Layout>
  );
}
