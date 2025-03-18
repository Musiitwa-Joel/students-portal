import React, { useContext, useEffect } from "react";
import { Modal, Form, Select, Row, Col, Typography, message } from "antd";
import AppContext from "../../context/appContext";
import { useMutation } from "@apollo/client";
import { SELF_ENROLLMENT } from "../../gql/mutation";

function EnrollmentModal() {
  const [form] = Form.useForm();
  const { studentFile, enrollModalVisible, setEnrollModalVisible } =
    useContext(AppContext);
  const [selfEnroll, { error, loading }] = useMutation(SELF_ENROLLMENT, {
    refetchQueries: ["My_details"],
  });

  // console.log("studentFile", studentFile);

  useEffect(() => {
    if (error) {
      message.error(error.message);
    }
  }, [error]);
  const onEnroll = async (values) => {
    // console.log(studentFile);
    // console.log("values", values);
    const payload = {
      studyYr: values.study_yr,
      enrollmentStatus: values.enrollment_status,
      sem: studentFile?.current_info.true_sem,
    };

    const res = await selfEnroll({
      variables: payload,
    });

    // console.log("res", res);

    setEnrollModalVisible(false);
  };
  return (
    <Modal
      title={
        <div
          style={{
            // backgroundColor: "red",
            padding: 0,
            margin: 0,
          }}
        >
          <Typography.Title
            style={{
              color: "purple",
              margin: 0,
              padding: 0,
            }}
            level={4}
          >
            To proceed, please provide your enrollment details.
          </Typography.Title>
        </div>
      }
      open={enrollModalVisible}
      onOk={() => form.submit()}
      cancelText={"Skip Enrollment"}
      onCancel={() => setEnrollModalVisible(false)}
      okText="Enroll"
      okButtonProps={{
        loading,
        disabled: loading,
      }}
      cancelButtonProps={{
        style: {
          display:
            studentFile?.current_info?.true_study_yr ==
            studentFile?.course_details.course.course_duration
              ? "inline-block"
              : "none",
        },
      }}
      maskClosable={false}
      closable={false}
      centered
      //   width={500}
    >
      <div
        style={{
          // borderColor: "red",
          // borderWidth: 1,
          paddingTop: 10,
        }}
      >
        <Row
          gutter={16}
          justify="center"
          style={{
            padding: 5,
          }}
        >
          <Col>
            <Typography.Title
              style={{
                color: "dodgerblue",
                fontWeight: "bold",
                margin: 0,
                padding: 0,
                // fontSize: "1.9rem",
              }}
              level={4}
            >
              ACADEMIC YEAR:
            </Typography.Title>
          </Col>
          <Col>
            <Typography.Title
              style={{
                color: "red",
                fontWeight: "bold",
                margin: 0,
                padding: 0,
                //   fontSize: "1.9rem",
              }}
              level={4}
            >
              {studentFile?.current_info.current_acc_yr}
            </Typography.Title>
          </Col>

          <Col>
            <Typography.Title
              style={{
                color: "dodgerblue",
                fontWeight: "bold",
                margin: 0,
                padding: 0,
                // fontSize: "1.9rem",
              }}
              level={4}
            >
              SEMESTER:
            </Typography.Title>
          </Col>
          <Col>
            <Typography.Title
              style={{
                color: "red",
                fontWeight: "bold",
                margin: 0,
                padding: 0,
                // fontSize: "1.9rem",
              }}
              level={4}
            >
              {studentFile?.current_info.true_sem}
            </Typography.Title>
          </Col>
        </Row>

        <div
          style={{
            marginTop: 15,
          }}
        >
          <Form
            name="enrollForm"
            form={form}
            layout="vertical"
            // initialValues={{
            //   study_yr: "2",
            // }}
            onFinish={onEnroll}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Current Year of Study"
              name="study_yr"
              rules={[
                {
                  required: true,
                  message: "Please input the study year",
                },
              ]}
            >
              <Select
                // loading={loading}
                allowClear
                placeholder="Current Year of Study"
              >
                <Select.Option value={studentFile?.current_info?.true_study_yr}>
                  {studentFile?.current_info?.true_study_yr}
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Enrollment Status"
              name="enrollment_status"
              rules={[
                {
                  required: true,
                  message: "Please input the enrollment status",
                },
              ]}
            >
              <Select
                // loading={loading}

                allowClear
                placeholder="Enrollment Status"
              >
                {studentFile?.current_info?.enrollment_types.map((status) => (
                  <Select.Option value={status?.id}>
                    {status?.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
}

export default EnrollmentModal;
