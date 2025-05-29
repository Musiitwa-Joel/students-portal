import { gql } from "@apollo/client";

const LOGIN = gql`
  mutation studentPortalLogin($userId: String!, $password: String!) {
    studentPortalLogin(user_id: $userId, password: $password) {
      token
    }
  }
`;

const CHANGE_STD_PWD = gql`
  mutation ChangeStdPwd($password: String!) {
    changeStdPwd(password: $password) {
      message
      success
    }
  }
`;

const SAVE_STD_CREDENTIALS = gql`
  mutation SaveStdCredentials($phoneNo: String!, $email: String!) {
    saveStdCredentials(phone_no: $phoneNo, email: $email) {
      message
      success
    }
  }
`;

const GENERATE_PRT = gql`
  mutation generatePRT($amount: Int!, $type: String!, $invoices: String) {
    generatePRT(amount: $amount, type: $type, invoices: $invoices) {
      student_no
      prt
      amount
      allocations
      prt_expiry
    }
  }
`;

const REMOVE_MODULE = gql`
  mutation removeModule($moduleId: String!) {
    remove_module(module_id: $moduleId) {
      message
      success
    }
  }
`;

const SELF_ENROLLMENT = gql`
  mutation selfEnrollment(
    $studyYr: String!
    $sem: String!
    $enrollmentStatus: String!
  ) {
    selfEnrollment(
      study_yr: $studyYr
      sem: $sem
      enrollment_status: $enrollmentStatus
    ) {
      success
      message
    }
  }
`;

const SELF_REGISTER = gql`
  mutation selfRegister($enrollmentToken: String!) {
    selfRegister(enrollment_token: $enrollmentToken) {
      message
      success
    }
  }
`;

const VERIFY_STUDENT_CREDENTIALS = gql`
  mutation verify_student_credentials($payload: CredentialsPayload) {
    verify_student_credentials(payload: $payload) {
      message
      success
    }
  }
`;

const RESEND_CLEARANCE_FORM = gql`
  mutation resendClearanceForm {
    resendClearanceForm {
      message
      success
    }
  }
`;

export {
  LOGIN,
  CHANGE_STD_PWD,
  SAVE_STD_CREDENTIALS,
  GENERATE_PRT,
  REMOVE_MODULE,
  SELF_ENROLLMENT,
  SELF_REGISTER,
  VERIFY_STUDENT_CREDENTIALS,
  RESEND_CLEARANCE_FORM,
};
