import React, { useState } from "react";
import { Card } from "antd";
import ModulesEnrollment from "./modules_enrollment/ModulesEnrollment";
import EnrollmentHistory from "./enrollment_history/EnrollmentHistory";
const tabList = [
  {
    key: "modules_enrollment",
    tab: "Modules Enrollment",
  },
  {
    key: "enrollment_history",
    tab: "Enrollment History",
  },
];
const contentList = {
  modules_enrollment: <ModulesEnrollment />,
  enrollment_history: <EnrollmentHistory />,
};

const Enrollment = () => {
  const [activeTabKey1, setActiveTabKey1] = useState("modules_enrollment");
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
export default Enrollment;
