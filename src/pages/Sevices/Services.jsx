import React from "react";
import { Tabs } from "antd";
import ProgramChange from "./ProgramChange";
import NewID from "./NewId";
import StudentSupport from "./StudentSupport";
import CashRefund from "./CashRefund";
// Define individual components for each tab
const Tab1 = () => (
  <div>
    <ProgramChange />
  </div>
);
const Tab2 = () => (
  <div>
    <NewID />
  </div>
);
// const Tab3 = () => (
//   <div>
//     <CashRefund />
//   </div>
// );
const Tab4 = () => (
  <div style={{ margin: 0 }}>
    <StudentSupport />
  </div>
);

const onChange = (key) => {
  console.log(key);
};

// Items array with component references
const items = [
  {
    key: "1",
    label: "Program Change",
    children: <Tab1 />,
  },
  {
    key: "2",
    label: "New ID",
    children: <Tab2 />,
  },
  // {
  //   key: "3",
  //   label: "Cash Refund",
  //   children: <Tab3 />,
  // },
  {
    key: "4",
    label: "Student Support",
    children: <Tab4 />,
  },
];

const Services = () => (
  <Tabs
    size="small"
    style={{ padding: 10 }}
    defaultActiveKey="1"
    items={items}
    onChange={onChange}
  />
);

export default Services;
