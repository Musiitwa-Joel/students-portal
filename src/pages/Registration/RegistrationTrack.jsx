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
  QRCode,
  Divider,
  Image,
} from "antd";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "./styles.css";
import AppContext from "../../context/appContext";
import formatDateString from "../../utils/formatDateToDateAndTime";
import { PiPrinter } from "react-icons/pi";
const { Title, Text } = Typography;
import ModuleTable from "./ModuleTable";

const RegistrationTrack = () => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setScale((prev) => (prev === 1 ? 1.05 : 1));
    }, 2000); // Pulse every 2 seconds
    return () => clearInterval(interval);
  }, []);
  const componentRef = useRef(null);
  const [modal, contextHolder] = Modal.useModal();
  const scrollContainerRef = useRef(null);
  const psRef = useRef(null);
  const { studentFile } = useContext(AppContext);
  // console.log(studentFile);
  const [regHist, setRegHist] = useState(
    studentFile?.registration_history || []
  );

  const [isExamPermitModalVisible, setIsExamPermitModalVisible] =
    useState(false);
  const [isRegistrationProofModalVisible, setIsRegistrationProofModalVisible] =
    useState(false);
  const [currentEnrollment, setCurrentEnrollment] = useState(null);

  // const handleDelete = (enrollment) => {
  //   modal.confirm({
  //     title: "Delete Enrollment",
  //     icon: <ExclamationCircleOutlined />,
  //     content: "Are you sure you want to delete this enrollment",
  //     okText: "Yes",
  //     cancelText: "No",
  //     onOk: () => onConfirmDelete(enrollment),
  //     style: {
  //       top: "30%",
  //     },
  //   });
  // };

  const onConfirmDelete = async (registration) => {
    // Implement delete logic here
  };

  const showExamPermitModal = (registration) => {
    setCurrentEnrollment(registration);
    setIsExamPermitModalVisible(true);
  };

  const showRegistrationProofModal = (registration) => {
    setCurrentEnrollment(registration);
    setIsRegistrationProofModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsExamPermitModalVisible(false);
    setIsRegistrationProofModalVisible(false);
    setCurrentEnrollment(null);
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      // Use 'new' operator to create PerfectScrollbar instance
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
  }, [regHist, studentFile]);

  useEffect(() => {
    setRegHist(studentFile?.registration_history || []);
  }, [studentFile]);

  return (
    <>
      <div>
        <div
          ref={scrollContainerRef}
          style={{
            position: "relative",
            height: "calc(100vh - 270px)",
            padding: 20,
            overflow: "hidden",
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
                items={regHist.map((registration) => ({
                  color:
                    registration.study_yr === "1" &&
                    registration.sem === "1" &&
                    registration.provisional === "1"
                      ? "green"
                      : "blue",

                  dot:
                    registration.study_yr === "1" &&
                    registration.sem === "1" ? (
                      <SmileOutlined />
                    ) : null,
                  children: (
                    <Badge.Ribbon
                      text={
                        registration.provisional === 1
                          ? "Provisional Registration"
                          : "Registered"
                      }
                      color={registration.provisional === 1 ? "green" : "blue"}
                    >
                      <Card
                        key={`registration-${registration.enrollment_token}`}
                        title={`Year ${registration.study_yr}, Semester ${registration.sem} (${registration.acc_yr_title})`}
                        size="small"
                        style={{
                          borderColor: "lightgray",
                          borderWidth: 1,
                          color: "red",
                        }}
                      >
                        <Row gutter={[16, 16]}>
                          <Col
                            xs={24}
                            sm={24}
                            md={16}
                            lg={16}
                            xl={16}
                            style={{ position: "relative" }}
                          >
                            {registration.id === "6" && (
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
                                  padding: "0 10px",
                                  textAlign: "center",
                                }}
                              >
                                <span
                                  style={{
                                    color: "white",
                                    fontSize: "1rem",
                                    fontWeight: "bold",
                                    lineHeight: 1.5,
                                  }}
                                >
                                  DEAD SEMESTER - YEAR {registration.study_yr},
                                  SEMESTER {registration.sem}
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
                                  label: "Registered By",
                                  children:
                                    registration.registered_type == "student"
                                      ? "SELF"
                                      : registration.registered_user
                                      ? registration.registered_user.staff_name
                                      : "SYSTEM",
                                },

                                {
                                  key: "3",
                                  label: "Registration Token",
                                  children: (
                                    <Typography.Text>
                                      {registration.registration_token}
                                    </Typography.Text>
                                  ),
                                },
                                {
                                  key: "6",
                                  label: "Registration Date",
                                  children: formatDateString(
                                    parseInt(registration.date)
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
                              column={1}
                            />
                          </Col>

                          <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                                marginTop: 2,
                                marginBottom: 10,
                                width: "100%",
                              }}
                            >
                              {registration.id !== "6" && (
                                <Button
                                  size="small"
                                  type="primary"
                                  ghost
                                  onClick={() =>
                                    showExamPermitModal(registration)
                                  }
                                  style={{
                                    width: "100%",
                                    padding: "10px 20px",
                                  }}
                                >
                                  <PiPrinter /> PRINT EXAM PERMIT
                                </Button>
                              )}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                                marginTop: 2,
                                marginBottom: 10,
                                width: "100%",
                              }}
                            >
                              <Button
                                size="small"
                                type="primary"
                                ghost
                                onClick={() =>
                                  showRegistrationProofModal(registration)
                                }
                                style={{
                                  width: "100%",
                                  padding: "10px 20px",
                                }}
                              >
                                <PiPrinter /> PRINT REGISTRATION PROOF
                              </Button>
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

      {/* Exam Permit Modal */}
      <Modal
        title="Examination Permit Preview"
        open={isExamPermitModalVisible}
        onCancel={handleModalCancel}
        footer={
          <div style={{ textAlign: "right" }}>
            <Button
              style={{
                marginRight: 10,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                transform: `scale(${scale})`,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = `scale(${scale})`)
              }
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.9)")
              }
              onMouseUp={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
            >
              Print
            </Button>
            <Button onClick={handleModalCancel}>Close</Button>
          </div>
        }
        width={900}
        style={{ top: 20 }}
      >
        {currentEnrollment && (
          <div
            ref={componentRef}
            style={{ maxHeight: "600px", overflowY: "auto", padding: 16 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Image
                preview={false}
                width={200}
                src="https://cdn.worldvectorlogo.com/logos/nkumba-uninersity.svg"
              />
              <Row justify="center">
                <div style={{ textAlign: "center", marginTop: "0px" }}>
                  <Text style={{ fontSize: "1.0rem" }} strong>
                    OFFICE OF THE ACADEMIC REGISTRAR
                  </Text>
                  <br />
                  <Text>STUDENT EXAMINATION PERMIT</Text>
                  <br />
                  <Text style={{ fontSize: "0.8rem" }}>
                    PRINT DATE: {new Date().toLocaleString()}
                  </Text>
                </div>
              </Row>
              <QRCode
                size={70}
                bordered={false}
                type="svg"
                value="https://ant.design/"
              />
            </div>

            <Divider
              style={{
                marginTop: 10,
                borderColor: "#00008B",
                borderStyle: "dashed",
                borderWidth: 1,
              }}
            />

            <div
              style={{
                padding: 2,
                border: "1px dotted #00008B",
                borderRadius: 5,
              }}
            >
              <Row gutter={[8, 0]} align="middle">
                <Col
                  span={4}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Image
                    preview={false}
                    width={80}
                    style={{ borderRadius: "50%" }}
                    src={`https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=${studentFile.student_no}`}
                  />
                </Col>

                <Col span={20}>
                  <Row gutter={[8, 2]} style={{ lineHeight: "1.2" }}>
                    <Col span={24}>
                      <Text strong>PROGRAMME:</Text> (
                      {studentFile?.course_details?.course?.course_code}){" "}
                      {studentFile?.course_details?.course?.course_title}
                    </Col>
                    <Col span={12}>
                      <Text strong>REGISTRATION NO:</Text>{" "}
                      {studentFile?.registration_no}
                    </Col>
                    <Col span={12}>
                      <Text strong>ACCOUNT BALANCE:</Text> UGX&nbsp;
                      {studentFile.current_info.account_balance}/=
                    </Col>
                    <Col span={12}>
                      <Text strong>FULL NAME:</Text>{" "}
                      {`${studentFile?.biodata?.surname} ${studentFile?.biodata?.other_names}`}
                    </Col>
                    <Col span={12}>
                      <Text strong>STUDENT NO:</Text> {studentFile?.student_no}
                    </Col>
                    <Col span={12}>
                      <Text strong>STUDY YEAR:</Text>{" "}
                      {currentEnrollment?.study_yr}
                    </Col>
                    <Col span={12}>
                      <Text strong>SEMESTER:</Text> {currentEnrollment?.sem}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>

            <Title
              level={5}
              style={{
                color: "green",
                textAlign: "center",
                marginTop: 4,
                marginBottom: 4,
              }}
            >
              REGISTERED COURSE MODULES
            </Title>
            <div style={{ marginTop: "-10px" }}>
              <ModuleTable />
            </div>

            <Divider
              style={{
                borderColor: "#00008B",
                borderStyle: "dashed",
                borderWidth: 1,
              }}
            />

            <div>
              <Title level={5} style={{ marginBottom: 4 }}>
                NOTES:
              </Title>
              <Text
                style={{
                  fontStyle: "italic",
                  fontSize: "13px",
                  lineHeight: "1.1",
                  display: "block",
                }}
              >
                <div>
                  The total credits registered for Semester{" "}
                  {currentEnrollment.sem} of the{" "}
                  {currentEnrollment.acc_yr_title} academic year is 5.
                </div>
                <div>
                  This card is confidential and must be presented to the
                  invigilator upon request at each examination.
                </div>
                <div>
                  Your <strong>STUDENT NUMBER</strong>, not your name, must be
                  written on every answer booklet or supplementary sheet.
                </div>
                <div>
                  Unauthorized materials or notes must NOT be brought into the
                  examination room.
                </div>
                <div>
                  Mobile phones, iPads, and tablets must NOT be brought near the
                  examination room.
                </div>
                <div>
                  Students must comply with the University Examination
                  Regulations.
                </div>
              </Text>
            </div>

            <div style={{ textAlign: "right", marginTop: 0 }}>
              <Image
                preview={false}
                width={200}
                src="https://content.govdelivery.com/attachments/fancy_images/USSOH/2015/12/704441/pdr-signature_original.png"
              />
              <div>ACADEMIC REGISTRAR</div>
            </div>
          </div>
        )}
      </Modal>

      {/* Registration Proof Modal */}
      {/* <Modal
        title="Registration Proof"
        open={isRegistrationProofModalVisible}
        onCancel={handleModalCancel}
        footer={null}
        style={{ top: 20 }}
        styles={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
      >
        {currentEnrollment && (
          <div>
            <h2>Registration Proof for {currentEnrollment.acc_yr_title}</h2>
            <p>
              Year {currentEnrollment.study_yr}, Semester{" "}
              {currentEnrollment.sem}
            </p>
            <p>Enrolled By: {currentEnrollment.enrolled_by}</p>
            <p>
              registration Date:{" "}
              {formatDateString(parseInt(currentEnrollment.datetime))}
            </p>
            <p>registration Token: {currentEnrollment.enrollment_token}</p>
            <p>Invoiced: {currentEnrollment.invoiced ? "Yes" : "No"}</p>
          </div>
        )}
      </Modal> */}
      <Modal
        title="Registration Proof"
        open={isRegistrationProofModalVisible}
        onCancel={handleModalCancel}
        footer={
          <div style={{ textAlign: "right" }}>
            <Button
              style={{
                marginRight: 10,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                transform: `scale(${scale})`,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = `scale(${scale})`)
              }
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.9)")
              }
              onMouseUp={(e) =>
                (e.currentTarget.style.transform = "scale(1.1)")
              }
            >
              Print
            </Button>

            <Button onClick={handleModalCancel}>Close</Button>
          </div>
        }
        width={900}
        style={{ top: 10, bottom: 10 }}
      >
        {currentEnrollment && (
          <div
            ref={componentRef}
            style={{ maxHeight: "600px", overflowY: "auto", padding: 16 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Image
                preview={false}
                width={200}
                src="https://cdn.worldvectorlogo.com/logos/nkumba-uninersity.svg"
              />
              <Row justify="center">
                <div style={{ textAlign: "center", marginTop: "0px" }}>
                  <Text style={{ fontSize: "1.0rem" }} strong>
                    OFFICE OF THE ACADEMIC REGISTRAR
                  </Text>
                  <br />
                  <Text>STUDENT EXAMINATION PERMIT</Text>
                  <br />
                  <Text style={{ fontSize: "0.8rem" }}>
                    PRINT DATE: {new Date().toLocaleString()}
                  </Text>
                </div>
              </Row>
              <QRCode
                size={70}
                bordered={false}
                type="svg"
                value="https://ant.design/"
              />
            </div>

            <Divider
              style={{
                marginTop: 10,
                borderColor: "#00008B",
                borderStyle: "dashed",
                borderWidth: 1,
              }}
            />

            <div
              style={{
                padding: 2,
                border: "1px dotted #00008B",
                borderRadius: 5,
              }}
            >
              <Row gutter={[8, 0]} align="middle">
                <Col
                  span={4}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <Image
                    preview={false}
                    width={80}
                    style={{ borderRadius: "50%" }}
                    src={`https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=${studentFile.student_no}`}
                  />
                </Col>

                <Col span={20}>
                  <Row gutter={[8, 2]} style={{ lineHeight: "1.2" }}>
                    <Col span={24}>
                      <Text strong>PROGRAMME:</Text> (
                      {studentFile?.course_details?.course?.course_code}){" "}
                      {studentFile?.course_details?.course?.course_title}
                    </Col>
                    <Col span={12}>
                      <Text strong>REGISTRATION NO:</Text>{" "}
                      {studentFile?.registration_no}
                    </Col>
                    <Col span={12}>
                      <Text strong>ACCOUNT BALANCE:</Text> UGX&nbsp;
                      {studentFile.current_info.account_balance}/=
                    </Col>
                    <Col span={12}>
                      <Text strong>FULL NAME:</Text>{" "}
                      {`${studentFile?.biodata?.surname} ${studentFile?.biodata?.other_names}`}
                    </Col>
                    <Col span={12}>
                      <Text strong>STUDENT NO:</Text> {studentFile?.student_no}
                    </Col>
                    <Col span={12}>
                      <Text strong>STUDY YEAR:</Text>{" "}
                      {currentEnrollment?.study_yr}
                    </Col>
                    <Col span={12}>
                      <Text strong>SEMESTER:</Text> {currentEnrollment?.sem}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>

            <Title
              level={5}
              style={{
                color: "green",
                textAlign: "center",
                marginTop: 4,
                marginBottom: 4,
              }}
            >
              REGISTERED COURSE MODULES
            </Title>
            <div style={{ marginTop: "-10px" }}>
              <ModuleTable />
            </div>

            <Divider
              style={{
                borderColor: "#00008B",
                borderStyle: "dashed",
                borderWidth: 1,
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 0,
              }}
            >
              {/* Holder's Signature Section (Left) */}
              <div style={{ textAlign: "left" }}>
                <div style={{ marginBottom: 0, fontWeight: "bold" }}>
                  Holder's Signature
                </div>
                <div
                  style={{
                    width: "200px",
                    height: "40px",
                    borderBottom: "1px solid ",
                  }}
                ></div>
              </div>

              {/* Academic Registrar's Signature Section (Right) */}
              <div style={{ textAlign: "right" }}>
                <Image
                  preview={false}
                  width={200}
                  src="https://content.govdelivery.com/attachments/fancy_images/USSOH/2015/12/704441/pdr-signature_original.png"
                />
                <div>ACADEMIC REGISTRAR</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default RegistrationTrack;
