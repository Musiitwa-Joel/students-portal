import React, { useState } from "react";
import { Card } from "antd";
import SelfRegistration from "./SelfRegistration";
import RegistrationTrack from "./RegistrationTrack";
import { Helmet } from "react-helmet";

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
      <Helmet>
        <title>Student Registration - Nkumba University</title>
        <meta
          name="description"
          content="Manage your student registration and track your registration progress for the 2024/2025 academic year at Your Institution Name."
        />
        <meta
          name="keywords"
          content="student registration, registration track, academic year, Your Institution Name"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Nkumba University" />
        <link rel="canonical" href="https://yourwebsite.com/registration" />
      </Helmet>
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
