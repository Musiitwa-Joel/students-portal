import { useState } from "react";
import { theme } from "antd";

const ModuleTable = ({ onCourseSelect }) => {
  const [selectedCourses, setSelectedCourses] = useState({});
  const [hoveredRow, setHoveredRow] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { token } = theme.useToken();
  const data = [
    {
      courses: [
        {
          code: "EMT7201",
          title: "ADVANCED ENGINEERING MATHEMATICS",
          cu: 9,
          category: "CORE",
          status: "NORMAL",
          gdPoint: 3.5,
          remark: "NP",
        },
        {
          code: "MEC7118",
          title: "THERMO-CHEMICAL ENERGY ENGINEERING",
          cu: 5,
          category: "ELECTIVE",
          status: "NORMAL",
          gdPoint: 4.5,
          remark: "NP",
        },
        {
          code: "TID7103",
          title: "STRATEGIC MANAGEMENT",
          cu: 7,
          category: "CORE",
          status: "NORMAL",
          gdPoint: 4.5,
          remark: "NP",
        },
        {
          code: "TID7104",
          title: "ADVANCED RESEARCH METHODS FOR SCIENCE AND TECHNOLOGY",
          cu: 3,
          category: "CORE",
          status: "RETAKE",
          gdPoint: 3.5,
          remark: "NP",
        },
        {
          code: "TID7107",
          title: "PROCESS IMPROVEMENT AND MAINTENANCE ENGINEERING",
          cu: 2,
          category: "CORE",
          status: "NORMAL",
          gdPoint: 5.0,
          remark: "NP",
        },
      ],
    },
  ];

  const handleCheckboxChange = (course) => {
    setSelectedCourses((prevSelected) => ({
      ...prevSelected,
      [course.code]: !prevSelected[course.code],
    }));
    setSelectedCourse(course);
    setIsModalVisible(true);
  };

  const handleMouseEnter = (courseCode) => {
    setHoveredRow(courseCode);
  };

  const handleMouseLeave = () => {
    setHoveredRow(null);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleStatusChange = (value) => {
    if (selectedCourse) {
      onCourseSelect(selectedCourse, value);
    }
    setIsModalVisible(false);
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: "Arial, sans-serif",
    fontSize: "10px",
    fontWeight: "bold",
  };

  const thStyle = {
    border: `1px dotted ${token.colorPrimary}`,
    textAlign: "left",
    padding: "4px",
    // backgroundColor: "blue",
    whiteSpace: "nowrap",
  };

  const tdStyle = {
    border: `1px dotted ${token.colorPrime}`,
    textAlign: "left",
    // color: "red",
    padding: "4px",
    whiteSpace: "nowrap",
  };

  const semesterTitleStyle = {
    fontWeight: "bold",
    margin: "10px 0 5px",
    fontSize: "12px",
  };

  const remarkRowStyle = {
    backgroundColor: "#f2f2f2",
  };

  const getRowStyle = (courseCode) => {
    const isSelected = !!selectedCourses[courseCode];
    const isHovered = hoveredRow === courseCode;

    return {
      backgroundColor: isSelected
        ? "#d1e7dd"
        : isHovered
        ? "#f8f9fa"
        : "transparent",
    };
  };

  return (
    <div style={{ padding: "0px", width: "100%" }}>
      {data.map((semesterData, index) => (
        <div key={index}>
          <div style={semesterTitleStyle}>{semesterData.semester}</div>
          <table style={tableStyle}>
            <thead>
              <tr style={{ color: token.colorPrimary }}>
                {/* <th style={thStyle}>###</th> */}
                <th style={thStyle}>CODE</th>
                <th style={thStyle}>MODULE TITLE</th>
                <th style={thStyle}>CU</th>
                <th style={thStyle}>CATEGORY</th>
                <th style={thStyle}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {semesterData.courses.map((course, courseIndex) => (
                <tr
                  key={courseIndex}
                  style={getRowStyle(course.code)}
                  onMouseEnter={() => handleMouseEnter(course.code)}
                  onMouseLeave={handleMouseLeave}
                >
                  <td style={tdStyle}>
                    <span>{course.code}</span>
                  </td>
                  <td style={tdStyle}>
                    <span>{course.title}</span>
                  </td>
                  <td style={tdStyle}>
                    <span>{course.cu}</span>
                  </td>
                  <td style={tdStyle}>
                    <span>{course.category}</span>
                  </td>
                  <td style={tdStyle}>
                    <span>{course.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ModuleTable;
