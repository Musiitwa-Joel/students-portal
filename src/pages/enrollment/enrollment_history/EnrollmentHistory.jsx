import React, { useRef, useEffect, useState, useContext } from "react";
import { ExclamationCircleOutlined, SmileOutlined } from "@ant-design/icons";
import {
  Timeline,
  Badge,
  Card,
  Button,
  Row,
  Col,
  Descriptions,
  Modal,
  ConfigProvider,
  theme,
  Typography,
} from "antd";
import PerfectScrollbar from "perfect-scrollbar";
import "../styles.css";
import AppContext from "../../../context/appContext";
import formatDateString from "../../../utils/formatDateToDateAndTime";
import { Edit2, Trash } from "lucide-react";

const EnrollmentHistory = () => {
  const [modal, contextHolder] = Modal.useModal();
  const scrollContainerRef = useRef(null);
  const psRef = useRef(null);
  const { studentFile } = useContext(AppContext);

  const [enrollmentHist, setEnrollmentHist] = useState(
    studentFile?.enrollment_history
  );

  const handleDelete = (enrollment) => {
    modal.confirm({
      title: "Delete Enrollment",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete this enrollment",
      okText: "Yes",
      cancelText: "No",
      onOk: () => onConfirmDelete(enrollment),
      style: {
        top: "30%",
      },
    });
  };

  const onConfirmDelete = async (enrollment) => {
    // console.log("delete", enrollment);
    // const payload = {
    //   enrollmentId: enrollment.id,
    // };
    // const res = await deleteEnrollment({
    //   variables: payload,
    // });
    // dispatch(
    //   showMessage({
    //     message: res.data.deleteEnrollment.message,
    //     variant: "success",
    //   })
    // );
  };

  // console.log("student file", studentFile);
  useEffect(() => {
    if (scrollContainerRef.current) {
      psRef.current = new PerfectScrollbar(scrollContainerRef.current, {
        wheelSpeed: 2,
        wheelPropagation: true,
        minScrollbarLength: 20,
      });
    }

    return () => {
      if (psRef.current) {
        psRef.current.destroy();
        psRef.current = null;
      }
    };
  }, [enrollmentHist, studentFile]);

  useEffect(() => {
    setEnrollmentHist(studentFile?.enrollment_history);
  }, [studentFile]);
  return (
    <>
      <div>
        <div
          style={{
            position: "relative",
            height: "calc(100vh - 270px)", // Adjust this height as needed
            // marginTop: 10,
            // backgroundColor: "red",
            padding: 20,
            overflow: "scroll", // Hide default scrollbars
          }}
        >
          {studentFile ? (
            <ConfigProvider
              theme={{
                components: {
                  Timeline: {
                    tailColor: "lightgray",
                  },
                  Card: {
                    headerBg: "#f4f4f4",
                    headerHeightSM: 38,
                  },
                },
                algorithm: theme.defaultAlgorithm,
              }}
            >
              <Timeline
                style={{
                  maxWidth: 1000,
                  minWidth: 500,
                }}
                items={enrollmentHist?.map((enrollment) => ({
                  color:
                    enrollment.study_yr == "1" &&
                    enrollment.sem == "1" &&
                    enrollment.enrollment_status.id == "1"
                      ? "#00CCFF"
                      : enrollment.enrollment_status.color_code,
                  dot:
                    enrollment.study_yr == "1" && enrollment.sem == "1" ? (
                      <SmileOutlined />
                    ) : null,
                  children: (
                    <Badge.Ribbon
                      text={enrollment.enrollment_status.title}
                      color={
                        enrollment.study_yr == "1" &&
                        enrollment.sem == "1" &&
                        enrollment.enrollment_status.id == "1"
                          ? "#00CCFF"
                          : enrollment.enrollment_status.color_code
                      }
                    >
                      <Card
                        key={"enrollment"}
                        title={`Year ${enrollment.study_yr}, Semester ${enrollment.sem} (${enrollment.acc_yr_title})`}
                        size="small"
                        style={{
                          borderColor: "lightgray",
                          borderWidth: 1,
                          color: "red",
                        }}
                      >
                        <Row gutter={[16, 16]}>
                          {/* Main Content Section */}
                          <Col
                            xs={24}
                            sm={24}
                            md={16}
                            lg={16}
                            xl={16}
                            style={{ position: "relative" }}
                          >
                            {enrollment.enrollment_status.id === "6" && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: "100%",
                                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                                  zIndex: 1,
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  padding: "0 10px", // Ensure padding for small screens
                                  textAlign: "center", // Center text for small screens
                                }}
                              >
                                <span
                                  style={{
                                    color: "white",
                                    fontSize: "1rem", // Scaled down for smaller screens
                                    fontWeight: "bold",
                                    lineHeight: 1.5, // Adjust line height for readability
                                  }}
                                >
                                  DEAD SEMESTER - YEAR {enrollment.study_yr},
                                  SEMESTER {enrollment.sem}
                                </span>
                              </div>
                            )}
                            <Descriptions
                              className="custom-descriptions"
                              bordered
                              size="small"
                              items={[
                                {
                                  key: "1",
                                  label: "Enrolled By",
                                  children:
                                    enrollment.enrolled_by_type == "student"
                                      ? "SELF"
                                      : enrollment.enrolled_user
                                      ? enrollment.enrolled_user.staff_name
                                      : "SYSTEM",
                                },
                                {
                                  key: "6",
                                  label: "Invoiced",
                                  children: enrollment.invoiced
                                    ? "TRUE"
                                    : "FALSE",
                                },
                                {
                                  key: "3",
                                  label: "Enrollment Token",
                                  children: (
                                    <Typography.Text>
                                      {enrollment.enrollment_token}
                                    </Typography.Text>
                                  ),
                                },
                                {
                                  key: "6",
                                  label: "Enrollment Date",
                                  children: formatDateString(
                                    parseInt(enrollment.datetime)
                                  ),
                                },
                              ]}
                              style={{
                                borderColor: "lightgray",
                                borderWidth: 0.2,
                                borderRadius: 10,
                              }}
                              labelStyle={{
                                width: "35%",
                                backgroundColor: "#e7edfe",
                                color: "#0832b7",
                                fontWeight: "bold",
                              }}
                              contentStyle={{
                                borderBottomColor: "red",
                                textAlign: "left",
                              }}
                              column={1} // Ensures stacking on smaller screens
                            />
                          </Col>

                          {/* Actions Section */}
                          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8, // Space between buttons
                                marginTop: 2,
                                marginBottom: 10,
                                width: "100%", // Ensure full width on mobile
                              }}
                            >
                              {enrollment.enrollment_status.id !== "6" && (
                                <Button
                                  type="primary"
                                  ghost
                                  style={{
                                    width: "100%", // Full width on all devices
                                    padding: "10px 20px", // Ensure clickable area is large on mobile
                                  }}
                                >
                                  View Registered Modules
                                </Button>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </Badge.Ribbon>
                  ),
                }))}
              />
            </ConfigProvider>
          ) : null}
        </div>

        {contextHolder}
      </div>
    </>
  );
};

export default EnrollmentHistory;
