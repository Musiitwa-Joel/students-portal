import React, { useContext, useEffect, useState } from "react";
import { Input, Button, Modal, Alert, message } from "antd";
import "../PRT.css";
import { useMutation } from "@apollo/client";

import { GENERATE_PRT } from "../../../gql/mutation";
import AppContext from "../../../context/appContext";

const Deposit = () => {
  const [depositAmount, setDepositAmount] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();

  const [generatePRT, { error, loading, data }] = useMutation(GENERATE_PRT);
  const { setTokenRes, setPaymentSlipVisible } = useContext(AppContext);

  useEffect(() => {
    if (error) {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    }
  }, [error]);

  const handleAmountChange = (e) => {
    setDepositAmount(Number(e.target.value));
  };

  const totalAmountToDeposit = depositAmount; // Assuming some logic to calculate total

  const handleGenerateToken = async () => {
    const payload = {
      amount: depositAmount,
      type: "prepayment_ref",
      invoices: null,
    };

    // console.log("payload", payload);

    const res = await generatePRT({
      variables: payload,
    });

    setTokenRes(res.data.generatePRT);

    setDepositAmount(0);

    setPaymentSlipVisible(true);
  };
  return (
    <div style={{ margin: 16 }}>
      {contextHolder}
      <div style={{ marginBottom: 16 }}>
        <label htmlFor="amountToDeposit">Amount to deposit in UGX </label>
        <Input
          required
          id="amountToDeposit"
          type="number"
          placeholder="Enter amount"
          value={depositAmount}
          onChange={handleAmountChange}
          style={{ width: 300 }}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          style={{
            backgroundColor: "#E0E7FF",
            color: "#5C67F2",
            borderColor: "#E0E7FF",
            textAlign: "center",
          }}
          disabled
        >
          TOTAL AMOUNT TO DEPOSIT: UGX {totalAmountToDeposit.toLocaleString()}
        </Button>
        <Button
          type="primary"
          onClick={handleGenerateToken}
          disabled={depositAmount == 0}
          loading={loading}
        >
          GENERATE TOKEN
        </Button>
      </div>
    </div>
  );
};

export default Deposit;
