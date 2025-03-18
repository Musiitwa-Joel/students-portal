import React from "react";
import { Collapse, Tag } from "antd";
import Sem1Yr1 from "./Sem1Yr1";
import Sem2Yr1 from "./Sem2Yr1";
import Sem1Yr2 from "./Sem1Yr2";
import "./App.css"; // Make sure to create this CSS file

const { Panel } = Collapse;

const totalBillYear1Sem1 = 1586900.0;
const totalBillYear1Sem2 = 1499900.0;

const App = () => {
  return (
    <div className="app-container">
      <Collapse defaultActiveKey="2" size="small" accordion>
        <Panel
          header={
            <div className="panel-header">
              <strong className="panel-title">
                FEES STRUCTURE FOR YEAR 1 SEMESTER 1
              </strong>
              <strong className="panel-total">
                TOTAL BILL:{" "}
                <Tag color="blue">
                  {totalBillYear1Sem1.toLocaleString()}&nbsp;UGX
                </Tag>
              </strong>
            </div>
          }
          key="1"
        >
          <Sem1Yr1 />
        </Panel>
        <Panel
          header={
            <div className="panel-header">
              <strong className="panel-title">
                FEES STRUCTURE FOR YEAR 1 SEMESTER 2
              </strong>
              <strong className="panel-current-semester">
                <Tag color="green">CURRENT SEMESTER</Tag>
              </strong>
              <strong className="panel-total">
                TOTAL BILL:{" "}
                <Tag color="blue">
                  {totalBillYear1Sem2.toLocaleString()}&nbsp;UGX
                </Tag>
              </strong>
            </div>
          }
          key="2"
        >
          <Sem2Yr1 />
        </Panel>
        <Panel
          header={
            <div className="panel-header">
              <strong className="panel-title">
                FEES STRUCTURE FOR YEAR 2 SEMESTER 1
              </strong>
              <strong className="panel-total">
                TOTAL BILL:{" "}
                <Tag color="blue">
                  {totalBillYear1Sem2.toLocaleString()}&nbsp;UGX
                </Tag>
              </strong>
            </div>
          }
          key="3"
        >
          <Sem1Yr2 />
        </Panel>
      </Collapse>
    </div>
  );
};

export default App;
