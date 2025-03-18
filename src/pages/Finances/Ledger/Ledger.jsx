import React from "react";
// import { Box } from "@mui/material";
import { ConfigProvider, Table, Row, Col, Button, Tooltip } from "antd";
import { PrinterOutlined } from "@ant-design/icons";
// import "./styles.css";

const columns = [
  {
    title: "Row Name",
    dataIndex: "name",
    key: "name",
    render: (text) => (
      <span style={{ color: "dodgerblue", fontWeight: "500" }}>{text}</span>
    ),
  },
];

const data = [
  {
    key: "2",
    name: "LEDGER FOR YEAR 1, SEMESTER 1 AND 2 ACADEMIC YEAR 2020/2021",
  },
  {
    key: "1",
    name: (
      <Row align="middle" justify="space-between">
        <Col>
          <span style={{ color: "dodgerblue", fontWeight: "500" }}>
            LEDGER FOR YEAR 2, SEMESTER 1 AND 3, ACADEMIC YEAR 2021/2022
          </span>
        </Col>
        <Col>
          <Tooltip title="Print">
            <Button
              type="dashed"
              style={{ padding: "3px 6px" }}
              size="small"
              icon={<PrinterOutlined />}
              onClick={() => printStatement()}
            />
          </Tooltip>
        </Col>
      </Row>
    ),
  },
];

const tableData = [
  {
    invoice_no: "WED 10-MAR-2021 11:38 am",
    currency: "Invoice #2000100121-T58335192",
    amount: "1129400.00",
    paid: "0",
    due: "1129400.00",
    narration: "Tuition",
    percentage: "30",
  },
  {
    invoice_no: "WED 10-MAR-2021 11:38 am",
    currency: "Invoice #2000100121-F58574678",
    amount: "457500.00",
    paid: "0",
    due: "1586900.00",
    narration: "Functional",
    percentage: "30",
  },
  {
    invoice_no: "MON 15-MAR-2021 03:09 pm",
    currency: "Payment #B4E23833FE6A4",
    amount: "00",
    paid: "950000.00",
    due: "636900.00",
    narration: "Tuition",
    percentage: "30",
  },
  {
    invoice_no: "MON 15-MAR-2021 03:09 pm",
    currency: "Payment #B4E23833FE6A4",
    amount: "00",
    paid: "636900.00",
    due: "00",
    narration: "Tuition",
    percentage: "30",
  },
  {
    invoice_no: "MON 30-AUG-2021 10:18 am",
    currency: "Invoice #2000100121-T12111749",
    amount: "1129400.00",
    paid: "0",
    due: "1129400.00",
    narration: "Tuition",
    percentage: "30",
  },
  {
    invoice_no: "MON 30-AUG-2021 10:18 am",
    currency: "Invoice #2000100121-F24143476",
    amount: "320500.00",
    paid: "0",
    due: "1449900.00",
    narration: "Functional",
    percentage: "30",
  },
  {
    invoice_no: "SAT 04-SEP-2021 03:21 pm",
    currency: "Payment #F59B22A6A4A4A",
    amount: "0",
    paid: "500000.00",
    due: "949900.00",
    narration: "Functional",
    percentage: "30",
  },
  {
    invoice_no: "SUN 05-SEP-2021 11:18 am",
    currency: "Payment #A49827873D943",
    amount: "0",
    paid: "95000.00",
    due: "854900.00",
    narration: "Functional",
    percentage: "30",
  },
  {
    invoice_no: "TUE 26-OCT-2021 07:05 pm",
    currency: "Payment #C9FDEDE7F8D4D",
    amount: "0",
    paid: "300000.00",
    due: "554900.00",
    narration: "Functional",
    percentage: "30",
  },
  {
    invoice_no: "TUE 30-NOV-2021 03:07 pm",
    currency: "Payment #3B9538F22C4A7",
    amount: "0",
    paid: "554900.00",
    due: "0.00",
    narration: "Functional",
    percentage: "30",
  },
];

function printStatement() {
  const printWindow = window.open("", "_blank", "height=100,width=400");
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Student Statement</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 5px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h2>TO: MWESIGWA Isaac (2100708077) - 21/U/08077/PS</h2>
          <h3>AS OF: ${new Date().toLocaleString()}</h3>
          <h3>COLLEGE OF HUMANITIES AND SOCIAL SCIENCES</h3>
          <h3>SCHOOL OF LANGUAGES, LITERATURE AND COMMUNICATION</h3>
          <h3>BACHELOR OF CHINESE AND ASIAN STUDIES</h3>
          <h2>Statement</h2>
          <table>
            <tr>
              <th>#</th>
              <th>Time stamp</th>
              <th>Entry</th>
    
              <th>Debit</th>
              <th>Credit</th>
              <th>Balance</th>
            </tr>
            ${tableData
              .map(
                (item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.invoice_no}</td>
                <td>${item.currency}</td>
               
                <td>${parseInt(item.amount).toLocaleString()}</td>
                <td>${parseInt(item.paid).toLocaleString()}</td>
                <td>${parseInt(item.due).toLocaleString()}</td>
              </tr>
            `
              )
              .join("")}
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.focus();
  }
}

export default function Ledger() {
  const expandedRowRender = () => {
    const columns2 = [
      {
        title: "#",
        dataIndex: "index",
        key: "date",
        render: (_, __, index) => index + 1,
        width: "5%",
      },
      {
        title: "TIME LOG",
        dataIndex: "invoice_no",
        width: "25%",
        key: "invoice_no",
        ellipsis: true,
      },
      {
        title: "POSTING",
        dataIndex: "currency",
        key: "item_name",
        width: "30%",
        ellipsis: true,
      },
      {
        title: "DEBIT",
        dataIndex: "amount",
        key: "amount",
        ellipsis: true,
        render: (text) => parseInt(text).toLocaleString(),
        width: "15%",
      },
      {
        title: "CREDIT",
        key: "paid",
        dataIndex: "paid",
        width: "15%",
        render: (text) => parseInt(text).toLocaleString(),
      },
      {
        title: "BALANCE",
        dataIndex: "due",
        key: "due",
        width: "15%",
        render: (text) => parseInt(text).toLocaleString(),
      },
    ];

    return (
      <Table
        style={{ marginBottom: 5, marginTop: 5 }}
        size="small"
        columns={columns2}
        dataSource={tableData}
        pagination={false}
        rowHoverable
      />
    );
  };

  return (
    <div>
      {/* <Box
        sx={{
          backgroundColor: "#fff",
          borderColor: "lightgray",
          borderWidth: 1,
          borderBottom: "none",
        }}
        className="p-5"
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      /> */}
      <ConfigProvider
        theme={{
          components: {
            Table: {
              borderColor: "lightgray",
              borderRadius: 0,
              headerBorderRadius: 0,
            },
          },
        }}
      >
        <Table
          className="custom-table"
          bordered
          showHeader={false}
          size="small"
          columns={columns}
          expandable={{
            expandedRowRender,
            defaultExpandAllRows: true,
          }}
          dataSource={data}
          scroll={{
            y: "calc(100vh - 190px)",
          }}
        />
      </ConfigProvider>
    </div>
  );
}
