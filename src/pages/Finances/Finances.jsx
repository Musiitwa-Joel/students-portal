import React, { useContext, useState } from "react";
import { Card, Row, Col, Statistic, Typography, Button } from "antd";
import MyInvoices from "./Invoices/Invoices";
import MyLedger from "./Ledger/Ledger";
import MyTransactions from "./Transactions/Transactions";
import MyFeesStructure from "./FeesStructure/FeesStructure";
import AppContext from "../../context/appContext";
import { RefreshCcw } from "lucide-react";

const tabList = [
  {
    key: "my_invoices",
    tab: "My Invoices",
  },
  {
    key: "my_ledger",
    tab: "My Ledger",
  },
  {
    key: "my_txns",
    tab: "My Transactions",
  },
  {
    key: "fees_structure",
    tab: "Fees Structure",
  },
];

const Statistics = ({ invoices }) => {
  // console.log("invoices", invoices);
  const totalAmount = invoices.reduce(
    (total, item) => total + parseInt(item.total_amount),
    0
  );
  const unpaidInvoices = invoices.filter((inv) => inv.amount_due > 0);

  const paidInvoices = invoices.filter((inv) => inv.amount_paid > 0);

  const totalAmountDue = unpaidInvoices.reduce(
    (total, item) => total + parseInt(item.amount_due),
    0
  );

  const totalAmountPaid = paidInvoices.reduce(
    (total, item) => total + parseInt(item.amount_paid),
    0
  );

  let percentageCompletion = (totalAmountPaid / totalAmount) * 100 || 0;
  return (
    <div
      style={{
        backgroundColor: "rgb(240, 242, 245)",
        height: "calc(100vh - 260px)",
      }}
    >
      <Row gutter={16}>
        <Col span={24}>
          <Card
            bordered={true}
            style={{
              margin: 10,
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.18)",
              borderRadius: 0,
            }}
          >
            <Statistic
              title={
                <Typography.Title
                  level={5}
                  style={{
                    margin: 0,
                  }}
                >
                  TOTAL INVOICE AMOUNT
                </Typography.Title>
              }
              value={totalAmount}
              precision={0}
              valueStyle={{
                color: "#3f8600",
              }}
              // prefix={<ArrowUpOutlined />}
              suffix="UGX"
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            style={{
              margin: 10,
              marginTop: 0,
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.18)",
              borderRadius: 0,
            }}
          >
            <Statistic
              title={
                <Typography.Title
                  level={5}
                  style={{
                    margin: 0,
                  }}
                >
                  TOTAL INVOICE AMOUNT PAID
                </Typography.Title>
              }
              value={totalAmountPaid}
              precision={0}
              valueStyle={{
                color: "#3f8600",
              }}
              // prefix={<ArrowDownOutlined />}
              suffix="UGX"
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            style={{
              margin: 10,
              marginTop: 0,
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.18)",
              borderRadius: 0,
            }}
          >
            <Statistic
              title={
                <Typography.Title
                  level={5}
                  style={{
                    margin: 0,
                  }}
                >
                  TOTAL INVOICE AMOUNT DUE
                </Typography.Title>
              }
              value={totalAmountDue}
              precision={0}
              valueStyle={{
                color: "#3f8600",
              }}
              // prefix={<ArrowDownOutlined />}
              suffix="UGX"
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card
            bordered={false}
            style={{
              margin: 10,
              marginTop: 0,
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.18)",
              borderRadius: 0,
            }}
          >
            <Statistic
              title={
                <Typography.Title
                  level={5}
                  style={{
                    margin: 0,
                  }}
                >
                  PERCENTAGE COMPLETION
                </Typography.Title>
              }
              value={percentageCompletion}
              precision={2}
              valueStyle={{
                color: percentageCompletion < 50 ? "#cf1322" : "#3f8600",
                // color: "#3f8600",
              }}
              // prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
const contentList = {
  my_invoices: <MyInvoices />,
  my_ledger: <MyLedger />,
  my_txns: <MyTransactions />,
  fees_structure: <MyFeesStructure />,
};

const Finance = () => {
  const { studentFile } = useContext(AppContext);
  const [activeTabKey1, setActiveTabKey1] = useState("my_invoices");
  const onTab1Change = (key) => {
    setActiveTabKey1(key);
  };

  return (
    <>
      <Card
        // style={{
        //   width: "100%",
        // }}
        tabList={tabList}
        activeTabKey={activeTabKey1}
        onTabChange={onTab1Change}
        // extra={<Button icon={<RefreshCcw size={15} />}>Refresh</Button>}
        // extra={<a href="#">More</a>}
      >
        <Row
          gutter={8}
          style={{
            width: "100%",
            height: "auto",
            margin: 0,
            padding: 0,
            // boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)",
            // backgroundColor: "red",
          }}
        >
          <Col
            className="gutter-row"
            span={19}
            style={{
              padding: 0,
              // margin: 10,
            }}
          >
            <div>{contentList[activeTabKey1]}</div>
          </Col>
          <Col className="gutter-row" span={5}>
            <Statistics invoices={studentFile?.invoices || []} />
          </Col>
        </Row>
      </Card>
    </>
  );
};
export default Finance;
