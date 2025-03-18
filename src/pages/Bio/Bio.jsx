import React, { useContext } from "react";
import {
  Card,
  Image,
  Tabs,
  Row,
  Col,
  Typography,
  Divider,
  Tag,
  Grid,
} from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  IdcardOutlined,
  CalendarOutlined,
  UserOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { IoIosCheckmarkCircle } from "react-icons/io";

import AcademicDetails from "./AcademicDetails";
import PersonalDetails from "./PersonalDetails";
import Security from "./Security";
import AppContext from "../../context/appContext";

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const Bio = () => {
  const { studentFile } = useContext(AppContext);
  const screens = useBreakpoint();

  const formatDate = (value) => {
    if (!value) return "NO RECORD";
    const timestamp = Number(value);
    if (!isNaN(timestamp) && timestamp > 0) {
      const date = new Date(timestamp);
      return date.toLocaleDateString("en-GB");
    }
    return value;
  };

  return (
    <Card style={{ margin: "0px" }}>
      <div style={{ maxHeight: "calc(100vh - 183px)", overflowY: "auto" }}>
        <Row gutter={16}>
          <Col xs={24} sm={24} md={24} lg={8}>
            <Card>
              <Row align="middle">
                <Col>
                  <Image
                    preview={false}
                    width={64}
                    src={`https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=${studentFile.student_no}`}
                    alt="Profile"
                    style={{ borderRadius: "50%" }}
                  />
                </Col>
                <Col style={{ paddingLeft: "16px" }}>
                  <Title level={5} style={{ margin: 0 }}>
                    {`${studentFile.biodata.surname}`}{" "}
                    {`${studentFile.biodata.other_names}`}{" "}
                    <IoIosCheckmarkCircle style={{ color: "green" }} />
                  </Title>
                  <Text type="secondary"> {`${studentFile.student_no}`}</Text>
                  <br />
                  <Text type="secondary">{`${studentFile.registration_no}`}</Text>
                </Col>
              </Row>
              <p style={{ fontWeight: "bold" }}>About</p>
              <div style={{ marginTop: 16 }}>
                <Text>
                  <PhoneOutlined style={{ paddingRight: 10 }} />
                  Phone:{" "}
                  <strong
                    style={{ paddingLeft: 10 }}
                  >{`${studentFile.biodata.phone_no}`}</strong>
                </Text>
                <br />
                <Text>
                  <MailOutlined style={{ paddingRight: 10 }} />
                  Email:
                  <strong style={{ paddingLeft: 10 }}>
                    {`${studentFile.biodata.email}`}
                  </strong>
                </Text>
                <br />
                <Divider style={{ marginTop: "10px" }} />
                <p style={{ fontWeight: "bold" }}>Bio Information</p>
                <Text>
                  <HomeOutlined style={{ paddingRight: 10 }} />
                  Address:{" "}
                  <strong style={{ paddingLeft: 10 }}>
                    {" "}
                    {formatDate(studentFile.biodata.district_of_birth)}
                  </strong>
                </Text>
                <br />
                <Text>
                  <CalendarOutlined style={{ paddingRight: 10 }} />
                  Date of Birth:{" "}
                  <strong style={{ paddingLeft: 10 }}>
                    {" "}
                    {formatDate(studentFile.biodata.date_of_birth)}
                  </strong>
                </Text>
                <br />
                <Text>
                  <IdcardOutlined style={{ paddingRight: 10 }} />
                  National ID:{" "}
                  <strong style={{ paddingLeft: 10 }}>
                    {" "}
                    {formatDate(studentFile.biodata.national_id_no)}
                  </strong>
                </Text>
                <br />
                <Divider style={{ marginTop: "10px" }} />
                <p style={{ fontWeight: "bold" }}>Demographic Information</p>
                <Text>
                  <UserOutlined style={{ paddingRight: 10 }} />
                  Sex:{" "}
                  <strong style={{ paddingLeft: 10 }}>
                    {" "}
                    {`${studentFile.biodata.gender}`}
                  </strong>
                </Text>
                <br />
                <Text>
                  <GlobalOutlined style={{ paddingRight: 10 }} />
                  Nationality:{" "}
                  <strong style={{ paddingLeft: 10 }}>
                    {" "}
                    {`${studentFile.biodata.nationality.nationality_title}`}
                  </strong>
                </Text>
                <br />
                <Text>
                  <EnvironmentOutlined style={{ paddingRight: 10 }} />
                  District:{" "}
                  <strong style={{ paddingLeft: 10 }}>
                    {" "}
                    {formatDate(studentFile.biodata.district_of_birth)}
                  </strong>
                </Text>
                <Divider style={{ marginTop: "10px" }} />
                <Tag
                  style={{ fontWeight: "bold" }}
                  icon={
                    studentFile.current_info.enrollment_status ===
                    "ENROLLED" ? (
                      <CheckCircleOutlined style={{ fontWeight: "bold" }} />
                    ) : (
                      <CloseCircleOutlined style={{ fontWeight: "bold" }} />
                    )
                  }
                  color={
                    studentFile.current_info.enrollment_status === "ENROLLED"
                      ? "success"
                      : "error"
                  }
                >
                  {studentFile.current_info.enrollment_status
                    ? studentFile.current_info.enrollment_status.toUpperCase()
                    : "NO RECORD"}
                </Tag>

                <Tag
                  style={{ fontWeight: "bold" }}
                  icon={
                    studentFile.current_info.registration_status ===
                    "REGISTERED" ? (
                      <CheckCircleOutlined style={{ fontWeight: "bold" }} />
                    ) : (
                      <CloseCircleOutlined style={{ fontWeight: "bold" }} />
                    )
                  }
                  color={
                    studentFile.current_info.registration_status ===
                    "REGISTERED"
                      ? "success"
                      : "error"
                  }
                >
                  {studentFile.current_info.registration_status
                    ? studentFile.current_info.registration_status.toUpperCase()
                    : "NO RECORD"}
                </Tag>
              </div>
            </Card>
          </Col>
          {screens.lg && (
            <Col xs={24} sm={24} md={24} lg={16}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="Academic Details" key="1">
                  <AcademicDetails />
                </TabPane>
                <TabPane tab="Personal Details" key="2">
                  <PersonalDetails />
                </TabPane>
                <TabPane tab="Security" key="3">
                  <Security />
                </TabPane>
              </Tabs>
            </Col>
          )}
        </Row>
      </div>
    </Card>
  );
};

export default Bio;
