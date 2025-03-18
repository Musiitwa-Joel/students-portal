import React, { useContext } from "react";
import { Table, theme } from "antd";
import "./Bio.css";
import AppContext from "../../context/appContext";

const columns = (token) => [
  {
    title: "",
    dataIndex: "label",
    key: "label",
    render: (text) => (
      <strong
      // style={{ color: token.colorPrimary }}
      >
        {text}
      </strong>
    ),
  },
  {
    title: "",
    dataIndex: "value",
    key: "value",
  },
  {
    title: "",
    dataIndex: "label2",
    key: "label2",
    render: (text) => (
      <strong
      // style={{ color: token.colorPrimary }}
      >
        {text}
      </strong>
    ),
  },
  {
    title: "",
    dataIndex: "value2",
    key: "value2",
  },
];

const AcademicDetails = () => {
  const { token } = theme.useToken();
  const { studentFile } = useContext(AppContext);
  // console.log(studentFile);

  const getValue = (value) => {
    if (value === undefined || value === null || value === "") {
      return "NO RECORD";
    }
    return value;
  };

  // Handle Residence Status with Boolean
  const getResidenceStatus = (isResident) => {
    return Boolean(isResident) ? "RESIDENT" : "NON RESIDENT";
  };

  return (
    <Table
      size="small"
      dataSource={[
        {
          key: "1",
          label: "STUDENT NUMBER",
          value: getValue(studentFile.student_no),
          label2: "ACADEMIC STATUS",
          value2: getValue(studentFile.current_info.progress),
        },
        {
          key: "2",
          label: "REG. NUMBER",
          value: getValue(studentFile.registration_no),
          label2: "BILLING CATEGORY",
          value2: getValue(studentFile.biodata.nationality?.nationality_title),
        },
        {
          key: "3",
          label: "CAMPUS",
          value: getValue(studentFile.campus_title),
          label2: "MARITAL STATUS",
          value2: getValue(studentFile.marital_status),
        },
        {
          key: "4",
          label: "PROGRAMME VERSION",
          value: getValue(studentFile.course_details?.version_title),
          label2: "RESIDENCE STATUS",
          value2: getResidenceStatus(studentFile.is_resident),
        },
        {
          key: "5",
          label: "INTAKE",
          value: getValue(studentFile.intake_title),
          label2: "HALL OF ATTACHMENT",
          value2: "N/A",
        },
        {
          key: "6",
          label: "ENTRY ACADEMIC YEAR",
          value: getValue(studentFile.entry_acc_yr_title),
          label2: "HALL OF RESIDENCE",
          value2: "N/A",
        },
        {
          key: "7",
          label: "ENTRY STUDY YEAR",
          value: getValue(studentFile.entry_study_yr),
          label2: "CURRENT SEM",
          value2: getValue(studentFile.current_info.recent_enrollment.sem),
        },
        {
          key: "8",
          label: "CURRENT STUDY YEAR",
          value: getValue(studentFile.current_info.recent_enrollment.study_yr),
          label2: "HAS COMPLETED",
          value2: "N/A",
        },
        {
          key: "9",
          label: "STUDY TYPE",
          value: getValue(studentFile.study_time_title),
          label2: "ON LOAN SCHEME",
          value2: "NO",
        },
        {
          key: "10",
          label: "SPONSORSHIP",
          value: getValue(studentFile.sponsorship),
          label2: "AFFILIATED",
          value2: "N/A",
        },
      ]}
      columns={columns(token)}
      pagination={false}
      showHeader={false}
      bordered
    />
  );
};

export default AcademicDetails;
