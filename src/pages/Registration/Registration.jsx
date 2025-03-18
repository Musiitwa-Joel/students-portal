import React, { useState } from "react";
import { Card } from "antd";
import SelfRegistration from "./SelfRegistration";
import RegistrationTrack from "./RegistrationTrack";

const tabList = [
  {
    key: "registration",
    tab: "Registration",
  },
  {
    key: "registration_track",
    tab: "Registration Track",
  },
];
const contentList = {
  registration: <SelfRegistration />,
  registration_track: <RegistrationTrack />,
};

const Registration = () => {
  const [activeTabKey1, setActiveTabKey1] = useState("registration");
  const onTab1Change = (key) => {
    setActiveTabKey1(key);
  };

  return (
    <>
      <Card
        style={{
          width: "100%",
        }}
        tabList={tabList}
        activeTabKey={activeTabKey1}
        onTabChange={onTab1Change}
        styles={{
          body: {
            // backgroundColor: "rgb(238, 238, 238)",
          },
        }}
      >
        <div>{contentList[activeTabKey1]}</div>
      </Card>
    </>
  );
};
export default Registration;
