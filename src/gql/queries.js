import { gql } from "@apollo/client";

const LOAD_STUDENT_FILE = gql`
  query My_details {
    my_details {
      id
      form_no
      student_no
      registration_no
      biodata {
        surname
        other_names
        is_verified
        marital_status
        nationality {
          id
          nationality_category
          nationality_title
        }
        email
        gender
        date_of_birth
        district_of_birth
        district_of_origin
        phone_no
        place_of_residence
        religion
        verified_credentials
        credentials_verified_on
        credentials_verified_by
      }
      intake_id
      intake_title
      campus_title
      study_time_title
      course_details {
        id
        version_title
        course {
          id
          course_code
          course_duration
          course_title
          school {
            id
            school_code
            school_title
            college {
              id
              college_code
              college_title
            }
          }
        }
      }
      entry_acc_yr_title
      entry_study_yr
      enrollment_history {
        id
        enrollment_token
        study_yr
        sem
        acc_yr
        datetime
        enrollment_status {
          id
          title
          color_code
        }
        enrolled_by
        acc_yr_title
        invoiced
        enrolled_by_type
      }
      registration_history {
        id
        acc_yr_id
        acc_yr_title
        date
        study_yr
        student_no
        sem
        enrollment_token
        registration_token
        reg_comments
        provisional_reason
        provisional_expiry
        provisional
        de_registered_reason
        de_registered
        registered_user {
          title
          staff_name
          id
        }
        registered_type
      }
      invoices {
        id
        student_id
        student_no
        invoice_no
        line_items {
          line_item_id
          student_no
          item_name
          item_code
          invoice_no
          date
          item_comments
          item_description
          quantity
          unit_amount
        }

        currency_code
        amount_paid
        amount_due
        academic_year
        due_date
        study_year
        total_amount
        total_credit
        semester
        status
        paid
        reference
        narration
        invoice_type
        invoice_date
        invoice_category
        total_dps
        total_ppas
        voided
        voided_by
        voided_on
        voided_reason
        txns {
          tredumo_txn_id
          invoice_no
          student_no
          prt
          amount
          allocation_date
          acc_yr
          is_dp
          is_pp_allocation
          posted_by
        }
      }
      current_info {
        recent_enrollment {
          id
          datetime
          study_yr
          sem
          acc_yr
          acc_yr_title
          enrollment_token
        }
        enrollment_status
        current_acc_yr
        account_balance
        true_sem
        true_study_yr
        acc_yr_id
        progress
        active_sem_id
        registration_status
        enrollment_types {
          id
          title
        }
      }
      status
      is_on_sponsorship
      is_resident
      graduation_status
    }
  }
`;

const GET_COURSE_UNITS = gql`
  query getCourseUnits($courseVersionId: String!) {
    course_units(course_version_id: $courseVersionId) {
      id
      course_unit_code
      course_unit_title
      credit_units
      course_unit_year
      course_unit_sem
      course_unit_level
    }
  }
`;

const REGISTER_MODULE = gql`
  mutation std_module_registration($payload: StdRegisterModuleInput!) {
    std_module_registration(payload: $payload) {
      message
      success
    }
  }
`;

const GET_STUDENT_SELECTED_COURSEUNITS = gql`
  query getStudentSelectedModules($studyYear: Int!, $sem: Int!) {
    student_selected_modules(study_year: $studyYear, sem: $sem) {
      id
      student_no
      study_year
      semester
      status
      paid
      retake_count
      invoice_no
      course_unit {
        course_unit_code
        course_unit_level
        course_unit_title
        credit_units
      }
    }
  }
`;

const GET_MY_RESULTS = gql`
  query myResults {
    my_results {
      id
      student_no
      biodata {
        surname
        other_names
        date_of_birth
        gender
      }
      registration_no
      course_details {
        course {
          course_code
          course_title
          school {
            school_code
            school_title
          }
        }
      }
      student_marks {
        student_no
        acc_yr_title
        course_unit_code
        course_unit_title
        study_yr
        semester
        yrsem
        coursework
        exam
        credit_units
        final_mark
        grade
        grade_point
        GPA
        CGPA
        TCU
        CTCU
        CTWS
        remarks
      }
    }
  }
`;

const GET_GRADUATION_SECTIONS = gql`
  query Graduation_sections {
    graduation_sections {
      graduation_details {
        acc_yr_title
        graduation_date
      }
      graduation_sections {
        id
        title
        instructions
        logs {
          id
          student_no
          status
          section_id
          date
          cleared_by
          cleared_by_user
          rejection_logs {
            clearance_id
            reject_reason
            rejected_at
            rejected_by
            rejected_by_user
          }
        }
      }
    }
  }
`;

const CHECK_GRADUATION_ELLIGIBILITY = gql`
  query check_graduation_elligibility {
    check_graduation_elligibility {
      is_elligible
      has_retakes
    }
  }
`;

export {
  LOAD_STUDENT_FILE,
  GET_COURSE_UNITS,
  REGISTER_MODULE,
  GET_STUDENT_SELECTED_COURSEUNITS,
  GET_MY_RESULTS,
  GET_GRADUATION_SECTIONS,
  CHECK_GRADUATION_ELLIGIBILITY,
};
