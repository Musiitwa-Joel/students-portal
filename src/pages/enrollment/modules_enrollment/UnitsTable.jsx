import { gql, useLazyQuery, useQuery } from "@apollo/client";
import {
  Space,
  Input,
  Button,
  ConfigProvider,
  Table,
  Form,
  Typography,
  message,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import EnrollmentModal from "./EnrollmentModal";
import AppContext from "../../../context/appContext";
import { GET_COURSE_UNITS } from "../../../gql/queries";

const { Search } = Input;

function UnitsTable() {
  const { studentFile } = useContext(AppContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [
    getCourseUnits,
    { error: loadErr, loading: loadingCourseUnits, data: cuRes },
  ] = useLazyQuery(GET_COURSE_UNITS, {
    notifyOnNetworkStatusChange: true,
  });
  const [groupedData, setGroupedData] = useState([]);
  const [courseUnits, setCourseUnits] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [moduleSearchValue, setModuleSearchValue] = useState("");
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (loadErr) {
      messageApi.open({
        type: "error",
        content: loadErr.message,
      });
    }
  }, [loadErr]);

  useEffect(() => {
    // First, dispatch the full list of course units

    // dispatch(setFilteredCourseUnits(courseUnits));
    let newArr = courseUnits;

    if (moduleSearchValue) {
      // Filter the course units based on the search value
      newArr = courseUnits.filter(
        (cu) =>
          cu.course_unit_title
            .toLowerCase()
            .includes(moduleSearchValue.toLowerCase()) // Use strict equality
      );
    }

    const grouped = {};

    // Use newArr instead of filteredCourseUnits
    newArr.forEach((course) => {
      const yearSemKey = `${course.course_unit_year}-${course.course_unit_sem}`;

      if (!grouped[yearSemKey]) {
        grouped[yearSemKey] = {
          course_unit_year: course.course_unit_year,
          course_unit_sem: course.course_unit_sem,
          courses: [],
        };
      }

      grouped[yearSemKey].courses.push(course);
    });

    // Convert the grouped data to an array
    let data = Object.values(grouped);

    // Sort the data based on course_unit_year and course_unit_sem
    data.sort((a, b) => {
      if (a.course_unit_year === b.course_unit_year) {
        return a.course_unit_sem - b.course_unit_sem; // Compare by semester if years are the same
      }
      return a.course_unit_year - b.course_unit_year; // Compare by year
    });

    // Dispatch the grouped data
    setGroupedData(data);

    // Set default expanded row keys based on the available data
    const expandedKeys = data.map(
      (group) => `${group.course_unit_year}-${group.course_unit_sem}`
    );
    // dispatch(setDefaultExpandedModuleRowKeys(c));
    setExpandedKeys(expandedKeys);
  }, [courseUnits, moduleSearchValue]);

  const loadCourseUnits = async () => {
    const res = await getCourseUnits({
      variables: {
        courseVersionId: studentFile?.course_details.id,
      },
    });

    // console.log("course units", res.data.course_units);
    if (res.data?.course_units) {
      setCourseUnits(res.data.course_units);
    }
  };

  useEffect(() => {
    if (studentFile) {
      loadCourseUnits();
    }
  }, [studentFile]);

  const onRowSelect = (selectedKeys, selectedRows, rowKey) => {
    setSelectedRowKeys(selectedKeys);
    setSelectedUnit(selectedRows[0]);
    setIsVisible(true);
  };

  // console.log("defaultExpandedRowKeys", defaultExpandedRowKeys);

  const innerColumns = [
    {
      title: "Code",
      dataIndex: "course_unit_code",
      key: "course_unit_code",
      render: (text) => (
        <Typography.Text
          style={{
            fontSize: 13,
          }}
        >
          {text}
        </Typography.Text>
      ),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "Course Unit Title",
      dataIndex: "course_unit_title",
      key: "course_unit_title",
      render: (text) => (
        <Typography.Text
          style={{
            fontSize: 13,
          }}
        >
          {text}
        </Typography.Text>
      ),
      width: "55%",
      ellipsis: true,
    },
    {
      title: "Credit unit",
      dataIndex: "credit_units",
      key: "credit_units",
      render: (text) => (
        <Typography.Text
          style={{
            fontSize: 13,
          }}
        >
          {text}
        </Typography.Text>
      ),
      width: "12%",
      ellipsis: true,
    },
    {
      title: "Level",
      dataIndex: "course_unit_level",
      key: "course_unit_level",
      render: (text) => (
        <Typography.Text
          style={{
            fontSize: 13,
          }}
        >
          {text}
        </Typography.Text>
      ),
      width: "12%",
      ellipsis: true,
    },
  ];

  // Expanded row render function: reuses the same columns for inner table
  const expandedRowRender = (record) => {
    const data = [];
    // for (let i = 0; i < 4; ++i) {
    //   data.push({
    //     key: i.toString(),
    //     course_unit_code: "BIT203939",
    //     course_unit_title: "DATA COMMUNICATION AND NETWORKS",
    //     credit_units: "3",
    //     study_yr: "1",
    //     sem: "1",
    //     course_unit_level: "elective",
    //   });
    // }
    return (
      <Table
        columns={innerColumns} // Use the same columns as outer table
        dataSource={record.courses}
        size="middle"
        pagination={false}
        rowKey="id"
        // loading={loadingCourseUnits}
        // rowSelection={{
        //   type: "radio",
        //   selectedRowKeys: selectedRowKeys, // Select row only if it's part of the current table
        //   onChange: (selectedKeys, selectedRows) =>
        //     onRowSelect(selectedKeys, selectedRows, record.key), // Handle row selection
        //   columnWidth: "5%",
        // }}
        onRow={(record) => ({
          onClick: () => {
            // console.log("clicked", record);
            setSelectedRowKeys([record.id]); // select row on click
            setSelectedUnit(record);
            setIsVisible(true);
          },
        })}
        bordered
        style={{
          //   minWidth: panelWidth * 16.25,
          borderRadius: 0,
        }}
        tableLayout="fixed"
      />
    );
  };

  // Outer table data, each row is just a sentence like "Study Year 1"
  const outerData = [];
  for (let i = 0; i < 3; ++i) {
    outerData.push({
      key: i.toString(),
      name: `Year ${i + 1}, Semester ${i + 1}`, // This will span across all columns
    });
  }

  const outerColumns = [
    {
      title: "Year",
      dataIndex: "name",
      key: "year",
      render: (text, record) => (
        <Typography.Text
          style={{
            fontSize: 13,
            color: "dodgerblue",
          }}
          strong
        >
          {`Year ${record.course_unit_year}, Semester ${record.course_unit_sem}`}
        </Typography.Text>
      ),
    },
    // {
    //   title: "Semester",
    //   dataIndex: "course_unit_sem",
    //   key: "sem",
    //   render: (text, record) => `Semester ${record.course_unit_sem}`,
    // },
  ];

  return (
    <div
      style={{
        backgroundColor: "#fff",
        // height: 300,
        borderColor: "green",
        borderWidth: 100,
      }}
    >
      {contextHolder}
      <div
        className="p-5"
        style={{
          paddingLeft: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: 10,
          marginBottom: 0,
          padding: 5,

          // backgroundColor: "red",

          // height: 40,
        }}
      >
        <Typography.Title
          level={5}
          color="inherit"
          component="div"
          style={{
            margin: 0,
            padding: 0,
          }}
        >
          Modules <span style={{ color: "red" }}>(Click to select)</span>
        </Typography.Title>

        <div>
          <Space>
            <Search
              placeholder="Search Module..."
              // onSearch={onSearch}
              onChange={(e) => setModuleSearchValue(e.target.value)}
              size="middle"
              width={500}
              style={{
                width: 250,
              }}
            />
          </Space>
        </div>
      </div>

      <div>
        <ConfigProvider
          theme={{
            components: {
              Table: {
                headerBg: "#f9f9f9",
                headerBorderRadius: 0,
                borderRadius: 0,
                // borderColor: "lightgray",
              },
            },
          }}
        >
          <Table
            columns={outerColumns} // Outer table has only one column with colSpan
            dataSource={groupedData}
            bordered
            pagination={false}
            showHeader={false}
            loading={loadingCourseUnits}
            size="middle"
            expandable={{
              expandedRowRender, // Inner table will appear when expanded
              // defaultExpandedRowKeys, // Expand rows by default
              expandedRowKeys: expandedKeys,
              onExpand: (expanded, record) => {
                // console.log("key", record);
                // dispatch(
                //   setDefaultExpandedModuleRowKeys(
                //     expanded
                //       ? [
                //           ...expandedKeys,
                //           `${record.course_unit_year}-${record.course_unit_sem}`,
                //         ]
                //       : expandedKeys.filter(
                //           (key) =>
                //             key !==
                //             `${record.course_unit_year}-${record.course_unit_sem}`
                //         )
                //   )
                // );
              },
            }}
            rowKey={(record) =>
              `${record.course_unit_year}-${record.course_unit_sem}`
            }
            style={{
              width: "100%",
              borderColor: "lightgray",
              //   borderTopColor: "gray",
              borderWidth: 1,
              borderRadius: 0,
            }}
            scroll={{
              y: "calc(100vh - 300px)",
            }}
          />
        </ConfigProvider>
      </div>

      <EnrollmentModal
        isVisible={isVisible}
        _module={selectedUnit}
        handleClose={() => setIsVisible(false)}
      />
    </div>
  );
}

export default UnitsTable;
