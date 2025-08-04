import React, { useContext } from "react";
import { Image, QRCode, theme } from "antd";
import styled from "styled-components";
import NkumbaLogo from "./nkumba.svg";
import ResultsComponent from "./ResultsComponent";
import AppContext from "../../context/appContext";

const Container = styled.div`
  padding: 10px;
  width: 100%;
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
`;

const InfoContainer = styled.div`
  padding-left: 16px;
  padding-right: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 0px;
`;

const ImageSection = styled.div`
  margin-right: 20px;
  margin-bottom: 10px;
`;

const InfoSection = styled.div`
  flex: 1;
  margin-right: 20px;
  margin-bottom: 10px;
  min-width: 200px;
`;

const HideOnMobile = styled.div`
  @media (max-width: 768px) {
    display: none !important;
  }
`;

const ScrollableResults = styled.div`
  flex: 1;
  overflow: auto;
`;

const ResultsTable = () => {
  const { token } = theme.useToken();
  const { studentFile } = useContext(AppContext);

  const getResidenceStatus = (isResident) => {
    return Boolean(isResident) ? "RESIDENT" : "NON RESIDENT";
  };

  const getGender = (genderCode) => {
    switch (genderCode) {
      case "M":
        return "MALE";
      case "F":
        return "FEMALE";
      default:
        return "UNKNOWN"; // Fallback for unexpected values
    }
  };

  const getProgressStatus = (progress) => {
    return progress === "NORMAL" ? "NORMAL PROGRESS" : progress;
  };

  return (
    <Container>
      <InfoContainer>
        {/* Image Section */}
        <ImageSection>
          <Image
            preview={false}
            width={80}
            src={`https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=${studentFile.student_no}`}
            style={{ borderRadius: "5px" }}
          />
        </ImageSection>

        {/* Student Info Section */}
        <InfoSection style={{ color: token.colorPrimary }}>
          <div style={{ fontWeight: "bold", fontSize: "14px" }}>
            {`${studentFile.biodata.surname} ${studentFile.biodata.other_names}`}
          </div>
          <div style={{ fontWeight: "bold", fontSize: "14px" }}>
            {studentFile.student_no}
          </div>
          <div style={{ fontWeight: "bold", fontSize: "14px" }}>
            {studentFile.registration_no}
          </div>
          <div style={{ fontWeight: "bold", fontSize: "14px" }}>
            {getGender(studentFile.biodata.gender)}
          </div>
        </InfoSection>

        {/* Faculty and Program Info Section */}
        <HideOnMobile as={InfoSection} style={{ color: token.colorPrimary }}>
          <div style={{ fontWeight: "bold", fontSize: "14px" }}>
            FACULTY: {studentFile.course_details.course.school.school_title}
          </div>
          <div style={{ fontWeight: "bold", fontSize: "14px" }}>
            ({studentFile.course_details.course.course_code}){" "}
            {studentFile.course_details.course.course_title}
          </div>
          <div style={{ fontWeight: "bold", fontSize: "14px" }}>
            {getResidenceStatus(studentFile.is_resident)}
          </div>
          <div style={{ fontWeight: "bold", fontSize: "14px" }}>
            {getProgressStatus(studentFile.current_info.progress)}
          </div>
        </HideOnMobile>

        {/* QR Code Section */}
        <HideOnMobile>
          <QRCode
            icon={NkumbaLogo}
            iconSize={20}
            bordered={false}
            color={token.colorPrimary}
            size={80}
            value={`https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=${studentFile.student_no}`}
            iconBgStyle={{ fill: "white" }}
          />
        </HideOnMobile>
      </InfoContainer>

      {/* Scrollable Results Component */}
      <ScrollableResults>
        <ResultsComponent />
      </ScrollableResults>
    </Container>
  );
};

export default ResultsTable;
