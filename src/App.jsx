// src/App.jsx
import React, { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import AppContext from "./context/appContext";
import ChangePasswordModal from "./auth/ChangePasswordModal";
import VerifyDetailsModal from "./pages/startup/VerifyDetailsModal";
import { message, Spin } from "antd";
import { useQuery } from "@apollo/client";
import { LOAD_STUDENT_FILE } from "./gql/queries";
import EnrollmentModal from "./pages/enrollment_modal/EnrollmentModal";

function App() {
  const [route, setRoute] = useState(null);
  const [studentFile, setStudentFile] = useState(null);
  const [paymentSlipVisible, setPaymentSlipVisible] = useState(null);
  const [tokenRes, setTokenRes] = useState(null);
  const [enrollModalVisible, setEnrollModalVisible] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [refetchStudentFile, setRefetchStudentFile] = useState(false);
  const [
    graduationVerificationModalVisible,
    setGraduationVerificationModalVisible,
  ] = useState(false);

  const { error, loading, data, refetch } = useQuery(LOAD_STUDENT_FILE, {
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (refetchStudentFile) {
      refetch();
      setRefetchStudentFile(false);
    }
  }, [refetchStudentFile]);

  useEffect(() => {
    if (error) {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setStudentFile(data.my_details);
      setEnrollModalVisible(
        data.my_details?.current_info?.enrollment_status !== "Enrolled"
      );
    }
  }, [data]);

  return (
    <AppContext.Provider
      value={{
        route,
        setRoute,
        studentFile,
        setStudentFile,
        paymentSlipVisible,
        setPaymentSlipVisible,
        tokenRes,
        setTokenRes,
        enrollModalVisible,
        setEnrollModalVisible,
        refetchStudentFile,
        setRefetchStudentFile,
        graduationVerificationModalVisible,
        setGraduationVerificationModalVisible,
      }}
    >
      {contextHolder}
      <Spin
        tip="Loading Student File"
        size="middle"
        spinning={loading}
        fullscreen
      />
      <Dashboard />

      {!loading && (
        <>
          <ChangePasswordModal />
          <VerifyDetailsModal />
          <EnrollmentModal />
        </>
      )}
    </AppContext.Provider>
  );
}

export default App;
