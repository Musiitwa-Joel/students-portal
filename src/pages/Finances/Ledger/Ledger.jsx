import React, { useRef, useContext } from "react";
import { useQuery } from "@apollo/client";
import {
  ConfigProvider,
  Table,
  Button,
  Tooltip,
  Skeleton,
  Alert,
  QRCode,
} from "antd";
import { PrinterOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import { Resizable } from "react-resizable";
import formatDateToDateAndTime from "../../../utils/formatDateToDateAndTime";
import { LEDGER_QUERY } from "../../../gql/queries";
import AppContext from "../../../context/appContext";

// Table column configurations
const COLUMN_CONFIG = {
  index: { title: "#", width: 50, key: "index" },
  date: { title: "Date", width: 150, key: "date" },
  entry: { title: "Entry", width: 250, key: "entry" },
  // description: { title: "Description", width: 200, key: "description" },
  debit: { title: "Debit", width: 100, key: "debit" },
  credit: { title: "Credit", width: 100, key: "credit" },
  balance: { title: "Balance", width: 100, key: "balance" },
};

// Table styles
const TABLE_STYLES = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "10px",
    tableLayout: "fixed",
  },
  cell: {
    border: "1px solid #999",
    padding: "4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    color: "#333",
  },
  header: {
    backgroundColor: "#f5f5f5",
  },
};

// Resizable column header component
const ResizableTitle = ({ onResize, width, ...restProps }) => {
  if (!width) return <th {...restProps} />;
  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          style={{
            position: "absolute",
            right: "-5px",
            top: 0,
            bottom: 0,
            width: "10px",
            cursor: "col-resize",
            zIndex: 1,
          }}
          onClick={(e) => e.stopPropagation()}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

// Print layout component
const PrintLedger = React.forwardRef(({ tableData, studentFile }, ref) => {
  const qrData =
    tableData.length > 0
      ? JSON.stringify({
          totalCredits: tableData.reduce(
            (sum, item) => sum + Number.parseFloat(item.credit || 0),
            0
          ),
          totalDebits: tableData.reduce(
            (sum, item) => sum + Number.parseFloat(item.debit || 0),
            0
          ),
          netBalance: Number.parseFloat(
            tableData[tableData.length - 1].balance || 0
          ).toLocaleString(),
        })
      : JSON.stringify({ totalCredits: 0, totalDebits: 0, netBalance: "N/A" });
  return (
    <div ref={ref} style={{ padding: "20mm", fontFamily: "Arial, sans-serif" }}>
      {/* Header */}
      <header style={{ marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {/* Reverted image sources to original */}
          <img
            src="https://cdn.worldvectorlogo.com/logos/nkumba-uninersity.svg"
            alt="Nkumba University Logo"
            style={{ width: "150px", height: "150px" }}
          />
          <img
            src={`https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=${
              studentFile?.student_no || ""
            }`}
            alt="Student Photo"
            style={{ width: "150px", height: "150px", borderRadius: "50%" }}
          />
          <QRCode
            value={qrData}
            bordered={false}
            size={80}
            bgColor="#fff"
            fgColor="#000"
            errorLevel="H"
            style={{
              border: "2px solid #5858efff",
              padding: "5px",
              backgroundColor: "#fff",
            }}
          />
        </div>
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <div
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              textTransform: "uppercase",
              color: "#333",
            }}
          >
            Nkumba University
          </div>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              marginTop: "5px",
              color: "#333",
            }}
          >
            Office of the University Bursar
          </div>
          <div style={{ fontSize: "11px", marginTop: "5px", color: "#555" }}>
            P.O. Box 237, Entebbe, Uganda
          </div>
          <div style={{ fontSize: "11px", color: "#555" }}>
            Phone: +256775037833 | Email: bursar@nkumbauniversity.ac.ug
          </div>
        </div>
        <hr style={{ border: "0.3px solid #ccc", margin: "10px 0" }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "11px",
            color: "#333",
            marginTop: "10px",
          }}
        >
          <div>
            <div>
              <strong>Student Info:</strong>{" "}
              {`${studentFile?.biodata?.surname} ${studentFile?.biodata?.other_names}`}{" "}
              ({studentFile?.student_no}) - {studentFile?.registration_no}
            </div>
            <div>
              <strong>Program:</strong>{" "}
              {studentFile?.course_details?.course?.course_title}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div>
              <strong>RE:</strong> Academic Ledger Statement
            </div>
            <div>
              <strong>As of:</strong>{" "}
              {new Date().toLocaleString("en-US", {
                timeZone: "Africa/Nairobi",
              })}
            </div>
          </div>
        </div>
      </header>
      {/* Ledger Table */}
      <section style={{ marginTop: "20px" }}>
        <h2 style={{ fontSize: "13px", fontWeight: "bold", color: "#333" }}>
          Financial Statement
        </h2>
        <table style={TABLE_STYLES.table}>
          <colgroup>
            <col style={{ width: "30px" }} />
            <col style={{ width: "80px" }} />
            <col style={{ width: "260px" }} />
            <col style={{ width: "90px" }} />
            <col style={{ width: "80px" }} />
            <col style={{ width: "70px" }} />
            <col style={{ width: "70px" }} />
          </colgroup>
          <thead>
            <tr>
              {Object.values(COLUMN_CONFIG).map((col) => (
                <th
                  key={col.key}
                  style={{ ...TABLE_STYLES.cell, ...TABLE_STYLES.header }}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, index) => (
              <tr key={item.id}>
                <td style={{ ...TABLE_STYLES.cell, maxWidth: "30px" }}>
                  {index + 1}
                </td>
                <td style={{ ...TABLE_STYLES.cell, maxWidth: "80px" }}>
                  {formatDateToDateAndTime(item.date)}
                </td>
                <td style={{ ...TABLE_STYLES.cell, maxWidth: "220px" }}>
                  {`${item.reference} (${item.academic_year.replace(
                    /(\d{4})\/(\d{4})/,
                    "$1/$2"
                  )}, Year${item.study_year}, Sem${item.semester})`}
                </td>
                {/* <td style={{ ...TABLE_STYLES.cell, maxWidth: "90px" }}>
                  {item.description}
                </td> */}
                <td style={{ ...TABLE_STYLES.cell, maxWidth: "80px" }}>
                  {Number.parseFloat(item.debit || 0).toLocaleString()}
                </td>
                <td style={{ ...TABLE_STYLES.cell, maxWidth: "80px" }}>
                  {Number.parseFloat(item.credit || 0).toLocaleString()}
                </td>
                <td style={{ ...TABLE_STYLES.cell, maxWidth: "70px" }}>
                  {Number.parseFloat(item.balance || 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div
          style={{
            textAlign: "right",
            fontWeight: "bold",
            marginTop: "10px",
            fontSize: "15px",
            color: "#333",
          }}
        >
          NET STATEMENT BALANCE:{" "}
          {tableData.length > 0
            ? Number.parseFloat(
                tableData[tableData.length - 1].balance || 0
              ).toLocaleString()
            : "N/A"}
          &nbsp;UGX
        </div>
      </section>
      {/* Print Styles */}
      <style type="text/css" media="print">{`
        @page { size: A4; margin: 20mm; }
        html, body { height: 100%; margin: 0 !important; padding: 0 !important; overflow: visible; }
        table { page-break-inside: auto; table-layout: fixed; }
        tr { page-break-inside: avoid; page-break-after: auto; }
        td, th { whiteSpace: nowrap !important; overflow: hidden; text-overflow: ellipsis; color: #333; }
      `}</style>
    </div>
  );
});

// Main Ledger Component
export default function Ledger() {
  const printRef = useRef(null);
  const { loading, error, data: queryData } = useQuery(LEDGER_QUERY);
  console.log(queryData);
  const { studentFile } = useContext(AppContext);
  const [columnWidths, setColumnWidths] = React.useState(
    Object.fromEntries(
      Object.entries(COLUMN_CONFIG).map(([key, { width }]) => [key, width])
    )
  );
  const tableData = queryData?.my_ledger || [];
  const isEmpty = tableData.length === 0;

  const handlePrint = useReactToPrint({
    // Reverting to contentRef as per user's report
    contentRef: printRef,
    documentTitle: "Nkumba University - Student Statement",
    onPrintError: (errorLocation, error) => {
      console.error(`Print error at ${errorLocation}:`, error);
      alert(
        "Failed to print. Please try again or check the console for details."
      );
    },
  });

  const handleResize =
    (key) =>
    (e, { size }) => {
      setColumnWidths((prev) => ({
        ...prev,
        [key]: Math.max(50, Math.min(300, size.width)),
      }));
    };

  const mainColumns = [
    {
      title: "Row Name",
      dataIndex: "name",
      key: "name",
      render: (text, _, __) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: "dodgerblue", fontWeight: "500" }}>{text}</span>
          <Tooltip title={isEmpty ? "No data to print" : "Print Statement"}>
            <Button
              type="primary"
              icon={<PrinterOutlined />}
              onClick={handlePrint}
              size="small"
              disabled={isEmpty}
              style={isEmpty ? { filter: "blur(2px)", opacity: 0.5 } : {}}
            >
              Print
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const expandedColumns = Object.entries(COLUMN_CONFIG).map(
    ([key, { title, width }]) => ({
      title,
      dataIndex: key,
      key,
      width: columnWidths[key],
      ellipsis: key !== "index",
      onHeaderCell: () => ({
        width: columnWidths[key],
        onResize: handleResize(key),
      }),
      render: (text, record) => {
        if (key === "index") return tableData.indexOf(record) + 1;
        if (key === "date") return formatDateToDateAndTime(record.date);
        if (key === "entry")
          return `${record.type} #${
            record.reference
          } (${record.academic_year.replace(
            /(\d{4})\/(\d{4})/,
            "$1/$2"
          )}, Year${record.study_year}, Sem${record.semester})`;
        if (["debit", "credit", "balance"].includes(key))
          return Number.parseFloat(text || 0).toLocaleString();
        return text;
      },
    })
  );

  const dataSource = studentFile?.biodata
    ? [
        {
          key: "1",
          name: `${studentFile.biodata.surname} ${studentFile.biodata.other_names}'S COMPREHENSIVE ACADEMIC LEDGER`,
        },
      ]
    : [{ key: "1", name: "COMPREHENSIVE ACADEMIC LEDGER" }];

  if (loading) {
    return (
      <div style={{ margin: "20px" }}>
        <Skeleton active paragraph={false} title={false} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          {Object.values(COLUMN_CONFIG).map((col) => (
            <Skeleton.Input
              key={col.key}
              style={{ width: col.width, height: 30, marginRight: 8 }}
              active
            />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            {Object.values(COLUMN_CONFIG).map((col) => (
              <Skeleton.Input
                key={`${col.key}-${rowIndex}`}
                style={{ width: col.width, height: 20, marginRight: 8 }}
                active
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error"
        description="Failed to load ledger data. Please try again."
        type="error"
        showIcon
        style={{ marginTop: "20px" }}
      />
    );
  }

  return (
    <div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              borderColor: "lightgray",
              borderRadius: 0,
              headerBorderRadius: 0,
              // Adding blue background to table header as per user's request
              headerBg: "#5858efff", // Using the blue from the QR code border
              headerColor: "#fff", // Ensure text is visible on blue background
            },
          },
        }}
      >
        <Table
          bordered
          showHeader={false}
          size="small"
          columns={mainColumns}
          expandable={{
            expandedRowRender: () => (
              <Table
                style={{ margin: "5px 0" }}
                size="small"
                components={{ header: { cell: ResizableTitle } }}
                columns={expandedColumns}
                dataSource={tableData}
                pagination={false}
                rowHoverable
                scroll={{ x: "max-content" }}
                footer={() => (
                  <div
                    style={{
                      textAlign: "right",
                      fontWeight: "bold",
                      fontSize: "15px",
                    }}
                  >
                    NET STATEMENT BALANCE:{" "}
                    {tableData.length > 0
                      ? Number.parseFloat(
                          tableData[tableData.length - 1].balance || 0
                        ).toLocaleString()
                      : "N/A"}
                    &nbsp;UGX
                  </div>
                )}
              />
            ),
            defaultExpandAllRows: true,
          }}
          dataSource={dataSource}
          scroll={{ y: "calc(100vh - 190px)" }}
        />
      </ConfigProvider>
      <div style={{ display: "none" }}>
        <PrintLedger
          tableData={tableData}
          studentFile={studentFile}
          ref={printRef}
        />
      </div>
    </div>
  );
}
