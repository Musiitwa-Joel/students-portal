import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Table,
  Space,
  ConfigProvider,
  Collapse,
  Typography,
  Row,
  Col,
  Alert,
  message,
  Button,
  Timeline,
  Empty,
} from "antd";
import { Loader, Settings, TriangleAlert } from "lucide-react";
import "./cleareance.css";
import { BsCheckCircleFill } from "react-icons/bs";
import { useMutation, useQuery } from "@apollo/client";
import {
  CHECK_GRADUATION_ELLIGIBILITY,
  GET_GRADUATION_SECTIONS,
} from "../../gql/queries";
import AppContext from "../../context/appContext";
import GraduationVerificationForm from "./GraduationVerificationForm";
import formatDateToYYYYMMDD from "../../utils/formatDateToYYYYMMDDDD";
import capitalizeFirstLetter from "../../utils/capitalizeFirstLetter";
import formatDateString from "../../utils/formatDateToDateAndTime";
import formatTimestampToDateTime from "../../utils/formatTimeStampToDateTime";

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const genExtra = () => (
  <>
    <Typography.Text
      style={{
        fontSize: 13,
      }}
    >
      MON-08-08-2000 10:30 PM
    </Typography.Text>
  </>
);

const items = [
  {
    key: "1",
    label: (
      <>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <BsCheckCircleFill
            color="color(display-p3 0.308 0.595 0.417)"
            size={20}
            style={{
              marginRight: 10,
            }}
          />
          School Admin Assistant
        </div>
      </>
    ),
    children: <p>{text}</p>,
    extra: genExtra(),
  },
  {
    key: "2",

    label: (
      <>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Settings
            className="spinning"
            size={20}
            style={{
              marginRight: 10,
              padding: 0,
            }}
          />
          School of Post Graduate Studies Admin. Assistant
        </div>
      </>
    ),
    children: <p>{text}</p>,
  },
  {
    key: "3",
    label: "The Head of Department",
    children: <p>{text}</p>,
  },
  {
    key: "4",
    label: "The Dean of School",
    children: <p>{text}</p>,
  },
  {
    key: "5",
    label: "The Librarian",
    children: <p>{text}</p>,
  },
  {
    key: "6",
    label: "Administrative Assistant- Admissions Office",
    children: <p>{text}</p>,
  },
  {
    key: "7",
    label: "Alumni Admin Secretary",
    children: <p>{text}</p>,
  },
  {
    key: "8",
    label: "The University Bursar",
    children: <p>{text}</p>,
  },
  {
    key: "9",
    label: "Alumni Admin Secretary",
    children: <p>{text}</p>,
  },
  {
    key: "10",
    label: "Academic Registrar",
    children: <p>{text}</p>,
  },
];

function GraduationClearance() {
  const appContext = useContext(AppContext);
  const { error, loading, data } = useQuery(CHECK_GRADUATION_ELLIGIBILITY, {
    fetchPolicy: "network-only",
  });
  const {
    data: sectionsData,
    error: sectionsErr,
    loading: loadingSections,
  } = useQuery(GET_GRADUATION_SECTIONS);
  // console.log("sstudent file", appContext.studentFile);

  useEffect(() => {
    if (error) {
      message.error(error.message);
    }

    if (sectionsErr) {
      message.error(sectionsErr.message);
    }
  }, [error, sectionsErr]);

  // console.log("sectionsData", sectionsData);

  const mainColumns = [
    {
      title: "Student Name",
      dataIndex: "student_name",
      key: "student_name",
      render: (text, record) =>
        `${record.biodata.surname} ${capitalizeFirstLetter(
          record.biodata.other_names
        )}`,
      ellipsis: true,
      width: 200,
    },
    {
      title: "Student Number",
      dataIndex: "student_no",
      key: "student_no",
    },
    {
      title: "Course",
      dataIndex: "course",
      key: "course",
      render: (text, record) => record.course_details.course.course_code,
      ellipsis: true,
    },
    {
      title: "Registration No",
      dataIndex: "registration_no",
      key: "registration_no",
      ellipsis: true,
    },
    {
      title: "School",
      dataIndex: "school",
      key: "school",
      render: (text, record) => record.course_details.course.school.school_code,
      ellipsis: true,
    },
    {
      title: "Study Session",
      dataIndex: "study_time",
      key: "study_time",
      render: (text, record) => record.study_time_title,
    },
    {
      title: "Campus",
      dataIndex: "campus",
      key: "campus",
      render: (text, record) => record.campus_title,
    },
    {
      title: "Date of Birth",
      dataIndex: "dob",
      key: "dob",
      render: (text, record) =>
        formatDateToYYYYMMDD(new Date(parseInt(record.biodata.date_of_birth))),
    },
    {
      title: "Date of Completion",
      dataIndex: "date_of_completion",
      key: "date_of_completion",
      ellipsis: true,
      render: (text, record) => {
        if (sectionsData?.graduation_sections) {
          return formatDateToYYYYMMDD(
            new Date(
              parseInt(
                sectionsData?.graduation_sections.graduation_details
                  .graduation_date
              )
            )
          );
        }
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        if (appContext?.studentFile?.graduation_status == "in_progress") {
          return (
            <div
              style={{
                display: "flex",
              }}
            >
              <Settings
                className="spinning"
                size={20}
                style={{
                  marginRight: 5,
                  padding: 0,
                }}
              />
              In Progress
            </div>
          );
        } else if (appContext?.studentFile?.graduation_status == "rejected") {
          return (
            <div
              style={{
                display: "flex",
              }}
            >
              <TriangleAlert
                size={20}
                color="red"
                style={{
                  marginRight: 5,
                  padding: 0,
                }}
              />
              Rejected
            </div>
          );
        } else {
          return appContext?.studentFile?.graduation_status;
        }
      },
      key: "status",
    },
  ];

  const onChange = (key) => {
    console.log(key);
  };

  return (
    <div
      style={{
        padding: 10,
      }}
    >
      {loading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <Loader
            className="loading-icon"
            size={25}
            style={{ animation: "spin 1s linear infinite" }}
          />
          <Typography.Text strong>
            Checking Graduation Elligibility...
          </Typography.Text>
        </div>
      )}

      {data ? (
        !data.check_graduation_elligibility.is_elligible ||
        data.check_graduation_elligibility.has_retakes ? (
          <div
            style={{
              marginBottom: 15,
            }}
          >
            <Card
              style={{ borderRadius: 0 }}
              bodyStyle={{
                // padding: isMobile ? "8px" : "16px",
                backgroundColor: "",
                marginTop: "5px",
              }}
            >
              <Card
                style={{
                  background: "#ffedf6",
                  marginBottom: 16,
                  textAlign: "center",
                }}
              >
                <Space
                  direction="vertical"
                  align="center"
                  style={{ width: "100%" }}
                >
                  <div
                    style={{
                      color: "maroon",
                      margin: 0,
                      fontSize: "16px",
                      fontWeight: 500,
                    }}
                  >
                    NOT ELLIGIBLE!
                  </div>
                  <Typography.Text
                    style={{
                      color: "#9e0d38",
                      // fontSize: isMobile ? "10px" : "12px",
                    }}
                  >
                    {`YOU ARE CURRENTLY NOT ELLIGIBLE FOR GRADUATION. KINDLY
                    COMPLETE THE REMAINING PAPERS ${
                      data.check_graduation_elligibility.has_retakes
                        ? "ALONG WITH THE REMAINING RETAKES"
                        : ""
                    }`}{" "}
                    <br />
                    AFTER THAT, YOU CAN COME BACK AND CHECK THE STATUS
                  </Typography.Text>
                </Space>
              </Card>
            </Card>
          </div>
        ) : (
          <>
            {appContext?.studentFile?.biodata?.verified_credentials ? (
              <ConfigProvider
                theme={{
                  components: {
                    Card: {
                      bodyPadding: 0,
                      // borderRadiusLG: 0,
                    },
                  },
                }}
              >
                <Card
                  title={
                    <Typography.Title
                      level={4}
                      style={{
                        margin: 0,
                        padding: "10px 0px",
                      }}
                    >
                      Student Details
                    </Typography.Title>
                  }
                  style={{
                    width: "100%",
                  }}
                >
                  <Table
                    columns={mainColumns}
                    dataSource={
                      appContext?.studentFile.biodata
                        ? [{ ...appContext?.studentFile }]
                        : []
                    }
                    pagination={false}
                    bordered
                    className="mb-6"
                    expandable={{
                      expandedRowRender: (record) => (
                        <>
                          <Row
                            gutter={36}
                            style={{
                              padding: 5,
                            }}
                          >
                            <Col>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <Space
                                  style={{
                                    padding: "5px 0px",
                                  }}
                                >
                                  <Typography.Text strong>
                                    GENDER:
                                  </Typography.Text>
                                  <Typography.Text>
                                    {appContext?.studentFile?.biodata.gender}
                                  </Typography.Text>
                                </Space>

                                <Space>
                                  <Typography.Text strong>
                                    EMAIL:
                                  </Typography.Text>
                                  <Typography.Text>
                                    {appContext?.studentFile?.biodata.email}
                                  </Typography.Text>
                                </Space>
                              </div>
                            </Col>

                            <Col>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <Space
                                  style={{
                                    padding: "5px 0px",
                                  }}
                                >
                                  <Typography.Text strong>
                                    NATIONALITY:
                                  </Typography.Text>
                                  <Typography.Text>
                                    {
                                      appContext?.studentFile?.biodata
                                        .nationality.nationality_title
                                    }
                                  </Typography.Text>
                                </Space>

                                <Space>
                                  <Typography.Text strong>
                                    POSTAL ADDRESS:
                                  </Typography.Text>
                                  <Typography.Text>
                                    {
                                      appContext?.studentFile?.biodata
                                        .place_of_residence
                                    }
                                  </Typography.Text>
                                </Space>
                              </div>
                            </Col>

                            <Col>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <Space
                                  style={{
                                    padding: "5px 0px",
                                  }}
                                >
                                  <Typography.Text strong>
                                    TELEPHONE NO:
                                  </Typography.Text>
                                  <Typography.Text>
                                    {" "}
                                    {appContext?.studentFile?.biodata.phone_no}
                                  </Typography.Text>
                                </Space>

                                <Space>
                                  <Typography.Text strong>
                                    RESIDENTIAL ADDRESS:
                                  </Typography.Text>
                                  <Typography.Text>
                                    {
                                      appContext?.studentFile?.biodata
                                        .place_of_residence
                                    }
                                  </Typography.Text>
                                </Space>
                              </div>
                            </Col>

                            <Col>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <Space
                                  style={{
                                    padding: "5px 0px",
                                  }}
                                >
                                  <Typography.Text strong>
                                    CREATED ON:
                                  </Typography.Text>
                                  <Typography.Text>
                                    {formatDateString(
                                      parseInt(
                                        appContext?.studentFile?.biodata
                                          .credentials_verified_on
                                      )
                                    )}
                                  </Typography.Text>
                                </Space>

                                <Space>
                                  <Typography.Text strong>
                                    CREATED BY:
                                  </Typography.Text>
                                  <Typography.Text>
                                    {
                                      appContext?.studentFile?.biodata
                                        .credentials_verified_by
                                    }
                                  </Typography.Text>
                                </Space>
                              </div>
                            </Col>
                          </Row>
                        </>
                      ),
                    }}
                  />
                </Card>
                {loadingSections ? (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 20,
                    }}
                  >
                    <Loader
                      className="loading-icon"
                      size={25}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                    <Typography.Text strong>
                      Loading Graduation Sections...
                    </Typography.Text>
                  </div>
                ) : (
                  <div
                    style={{
                      marginTop: 20,
                    }}
                  >
                    <Card
                      title={
                        <Typography.Title
                          level={4}
                          style={{
                            margin: 0,
                            padding: "10px 0px",
                          }}
                        >
                          Progress Logs
                        </Typography.Title>
                      }
                      extra={
                        <Button
                          disabled={
                            appContext?.studentFile?.graduation_status !==
                            "rejected"
                          }
                          type="primary"
                        >
                          Resend Form
                        </Button>
                      }
                      style={{
                        width: "100%",
                      }}
                      // variant="borderless"
                    >
                      <Collapse
                        size="large"
                        items={
                          sectionsData
                            ? sectionsData.graduation_sections.graduation_sections.map(
                                (section) => ({
                                  key: section.id,
                                  label: (
                                    <>
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                        }}
                                      >
                                        {section.logs.length > 0 ? (
                                          section.logs[0].status ==
                                          "pending" ? (
                                            <>
                                              <Settings
                                                className="spinning"
                                                size={20}
                                                style={{
                                                  marginRight: 5,
                                                  padding: 0,
                                                }}
                                              />
                                              {section.title}
                                            </>
                                          ) : section.logs[0].status ==
                                            "cleared" ? (
                                            <>
                                              <BsCheckCircleFill
                                                color="color(display-p3 0.308 0.595 0.417)"
                                                size={20}
                                                style={{
                                                  marginRight: 10,
                                                }}
                                              />
                                              {section.title}
                                            </>
                                          ) : (
                                            section.logs[0].status ==
                                              "rejected" && (
                                              <>
                                                {/* <BsCheckCircleFill
                                                  color="color(display-p3 0.308 0.595 0.417)"
                                                  size={20}
                                                  style={{
                                                    marginRight: 10,
                                                  }}
                                                /> */}
                                                <TriangleAlert
                                                  size={20}
                                                  color="red"
                                                  style={{
                                                    marginRight: 5,
                                                    padding: 0,
                                                  }}
                                                />
                                                {section.title}
                                              </>
                                            )
                                          )
                                        ) : (
                                          section.title
                                        )}

                                        {/* <BsCheckCircleFill
                                    color="color(display-p3 0.308 0.595 0.417)"
                                    size={20}
                                    style={{
                                      marginRight: 10,
                                    }}
                                  /> */}
                                      </div>
                                    </>
                                  ),
                                  children: (
                                    <>
                                      {section.instructions && (
                                        <Alert
                                          type="warning"
                                          message={section.instructions}
                                        />
                                      )}

                                      {section.logs[0]?.rejection_logs.length >
                                      0 ? (
                                        <div
                                          style={{
                                            paddingTop: 20,
                                            maxWidth: 700,
                                          }}
                                        >
                                          <Timeline
                                            // mode={"left"}
                                            // items={
                                            //   [
                                            //   {
                                            //     // label: "2015-09-01",
                                            //     color: "green",
                                            //     children: (
                                            //       <div
                                            //         style={{
                                            //           padding: "0px 20px 0px 0px",
                                            //         }}
                                            //       >
                                            //         <Typography.Text
                                            //           style={{
                                            //             fontStyle: "italic",
                                            //           }}
                                            //           type="secondary"
                                            //         >
                                            //           Posted by: SYSTEM at
                                            //           2015-09-01 09:12:11
                                            //         </Typography.Text>
                                            //         <Alert
                                            //           type="success"
                                            //           message="Create a services mnsjhs sdjhjhdjhsd jhsdbhjdsjdhb jhhjsjhsdjg kjklsd udslugsdb uyuys"
                                            //         />
                                            //       </div>
                                            //     ),
                                            //   },
                                            //   {
                                            //     // label: "2015-09-01 09:12:11",
                                            //     color: "red",
                                            //     children: (
                                            //       <div
                                            //         style={{
                                            //           margin: "0px 20px 0px 0px",
                                            //         }}
                                            //       >
                                            //         <Typography.Text
                                            //           style={{
                                            //             fontStyle: "italic",
                                            //           }}
                                            //           type="secondary"
                                            //         >
                                            //           Posted by: MR. HAKIM MULINDE
                                            //           at 2015-09-01 09:12:11
                                            //         </Typography.Text>
                                            //         <Alert
                                            //           type="error"
                                            //           message="Create a services"
                                            //         />
                                            //       </div>
                                            //     ),
                                            //   },
                                            // ]}
                                            items={section.logs[0]?.rejection_logs.map(
                                              (rej_log) => ({
                                                // label: "2015-09-01 09:12:11",
                                                color: "red",
                                                children: (
                                                  <div
                                                    style={{
                                                      margin:
                                                        "0px 20px 0px 0px",
                                                    }}
                                                  >
                                                    <Typography.Text
                                                      style={{
                                                        fontStyle: "italic",
                                                      }}
                                                      type="secondary"
                                                    >
                                                      Posted by:{" "}
                                                      {
                                                        rej_log?.rejected_by_user
                                                      }{" "}
                                                      at{" "}
                                                      {formatTimestampToDateTime(
                                                        parseInt(
                                                          rej_log?.rejected_at
                                                        )
                                                      )}
                                                    </Typography.Text>
                                                    <Alert
                                                      type="error"
                                                      message={
                                                        <Typography.Text
                                                          style={{
                                                            color: "red",
                                                          }}
                                                        >
                                                          {
                                                            rej_log?.reject_reason
                                                          }
                                                        </Typography.Text>
                                                      }
                                                    />
                                                  </div>
                                                ),
                                              })
                                            )}
                                          />
                                        </div>
                                      ) : (
                                        <div
                                          style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            width: "100%",
                                            marginTop: 10,
                                          }}
                                        >
                                          <Typography.Text
                                            style={{
                                              textAlign: "center",
                                              fontStyle: "italic",
                                            }}
                                            type="secondary"
                                          >
                                            No logs available yet. Any logs will
                                            be displayed here once they are
                                            available.
                                          </Typography.Text>
                                        </div>
                                      )}
                                    </>
                                  ),
                                  collapsible:
                                    section.logs.length == 0 && "disabled",
                                  // extra: genExtra(),
                                })
                              )
                            : []
                        }
                        onChange={onChange}
                      />
                    </Card>
                  </div>
                )}
              </ConfigProvider>
            ) : (
              <Card
                style={{ borderRadius: 0 }}
                bodyStyle={{
                  // padding: isMobile ? "8px" : "16px",
                  backgroundColor: "",
                  marginTop: "5px",
                }}
              >
                <Card
                  style={{
                    background: "#ededff",
                    marginBottom: 16,
                    textAlign: "center",
                  }}
                >
                  <Space
                    direction="vertical"
                    align="center"
                    style={{ width: "100%" }}
                  >
                    <div
                      style={{
                        color: "#389e0d",
                        margin: 0,
                        fontSize: "16px",
                        fontWeight: 500,
                      }}
                    >
                      CONGRAGULATIONS
                    </div>
                    <Typography.Text
                      style={{
                        color: "#0d389e",
                        // fontSize: isMobile ? "10px" : "12px",
                      }}
                    >
                      YOU ARE NOW ELLIGIBLE FOR GRADUATION. TAP THE BUTTON BELOW
                      TO BEGIN THE GRADUATION CLEARANCE PROCESS.
                    </Typography.Text>
                    <Space size={8}>
                      <Button
                        type="primary"
                        // size={isMobile ? "small" : "middle"}
                        style={{
                          background: "#0d389e",
                          borderColor: "#0d389e",
                        }}
                        onClick={() =>
                          appContext.setGraduationVerificationModalVisible(true)
                        }
                      >
                        VERIFY MY CREDENTIALS
                      </Button>
                    </Space>
                  </Space>
                </Card>
              </Card>
            )}
          </>
        )
      ) : null}
      <GraduationVerificationForm />
    </div>
  );
}

export default GraduationClearance;
