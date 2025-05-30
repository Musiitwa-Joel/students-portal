import React, { useContext, useState } from "react";
import { Modal, Collapse, theme, Card } from "antd";
import { CaretRightOutlined } from "@ant-design/icons";
import GenerateTable from "./GenerateTable";
import PartialPayment from "./PartialPayment";
import Deposit from "./Deposit/Deposit";
import AppContext from "../../context/appContext";
import PaymentSlip from "./PaymentSlip";

const PRT = () => {
  //   const [open, setOpen] = useState(false);
  const { studentFile } = useContext(AppContext);

  // console.log("student file", studentFile);

  const getItems = (panelStyle, invoices) => {
    if (!invoices || invoices.length == 0) {
      return [
        {
          key: "3",
          label: (
            <span
              style={{
                fontSize: 16,
              }}
            >
              {"GENERATE PRT TO DEPOSIT TO MY ACCOUNT"}
            </span>
          ),
          children: <Deposit />,
          style: panelStyle,
        },
      ];
    } else {
      return [
        {
          key: "1",
          label: (
            <span
              style={{
                fontSize: 16,
              }}
            >
              {"GENERATE PRT TO PAY FOR ALL PENDING INVOICES"}
            </span>
          ),
          children: <GenerateTable />,
          style: panelStyle,
        },
        {
          key: "2",
          label: (
            <span
              style={{
                fontSize: 16,
              }}
            >
              {"GENERATE PRT TO MAKE PARTIAL PAYMENT ON PENDING INVOICES"}
            </span>
          ),

          children: <PartialPayment />,
          style: panelStyle,
        },
        {
          key: "3",
          label: (
            <span
              style={{
                fontSize: 16,
              }}
            >
              {"GENERATE PRT TO DEPOSIT TO MY ACCOUNT"}
            </span>
          ),
          children: <Deposit />,
          style: panelStyle,
        },
      ];
    }
  };

  const { token } = theme.useToken();
  const panelStyle = {
    marginBottom: 20,
    background: "#dfe6ef",
    borderRadius: token.borderRadiusLG,
    border: "none",
  };

  return (
    <>
      <Card>
        <Collapse
          bordered={false}
          accordion
          size="middle"
          //   defaultActiveKey={["1"]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined
              style={{
                fontSize: 19,

                marginTop: 3,
              }}
              rotate={isActive ? 90 : 0}
            />
          )}
          style={{
            background: token.colorBgContainer,
            marginTop: 15,
          }}
          items={getItems(
            panelStyle,
            studentFile?.invoices.filter((inv) => inv.amount_due > 0)
          )}
        />
      </Card>
      <PaymentSlip />
    </>
  );
};
export default PRT;
