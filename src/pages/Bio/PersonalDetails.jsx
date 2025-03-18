import React, { useContext } from "react";
import { Table, theme } from "antd";
import "./Bio.css";
import AppContext from "../../context/appContext";

const columns = (token) => [
  {
    title: "",
    dataIndex: "label",
    ellipsis: true,
    key: "label",
    render: (text) => <strong>{text}</strong>,
  },
  {
    title: "",
    dataIndex: "value",
    ellipsis: true,
    key: "value",
  },
  {
    title: "",
    ellipsis: true,
    dataIndex: "label2",
    key: "label2",
    render: (text) => <strong>{text}</strong>,
  },
  {
    title: "",
    ellipsis: true,
    dataIndex: "value2",
    key: "value2",
  },
];

const PersonalDetails = () => {
  const { token } = theme.useToken();
  const { studentFile } = useContext(AppContext);

  // Function to check if a value is empty and return "NO RECORD" if it is
  const getValue = (value) => {
    if (!value) return "NO RECORD";

    // Convert date_of_birth timestamp (string or number) to dd/mm/yyyy format
    const timestamp = Number(value); // Ensure it's a number
    if (!isNaN(timestamp) && timestamp > 0) {
      const date = new Date(timestamp);
      return date.toLocaleDateString("en-GB"); // Converts to dd/mm/yyyy format
    }

    return value;
  };

  return (
    <Table
      size="small"
      dataSource={[
        {
          key: "1",
          label: "SURNAME",
          value: getValue(studentFile.biodata.surname),
          label2: "RELIGION",
          value2: getValue(studentFile.biodata.religion),
        },
        {
          key: "2",
          label: "OTHER NAMES",
          value: getValue(studentFile.biodata.other_names),
          label2: "DISTRICT",
          value2: getValue(studentFile.biodata.district_of_birth),
        },
        {
          key: "3",
          label: "EMAIL",
          value: getValue(studentFile.biodata.email),
          label2: "NATIONALITY",
          value2: getValue(studentFile.biodata.nationality?.nationality_title),
        },
        {
          key: "4",
          label: "TEL. PHONE",
          value: studentFile.biodata.phone_no,
          label2: "NATIONAL ID NO.",
          value2: getValue(studentFile.biodata.national_id_no),
        },
        {
          key: "5",
          label: "SEX",
          value: getValue(studentFile.biodata.gender),
          label2: "PASSPORT",
          value2: getValue(studentFile.biodata.passport),
        },
        {
          key: "6",
          label: "DATE OF BIRTH",
          value: getValue(studentFile.biodata.date_of_birth),
          label2: "",
          value2: "",
        },
      ]}
      columns={columns(token)}
      pagination={false}
      showHeader={false}
      bordered
      rowClassName={(record, index) =>
        index % 2 === 0 ? "even-row" : "odd-row"
      }
    />
  );
};

export default PersonalDetails;
