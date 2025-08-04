import React, { useState } from "react";
import { Card } from "antd";
import ModulesEnrollment from "./modules_enrollment/ModulesEnrollment";
import EnrollmentHistory from "./enrollment_history/EnrollmentHistory";
import { Helmet } from "react-helmet";

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
      <Helmet>
        <title>
          {activeTabKey1 === "modules_enrollment"
            ? "Modules Enrollment"
            : "Enrollment History"}{" "}
          - Nkumba University
        </title>
        <meta
          name="description"
          content={
            activeTabKey1 === "modules_enrollment"
              ? "Enroll in academic modules for the current semester at Nkumba University."
              : "View your enrollment history and past academic records at Nkumba University."
          }
        />
        <meta
          name="keywords"
          content={`${
            activeTabKey1 === "modules_enrollment"
              ? "modules enrollment, academic modules"
              : "enrollment history, academic records"
          }, Nkumba University`}
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Nkumba University" />
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
export default Enrollment;
