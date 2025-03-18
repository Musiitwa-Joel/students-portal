import React, { useContext, useEffect } from "react";
import {
  Typography,
  Card,
  Alert,
  Button,
  Space,
  ConfigProvider,
  theme,
  Grid,
  message,
} from "antd";
import { BookOutlined } from "@ant-design/icons";
import AppContext from "../../context/appContext";
import { useMutation } from "@apollo/client";
import { SELF_REGISTER } from "../../gql/mutation";

const { Title, Text, Paragraph } = Typography;
const { useToken } = theme;
const { useBreakpoint } = Grid;

const SelfRegistration = () => {
  const { studentFile } = useContext(AppContext);
  const { token } = useToken();
  const screens = useBreakpoint();
  const [selfRegister, { error, loading }] = useMutation(SELF_REGISTER, {
    refetchQueries: ["My_details"],
  });

  console.log("studentFile", studentFile);

  const handleRegister = async () => {
    // console.log("Registering...");
    const payload = {
      enrollmentToken:
        studentFile.current_info.recent_enrollment.enrollment_token,
    };

    const res = await selfRegister({
      variables: payload,
    });

    // console.log("response", res.data);
    message.success(res.data.selfRegister.message);
  };

  useEffect(() => {
    if (error) {
      message.error(error.message);
    }
  }, [error]);

  return (
    <div
      className="registration-container"
      style={{
        padding: screens.xs ? "12px" : "24px",
        maxWidth: "800px",
        margin: "0 auto",
        height: "calc(100vh - 260px)",
        overflowY: "auto",
      }}
    >
      <Card>
        <Card
          style={{
            backgroundColor: token.colorPrimary,
            marginBottom: "24px",
            overflowX: "auto", // Enable horizontal scrolling
          }}
        >
          <Space
            style={{
              width: "100%",
              justifyContent: "center",
              color: token.colorTextLightSolid,
              whiteSpace: "nowrap", // Prevent text from wrapping
              padding: screens.xs ? "8px 0" : "0", // Add padding for mobile
            }}
          >
            <Text
              strong
              style={{
                color: "inherit",
                fontSize: screens.xs ? "12px" : "16px",
              }}
            >
              Academic Year:{" "}
              {`${studentFile.current_info.recent_enrollment.acc_yr_title}`}
            </Text>
            <Text
              strong
              style={{
                color: "inherit",
                fontSize: screens.xs ? "12px" : "16px",
              }}
            >
              |
            </Text>
            <Text
              strong
              style={{
                color: "inherit",
                fontSize: screens.xs ? "12px" : "16px",
              }}
            >
              Year: {`${studentFile.current_info.recent_enrollment.study_yr}`}
            </Text>
            <Text
              strong
              style={{
                color: "inherit",
                fontSize: screens.xs ? "12px" : "16px",
              }}
            >
              |
            </Text>
            <Text
              strong
              style={{
                color: "inherit",
                fontSize: screens.xs ? "12px" : "16px",
              }}
            >
              Semester: {`${studentFile.current_info.recent_enrollment.sem}`}
            </Text>
          </Space>
        </Card>

        <Alert
          message="Important Registration Information"
          type="warning"
          showIcon
          style={{ marginBottom: "16px" }}
        />

        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Paragraph>
            <Text strong>Registration Status: </Text>
            <Text type="danger">Mandatory</Text>
          </Paragraph>

          <Paragraph>
            You may only register for the academic year and semester shown
            above. If these details are incorrect, please enroll in your desired
            semester first.
          </Paragraph>

          <Paragraph>
            Registration requires meeting all minimum fee policy requirements.
          </Paragraph>

          <Alert
            message="Once registered, you cannot modify your course units for this semester."
            type="info"
            showIcon
            style={{ marginBottom: "16px" }}
          />

          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Button
              type="primary"
              size={screens.xs ? "small" : "medium"}
              onClick={handleRegister}
              loading={loading}
              disabled={
                loading ||
                studentFile?.current_info.registration_status == "Registered"
              }
            >
              {studentFile?.current_info.registration_status == "Registered"
                ? "Already Registered"
                : "Register"}
            </Button>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default SelfRegistration;
