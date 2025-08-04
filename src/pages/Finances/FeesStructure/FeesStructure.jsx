import React, { useEffect, useState, useContext } from "react";
import { Collapse, Tag, Skeleton, message, Table } from "antd";
import { useQuery } from "@apollo/client";
import { Helmet } from "react-helmet";
import { gql } from "@apollo/client";
import AppContext from "../../../context/appContext";
import { GET_FEES_STRUCTURE } from "../../../gql/queries";
import "./App.css";

const { Panel } = Collapse;

// Reusable SemesterFees component using antd Table
const SemesterFees = ({ fees, totalBill }) => {
  const columns = [
    {
      title: "CODE",
      dataIndex: "code",
      key: "code",
      className: "fees-table-cell",
      render: (text, record) => {
        if (record.isTotal) {
          return {
            children: "TOTAL",
            props: { colSpan: 3 },
          };
        }
        return text;
      },
    },
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
      className: "fees-table-cell",
      render: (text, record) => {
        if (record.isTotal) {
          return {
            props: { colSpan: 0 },
          };
        }
        return text;
      },
    },
    {
      title: "AMOUNT",
      dataIndex: "amount",
      key: "amount",
      className: "fees-table-cell",
      render: (amount, record) => {
        if (record.isTotal) {
          return {
            children: `${totalBill.toLocaleString()} UGX`,
            props: { colSpan: 2, style: { textAlign: "right" } },
          };
        }
        return `${amount.toLocaleString()} ${record.currency}`;
      },
    },
    {
      title: "TYPE",
      dataIndex: "type",
      key: "type",
      className: "fees-table-cell",
      render: (text, record) => {
        if (record.isTotal) {
          return {
            props: { colSpan: 0 },
          };
        }
        return text;
      },
    },
  ];

  const dataSource = [
    ...fees.map((fee, index) => ({
      key: index,
      code: fee.code,
      name: fee.name,
      amount: fee.amount,
      currency: fee.currency,
      type: fee.type,
    })),
    {
      key: "total",
      isTotal: true,
    },
  ];

  return (
    <div className="fees-table-container">
      <div className="table-wrapper">
        <Table
          columns={columns}
          dataSource={dataSource}
          size="small"
          pagination={false}
          className="fees-table"
          rowClassName={(record) => (record.isTotal ? "total-row" : "")}
        />
      </div>
    </div>
  );
};

const FeesStructure = () => {
  const { studentFile } = useContext(AppContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [isTimeout, setIsTimeout] = useState(false);
  const [activeKey, setActiveKey] = useState("");
  const { loading, error, data } = useQuery(GET_FEES_STRUCTURE, {
    // fetchPolicy: "network-only",
    pollInterval: 0,
    onError: (err) => {
      console.error("GraphQL Query Error:", {
        message: err.message,
        graphQLErrors: err.graphQLErrors,
        networkError: err.networkError,
      });
    },
    onCompleted: (data) => {
      console.log("Query Completed:", data);
    },
  });

  const CURRENT_SEMESTER =
    studentFile?.current_info?.recent_enrollment?.sem ?? 1;
  const CURRENT_STUDY_YEAR =
    studentFile?.current_info?.recent_enrollment?.study_yr ?? 3;

  useEffect(() => {
    // Timeout after 10 seconds of loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        setIsTimeout(true);
        messageApi.open({
          type: "error",
          content: "Request timed out. Please check your network or try again.",
        });
      }
    }, 10000);

    // Handle errors
    if (error) {
      messageApi.open({
        type: "error",
        content: "Failed to load fees structure. Please try again.",
      });
    }

    // Handle no data after loading
    if (!loading && !error && !data?.my_fees_structure) {
      messageApi.open({
        type: "warning",
        content: "No fees structure data available from the server.",
      });
    }

    return () => clearTimeout(timeoutId);
  }, [loading, error, data, messageApi]);

  // Group fees by study_yr and semester
  const groupedFees = React.useMemo(() => {
    if (!data?.my_fees_structure) return [];

    const feeGroups = data.my_fees_structure.reduce((acc, fee) => {
      // Normalize year and semester to strings
      const year = String(fee.study_yr);
      const semester = String(fee.semester);
      const key = `${year}-${semester}`;
      if (!acc[key]) {
        acc[key] = {
          year,
          semester,
          fees: [],
          totalBill: 0,
        };
      }
      const amount = parseFloat(fee.amount) || 0;
      acc[key].fees.push({
        code: fee.item_code,
        name: fee.item_name,
        amount,
        currency: "UGX",
        type: fee.mandatory ? "MANDATORY" : "OPTIONAL",
      });
      acc[key].totalBill += amount;
      return acc;
    }, {});

    return Object.values(feeGroups).sort((a, b) => {
      if (a.year === b.year) return Number(a.semester) - Number(b.semester);
      return Number(a.year) - Number(b.year);
    });
  }, [data]);

  // Set active panel key based on CURRENT_STUDY_YEAR and CURRENT_SEMESTER
  useEffect(() => {
    if (!groupedFees.length) {
      console.log("No grouped fees, no active panel");
      setActiveKey("");
      return;
    }

    const currentYearStr = String(CURRENT_STUDY_YEAR);
    const currentSemesterStr = String(CURRENT_SEMESTER);

    const index = groupedFees.findIndex(
      (semester) =>
        semester.year === currentYearStr &&
        semester.semester === currentSemesterStr
    );

    const key = index !== -1 ? (index + 1).toString() : "";
    console.log("Active Key Calculation:", {
      currentYear: currentYearStr,
      currentSemester: currentSemesterStr,
      groupedFees: groupedFees.map((g) => ({
        year: g.year,
        semester: g.semester,
      })),
      matchedIndex: index,
      activeKey: key,
    });

    if (index === -1) {
      console.warn(
        `No matching panel found for Year ${currentYearStr}, Semester ${currentSemesterStr}`
      );
    }

    setActiveKey(key);
  }, [groupedFees, CURRENT_STUDY_YEAR, CURRENT_SEMESTER]);

  if (loading || isTimeout) {
    return (
      <div className="app-container">
        <Helmet>
          <title>Fees Structure - Nkumba University</title>
          <meta
            name="description"
            content="View the detailed fees structure for various semesters at Nkumba University, including tuition, fees, and total costs."
          />
          <meta
            name="keywords"
            content="fees structure, tuition fees, Nkumba University, semester costs, university expenses"
          />
          <meta name="robots" content="index, follow" />
          <meta name="author" content="Nkumba University" />
        </Helmet>
        {isTimeout && (
          <p
            style={{ color: "#ff4d4f", textAlign: "center", marginBottom: 16 }}
          >
            Request timed out. Please refresh or check your network connection.
          </p>
        )}
        <Collapse defaultActiveKey="1" size="small" accordion>
          {[1, 2, 3].map((index) => (
            <Panel
              header={
                <div className="panel-header">
                  <strong className="panel-title">
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 200, borderRadius: 4 }}
                    />
                  </strong>
                  <strong className="panel-total">
                    TOTAL BILL:{" "}
                    <Skeleton.Input
                      active
                      size="small"
                      style={{ width: 100, borderRadius: 4 }}
                    />
                  </strong>
                </div>
              }
              key={index.toString()}
            >
              <div className="fees-table-container">
                <div className="table-wrapper">
                  <Skeleton
                    active
                    title={{ width: "100%" }}
                    paragraph={{
                      rows: 10,
                      width: Array(10).fill("100%"),
                    }}
                    style={{ marginTop: 8 }}
                  />
                </div>
              </div>
            </Panel>
          ))}
        </Collapse>
      </div>
    );
  }

  if (error || !data?.my_fees_structure || groupedFees.length === 0) {
    return (
      <div className="app-container">
        <Helmet>
          <title>Fees Structure - Nkumba University</title>
          <meta
            name="description"
            content="View the detailed fees structure for various semesters at Nkumba University, including tuition, fees, and total costs."
          />
          <meta
            name="keywords"
            content="fees structure, tuition fees, Nkumba University, semester costs, university expenses"
          />
          <meta name="robots" content="index, follow" />
          <meta name="author" content="Nkumba University" />
        </Helmet>
        <p>
          {error
            ? "Error loading fees structure. Please try again later."
            : "No fees structure data available."}
        </p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {contextHolder}
      <Helmet>
        <title>Fees Structure - Nkumba University</title>
        <meta
          name="description"
          content="View the detailed fees structure for various semesters at Nkumba University, including tuition, fees, and total costs."
        />
        <meta
          name="keywords"
          content="fees structure, tuition fees, Nkumba University, semester costs, university expenses"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Nkumba University" />
      </Helmet>
      <Collapse
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key)}
        size="small"
        accordion
      >
        {groupedFees.map((semester, index) => {
          const panelKey = (index + 1).toString();
          console.log(
            `Rendering Panel: Year ${semester.year}, Semester ${semester.semester}, Key: ${panelKey}`
          );
          return (
            <Panel
              header={
                <div className="panel-header">
                  <strong className="panel-title">
                    FEES STRUCTURE FOR YEAR {semester.year} SEMESTER{" "}
                    {semester.semester}
                    {semester.year === String(CURRENT_STUDY_YEAR) &&
                      semester.semester === String(CURRENT_SEMESTER) && (
                        <Tag color="green" style={{ marginLeft: 8 }}>
                          CURRENT SEMESTER
                        </Tag>
                      )}
                  </strong>
                  <strong className="panel-total">
                    TOTAL BILL:{" "}
                    <Tag color="blue">
                      {semester.totalBill.toLocaleString()} UGX
                    </Tag>
                  </strong>
                </div>
              }
              key={panelKey}
            >
              <SemesterFees
                fees={semester.fees}
                totalBill={semester.totalBill}
              />
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
};

export default FeesStructure;
