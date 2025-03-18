import React, { useState } from "react";
import { Flex, Typography, Table, theme } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import ResultsTable from "./ResultsTable";
import "./MyTable.css";

const Desc = ({ text }) => (
  <Flex
    justify="center"
    align="center"
    style={{
      height: "100%",
    }}
  >
    <Typography.Title
      type="secondary"
      level={5}
      style={{
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </Typography.Title>
  </Flex>
);

const Results = () => {
  return <ResultsTable />;
};

export default Results;
