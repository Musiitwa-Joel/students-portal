import React, { useContext, useEffect, useState } from "react";
import { Table, Button, InputNumber, Modal, Alert, message } from "antd";
import "./PRT.css";
import { GENERATE_PRT } from "../../gql/mutation";
import { useMutation } from "@apollo/client";
import AppContext from "../../context/appContext";

const columns = [
  {
    title: "INVOICE NO",
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
    dataIndex: "amount_paid",
    render: (text) => text.toLocaleString(),
    key: "amount_paid",
  },
  {
    title: "AMOUNT DUE",
    dataIndex: "amount_due",
    render: (text) => text.toLocaleString(),
    key: "amount_due",
  },
  {
    title: "AMOUNT TO PAY",
    key: "amount_to_pay",
    // render: (text, record, index) => (
    //   <InputNumber
    //     min={0}
    //     type="number"
    //     value={record.amount_to_pay}
    //     onChange={(value) => handleAmountChange(value, index)}
    //   />
    // ),
  },
];

const PartialPayment = () => {
  const { studentFile, setTokenRes, setPaymentSlipVisible } =
    useContext(AppContext);
  const [totalAmountToPay, setTotalAmountToPay] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();
  const [generatePRT, { loading, error, data: prtRes }] =
    useMutation(GENERATE_PRT);

  useEffect(() => {
    if (error) {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    }
  }, [error]);

  const _unpaidInvoices = studentFile?.invoices.filter(
    (inv) => inv.amount_due > 0
  );

  const [data, setData] = useState(_unpaidInvoices);

  useEffect(() => {
    setData(_unpaidInvoices);
  }, [studentFile]);

  const handleAmountChange = (value, index) => {
    let newData = [...data];

    // Create a new object with the existing properties and add the new property
    newData[index] = {
      ...newData[index],
      allocate_amount: value,
    };

    setData(newData);

    setTotalAmountToPay(
      newData.reduce(
        (total, item) => total + parseInt(item.allocate_amount || 0),
        0
      )
    );
    // });
  };

  const handleGenerateToken = async (unpaidInvoices) => {
    const allocatedInvs = unpaidInvoices.filter((inv) => inv.allocate_amount);
    // console.log("allocated invoices", allocatedInvs);
    const payload = {
      studentNo: studentFile?.student_no,
      amount: totalAmountToPay,
      type: "invoice_ref",
      // generatedBy: userObj.user.user_id,
      invoices: JSON.stringify(allocatedInvs),
    };

    // console.log("payload", payload);

    const res = await generatePRT({
      variables: payload,
    });

    setTokenRes(res.data.generatePRT);

    setPaymentSlipVisible(true);

    setData(_unpaidInvoices);
    setTotalAmountToPay(0);
  };

  return (
    <div style={{}}>
      {contextHolder}
      <Table
        pagination={false}
        className="custom-table"
        size="small"
        columns={columns.map((col) => ({
          ...col,
          render:
            col.key === "amount_to_pay"
              ? (text, record, index) => (
                  <InputNumber
                    min={0}
                    max={data[index]?.amount_due}
                    value={
                      data[index]?.allocate_amount
                        ? data[index]?.allocate_amount
                        : 0
                    }
                    type="number"
                    style={{
                      width: "100%",
                    }}
                    onChange={(value) => handleAmountChange(value, index)}
                  />
                )
              : col.render,
        }))}
        dataSource={studentFile?.invoices.filter((inv) => inv.amount_due > 0)}
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell
              index={0}
              colSpan={5}
              style={{ textAlign: "right" }}
            >
              <strong>TOTAL AMOUNT TO PAY</strong>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={5}>
              <strong>{totalAmountToPay.toLocaleString()} UGX</strong>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
      <div style={{ margin: 16, textAlign: "right" }}>
        <Button
          style={{}}
          type="primary"
          onClick={() => handleGenerateToken(data)}
          disabled={totalAmountToPay == 0}
          loading={loading}
        >
          GENERATE TOKEN
        </Button>
      </div>
    </div>
  );
};

export default PartialPayment;
