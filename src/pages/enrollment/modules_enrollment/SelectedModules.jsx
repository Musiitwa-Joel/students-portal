import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  Space,
  Input,
  Button,
  ConfigProvider,
  Table,
  Popconfirm,
  Typography,
  message,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { GET_STUDENT_SELECTED_COURSEUNITS } from "../../../gql/queries";

import AppContext from "../../../context/appContext";
import { REMOVE_MODULE } from "../../../gql/mutation";
import { CheckCheck, DeleteIcon, RefreshCcw, Trash, XIcon } from "lucide-react";

function SelectedModules() {
  const { studentFile } = useContext(AppContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedModules, setSelectedModules] = useState([]);
  const [
    getStudentRegisteredCourseUnits,
    { error, loading, data: studentRegisteredCourseUnitsRes, refetch },
  ] = useLazyQuery(GET_STUDENT_SELECTED_COURSEUNITS, {
    notifyOnNetworkStatusChange: true,
  });

  const [
    removeModule,
    { error: removeErr, loading: removingModule, data: removeRes },
  ] = useMutation(REMOVE_MODULE, {
    refetchQueries: ["getStudentSelectedModules"],
  });

  useEffect(() => {
    if (error) {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    }

    if (removeErr) {
      messageApi.open({
        type: "error",
        content: removeErr.message,
      });
    }
  }, [error, removeErr]);

  const loadStudentRegisteredCourseUnits = async () => {
    const res = await getStudentRegisteredCourseUnits({
      variables: {
        studentNo: studentFile?.student_no,
        studyYear: parseInt(
          studentFile?.current_info?.recent_enrollment?.study_yr
        ),

        sem: parseInt(studentFile?.current_info?.recent_enrollment?.sem),
      },
    });

    // console.log("modules", res.data?.student_registered_courseunits);
    if (res.data?.student_selected_modules) {
      setSelectedModules(res.data?.student_selected_modules);
    }
  };

  useEffect(() => {
    loadStudentRegisteredCourseUnits();
  }, [studentFile, studentRegisteredCourseUnitsRes]);

  const data = [
    {
      key: "2",
      course_unit_code: "BIT203939",
      course_unit_title: "DATA COMMUNICATION AND NETWORKS",
      credit_units: "3",
      study_yr: "1",
      sem: "1",
      status: "normal",
      course_unit_level: "elective",
    },
    {
      key: "3",
      course_unit_code: "BIT203939",
      course_unit_title: "COMPUTER MATHEMATICS",
      credit_units: "3",
      study_yr: "1",
      sem: "1",
      status: "normal",
      course_unit_level: "elective",
    },
    {
      key: "4",
      course_unit_code: "BIT203939",
      course_unit_title: "DATA COMMUNICATION AND NETWORKS",
      credit_units: "3",
      study_yr: "1",
      sem: "1",
      status: "normal",
      course_unit_level: "elective",
    },
  ];

  const expandedRowRender2 = (record) => {
    //   console.log("record", record);
    return (
      <div>
        <div
          style={{
            display: "flex",
            marginBottom: 10,
          }}
        >
          <span
            style={{
              width: 120,
              fontWeight: "bold",
            }}
          >
            Invoice No:{" "}
          </span>
          <span>{record.invoice_no || "NOT GENERATED"}</span>
        </div>

        {record.status == "retake" && (
          <div
            style={{
              display: "flex",
            }}
          >
            <span
              style={{
                width: 120,
                fontWeight: "bold",
              }}
            >
              Retake Count:{" "}
            </span>
            <span>{record.retake_count}</span>
          </div>
        )}
      </div>
    );
  };

  const handleConfirm = async (record) => {
    const payload = {
      moduleId: record?.id,
    };

    // console.log("the payload", payload);
    const res = await removeModule({
      variables: payload,
    });

    if (res.data.remove_module) {
      messageApi.open({
        type: "success",
        content: res.data.remove_module.message,
      });
    }
  };

  const expandedRowRender = (record) => {
    let columns = [
      {
        title: "Action",
        dataIndex: "action",
        ellipsis: true,
        width: "12%",
        render: (text, record, index) => (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Space size="middle">
              <Popconfirm
                zIndex={999999}
                title="Remove Course Unit"
                description="Are you sure to remove this course unit?"
                // onConfirm={(e) => confirm(e, record)}
                onConfirm={(e) => handleConfirm(record)}
                // onCancel={cancel}
                okText="Yes"
                okButtonProps={{
                  style: {
                    backgroundColor: "dodgerblue",
                  },
                }}
                cancelText="No"
              >
                <Button
                  size="small"
                  danger
                  // onClick={() => handleRowDelete(record)}
                  icon={<Trash size={15} />}
                />
              </Popconfirm>
            </Space>
          </div>
        ),
      },
      {
        title: "#",
        dataIndex: "#",
        width: "8%",
        render: (text, record, index) => index + 1,
      },
      {
        title: "Code",
        dataIndex: "course_unit_code",
        width: "12%",
        ellipsis: true,
        render: (text, record) => (
          <Typography.Text
            style={{
              fontSize: 13,
            }}
          >
            {record.course_unit?.course_unit_code}
          </Typography.Text>
        ),
        // render: (text, record, index) => record.course_unit?.course_unit_code,
      },
      {
        title: "Course unit title",
        dataIndex: "course_unit_title",
        width: "50%",
        ellipsis: true,

        render: (text, record) => (
          <Typography.Text
            style={{
              fontSize: 13,
            }}
          >
            {record.course_unit?.course_unit_title}
          </Typography.Text>
        ),
      },

      {
        title: "Status",
        dataIndex: "status",
        width: "15%",

        render: (text, record) => (
          <Typography.Text
            style={{
              fontSize: 13,
            }}
          >
            {text.toUpperCase()}
          </Typography.Text>
        ),
        ellipsis: true,
      },
      {
        title: "Level",
        dataIndex: "course_unit_level",
        width: "15%",

        render: (text, record) => (
          <Typography.Text
            style={{
              fontSize: 13,
            }}
          >
            {record.course_unit?.course_unit_level}
          </Typography.Text>
        ),
        ellipsis: true,
      },
      {
        title: "Paid",
        dataIndex: "paid",
        width: "10%",
        render: (text, record, index) => {
          const invoice_record = studentFile?.invoices.filter(
            (inv) => inv.invoice_no == record.invoice_no
          );

          if (invoice_record[0]?.status == "paid") {
            return (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  size="small"
                  //   danger
                  ghost
                  type="primary"
                  // onClick={() => handleRowDelete(record)}
                  icon={
                    <CheckCheck
                      color="green"
                      style={{
                        fontWeight: "bold",
                      }}
                    />
                  }
                />
              </div>
            );
          } else {
            return (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  size="small"
                  danger
                  // onClick={() => handleRowDelete(record)}
                  icon={<XIcon color="red" />}
                />
              </div>
            );
          }
        },
      },
      {
        title: "CU",
        dataIndex: "credit_units",
        width: "10%",
        render: (text, record, index) => record.course_unit?.credit_units,
        ellipsis: true,
      },
    ];

    if (record.key == "normal") {
      // dont show the paid column
      columns = columns.filter((column) => column.dataIndex !== "paid");
    } else {
      columns = columns.filter(
        (column) => column.dataIndex !== "course_unit_level"
      );
    }

    let newArr = selectedModules.filter((m) => m.status === record.key);

    if (record.key == "retakes_and_missed") {
      newArr = selectedModules.filter(
        (m) => m.status === "retake" || m.status === "missed"
      );
    }

    // console.log("record", record);
    return (
      <ConfigProvider
        theme={{
          components: {
            Table: {
              // borderColor: "lightgray",
              borderRadius: 0,
              headerBorderRadius: 0,
            },
          },
        }}
      >
        <Table
          size="middle"
          rowKey={"id"}
          bordered
          loading={loading || removeModule}
          dataSource={newArr}
          expandable={{
            expandedRowRender:
              record.key === "retakes_and_missed"
                ? expandedRowRender2
                : undefined,
          }}
          columns={columns}
          pagination={false}
          scroll={{
            y: "calc(100vh - 340px)",
          }}
        />
      </ConfigProvider>
    );
  };

  const outerColumns = [
    {
      title: "Paper Category",
      dataIndex: "normal",
      key: "normal",
      render: (text, record) => (
        <span
          style={{
            color: "dodgerblue",
            fontWeight: "600",
          }}
        >
          {record.title}
        </span>
      ),
    },
    // {
    //   title: "Semester",
    //   dataIndex: "course_unit_sem",
    //   key: "sem",
    //   render: (text, record) => `Semester ${record.course_unit_sem}`,
    // },
  ];

  const normalPapers = selectedModules.filter((m) => m.status == "normal");
  const retakeAndMissedPapers = selectedModules.filter(
    (m) => m.status == "retake" || m.status == "missed"
  );
  let outerData = [];

  if (normalPapers.length > 0)
    outerData.push({
      id: 1,
      title: "Normal Papers",
      key: "normal",
    });

  if (retakeAndMissedPapers.length > 0)
    outerData.push({
      id: 2,
      title: "Retakes And Missed Papers",
      key: "retakes_and_missed",
    });

  return (
    <div
      style={{
        backgroundColor: "#fff",
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
          padding: 7.3,
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
          Selected Modules
        </Typography.Title>

        <div>
          <Space>
            <Button
              size="small"
              ghost
              type="primary"
              onClick={() =>
                refetch({
                  studentNo: studentFile?.student_no,
                  studyYear: parseInt(
                    studentFile?.current_info?.recent_enrollment?.study_yr
                  ),
                  sem: parseInt(
                    studentFile?.current_info?.recent_enrollment?.sem
                  ),
                })
              }
              icon={<RefreshCcw size={15} />}
            >
              Refresh
            </Button>
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
              },
            },
          }}
        >
          <Table
            columns={outerColumns} // Outer table has only one column with colSpan
            dataSource={outerData}
            bordered
            pagination={false}
            showHeader={false}
            loading={loading}
            size="middle"
            expandable={{
              expandedRowRender, // Inner table will appear when expanded
              // defaultExpandedRowKeys, // Expand rows by default
              expandedRowKeys: [1, 2],
              //   onExpand: (expanded, record) => {
              //     // console.log("key", record);
              //     dispatch(
              //       setDefaultExpandedModuleRowKeys(
              //         expanded
              //           ? [
              //               ...expandedKeys,
              //               `${record.course_unit_year}-${record.course_unit_sem}`,
              //             ]
              //           : expandedKeys.filter(
              //               (key) =>
              //                 key !==
              //                 `${record.course_unit_year}-${record.course_unit_sem}`
              //             )
              //       )
              //     );
              //   },
            }}
            rowKey={"id"}
            style={{
              width: "100%",
              borderColor: "lightgray",
              //   borderTopColor: "gray",
              borderWidth: 1,
              borderRadius: 0,
            }}
            scroll={{
              y: "calc(100vh - 190px)",
            }}
          />
        </ConfigProvider>
      </div>
    </div>
  );
}

export default SelectedModules;
