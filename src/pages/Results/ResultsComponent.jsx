import React, { useEffect, useState } from "react";
import { Spin, Table, Typography, message } from "antd";
import { useQuery } from "@apollo/client";
import { GET_MY_RESULTS } from "../../gql/queries";
import styled from "styled-components";

const { Title } = Typography;

const StyledTable = styled(Table)`
  .ant-table-thead > tr > th {
    background-color: #c3cdec !important;
    color: blue !important;
  }

  .red-row {
    background-color: #fff1f0;
  }

  .red-row:hover > td {
    background-color: #ffccc7 !important;
  }

  .ant-table-footer {
    background-color: white;
    padding: 8px 16px;
  }

  @media (max-width: 768px) {
    .hide-on-mobile {
      display: none !important;
    }

    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 8px !important;
    }

    .ant-table-tbody > tr > td {
      white-space: normal !important;
      word-break: break-word !important;
    }

    /* Adjust column widths for mobile */
    .ant-table-cell {
      &:first-child {
        max-width: 70% !important;
      }
      &:nth-child(2) {
        max-width: 15% !important;
      }
      &:nth-child(3) {
        max-width: 15% !important;
      }
    }
  }
`;

const SemesterTitle = styled(Title)`
  color: #1890ff;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 16px !important;
    margin-bottom: 8px;
  }
`;

const FooterContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 32px;
  font-size: 14px;

  @media (max-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 16px;
    padding: 8px 0;
  }
`;

const FooterItem = styled.span`
  font-size: 13px;
  font-weight: bold;

  @media (max-width: 768px) {
    &.hide-on-mobile {
      display: none;
    }

    &.show-on-mobile {
      flex: 0 0 auto;
      margin-right: 16px;
    }
  }
`;

const getMobileColumns = () => [
  {
    title: "Course Title",
    dataIndex: "course_unit_title",
    key: "course_unit_title",
    ellipsis: true,
    width: "70%",
    render: (text) => (
      <div
        style={{
          whiteSpace: "normal",
          wordBreak: "break-word",
          fontSize: "13px",
          lineHeight: "1.3",
        }}
      >
        {text}
      </div>
    ),
  },
  {
    title: "Mark",
    dataIndex: "final_mark",
    key: "final_mark",

    width: "15%",
    render: (text) => (
      <div style={{ textAlign: "center", fontSize: "13px" }}>{text}</div>
    ),
  },
  {
    title: "Grade",
    dataIndex: "grade",
    key: "grade",
    ellipsis: true,
    width: "15%",
    render: (text) => (
      <div style={{ textAlign: "center", fontSize: "13px" }}>{text}</div>
    ),
  },
];

// const getDesktopColumns = () => [
//   {
//     title: "Course Code",
//     dataIndex: "course_unit_code",
//     key: "course_unit_code",
//     width: 120,
//     ellipsis: true,
//   },
//   {
//     title: "Course Title",
//     dataIndex: "course_unit_title",
//     key: "course_unit_title",
//     ellipsis: true,
//   },
//   {
//     title: "Credit Units",
//     dataIndex: "credit_units",
//     key: "credit_units",
//     width: 80,
//     ellipsis: true,
//   },
//   {
//     title: "Final Mark",
//     dataIndex: "final_mark",
//     key: "final_mark",
//     width: 70,
//     ellipsis: true,
//   },
//   {
//     title: "Grade",
//     dataIndex: "grade",
//     key: "grade",
//     width: 50,
//     ellipsis: true,
//   },
//   {
//     title: "Grade Point",
//     dataIndex: "grade_point",
//     key: "grade_point",
//     width: 80,
//     ellipsis: true,
//   },
//   {
//     title: "Remark",
//     dataIndex: "remarks",
//     key: "remarks",
//     width: 60,
//     ellipsis: true,
//   },
// ];

const getDesktopColumns = () => [
  {
    title: "Course Code",
    dataIndex: "course_unit_code",
    key: "course_unit_code",
    width: 120,
    ellipsis: true,
  },
  {
    title: "Course Title",
    dataIndex: "course_unit_title",
    key: "course_unit_title",
    ellipsis: true,
  },

  {
    title: "CW", // New Column: Coursework Mark
    dataIndex: "coursework", // Ensure this matches the key in your data
    key: "coursework",
    width: 45,
    ellipsis: true,
    // render: (text) => (
    //   <div style={{ textAlign: "center", fontSize: "13px" }}>{text}</div>
    // ),
  },
  {
    title: "Exam Mark", // New Column: Exam Mark
    dataIndex: "exam", // Ensure this matches the key in your data
    key: "exam",
    width: 80,
    ellipsis: true,
    // render: (text) => (
    //   <div style={{ textAlign: "center", fontSize: "13px" }}>{text}</div>
    // ),
  },
  {
    title: "Final Mark",
    dataIndex: "final_mark",
    key: "final_mark",
    width: 70,
    ellipsis: true,
  },
  {
    title: "Grade",
    dataIndex: "grade",
    key: "grade",
    width: 50,
    ellipsis: true,
  },

  {
    title: "Grade Point",
    dataIndex: "grade_point",
    key: "grade_point",
    width: 80,
    ellipsis: true,
  },
  {
    title: "CUs",
    dataIndex: "credit_units",
    key: "credit_units",
    width: 45,
    ellipsis: true,
  },
  {
    title: "Remark",
    dataIndex: "remarks",
    key: "remarks",
    width: 60,
    ellipsis: true,
  },
];
const ResultsComponent = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { error, loading, data } = useQuery(GET_MY_RESULTS);
  const [categorizedResults, setCategorizedResults] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  // console.log(data);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (data?.my_results?.student_marks) {
      const results = data.my_results.student_marks;
      const categorized = {};
      results.forEach((result) => {
        const key = `${result.study_yr}-${result.semester}-${result.acc_yr_title}`;
        if (!categorized[key]) {
          categorized[key] = [];
        }
        categorized[key].push({
          ...result,
          key: result.course_unit_code,
        });
      });

      setCategorizedResults(categorized);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    }
  }, [error, messageApi]);

  const renderSemesterTables = () => {
    return Object.entries(categorizedResults)
      .sort(([keyA], [keyB]) => {
        const [yearA, semA] = keyA.split("-");
        const [yearB, semB] = keyB.split("-");
        return yearA === yearB
          ? Number(semA) - Number(semB)
          : Number(yearA) - Number(yearB);
      })
      .map(([key, semesterData]) => {
        const [year, semester, academicYear] = key.split("-");
        return (
          <div key={key} style={{ marginBottom: isMobile ? 16 : 24 }}>
            <SemesterTitle level={5}>
              YEAR {year} - SEMESTER {semester} - {academicYear}
            </SemesterTitle>
            <StyledTable
              columns={isMobile ? getMobileColumns() : getDesktopColumns()}
              dataSource={semesterData}
              pagination={false}
              bordered
              size={"small"}
              rowClassName={(record) =>
                Number(record.final_mark) < 50 ? "red-row" : ""
              }
              footer={() => (
                <FooterContainer>
                  <FooterItem className="show-on-mobile">
                    GPA: {semesterData[0].GPA}
                  </FooterItem>
                  <FooterItem className="show-on-mobile">
                    CGPA: {semesterData[0].CGPA}
                  </FooterItem>
                  <FooterItem className="hide-on-mobile">
                    SEMESTER REMARK: {semesterData[0].remarks}
                  </FooterItem>
                  <FooterItem className="hide-on-mobile">
                    TCU: {semesterData[0].TCU}
                  </FooterItem>
                  <FooterItem className="hide-on-mobile">
                    CTCU: {semesterData[0].CTCU}
                  </FooterItem>
                </FooterContainer>
              )}
            />
          </div>
        );
      });
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
        }}
      >
        <Spin tip="Loading results..." />
      </div>
    );
  }

  return (
    <div
      style={{
        paddingLeft: isMobile ? 8 : 16,
        paddingRight: isMobile ? 8 : 16,
      }}
    >
      {contextHolder}
      {renderSemesterTables()}
    </div>
  );
};

export default ResultsComponent;
