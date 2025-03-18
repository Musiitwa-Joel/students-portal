import React, { useState, useEffect } from "react";
import { Splitter, Flex, Typography, Collapse, Table, Row, Col } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import UnitsTable from "./UnitsTable";
import SelectedModules from "./SelectedModules";
// import RegistrationTrack from "./RegistrationTrack";
// import "./MyTable.css";

const { Panel } = Collapse;

const Desc = ({ text }) => (
  <Flex justify="center" align="center" style={{ height: "100%" }}>
    <Typography.Title
      type="secondary"
      level={5}
      style={{ whiteSpace: "nowrap" }}
    >
      {text}
    </Typography.Title>
  </Flex>
);

const ModulesEnrollment = () => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCourseSelect = (course, status) => {
    setSelectedCourses((prevSelected) => {
      const existingCourse = prevSelected.find((c) => c.code === course.code);
      return existingCourse
        ? prevSelected.map((c) =>
            c.code === course.code ? { ...c, status } : c
          )
        : [...prevSelected, { ...course, status }];
    });
  };

  const handleDelete = (courseCode) => {
    setSelectedCourses((prevSelected) =>
      prevSelected.filter((course) => course.code !== courseCode)
    );
  };

  const columns = [
    {
      title: "#",
      width: isMobile ? "10%" : "5%",
      key: "action",
      render: (_, record) => (
        <DeleteOutlined
          onClick={() => handleDelete(record.code)}
          style={{ cursor: "pointer", color: "red" }}
        />
      ),
    },
    {
      title: "Course Title",
      ellipsis: true,
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Enrollment Status",
      ellipsis: true,
      width: isMobile ? "45%" : "30%",
      dataIndex: "status",
      key: "status",
    },
  ];

  return isMobile ? (
    <div style={{ padding: "0px" }}>
      <UnitsTable onCourseSelect={handleCourseSelect} />
      <Collapse style={{ marginTop: "10px" }}>
        <Panel style={{ padding: 0 }} header="Registered Units" key="1">
          <SelectedModules />
        </Panel>
      </Collapse>
    </div>
  ) : (
    <>
      <Row
        gutter={16}
        style={{
          width: "100%",
          height: "auto",
          margin: 0,
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)",
          //   backgroundColor: "red",
        }}
      >
        <Col className="gutter-row" span={12}>
          <UnitsTable onCourseSelect={handleCourseSelect} />
        </Col>
        <Col className="gutter-row" span={12}>
          <SelectedModules />
        </Col>
      </Row>
      {/* <Splitter
        style={{
          width: "100%",
          height: "auto",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Splitter.Panel defaultSize="50%" min="20%" max="50%" resizable={false}>
          <UnitsTable onCourseSelect={handleCourseSelect} />
        </Splitter.Panel>
        <Splitter.Panel style={{ overflowX: "auto" }} defaultSize="20%">
         
          <SelectedModules />
        </Splitter.Panel>
      </Splitter> */}
    </>
  );
};

export default ModulesEnrollment;
