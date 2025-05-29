import { Tabs } from "antd";
import { useState } from "react";
import OngoingElections from "./OngoingElections";
import UpcomingElections from "./UpcomingElections";
import PastElections from "./PastElections";

export default function ElectionsPage() {
  const [activeTab, setActiveTab] = useState("1");

  const items = [
    {
      key: "1",
      label: "Ongoing Elections",
      children: <OngoingElections />,
    },
    {
      key: "2",
      label: "Upcoming Elections",
      children: <UpcomingElections />,
    },
    {
      key: "3",
      label: "Past Elections",
      children: <PastElections />,
    },
  ];

  const containerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  };

  const tabsContainerStyle = {
    backgroundColor: "white",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  };

  const contentStyle = {
    flex: 1,
    overflowY: "auto",
  };

  return (
    <div style={containerStyle}>
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={items}
        size="large"
        style={tabsContainerStyle}
        tabBarStyle={{
          fontWeight: 600,
          marginBottom: 24,
          position: "sticky",
          top: 0,
          backgroundColor: "white",
          zIndex: 1,
        }}
      >
        {items.map((item) => (
          <Tabs.TabPane key={item.key} tab={item.label}>
            <div style={contentStyle}>{item.children}</div>
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
}
