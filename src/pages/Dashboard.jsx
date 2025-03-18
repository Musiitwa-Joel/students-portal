import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Card,
  Row,
  Col,
  Typography,
  Button,
  Drawer,
  theme,
  Grid,
  Avatar,
  Tag,
  Image,
  Switch,
  Dropdown,
  Spin,
  Space,
} from "antd";

const { Header: AntHeader } = Layout;
const { useToken } = theme;

import { GiVote } from "react-icons/gi";
import { FaQuestion } from "react-icons/fa";
import { FcServices } from "react-icons/fc";
import { IoCalendarNumber } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { RiAiGenerate } from "react-icons/ri";
import { PiTrademarkRegisteredFill } from "react-icons/pi";
import { GiPapers } from "react-icons/gi";
import { GiTakeMyMoney } from "react-icons/gi";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { MdSettingsSuggest } from "react-icons/md";
import { Moon, RefreshCcw, Sun } from "lucide-react";
import { RiPresentationLine } from "react-icons/ri";
import {
  HomeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  BookOutlined,
  MenuOutlined,
  ProfileOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./mycss.css";
import AppContext from "../context/appContext";

import PRT from "./PRT/PRT";
const { Header, Content, Sider, Footer } = Layout;
const { Title, Text } = Typography;
import Registration from "./Registration/Registration";
import Results from "./Results/Results";
import Bio from "./Bio/Bio";
import AcademicCalendar from "./AcademicCalendar/AcademicCalendar";
import Finance from "./Finances/Finances";
import Services from "./Sevices/Services";
import Faq from "./Faq/faq";
import Enrollment from "./enrollment/Enrollment";
import styled from "styled-components";
import GraduationClearance from "./graduation_clearance/GraduationClearance";

const SpinningIcon = styled(RefreshCcw)`
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const { useBreakpoint } = Grid;

const UserAvatar = ({ stdno, name }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const userMenu = (
    <Menu>
      <Menu.Item key="profile" icon={<ProfileOutlined />}>
        My Profile
      </Menu.Item>
      <Menu.Item
        key="logout"
        danger
        icon={<LogoutOutlined />}
        onClick={handleLogout}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={userMenu} trigger={["click"]}>
      <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            marginRight: 10,
          }}
        >
          <Typography.Text strong>{name}</Typography.Text>
          <Typography.Text>{stdno}</Typography.Text>
        </div>
        <img
          src={`https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=${stdno}`}
          style={{
            marginRight: "8px",
            marginTop: 0,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "lightgray",
          }}
        />
      </div>
    </Dropdown>
  );
};
const dashboardItems = [
  {
    icon: <RiAiGenerate />,
    color: "#de703d",
    key: "generate_prt",
    title: "Generate PRT",
  },
  {
    icon: <BookOutlined style={{}} />,
    title: "Enrollment",
    key: "enrollment",
    color: "#722ed1",
  },
  {
    icon: <PiTrademarkRegisteredFill style={{}} />,
    title: "Registration",
    key: "registration",
    color: "#faad14",
  },

  // {
  //   icon: <BookOutlined style={{}} />,
  //   title: "Registration",
  //   key: "enrollment",
  //   color: "#faad14",
  // },
  {
    icon: <GiPapers style={{}} />,
    title: "Results Hub",
    key: "results_hub",
    color: "#1890ff",
  },
  {
    icon: <GiTakeMyMoney style={{}} />,
    title: "My Finances",
    key: "my_finances",
    color: "red",
  },
  {
    icon: <CgProfile style={{}} />,
    title: "Bio Data",
    key: "bio",
    color: "#eb2f96",
  },
  {
    icon: <IoCalendarNumber style={{}} />,
    title: "Acc. Calendar",
    key: "calendar",
    color: "green",
  },
  {
    icon: <FcServices style={{}} />,
    title: "My Services",
    color: "#013220",
    key: "services",
  },
  {
    icon: <GiVote style={{}} />,
    title: "E-Voting",
    key: "evoting",
    color: "#04417a",
  },
  {
    icon: <FaQuestion style={{}} />,
    title: "FAQ",
    color: "#2196F3",
    key: "faq",
  },
  {
    icon: <RiPresentationLine style={{}} />,
    title: "E-Learning",
    color: "#0d72a8",
    key: "faq",
  },
  {
    icon: <MdSettingsSuggest style={{}} />,
    title: "Suggestion Box",
    color: "#661f19",
    key: "faq",
  },

  {
    icon: <GiVote style={{}} />,
    title: "Counseling",
    key: "counseling",
    color: "#04417a",
  },

  {
    icon: <RiPresentationLine style={{}} />,
    title: "News",
    key: "news",
    color: "#0d72a8",
  },
  {
    icon: <MdSettingsSuggest style={{}} />,
    title: "Library",
    key: "library",
    color: "#661f19",
  },
  {
    icon: <FaQuestion style={{}} />,
    title: "Graduation Clearance",
    color: "#2196F3",
    key: "graduation_clearance",
  },
  // { icon: <ToolOutlined style={{ color: "#a0d911" }} />, title: "My Services" },
];

export default function Dashboard() {
  const { token } = useToken();
  const currentYear = new Date().getFullYear();

  const [currentTheme, setcurrentTheme] = useState("light");
  const [visible, setVisible] = useState(false);
  const screens = useBreakpoint();
  const {
    route,
    setRoute,
    studentFile,
    refetchStudentFile,
    setRefetchStudentFile,
  } = useContext(AppContext);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  const price = 234000;
  const formattedPrice = price.toLocaleString("en-UG", {
    style: "currency",
    currency: "UGX",
  });

  const contentStyle = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
  };

  const renderSidebarContent = (studentFile) => (
    <Layout style={{ minHeight: "100vh -50px", backgroundColor: "#eeeeee" }}>
      <div
        style={{
          height: 100,
          backgroundColor:
            studentFile?.current_info?.registration_status == "Registered"
              ? "#0832b7"
              : studentFile?.current_info?.registration_status ==
                "Provisionally Registered"
              ? "green"
              : "#ff3333",
          borderRadius: 5,
        }}
      ></div>
      <div
        style={{
          height: "auto",
          backgroundColor: "#e5e5e5",
          marginTop: -30,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}
      >
        <Content
          style={{
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={`https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=${studentFile?.student_no}`}
            style={{
              marginBottom: "4px",
              marginTop: "-80px",
              width: 110,
              height: 110,
              borderRadius: 75,
              backgroundColor: "lightgray",
              // marginBottom: 10,
            }}
          />

          <Card
            style={{
              width: "100%",
              maxWidth: 400,
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            <Title level={4} style={{ margin: 0 }}>
              {studentFile?.biodata &&
                `${studentFile?.biodata?.surname} ${studentFile?.biodata?.other_names}`}
            </Title>
            <Text type="secondary">{studentFile?.registration_no}</Text>
            <Text type="secondary" style={{ display: "block" }}>
              {studentFile?.student_no}
            </Text>
            <Text>
              {studentFile?.course_details &&
                `${studentFile?.course_details?.course?.course_code} - ${studentFile?.course_details?.course?.course_title}`}
            </Text>
          </Card>

          <Card style={{ width: "100%", maxWidth: 400, marginBottom: "10px" }}>
            <Row gutter={16} justify="space-between" align="middle">
              <Col
                span={8}
                style={{ textAlign: "center", position: "relative" }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  {studentFile?.current_info?.recent_enrollment?.study_yr}
                </Title>
                <Text type="secondary">Year</Text>
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: "1px",
                    backgroundColor: token.colorPrimary,
                  }}
                />
              </Col>
              <Col
                span={8}
                style={{ textAlign: "center", position: "relative" }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  {studentFile?.study_time_title}
                </Title>
                <Text type="secondary">Study Time</Text>
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: "1px",
                    backgroundColor: token.colorPrimary,
                  }}
                />
              </Col>
              <Col span={8} style={{ textAlign: "center" }}>
                <Title level={4} style={{ margin: 0 }}>
                  {studentFile?.current_info?.recent_enrollment?.sem}
                </Title>
                <Text type="secondary">Semester</Text>
              </Col>
            </Row>
          </Card>

          <Card style={{ width: "100%", maxWidth: 400 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Tag
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                }}
                icon={<CheckCircleOutlined style={{ fontWeight: "bold" }} />}
                color={
                  studentFile?.current_info?.enrollment_status === "Enrolled"
                    ? "#108ee9"
                    : "error"
                }
              >
                {studentFile?.current_info?.enrollment_status}
              </Tag>
              <Tag
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                }}
                icon={<CloseCircleOutlined style={{ fontWeight: "bold" }} />}
                color={
                  studentFile?.current_info?.registration_status ===
                  "Registered"
                    ? "#108ee9"
                    : studentFile?.current_info?.registration_status ===
                      "Provisionally Registered"
                    ? "green"
                    : "error"
                }
              >
                {studentFile?.current_info?.registration_status}
              </Tag>
            </div>
          </Card>
        </Content>
      </div>
    </Layout>
  );

  return (
    <>
      <Layout
        style={{
          background: "#f0f2f5",
          height: "calc(100vh - 0px)",
        }}
      >
        {/* {content} */}
        <AntHeader
          style={{
            background: "#fff",
            padding: "0 16px",
            boxShadow: "0 1px 4px rgba(0,21,41,.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <img
            src="https://cdn.worldvectorlogo.com/logos/nkumba-uninersity.svg"
            width={140}
            style={{ marginBottom: 3, marginTop: 3 }}
          />

          {screens.md ? (
            <UserAvatar
              stdno={studentFile?.student_no}
              name={`${studentFile?.biodata?.surname} ${studentFile?.biodata?.other_names}`}
            />
          ) : (
            <>
              <Button
                type="primary"
                icon={<MenuOutlined />}
                onClick={showDrawer}
                style={{ marginLeft: "16px" }}
              />
            </>
          )}
        </AntHeader>
        <Header
          className="responsive-header"
          style={{
            marginTop: 10,
            marginLeft: screens.xs ? 0 : 20,
            marginRight: screens.xs ? 0 : 20,
            background: "#fff",
            padding: "0 16px",
            boxShadow: "0 1px 4px rgba(0,21,41,.08)",
            borderRadius: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap", // Allow wrapping
          }}
        >
          {route ? (
            <Button
              type="text"
              icon={
                <ArrowLeftOutlined
                  style={{
                    color: token.colorPrimary,
                    fontSize: "20px",
                    paddingRight: 0,
                  }}
                />
              }
              onClick={() => setRoute(null)}
              style={{ marginRight: 10 }}
            />
          ) : null}
          <Title
            level={4}
            className="dashboard-title"
            style={{
              margin: 0,
              color: token.colorPrimary,
              flex: 1,
            }}
          >
            {route ? route.title : "Dashboard"}
          </Title>

          {studentFile?.current_info && (
            <Space size="middle">
              {studentFile?.current_info?.progress == "NORMAL" ? (
                <Tag
                  style={{
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    fontSize: 13,
                  }}
                  icon={
                    <CheckCircleOutlined
                      style={{ fontWeight: "bold", fontSize: 14 }}
                    />
                  }
                  color="#108ee9"
                >
                  NORMAL PROGRESS
                </Tag>
              ) : (
                <Tag
                  style={{
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    fontSize: 13,
                  }}
                  icon={
                    <CheckCircleOutlined
                      style={{ fontWeight: "bold", fontSize: 14 }}
                    />
                  }
                  color="error"
                >
                  {studentFile?.current_info?.progress}
                </Tag>
              )}

              <Tag
                style={{
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  fontSize: 13,
                }}
                icon={
                  <MdOutlineAccountBalanceWallet
                    style={{ fontWeight: "bold", marginRight: 5, fontSize: 16 }}
                  />
                }
                color="processing"
              >
                {studentFile?.current_info &&
                  `UGX ${studentFile?.current_info?.account_balance}`}
              </Tag>

              <Button
                icon={
                  refetchStudentFile ? (
                    <SpinningIcon size={15} />
                  ) : (
                    <RefreshCcw size={15} />
                  )
                }
                onClick={() => setRefetchStudentFile(true)}
              >
                Refresh
              </Button>
            </Space>
          )}
        </Header>

        <div
          style={{
            height: "calc(100vh - 170px)",
            overflow: "scroll",
          }}
        >
          {!route ? (
            <Layout
              style={{ background: "#eeeeee", height: "calc(100vh - 170px)" }}
            >
              <Content
                style={{
                  marginTop: "5px",
                  display: "flex",
                  flexDirection: screens.lg ? "row" : "column",
                }}
              >
                <div
                  style={{
                    overscrollBehavior: "none",
                    flex: 1,
                    background: "#eeeeee",
                    // backgroundColor: "red",
                    padding: 5,
                    // paddingLeft: 23,
                    minHeight: "auto",
                    marginBottom: screens.lg ? 0 : 24,
                    marginLeft: screens.md ? 20 : 0,
                    marginRight: screens.md ? 20 : 0,
                    height: 100,
                  }}
                >
                  <Row gutter={[16, 16]}>
                    {dashboardItems.map((item, index) => (
                      <Col xs={12} sm={8} md={6} lg={6} xl={6} key={index}>
                        <Card
                          hoverable
                          style={{
                            textAlign: "center",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            // justifyContent: "center",
                            alignItems: "center",
                            border: `1px solid ${token.colorPrimary}`,
                            borderRadius: "5px",
                          }}
                          onClick={() => setRoute(item)}
                          // bodyStyle={{ padding: "24px 8px" }}
                        >
                          {React.cloneElement(item.icon, {
                            style: {
                              ...item.icon.props.style,
                              fontSize: "40px",
                              color: item.color,
                              // backgroundColor: "red",
                            },
                          })}
                          <p
                            style={{
                              marginTop: "8px",
                              marginBottom: 0,
                              color: item.color,

                              fontSize: screens.xs ? "12px" : "14px",
                            }}
                          >
                            {item.title}
                          </p>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </div>
                {screens.lg && (
                  <Sider
                    width={430}
                    style={{
                      padding: 0,
                      marginRight: 20,
                      marginBottom: 15,
                      marginTop: 3,
                      background: "transparent",
                      borderRadius: "5px",
                      // backgroundColor: "red",
                    }}
                  >
                    {renderSidebarContent(studentFile)}
                  </Sider>
                )}
              </Content>
            </Layout>
          ) : (
            <div
              style={{
                marginTop: route.key == "graduation_clearance" ? 0 : 10,
                marginLeft:
                  route.key == "graduation_clearance"
                    ? 10
                    : screens.md
                    ? 20
                    : 0,
                marginRight:
                  route.key == "graduation_clearance"
                    ? 10
                    : screens.md
                    ? 20
                    : 0,
                background: route.key != "graduation_clearance" && "#fff",
              }}
            >
              {route.key == "registration" && <Registration />}
              {route.key == "enrollment" && <Enrollment />}
              {route.key == "generate_prt" && <PRT />}
              {route.key == "results_hub" && <Results />}
              {route.key == "bio" && <Bio />}
              {route.key == "calendar" && <AcademicCalendar />}
              {route.key == "my_finances" && <Finance />}
              {route.key == "services" && <Services />}
              {route.key == "faq" && <Faq />}
              {route.key == "graduation_clearance" && <GraduationClearance />}
            </div>
          )}
        </div>

        <Drawer
          style={{ borderRadius: 5 }}
          title="Menu"
          placement="right"
          onClose={onClose}
          open={visible}
          width={screens.xs ? "100%" : 300}
        >
          {renderSidebarContent(studentFile)}
        </Drawer>
        <Footer
          style={{
            height: 30,
            textAlign: "center",
          }}
        >
          <span className="full-footer">
            ©{new Date().getFullYear()} Nkumba University and the university
            logo are trademarks of Nkumba University; other trademarks are
            property of their owners.
          </span>
          <span className="mobile-footer">
            ©{new Date().getFullYear()} Nkumba University
          </span>
        </Footer>
      </Layout>
    </>
  );
}
