import React from "react";
import { Table, Typography, Tag } from "antd";
import { CloseCircleOutlined, SyncOutlined } from "@ant-design/icons";
import { Helmet } from "react-helmet";
import "./AcademicCalendar.css";
const { Title } = Typography;

export default function AcademicCalendar() {
  const columns = [
    {
      title: "EVENT",
      dataIndex: "event",
      key: "event",
    },
    {
      title: "DESCRIPTION",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "START DATE",
      dataIndex: "startDate",
      key: "startDate",
    },
    {
      title: "END DATE",
      dataIndex: "endDate",
      key: "endDate",
    },
    {
      title: "STATUS",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          icon={
            status === "Open" ? <SyncOutlined spin /> : <CloseCircleOutlined />
          }
          color={status === "Open" ? "success" : "error"}
        >
          {status}
        </Tag>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      event: "CHANGE OF PROGRAMME",
      description: "CHANGE OF PROGRAMME",
      startDate: "3rd Aug 2024",
      endDate: "17th Aug 2024",
      status: "Close",
    },
    {
      key: "2",
      event: "ENROLLMENT",
      description: "ENROLLMENT",
      startDate: "4th Aug 2024",
      endDate: "7th Dec 2024",
      status: "Open",
    },
    {
      key: "3",
      event: "REGISTRATION",
      description: "REGISTRATION",
      startDate: "4th Aug 2024",
      endDate: "7th Dec 2024",
      status: "Open",
    },
    {
      key: "4",
      event: "ADMINISTRATIVE CHANG...",
      description: "ADMINISTRATIVE CHANG...",
      startDate: "8th Aug 2024",
      endDate: "7th Dec 2024",
      status: "Open",
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Helmet>
        <title>Academic Calendar - Your Institution Name</title>
        <meta
          name="description"
          content="View the Academic Calendar, including key dates for enrollment, registration, program changes, and more at Your Institution Name."
        />
        <meta
          name="keywords"
          content="academic calendar, enrollment, registration, program change, Your Institution Name"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Nkumba University" />
        <link
          rel="canonical"
          href="https://yourwebsite.com/academic-calendar"
        />
      </Helmet>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Title level={5} style={{ margin: 0 }}>
          ACADEMIC CALENDAR - 2024/2025
        </Title>
      </div>

      <Table
        size="small"
        className="custom-table"
        columns={columns}
        dataSource={data}
        pagination={false}
      />
      <div
        style={{
          backgroundColor: "darkblue",
          color: "white",
          padding: "8px 10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>SEMESTER 1 Ends on 12 July 2025</span>
        <Tag color="success">Current</Tag>
      </div>
    </div>
  );
}
