import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  Row,
  Typography,
  Form,
  Col,
  Divider,
  Alert,
  Card,
  Space,
  DatePicker,
  Select,
  message,
  Spin,
} from "antd";
import AppContext from "../../context/appContext";
import { X } from "lucide-react";
import dayjs from "dayjs";
import { gql, useMutation, useQuery } from "@apollo/client";
import { VERIFY_STUDENT_CREDENTIALS } from "../../gql/mutation";
import formatDateToYYYYMMDD from "../../utils/formatDateToYYYYMMDDDD";

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const LOAD_REQS = gql`
  query nationalities {
    nationalities {
      id
      nationality_title
    }
  }
`;

const genderOptions = [
  { value: "M", label: "MALE" },
  { value: "F", label: "FEMALE" },
];

const GraduationVerificationForm = () => {
  const appContext = useContext(AppContext);
  const [form] = Form.useForm();
  const { error, loading, data } = useQuery(LOAD_REQS);
  const [modal, contextHolder] = Modal.useModal();
  const [
    verifyStudentCredentials,
    { error: verifyErr, loading: verifyingCredentials },
  ] = useMutation(VERIFY_STUDENT_CREDENTIALS, {
    refetchQueries: ["My_details", "Graduation_sections"],
  });

  useEffect(() => {
    if (error) {
      message.error(error.message);
    }

    if (verifyErr) {
      message.error(verifyErr.message);
    }
  }, [error, verifyErr]);

  if (appContext?.studentFile) {
    form.setFieldsValue({
      surname: appContext?.studentFile.biodata.surname,
      othernames: appContext?.studentFile.biodata.other_names,
      email: appContext?.studentFile.biodata.email,
      phoneNo: appContext?.studentFile.biodata.phone_no,
      residential_address: appContext?.studentFile.biodata.place_of_residence,
      date_of_birth: dayjs(
        parseInt(appContext?.studentFile.biodata.date_of_birth)
      ),
      gender: appContext?.studentFile.biodata.gender,
      country_of_origin: appContext?.studentFile.biodata.country_of_origin,
      nationality: appContext?.studentFile.biodata.nationality.id,
      student_no: appContext?.studentFile.student_no,
      registration_no: appContext?.studentFile.registration_no,
      course: `${appContext?.studentFile.course_details.course.course_code} - ${appContext?.studentFile.course_details.course.course_title}`,
      school: `${appContext?.studentFile.course_details.course.school.school_code} - ${appContext?.studentFile.course_details.course.school.school_title}`,
      study_session: appContext?.studentFile.study_time_title,
      campus: appContext?.studentFile.campus_title,
    });
  }

  const onFinish = async () => {
    const values = form.getFieldsValue();

    const payload = {
      payload: {
        surname: values.surname,
        othernames: values.othernames,
        phone_no: values.phoneNo,
        email: values.email,
        date_of_birth: formatDateToYYYYMMDD(values.date_of_birth.$d),
        country_of_origin: values.country_of_origin,
        gender: values.gender,
        nationality: values.nationality,
        place_of_residence: values.residential_address,
        acc_yr_id: appContext?.studentFile.current_info.acc_yr_id,
      },
    };

    // console.log("payload", payload);
    const res = await verifyStudentCredentials({
      variables: payload,
    });

    // console.log("response", res.data);
    message.success(res.data.verify_student_credentials.message);
    appContext.setGraduationVerificationModalVisible(false);
  };

  const handleOk = async () => {
    try {
      // validatte the fields
      await form.validateFields();
      const confirmed = await modal.confirm({
        title: "Confirmation",
        content:
          "Please ensure that you have thoroughly reviewed your details, as they will appear exactly as entered on your official transcript.",
        centered: true,
      });

      if (confirmed) {
        await onFinish();
      }
    } catch (error) {
      console.log("error", error.message);
      message.error("Please fill in all the required Fields");
    }
  };
  const handleCancel = () => {
    appContext.setGraduationVerificationModalVisible(false);
  };
  return (
    <>
      {contextHolder}
      <Modal
        title={
          <Typography.Text
            style={{
              color: "#fff",
            }}
          >
            {`VERIFY YOUR CREDENTIALS`}
          </Typography.Text>
        }
        open={appContext?.graduationVerificationModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Save"
        width={850}
        okButtonProps={{
          loading: verifyingCredentials,
          disabled: verifyingCredentials,
        }}
        style={{
          top: 50,
        }}
        closeIcon={
          <X
            style={{
              color: "#fff",
            }}
          />
        }
        styles={{
          body: {
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 5,
            height: "auto",

            // Ensure the content is not clipped
          },
          content: {
            padding: 0,
            height: "auto",
            // Ensure the content is not clipped
          },
          footer: {
            padding: 10,
          },
          header: {
            backgroundColor: "#0d389e",
            padding: "7px 10px",
          },
        }}
        maskClosable={false}
      >
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          //   style={{
          //     maxWidth: 600,
          //   }}
        >
          <div
            style={{
              marginBottom: 10,
            }}
          >
            <Alert
              type="info"
              // message="Important Notice"
              description={
                <Typography.Text strong>
                  NAMES MUST BE WRITTEN IN THE ORDER IN WHICH THEY APPEAR ON THE
                  APPLICANT’S EARLIER ACADEMIC DOCUMENTS (E.g. ‘O’ and ‘A’ Level
                  Certificates)
                </Typography.Text>
              }
              // showIcon
            />
          </div>
          <Spin spinning={verifyingCredentials}>
            <Row gutter={32}>
              <Col className="gutter-row" span={12}>
                <div
                  style={{
                    marginBottom: 10,
                  }}
                >
                  <Alert
                    message="Editable Fields"
                    type="warning"
                    showIcon
                    // closable
                  />
                </div>

                <Form.Item
                  name="surname"
                  label="Surname"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="othernames"
                  label="Other names"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="phoneNo"
                  label="Phone Number"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="residential_address"
                  label="Residential Address"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="date_of_birth"
                  label="Date of Birth"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <DatePicker
                    style={{
                      width: "100%",
                    }}
                  />
                </Form.Item>

                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select placeholder="Select gender">
                    {genderOptions.map((opt) => (
                      <Select.Option value={opt.value}>
                        {opt.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="country_of_origin"
                  label="Country Of Origin"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="nationality"
                  label="Nationality"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select
                    placeholder="Select a nationality"
                    loading={loading}
                    showSearch
                    options={
                      data
                        ? data?.nationalities.map((nationality) => ({
                            label: nationality.nationality_title,
                            value: nationality.id,
                          }))
                        : []
                    }
                  />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={12}>
                <div
                  style={{
                    marginBottom: 10,
                  }}
                >
                  <Alert
                    message="Non-Editable Fields"
                    type="warning"
                    showIcon
                    // closable
                  />
                </div>

                <div>
                  <Form.Item
                    name="student_no"
                    label="Student Number"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input readOnly />
                  </Form.Item>

                  <Form.Item
                    name="registration_no"
                    label="Registration No."
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input readOnly />
                  </Form.Item>

                  <Form.Item
                    name="course"
                    label="Course"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input readOnly />
                  </Form.Item>

                  <Form.Item
                    name="school"
                    label="School"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input readOnly />
                  </Form.Item>

                  <Form.Item
                    name="study_session"
                    label="Study Session"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input readOnly />
                  </Form.Item>

                  <Form.Item
                    name="campus"
                    label="Campus"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              </Col>
            </Row>
          </Spin>
        </Form>
      </Modal>
    </>
  );
};
export default GraduationVerificationForm;
