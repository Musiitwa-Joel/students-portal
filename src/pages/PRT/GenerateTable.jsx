import React, { useEffect } from "react";
import { Table, Button, Modal, Alert, message } from "antd";
import "./PRT.css";
import { useMutation } from "@apollo/client";
import { useContext } from "react";
import AppContext from "../../context/appContext";
import { GENERATE_PRT } from "../../gql/mutation";

const columns = [
  {
    title: "INVOICE NO.",
    dataIndex: "invoice_no",
    key: "invoice_no",
  },
  {
    title: "DESCRIPTION",
    dataIndex: "narration",
    key: "narration",
  },
  {
    title: "AMOUNT",
    dataIndex: "total_amount",
    render: (text) => text.toLocaleString(),
    key: "total_amount",
  },
  {
    title: "PAID",
    key: "amount_paid",
    render: (text) => text.toLocaleString(),
    dataIndex: "amount_paid",
  },
  {
    title: "AMOUNT DUE",
    key: "amount_due",
    render: (text) => text.toLocaleString(),
    dataIndex: "amount_due",
  },
];

const data = [
  {
    key: "1",
    invoice_no: "T-INV1088619943",
    desc: "Tuition Fees",
    amount: "1,380,000 UGX",
    paid: "45 UGX",
    amount_due: "1,379,955 UGX",
  },
  {
    key: "2",
    invoice_no: "T-INV653527027",
    desc: "Tuition Fees",
    amount: "1,380,000 UGX",
    paid: "0 UGX",
    amount_due: "1,220,000 UGX",
  },
  {
    key: "3",
    invoice_no: "F-INV1628648347",
    desc: "Functional Fees",
    amount: "599,755 UGX",
    paid: "0 UGX",
    amount_due: "599,755 UGX",
  },
];

const GenerateTable = () => {
  const { studentFile, setTokenRes, setPaymentSlipVisible } =
    useContext(AppContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [generatePRT, { loading, error, data }] = useMutation(GENERATE_PRT);
  // console.log("invoices", studentFile?.invoices);

  useEffect(() => {
    if (error) {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    }
  }, [error]);

  // console.log("invoices", );
  const unpaidInvoices = studentFile?.invoices.filter(
    (inv) => inv.amount_due > 0
  );
  const totalAmountDue = unpaidInvoices.reduce(
    (total, item) => total + parseInt(item.amount_due),
    0
  );

  const handleGenerateToken = async (unpaidInvoices) => {
    let newData = [];

    unpaidInvoices.map((inv, index) => {
      newData.push({
        ...inv,
        allocate_amount: inv.amount_due,
      });
    });

    const payload = {
      studentNo: studentFile?.student_no,
      amount: totalAmountDue,
      type: "invoice_ref",
      invoices: JSON.stringify(newData),
    };

    // console.log("payload", payload);

    const res = await generatePRT({
      variables: payload,
    });

    // console.log("res", res.data);

    setTokenRes(res.data.generatePRT);

    setPaymentSlipVisible(true);
  };

  return (
    <div>
      {contextHolder}
      <Table
        pagination={false}
        className="custom-table"
        size="small"
        columns={columns}
        dataSource={unpaidInvoices}
        summary={(records) => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={4}>
              <strong>TOTAL AMOUNT TO PAY</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={4}>
              <strong>
                {records
                  .reduce((total, item) => total + parseInt(item.amount_due), 0)
                  .toLocaleString()}{" "}
                UGX
              </strong>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
      <div style={{ margin: 16, textAlign: "right" }}>
        <Button
          type="primary"
          onClick={() => handleGenerateToken(unpaidInvoices)}
          loading={loading}
        >
          GENERATE TOKEN
        </Button>
      </div>
    </div>
  );
};

export default GenerateTable;
