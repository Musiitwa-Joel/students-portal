import { useState, useEffect, useContext, useMemo } from "react";
import {
  Card,
  Button,
  Badge,
  Tag,
  Input,
  Select,
  DatePicker,
  Drawer,
  Steps,
  Form,
  Divider,
  Avatar,
  Alert,
  Result,
  Progress,
  Tooltip,
  Radio,
  Modal,
  Spin,
  message,
} from "antd";
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Bell,
  Filter,
  Search,
  AlertTriangle,
  Info,
  BookOpen,
  Check,
  DollarSign,
  UserPlus,
  CheckCircle,
  XCircle,
  Phone,
  CreditCard,
  Copy,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import dayjs from "dayjs";
import AppContext from "../../context/appContext";
import { useQuery } from "@apollo/client";
import { UPCOMING_ONGOING_PAST_ELECTIONS } from "../../gql/queries";

// Mock data for potential seconders
const potentialSeconders = [
  {
    id: 1,
    name: "Nakato Rebecca",
    studentId: "2000100122",
    faculty: "Business Administration",
    image:
      "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100122",
  },
];

// Political colors options
const colorOptions = [
  { name: "Gold", value: "#FFD700" },
  { name: "Red", value: "#DC143C" },
  { name: "Blue", value: "#1E90FF" },
  { name: "Green", value: "#32CD32" },
  { name: "Purple", value: "#8A2BE2" },
  { name: "Orange", value: "#FF8C00" },
  { name: "Pink", value: "#FF69B4" },
  { name: "Teal", value: "#008080" },
  { name: "Brown", value: "#A52A2A" },
  { name: "Navy", value: "#000080" },
  { name: "Lime", value: "#32CD32" },
  { name: "Magenta", value: "#FF00FF" },
  { name: "Cyan", value: "#00FFFF" },
  { name: "Olive", value: "#808000" },
  { name: "Maroon", value: "#800000" },
  { name: "Coral", value: "#FF7F50" },
  { name: "Indigo", value: "#4B0082" },
  { name: "Turquoise", value: "#40E0D0" },
  { name: "Violet", value: "#EE82EE" },
  { name: "Black", value: "#000000" },
];

// Mobile money providers
const mobileMoneyProviders = [
  { name: "MTN Mobile Money", value: "mtn", color: "#FFCC00" },
  { name: "Airtel Money", value: "airtel", color: "#FF0000" },
];

export default function UpcomingElections() {
  const { studentFile } = useContext(AppContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [processedElections, setProcessedElections] = useState([]);

  const currentStudent = {
    id: studentFile?.student_no || "",
    name: studentFile?.biodata
      ? `${studentFile.biodata.surname} ${studentFile.biodata.other_names}`
      : "",
    faculty: studentFile?.course_details?.course?.school?.school_title || "",
    cgpa: 3.8,
    hasRetakes: false,
    financialStatus: "Cleared",
    feePaid: 80,
    phoneNumber: studentFile?.biodata?.phone_no || "NOT PROVIDED",
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState([null, null]);
  const [expandedElection, setExpandedElection] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedSeconders, setSelectedSeconders] = useState([]);
  const [searchSeconders, setSearchSeconders] = useState("");
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [currentElection, setCurrentElection] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [manifesto, setManifesto] = useState("");
  const [position, setPosition] = useState("");
  // console.log(studentFile);

  // Payment related states
  const [paymentMethod, setPaymentMethod] = useState("mtn");
  const [phoneNumber, setPhoneNumber] = useState(currentStudent.phoneNumber);
  const [paymentStatus, setPaymentStatus] = useState("pending"); // pending, processing, completed, failed
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentVerificationCode, setPaymentVerificationCode] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [paymentAmount] = useState(1000000); // 1,000,000 UGX
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [timers, setTimers] = useState({}); // Store timer intervals

  const studentSchoolCode =
    studentFile?.course_details?.course?.school?.school_code;
  const studentSchoolId = studentFile?.course_details?.course?.school?.id;
  const studentCampusId = studentFile?.campus_id;
  console.log(studentFile);

  const apiFilters = useMemo(() => {
    const filters = {};

    // Add school code filter if available
    if (studentSchoolId) {
      filters.school_id = studentSchoolId;
      console.log("Adding school_id filter:", studentSchoolId);
    } else {
      console.log("No school_id found for student");
    }

    // Add campus filter if available
    if (studentCampusId) {
      filters.campus_id = studentCampusId;
      console.log("Adding campus_id filter:", studentCampusId);
    } else {
      console.log("No campus_id found for student");
    }
    filters.is_active = true;

    // You can add other filters based on student data
    // filters.category_id = null; // or specific category
    // filters.acc_yr_id = null; // or current academic year
    // filters.is_active = true; // only active elections

    return filters;
  }, [studentCampusId, studentSchoolId]);
  console.log("API Filters:", apiFilters);
  console.log("Student Campus ID:", studentCampusId);
  console.log("Student School ID:", studentSchoolId);

  const { error, loading, data } = useQuery(UPCOMING_ONGOING_PAST_ELECTIONS, {
    variables: {
      filters: apiFilters,
    },
    // Optional: skip query if no student data available
    // skip: !studentFile || !studentSchoolId,
  });

  // Add this useEffect to update time every minute when there are same-day elections
  useEffect(() => {
    const hasSameDayElections = processedElections.some((election) => {
      const diffInDays = election.registrationDeadline.diff(currentTime, "day");
      const diffInMinutes = election.registrationDeadline.diff(
        currentTime,
        "minute"
      );
      return diffInDays === 0 && diffInMinutes > 0;
    });

    if (hasSameDayElections) {
      const interval = setInterval(() => {
        setCurrentTime(dayjs());
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [processedElections, currentTime]);

  // Process GraphQL data
  useEffect(() => {
    if (data?.upcoming_elections) {
      const elections = data.upcoming_elections.map((election) => ({
        id: election.id,
        title: `${election.election_name} - ${election.academic_year_name}`,
        startDate: dayjs(election.election_date),
        acc_yr: election.academic_year_name,
        registrationDeadline: dayjs(election.registration_end_time),
        location: "ONLINE",
        description: `Election for ${election.election_name} - ${election.academic_year_name}`,
        eligibleVoters:
          election.schools && election.schools.length > 0
            ? `${election.schools
                .map((school) => school.school_title)
                .join(", ")}`
            : "All registered students",
        registrationOpen: dayjs().isBefore(
          dayjs(election.registration_end_time)
        ),
        candidates: [
          {
            id: 1,
            name: "Namugwanya Sarah",
            party: "UYD",
            manifesto: "Improve student welfare and accommodation",
            image:
              "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
            color: "#FFD700",
            registered: true,
          },
          {
            id: 2,
            name: "Mukasa David",
            party: "Independent",
            manifesto: "Better internet and library facilities",
            image:
              "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
            color: "#000000",
            registered: true,
          },
        ],
        // Additional fields from GraphQL
        categoryId: election.category_id,
        electionCode: election.election_code,
        electionStartTime: election.election_start_time,
        electionEndTime: election.election_end_time,
        registrationStartTime: election.registration_start_time,
        requiredTuitionPercentage: election.required_tuition_percentage,
        nominationFee: election.nomination_fee,
        campusId: election.campus_title,
        schools: election.schools,
      }));
      setProcessedElections(elections);
    }
  }, [data]);
  console.log(data, "Processed Elections:", processedElections);

  // Generate a random payment reference when the component mounts
  useEffect(() => {
    const generateReference = () => {
      const prefix = "NKU-FEE-";
      const randomNum = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0");
      return `${prefix}${randomNum}`;
    };
    setPaymentReference(generateReference());
  }, []);

  useEffect(() => {
    if (error) {
      messageApi.open({
        type: "error",
        content: error.message,
      });
    }
  }, [error, messageApi]);

  const filteredElections = processedElections.filter((election) => {
    const matchesSearch =
      election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      election.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      election.acc_yr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (election.candidates &&
        election.candidates.some(
          (candidate) =>
            candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.party.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    const matchesFilter =
      filterType === "all" ||
      (filterType === "registration-open" && election.registrationOpen) ||
      (filterType === "with-candidates" &&
        election.candidates &&
        election.candidates.length > 0);

    const matchesDateRange =
      !dateRange[0] ||
      !dateRange[1] ||
      (election.startDate.isAfter(dateRange[0]) &&
        election.startDate.isBefore(dateRange[1]));

    return matchesSearch && matchesFilter && matchesDateRange;
  });

  const hasElectionsButNotEligible = false;

  // Function to calculate and format time remaining until election
  // const getTimeRemaining = (date) => {
  //   const now = currentTime;
  //   const diffInSeconds = date.diff(now, "second");

  //   if (diffInSeconds < 0) {
  //     return "Election has started";
  //   }

  //   const days = Math.floor(diffInSeconds / (24 * 60 * 60));
  //   const hours = Math.floor((diffInSeconds % (24 * 60 * 60)) / (60 * 60));
  //   const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60);
  //   const seconds = diffInSeconds % 60;

  //   // If more than 7 days, just show days
  //   if (days > 7) {
  //     return `${days} day${days !== 1 ? "s" : ""} until election`;
  //   }

  //   // If more than 1 day, show days and hours
  //   if (days > 0) {
  //     return `${days}d ${hours}h until election`;
  //   }

  //   // If same day, show hours, minutes, seconds
  //   if (hours > 0) {
  //     return `${hours}h ${minutes}m ${seconds}s until election`;
  //   }

  //   // If less than an hour
  //   if (minutes > 0) {
  //     return `${minutes}m ${seconds}s until election`;
  //   }

  //   // If less than a minute
  //   return `${seconds}s until election`;
  // };

  // Custom hook for live countdown
  const useLiveCountdown = (targetDate) => {
    const [timeRemaining, setTimeRemaining] = useState("");
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
      const calculateTimeRemaining = () => {
        const now = dayjs();
        const target = dayjs(targetDate);
        const diffInSeconds = target.diff(now, "second");

        if (diffInSeconds <= 0) {
          setTimeRemaining("Election has started");
          setIsActive(false);
          return;
        }

        setIsActive(true);

        const days = Math.floor(diffInSeconds / (24 * 60 * 60));
        const hours = Math.floor((diffInSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60);
        const seconds = diffInSeconds % 60;

        // Format based on time remaining
        if (days > 7) {
          setTimeRemaining(
            `${days} day${days !== 1 ? "s" : ""} until election`
          );
        } else if (days > 0) {
          setTimeRemaining(`${days}d ${hours}h ${minutes}m until election`);
        } else if (hours > 0) {
          setTimeRemaining(`${hours}h ${minutes}m ${seconds}s until election`);
        } else if (minutes > 0) {
          setTimeRemaining(`${minutes}m ${seconds}s until election`);
        } else {
          setTimeRemaining(`${seconds}s until election`);
        }
      };

      // Calculate immediately
      calculateTimeRemaining();

      // Set up interval
      const interval = setInterval(calculateTimeRemaining, 1000);

      return () => clearInterval(interval);
    }, [targetDate]);

    return { timeRemaining, isActive };
  };

  // Live countdown display component
  const LiveCountdownDisplay = ({ targetDate }) => {
    const { timeRemaining, isActive } = useLiveCountdown(targetDate);

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "#6B7280",
          fontSize: "14px",
        }}
      >
        <Clock style={{ width: "14px", height: "14px" }} />
        <span
          style={{
            fontFamily: "monospace", // Makes numbers align better
            fontWeight: isActive ? "600" : "normal",
            color: isActive ? "#EF4444" : "#6B7280", // Red when active countdown
          }}
        >
          {timeRemaining}
        </span>
        {isActive && (
          <span
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: "#EF4444",
              borderRadius: "50%",
              animation: "pulse 1s infinite",
            }}
          />
        )}
      </div>
    );
  };

  // Add this to your component or CSS file
  const pulseAnimation = `
@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
`;

  // Add the style tag to your component
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = pulseAnimation;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const DigitalCountdown = ({ targetDate }) => {
    const [timeData, setTimeData] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isActive: false,
    });

    useEffect(() => {
      const updateCountdown = () => {
        const now = dayjs();
        const target = dayjs(targetDate);
        const diffInSeconds = target.diff(now, "second");

        if (diffInSeconds <= 0) {
          setTimeData({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isActive: false,
          });
          return;
        }

        const days = Math.floor(diffInSeconds / (24 * 60 * 60));
        const hours = Math.floor((diffInSeconds % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60);
        const seconds = diffInSeconds % 60;

        setTimeData({
          days,
          hours,
          minutes,
          seconds,
          isActive: true,
        });
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);

      return () => clearInterval(interval);
    }, [targetDate]);

    const digitStyle = {
      backgroundColor: "#1F2937",
      color: "#FFD700",
      padding: "4px 8px",
      borderRadius: "4px",
      fontFamily: "monospace",
      fontSize: "16px",
      fontWeight: "bold",
      minWidth: "30px",
      textAlign: "center",
    };

    const labelStyle = {
      fontSize: "10px",
      color: "#6B7280",
      textAlign: "center",
    };

    if (!timeData.isActive) {
      return <span style={{ color: "#10B981" }}>Election Started!</span>;
    }

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* <Clock style={{ width: "16px", height: "16px", color: "#6B7280" }} /> */}

        {timeData.days > 0 && (
          <div style={{ textAlign: "center" }}>
            <div style={digitStyle}>
              {timeData.days.toString().padStart(2, "0")}
            </div>
            <div style={labelStyle}>days</div>
          </div>
        )}

        <div style={{ textAlign: "center" }}>
          <div style={digitStyle}>
            {timeData.hours.toString().padStart(2, "0")}
          </div>
          <div style={labelStyle}>hrs</div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={digitStyle}>
            {timeData.minutes.toString().padStart(2, "0")}
          </div>
          <div style={labelStyle}>min</div>
        </div>

        <div style={{ textAlign: "center" }}>
          <div style={digitStyle}>
            {timeData.seconds.toString().padStart(2, "0")}
          </div>
          <div style={labelStyle}>sec</div>
        </div>
      </div>
    );
  };

  // Function to calculate and format time remaining until registration deadline
  const getRegistrationTimeRemaining = (date) => {
    const now = currentTime; // Use state instead of dayjs()
    const diffInMinutes = date.diff(now, "minute");
    const diffInHours = date.diff(now, "hour");
    const diffInDays = date.diff(now, "day");

    if (diffInMinutes < 0) {
      return "Registration closed";
    } else if (diffInDays === 0) {
      // Same day - show live countdown
      if (diffInHours === 0) {
        return diffInMinutes <= 1
          ? "Last minute to register!"
          : `${diffInMinutes} minute${
              diffInMinutes !== 1 ? "s" : ""
            } left to register`;
      } else {
        const remainingMinutes = diffInMinutes % 60;
        if (remainingMinutes === 0) {
          return `${diffInHours} hour${
            diffInHours !== 1 ? "s" : ""
          } left to register`;
        } else {
          return `${diffInHours}h ${remainingMinutes}m left to register`;
        }
      }
    } else if (diffInDays <= 7) {
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} left to register`;
    } else {
      return `Registration closes on ${date.format("MMMM D, YYYY")}`;
    }
  };

  useEffect(() => {
    const hasSameDayElections = processedElections.some((election) => {
      const diffInDays = election.registrationDeadline.diff(currentTime, "day");
      const diffInMinutes = election.registrationDeadline.diff(
        currentTime,
        "minute"
      );
      return diffInDays === 0 && diffInMinutes > 0;
    });

    const hasFinalHourElections = processedElections.some((election) => {
      const diffInMinutes = election.registrationDeadline.diff(
        currentTime,
        "minute"
      );
      return diffInMinutes > 0 && diffInMinutes <= 60;
    });

    if (hasSameDayElections) {
      // Update every 30 seconds in final hour, every minute otherwise
      const updateInterval = hasFinalHourElections ? 30000 : 60000;

      const interval = setInterval(() => {
        setCurrentTime(dayjs());
      }, updateInterval);

      return () => clearInterval(interval);
    }
  }, [processedElections, currentTime]);

  // Function to handle opening the registration drawer
  const handleOpenRegistration = (election) => {
    setCurrentElection(election);
    setDrawerVisible(true);
    setCurrentStep(0);
    setSelectedSeconders([]);
    setRegistrationComplete(false);
    setSelectedColor(null);
    setManifesto("");
    setPosition(election.title);
    setPaymentStatus("pending");
    setPaymentCompleted(false);
  };

  // Function to handle closing the registration drawer
  const handleCloseDrawer = () => {
    setDrawerVisible(false);
  };

  // Function to handle next step in registration
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  // Function to handle previous step in registration
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // Function to handle seconder selection
  const handleSeconderSelection = (seconder) => {
    if (selectedSeconders.some((s) => s.id === seconder.id)) {
      setSelectedSeconders(
        selectedSeconders.filter((s) => s.id !== seconder.id)
      );
    } else {
      if (selectedSeconders.length < 100) {
        setSelectedSeconders([...selectedSeconders, seconder]);
      }
    }
  };

  // Function to handle form submission
  const handleSubmit = () => {
    setRegistrationComplete(true);
  };

  // Function to handle payment initiation
  const handleInitiatePayment = () => {
    setPaymentModalVisible(true);
  };

  // Function to handle payment confirmation
  const handleConfirmPayment = () => {
    setPaymentProcessing(true);
    setPaymentStatus("processing");
    // Simulate payment processing
    setTimeout(() => {
      setPaymentProcessing(false);
      setPaymentModalVisible(false);
      // Generate a random verification code
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      setPaymentVerificationCode(verificationCode);
      setPaymentStatus("completed");
      setPaymentCompleted(true);
    }, 3000);
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a notification here
  };

  // Filter seconders based on search term
  const filteredSeconders = potentialSeconders.filter(
    (seconder) =>
      seconder.name.toLowerCase().includes(searchSeconders.toLowerCase()) ||
      seconder.studentId.includes(searchSeconders) ||
      seconder.faculty.toLowerCase().includes(searchSeconders.toLowerCase())
  );

  // Check if all requirements are met
  const academicRequirementsMet =
    currentStudent.cgpa >= 3.0 && !currentStudent.hasRetakes;
  const financialRequirementsMet = currentStudent.feePaid >= 75;
  const seconderRequirementsMet = selectedSeconders.length >= 3;
  const personalDetailsMet = selectedColor !== null && manifesto.length >= 50;
  const paymentRequirementMet = paymentCompleted;

  // Calculate overall eligibility
  const isEligible =
    academicRequirementsMet &&
    financialRequirementsMet &&
    seconderRequirementsMet &&
    personalDetailsMet &&
    paymentRequirementMet;

  const containerStyle = {
    marginBottom: "24px",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "linear-gradient(to right, #FFD700, #FFD700, #FFD700)",
    padding: "16px",
    borderRadius: "8px",
    color: "#000",
    marginBottom: "24px",
  };

  const headerTextStyle = {
    fontSize: "20px",
    fontWeight: "bold",
  };

  const headerSubtitleStyle = {
    fontSize: "14px",
    opacity: "0.9",
  };

  const badgeContainerStyle = {
    backgroundColor: "white",
    padding: "8px",
    borderRadius: "50%",
  };

  const iconStyle = {
    height: "24px",
    width: "24px",
    color: "#000",
  };

  const filterContainerStyle = {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    flexWrap: "wrap",
  };

  const searchContainerStyle = {
    flex: "1",
    minWidth: "250px",
    position: "relative",
  };

  const filterSelectStyle = {
    minWidth: "150px",
  };

  const datePickerStyle = {
    minWidth: "250px",
  };

  const emptyStateStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 0",
    backgroundColor: "#F9FAFB",
    borderRadius: "8px",
    marginTop: "20px",
  };

  const cardStyle = {
    marginBottom: "20px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
    borderRadius: "8px",
    overflow: "hidden",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  };

  const cardExpandedStyle = {
    ...cardStyle,
    boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
  };

  const cardHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    borderBottom: "1px solid #E5E7EB",
  };

  const cardTitleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    margin: 0,
  };

  const cardMetaStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#6B7280",
    fontSize: "14px",
  };

  const cardContentStyle = {
    padding: "16px",
  };

  const cardActionsStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    padding: "0 16px 16px",
  };

  const infoBoxStyle = {
    backgroundColor: "#F9FAFB",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
  };

  const infoBoxTitleStyle = {
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "8px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  };

  const infoBoxContentStyle = {
    fontSize: "14px",
    color: "#4B5563",
  };

  const candidateCardStyle = {
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
    backgroundColor: "#FFFFFF",
  };

  const candidateImageStyle = {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    overflow: "hidden",
  };

  const candidateInfoStyle = {
    flex: "1",
  };

  const candidateNameStyle = {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "4px",
  };

  const candidatePartyStyle = {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    marginBottom: "4px",
  };

  const candidateManifestoStyle = {
    fontSize: "13px",
    color: "#6B7280",
  };

  const toggleEmptyButtonStyle = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: "1000",
    backgroundColor: "#FFD700",
    color: "#000",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  };

  const drawerTitleStyle = {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "16px",
  };

  const stepContentStyle = {
    marginTop: "24px",
  };

  const requirementCardStyle = {
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
    backgroundColor: "#FFFFFF",
  };

  const requirementTitleStyle = {
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const seconderCardStyle = {
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "12px",
    backgroundColor: "#FFFFFF",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  };

  const seconderCardSelectedStyle = {
    ...seconderCardStyle,
    backgroundColor: "#F0FDF4",
    borderColor: "#10B981",
  };

  const colorBoxStyle = {
    width: "36px",
    height: "36px",
    borderRadius: "4px",
    cursor: "pointer",
    border: "2px solid transparent",
    transition: "transform 0.2s ease, border-color 0.2s ease",
    margin: "4px",
  };

  const colorBoxSelectedStyle = {
    ...colorBoxStyle,
    transform: "scale(1.1)",
    border: "2px solid #000",
  };

  const statusCardStyle = {
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
    backgroundColor: "#FFFFFF",
  };

  const statusItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #F3F4F6",
  };

  const paymentCardStyle = {
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "16px",
    backgroundColor: "#FFFFFF",
  };

  const paymentInfoStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #F3F4F6",
  };

  const paymentMethodCardStyle = {
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  };

  const paymentMethodCardSelectedStyle = {
    ...paymentMethodCardStyle,
    borderColor: "#10B981",
    backgroundColor: "#F0FDF4",
  };

  const copyButtonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    cursor: "pointer",
    color: "#3B82F6",
    fontSize: "14px",
  };

  // Loading state
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 200,
        }}
      >
        <Spin tip="Loading elections..." />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {contextHolder}
      <div style={headerStyle}>
        <div>
          <h2 style={headerTextStyle}>Upcoming Elections</h2>
          <p style={headerSubtitleStyle}>
            Elections scheduled to take place in the near future
          </p>
        </div>
        <Badge
          count={processedElections.length}
          overflowCount={10}
          style={{ backgroundColor: "#000", color: "#FFD700" }}
        >
          <div style={badgeContainerStyle}>
            <Calendar style={iconStyle} />
          </div>
        </Badge>
      </div>

      {/* Filters and Search */}
      <div style={filterContainerStyle}>
        <div style={searchContainerStyle}>
          <Input
            placeholder="Search elections, candidates, or parties..."
            prefix={
              <Search
                style={{ color: "#9CA3AF", width: "16px", height: "16px" }}
              />
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <Select
          placeholder="Filter by"
          style={filterSelectStyle}
          value={filterType}
          onChange={(value) => setFilterType(value)}
          options={[
            { value: "all", label: "All Upcoming" },
            { value: "registration-open", label: "Registration Open" },
            { value: "with-candidates", label: "With Candidates" },
          ]}
          suffixIcon={<Filter style={{ width: "14px", height: "14px" }} />}
        />
        <DatePicker.RangePicker
          style={datePickerStyle}
          value={dateRange}
          onChange={(dates) => setDateRange(dates)}
          placeholder={["Start Date", "End Date"]}
          suffixIcon={<Calendar style={{ width: "14px", height: "14px" }} />}
        />
      </div>

      {/* Election Cards or Empty State */}
      {filteredElections.length > 0 ? (
        filteredElections.map((election) => {
          const isExpanded = expandedElection === election.id;
          const hasRegisteredCandidates =
            election.candidates &&
            election.candidates.some((c) => c.registered);

          return (
            <Card
              key={election.id}
              style={isExpanded ? cardExpandedStyle : cardStyle}
              bodyStyle={{ padding: 0 }}
            >
              <div style={cardHeaderStyle}>
                <h3 style={cardTitleStyle}>{election.title}</h3>
                {/* <LiveCountdownDisplay targetDate={election.startDate} /> */}
                <DigitalCountdown targetDate={election.startDate} />
              </div>

              <div style={cardContentStyle}>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "16px",
                    marginBottom: "16px",
                  }}
                >
                  {/* Election Date */}
                  <div
                    style={{
                      flex: "1",
                      minWidth: "250px",
                      backgroundColor: "#FFFBEB",
                      borderRadius: "8px",
                      padding: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      borderLeft: "4px solid #FFD700",
                    }}
                  >
                    <Calendar
                      style={{
                        width: "24px",
                        height: "24px",
                        color: "#92400E",
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#92400E",
                          marginBottom: "4px",
                        }}
                      >
                        Election Date
                      </div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#92400E",
                        }}
                      >
                        {election.startDate.format("MMMM D, YYYY")}
                      </div>
                    </div>
                  </div>

                  {/* Registration Status */}
                  <div
                    style={{
                      flex: "1",
                      minWidth: "250px",
                      backgroundColor: election.registrationOpen
                        ? "#F0FDF4"
                        : "#FEF2F2",
                      borderRadius: "8px",
                      padding: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      borderLeft: `4px solid ${
                        election.registrationOpen ? "#10B981" : "#EF4444"
                      }`,
                    }}
                  >
                    <Users
                      style={{
                        width: "24px",
                        height: "24px",
                        color: election.registrationOpen
                          ? "#047857"
                          : "#B91C1C",
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: election.registrationOpen
                            ? "#047857"
                            : "#B91C1C",
                          marginBottom: "4px",
                        }}
                      >
                        Registration Status
                      </div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: election.registrationOpen
                            ? "#047857"
                            : "#B91C1C",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {election.registrationOpen
                          ? getRegistrationTimeRemaining(
                              election.registrationDeadline
                            )
                          : "Registration Closed"}
                        {/* Add live indicator for same-day countdowns */}
                        {election.registrationOpen &&
                          election.registrationDeadline.diff(
                            currentTime,
                            "day"
                          ) === 0 &&
                          election.registrationDeadline.diff(
                            currentTime,
                            "minute"
                          ) > 0 && (
                            <span
                              style={{
                                width: "8px",
                                height: "8px",
                                backgroundColor: "#10B981",
                                borderRadius: "50%",
                                animation: "pulse 2s infinite",
                              }}
                            />
                          )}
                      </div>
                    </div>
                  </div>
                </div>

                <p style={{ margin: "0 0 16px 0", color: "#4B5563" }}>
                  {election.description}
                </p>

                {!isExpanded && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginBottom: "16px",
                    }}
                  >
                    <Tag
                      color="blue"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <MapPin style={{ width: "12px", height: "12px" }} />
                      {election.location}
                    </Tag>
                    <Tag
                      color="purple"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                      title={
                        election.schools && election.schools.length > 0
                          ? election.schools
                              .map(
                                (school) =>
                                  `${school.school_title} (${school.school_code})`
                              )
                              .join("\n")
                          : "All registered students from all schools"
                      }
                    >
                      <Users style={{ width: "12px", height: "12px" }} />
                      {election.eligibleVoters}
                    </Tag>
                    <Tag
                      color={
                        election.candidates.length > 0 ? "green" : "orange"
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Users style={{ width: "12px", height: "12px" }} />
                      {election.candidates.length} Candidate
                      {election.candidates.length !== 1 ? "s" : ""}
                    </Tag>
                  </div>
                )}

                {isExpanded && (
                  <div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "16px",
                        marginBottom: "24px",
                      }}
                    >
                      {/* Location Information */}
                      <div style={infoBoxStyle}>
                        <div style={infoBoxTitleStyle}>
                          <MapPin
                            style={{
                              width: "16px",
                              height: "16px",
                              color: "#4B5563",
                            }}
                          />
                          Location
                        </div>
                        <div style={infoBoxContentStyle}>
                          {election.location}
                        </div>
                      </div>
                      {/* Eligible Voters */}
                      <div style={infoBoxStyle}>
                        <div style={infoBoxTitleStyle}>
                          <Users
                            style={{
                              width: "16px",
                              height: "16px",
                              color: "#4B5563",
                            }}
                          />
                          Eligible Voters
                        </div>
                        <div style={infoBoxContentStyle}>
                          {election.eligibleVoters}
                        </div>
                      </div>
                    </div>

                    {/* Registration Information */}
                    <div
                      style={{
                        padding: "16px",
                        borderRadius: "8px",
                        marginBottom: "24px",
                        backgroundColor: election.registrationOpen
                          ? "#F0FDF4"
                          : "#FEF2F2",
                        border: `1px solid ${
                          election.registrationOpen ? "#D1FAE5" : "#FEE2E2"
                        }`,
                      }}
                    >
                      <h4
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          marginBottom: "12px",
                          color: election.registrationOpen
                            ? "#047857"
                            : "#B91C1C",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {election.registrationOpen ? (
                          <Info style={{ width: "18px", height: "18px" }} />
                        ) : (
                          <AlertTriangle
                            style={{ width: "18px", height: "18px" }}
                          />
                        )}
                        Registration Information
                      </h4>

                      {election.registrationOpen ? (
                        <>
                          <p style={{ fontSize: "14px", marginBottom: "12px" }}>
                            Registration is currently open for this election.
                            The deadline for registration is
                            <strong>
                              {" "}
                              {election.registrationDeadline.format(
                                "MMMM D, YYYY"
                              )}{" "}
                              {election.registrationDeadline.format("HH:mm")}
                            </strong>
                          </p>
                          <Button
                            type="primary"
                            style={{
                              backgroundColor: "#10B981",
                              borderColor: "#10B981",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                            onClick={() => handleOpenRegistration(election)}
                          >
                            <BookOpen
                              style={{ width: "16px", height: "16px" }}
                            />
                            Register as Candidate
                          </Button>
                        </>
                      ) : (
                        <p style={{ fontSize: "14px" }}>
                          Registration for this election is now closed. The
                          candidate list has been finalized.
                        </p>
                      )}
                    </div>

                    {/* Candidates Section */}
                    <div style={{ marginBottom: "24px" }}>
                      <h4
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          marginBottom: "16px",
                        }}
                      >
                        {election.candidates.length > 0
                          ? `Registered Candidates (${election.candidates.length})`
                          : "No Candidates Registered Yet"}
                      </h4>

                      {election.candidates.length > 0 ? (
                        <div>
                          {election.candidates.map((candidate) => (
                            <div key={candidate.id} style={candidateCardStyle}>
                              <div style={candidateImageStyle}>
                                <img
                                  src={candidate.image || "/placeholder.svg"}
                                  alt={candidate.name}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                              <div style={candidateInfoStyle}>
                                <div style={candidateNameStyle}>
                                  {candidate.name}
                                </div>
                                <div
                                  style={{
                                    ...candidatePartyStyle,
                                    backgroundColor:
                                      candidate.color === "#FFD700"
                                        ? "#FEF3C7"
                                        : candidate.color === "#DC143C"
                                        ? "#FEE2E2"
                                        : "#E5E7EB",
                                    color:
                                      candidate.color === "#FFD700"
                                        ? "#92400E"
                                        : candidate.color === "#DC143C"
                                        ? "#991B1B"
                                        : "#1F2937",
                                  }}
                                >
                                  {candidate.party}
                                </div>
                                <div style={candidateManifestoStyle}>
                                  {candidate.manifesto}
                                </div>
                              </div>
                              {candidate.registered && (
                                <Tag color="green">Confirmed</Tag>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div
                          style={{
                            padding: "24px",
                            backgroundColor: "#F9FAFB",
                            borderRadius: "8px",
                            textAlign: "center",
                          }}
                        >
                          <Users
                            style={{
                              width: "32px",
                              height: "32px",
                              color: "#9CA3AF",
                              margin: "0 auto 12px",
                            }}
                          />
                          <p
                            style={{
                              fontSize: "14px",
                              color: "#6B7280",
                              margin: 0,
                            }}
                          >
                            No candidates have registered for this election yet.
                            {election.registrationOpen &&
                              " Be the first to register!"}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Reminder Button */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "16px",
                      }}
                    >
                      <Button
                        type="default"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Bell style={{ width: "16px", height: "16px" }} />
                        Set Reminder for This Election
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div style={cardActionsStyle}>
                {isExpanded ? (
                  <Button
                    type="primary"
                    onClick={() => setExpandedElection(null)}
                    style={{
                      backgroundColor: "#FFD700",
                      borderColor: "#FFD700",
                      color: "#000",
                    }}
                  >
                    Collapse
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={() => setExpandedElection(election.id)}
                    style={{
                      backgroundColor: "#FFD700",
                      borderColor: "#FFD700",
                      color: "#000",
                    }}
                  >
                    View Details
                  </Button>
                )}
              </div>
            </Card>
          );
        })
      ) : (
        <div style={emptyStateStyle}>
          <AlertTriangle size={48} color="#9CA3AF" />
          <h3>No upcoming elections</h3>
          <p>
            There are currently no upcoming elections for your school (
            {studentSchoolCode}). Check back later for future elections.
          </p>
          <Button
            type="primary"
            style={{
              backgroundColor: "#FFD700",
              borderColor: "#FFD700",
              color: "#000",
            }}
          >
            Propose an Election
          </Button>
        </div>
      )}

      {/* Registration Drawer */}
      <Drawer
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <BookOpen style={{ width: "20px", height: "20px" }} />
            <span>Candidate Registration</span>
          </div>
        }
        placement="right"
        width={800}
        onClose={handleCloseDrawer}
        open={drawerVisible}
        extra={
          <div style={{ display: "flex", gap: "8px" }}>
            {currentStep > 0 && !registrationComplete && (
              <Button onClick={handlePrevStep}>Previous</Button>
            )}
            {currentStep < 3 && !registrationComplete && (
              <Button
                type="primary"
                onClick={currentStep === 3 ? handleSubmit : handleNextStep}
                style={{
                  backgroundColor: "#10B981",
                  borderColor: "#10B981",
                }}
                disabled={
                  (currentStep === 0 && !personalDetailsMet) ||
                  (currentStep === 1 && !academicRequirementsMet) ||
                  (currentStep === 2 && !paymentRequirementMet) ||
                  (currentStep === 3 && !seconderRequirementsMet)
                }
              >
                {currentStep === 3 ? "Submit" : "Next"}
              </Button>
            )}
            {registrationComplete && (
              <Button
                type="primary"
                onClick={handleCloseDrawer}
                style={{
                  backgroundColor: "#10B981",
                  borderColor: "#10B981",
                }}
              >
                Close
              </Button>
            )}
          </div>
        }
      >
        {!registrationComplete ? (
          <>
            <div style={{ marginBottom: "24px" }}>
              <div style={statusCardStyle}>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "12px",
                  }}
                >
                  Application Status
                </h3>
                <div style={statusItemStyle}>
                  <span>Personal Details</span>
                  <span>
                    {personalDetailsMet ? (
                      <CheckCircle
                        style={{
                          color: "#10B981",
                          width: "18px",
                          height: "18px",
                        }}
                      />
                    ) : (
                      <XCircle
                        style={{
                          color: "#EF4444",
                          width: "18px",
                          height: "18px",
                        }}
                      />
                    )}
                  </span>
                </div>
                <div style={statusItemStyle}>
                  <span>Academic Requirements</span>
                  <span>
                    {academicRequirementsMet ? (
                      <CheckCircle
                        style={{
                          color: "#10B981",
                          width: "18px",
                          height: "18px",
                        }}
                      />
                    ) : (
                      <XCircle
                        style={{
                          color: "#EF4444",
                          width: "18px",
                          height: "18px",
                        }}
                      />
                    )}
                  </span>
                </div>
                <div style={statusItemStyle}>
                  <span>Financial Status</span>
                  <span>
                    {financialRequirementsMet ? (
                      <CheckCircle
                        style={{
                          color: "#10B981",
                          width: "18px",
                          height: "18px",
                        }}
                      />
                    ) : (
                      <XCircle
                        style={{
                          color: "#EF4444",
                          width: "18px",
                          height: "18px",
                        }}
                      />
                    )}
                  </span>
                </div>
                <div style={statusItemStyle}>
                  <span>Nomination Fee</span>
                  <span>
                    {paymentRequirementMet ? (
                      <CheckCircle
                        style={{
                          color: "#10B981",
                          width: "18px",
                          height: "18px",
                        }}
                      />
                    ) : (
                      <XCircle
                        style={{
                          color: "#EF4444",
                          width: "18px",
                          height: "18px",
                        }}
                      />
                    )}
                  </span>
                </div>
                <div style={{ ...statusItemStyle, borderBottom: "none" }}>
                  <span>Seconders</span>
                  <span>
                    {seconderRequirementsMet ? (
                      <CheckCircle
                        style={{
                          color: "#10B981",
                          width: "18px",
                          height: "18px",
                        }}
                      />
                    ) : (
                      <span style={{ color: "#6B7280", fontSize: "14px" }}>
                        {selectedSeconders.length}/3 minimum
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <Steps
              current={currentStep}
              items={[
                {
                  title: "Details",
                  status: personalDetailsMet ? "finish" : "process",
                },
                {
                  title: "Verification",
                  status:
                    currentStep > 0
                      ? academicRequirementsMet && financialRequirementsMet
                        ? "finish"
                        : "error"
                      : "wait",
                },
                {
                  title: "Payment",
                  status:
                    currentStep > 1
                      ? paymentRequirementMet
                        ? "finish"
                        : "process"
                      : "wait",
                },
                {
                  title: "Seconders",
                  status:
                    currentStep > 2
                      ? seconderRequirementsMet
                        ? "finish"
                        : "process"
                      : "wait",
                },
              ]}
            />

            <div style={stepContentStyle}>
              {currentStep === 0 && (
                <div>
                  <h3 style={drawerTitleStyle}>Candidate Details</h3>
                  <div style={requirementCardStyle}>
                    <Form layout="vertical">
                      <Form.Item label="Position Applying For">
                        <Input
                          value={currentElection?.title || ""}
                          disabled
                          style={{ backgroundColor: "#f5f5f5" }}
                        />
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6B7280",
                            marginTop: "4px",
                          }}
                        >
                          Position is determined by the election you selected
                        </div>
                      </Form.Item>
                      <Form.Item
                        label="Campaign Manifesto"
                        required
                        tooltip="Minimum 50 characters"
                      >
                        <Input.TextArea
                          rows={4}
                          placeholder="Enter your campaign manifesto"
                          value={manifesto}
                          onChange={(e) => setManifesto(e.target.value)}
                        />
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#6B7280",
                            marginTop: "4px",
                          }}
                        >
                          {manifesto.length}/50 characters minimum
                        </div>
                      </Form.Item>
                      <Form.Item label="Choose Your Campaign Color" required>
                        <div style={{ marginBottom: "8px" }}>
                          Select one of the available colors to represent your
                          campaign:
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "4px",
                          }}
                        >
                          {colorOptions.map((color) => (
                            <Tooltip key={color.value} title={color.name}>
                              <div
                                style={
                                  selectedColor === color.value
                                    ? colorBoxSelectedStyle
                                    : colorBoxStyle
                                }
                                onClick={() => setSelectedColor(color.value)}
                              >
                                <div
                                  style={{
                                    backgroundColor: color.value,
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "2px",
                                  }}
                                />
                              </div>
                            </Tooltip>
                          ))}
                        </div>
                        {selectedColor && (
                          <div
                            style={{
                              marginTop: "8px",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <div
                              style={{
                                width: "24px",
                                height: "24px",
                                backgroundColor: selectedColor,
                                borderRadius: "4px",
                              }}
                            />
                            <span>
                              Selected:{" "}
                              {
                                colorOptions.find(
                                  (c) => c.value === selectedColor
                                )?.name
                              }
                            </span>
                          </div>
                        )}
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div>
                  <h3 style={drawerTitleStyle}>Eligibility Verification</h3>
                  <div style={requirementCardStyle}>
                    <div style={requirementTitleStyle}>
                      <Check
                        style={{
                          width: "18px",
                          height: "18px",
                          color: "#4B5563",
                        }}
                      />
                      Academic Qualifications
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <span>Current CGPA:</span>
                        <span
                          style={{
                            fontWeight: "600",
                            color:
                              currentStudent.cgpa >= 3.0
                                ? "#10B981"
                                : "#EF4444",
                          }}
                        >
                          {currentStudent.cgpa.toFixed(1)}
                        </span>
                      </div>
                      <Progress
                        percent={(currentStudent.cgpa / 5) * 100}
                        status={
                          currentStudent.cgpa >= 3.0 ? "success" : "exception"
                        }
                        showInfo={false}
                      />
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6B7280",
                          marginTop: "4px",
                        }}
                      >
                        Minimum required: 3.0
                      </div>
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <span>Retake Status:</span>
                        <span
                          style={{
                            fontWeight: "600",
                            color: !currentStudent.hasRetakes
                              ? "#10B981"
                              : "#EF4444",
                          }}
                        >
                          {!currentStudent.hasRetakes
                            ? "No Retakes"
                            : "Has Retakes"}
                        </span>
                      </div>
                      {currentStudent.hasRetakes && (
                        <Alert
                          message="Ineligible due to retakes"
                          description="You are not eligible to run as a candidate because you have retakes in your academic record."
                          type="error"
                          showIcon
                        />
                      )}
                    </div>

                    <Divider />

                    <div style={requirementTitleStyle}>
                      <DollarSign
                        style={{
                          width: "18px",
                          height: "18px",
                          color: "#4B5563",
                        }}
                      />
                      Financial Status
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <span>Tuition Payment:</span>
                        <span
                          style={{
                            fontWeight: "600",
                            color:
                              currentStudent.feePaid >= 75
                                ? "#10B981"
                                : "#EF4444",
                          }}
                        >
                          {currentStudent.feePaid}% Paid
                        </span>
                      </div>
                      <Progress
                        percent={currentStudent.feePaid}
                        status={
                          currentStudent.feePaid >= 75 ? "success" : "exception"
                        }
                      />
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6B7280",
                          marginTop: "4px",
                        }}
                      >
                        Minimum required: 75% of tuition fees
                      </div>
                    </div>

                    {!academicRequirementsMet && (
                      <Alert
                        message="Academic Requirements Not Met"
                        description="You must meet all academic requirements to proceed with your candidacy application."
                        type="error"
                        showIcon
                        style={{ marginTop: "16px" }}
                      />
                    )}
                    {!financialRequirementsMet && (
                      <Alert
                        message="Financial Requirements Not Met"
                        description="You must clear at least 75% of your tuition fees to proceed with your candidacy application."
                        type="error"
                        showIcon
                        style={{ marginTop: "16px" }}
                      />
                    )}
                    {academicRequirementsMet && financialRequirementsMet && (
                      <Alert
                        message="Verification Successful"
                        description="You have met all the academic and financial requirements for candidacy."
                        type="success"
                        showIcon
                        style={{ marginTop: "16px" }}
                      />
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h3 style={drawerTitleStyle}>Nomination Fee Payment</h3>
                  <Alert
                    message="Nomination Fee Required"
                    description="A non-refundable nomination fee of 1,000,000 UGX is required to complete your candidacy registration."
                    type="info"
                    showIcon
                    style={{ marginBottom: "16px" }}
                  />

                  <div style={paymentCardStyle}>
                    <div style={requirementTitleStyle}>
                      <CreditCard
                        style={{
                          width: "18px",
                          height: "18px",
                          color: "#4B5563",
                        }}
                      />
                      Payment Details
                    </div>
                    <div style={paymentInfoStyle}>
                      <span>Nomination Fee:</span>
                      <span style={{ fontWeight: "600" }}>UGX 1,000,000</span>
                    </div>
                    <div style={paymentInfoStyle}>
                      <span>Reference Number:</span>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ fontWeight: "600" }}>
                          {paymentReference}
                        </span>
                        <div
                          style={copyButtonStyle}
                          onClick={() => copyToClipboard(paymentReference)}
                        >
                          <Copy style={{ width: "14px", height: "14px" }} />
                          <span>Copy</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ ...paymentInfoStyle, borderBottom: "none" }}>
                      <span>Payment Status:</span>
                      <span
                        style={{
                          fontWeight: "600",
                          color:
                            paymentStatus === "completed"
                              ? "#10B981"
                              : paymentStatus === "processing"
                              ? "#F59E0B"
                              : paymentStatus === "failed"
                              ? "#EF4444"
                              : "#6B7280",
                        }}
                      >
                        {paymentStatus === "completed"
                          ? "Paid"
                          : paymentStatus === "processing"
                          ? "Processing"
                          : paymentStatus === "failed"
                          ? "Failed"
                          : "Pending"}
                      </span>
                    </div>
                  </div>

                  {paymentStatus === "completed" ? (
                    <div style={requirementCardStyle}>
                      <Result
                        status="success"
                        title="Payment Successful!"
                        subTitle={`Your payment of UGX 1,000,000 has been received. Reference: ${paymentReference}`}
                        extra={[
                          <div
                            key="details"
                            style={{ textAlign: "left", marginTop: "16px" }}
                          >
                            <div
                              style={{ marginBottom: "8px", fontWeight: "600" }}
                            >
                              Payment Details:
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "4px",
                              }}
                            >
                              <span>Amount:</span>
                              <span>UGX 1,000,000</span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "4px",
                              }}
                            >
                              <span>Date:</span>
                              <span>
                                {dayjs().format("MMMM D, YYYY h:mm A")}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "4px",
                              }}
                            >
                              <span>Method:</span>
                              <span>
                                {paymentMethod === "mtn"
                                  ? "MTN Mobile Money"
                                  : "Airtel Money"}
                              </span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "4px",
                              }}
                            >
                              <span>Phone Number:</span>
                              <span>{phoneNumber}</span>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "4px",
                              }}
                            >
                              <span>Verification Code:</span>
                              <span>{paymentVerificationCode}</span>
                            </div>
                          </div>,
                        ]}
                      />
                    </div>
                  ) : (
                    <div style={requirementCardStyle}>
                      <div style={requirementTitleStyle}>
                        <Smartphone
                          style={{
                            width: "18px",
                            height: "18px",
                            color: "#4B5563",
                          }}
                        />
                        Mobile Money Payment
                      </div>
                      <Form layout="vertical">
                        <Form.Item label="Select Payment Method" required>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "12px",
                            }}
                          >
                            {mobileMoneyProviders.map((provider) => (
                              <div
                                key={provider.value}
                                style={
                                  paymentMethod === provider.value
                                    ? paymentMethodCardSelectedStyle
                                    : paymentMethodCardStyle
                                }
                                onClick={() => setPaymentMethod(provider.value)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                  }}
                                >
                                  <div
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "8px",
                                      backgroundColor: provider.color,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <Smartphone
                                      style={{
                                        color: "white",
                                        width: "24px",
                                        height: "24px",
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: "600" }}>
                                      {provider.name}
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "12px",
                                        color: "#6B7280",
                                      }}
                                    >
                                      Pay using your {provider.name} account
                                    </div>
                                  </div>
                                  <Radio
                                    checked={paymentMethod === provider.value}
                                    style={{ marginLeft: "auto" }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </Form.Item>

                        <Form.Item label="Mobile Money Number" required>
                          <Input
                            placeholder="Enter your mobile money number"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            prefix={
                              <Phone
                                style={{
                                  color: "#9CA3AF",
                                  width: "16px",
                                  height: "16px",
                                }}
                              />
                            }
                          />
                          <div
                            style={{
                              fontSize: "12px",
                              color: "#6B7280",
                              marginTop: "4px",
                            }}
                          >
                            Enter the phone number registered with your mobile
                            money account
                          </div>
                        </Form.Item>

                        <Form.Item>
                          <Button
                            type="primary"
                            onClick={handleInitiatePayment}
                            style={{
                              backgroundColor: "#10B981",
                              borderColor: "#10B981",
                              width: "100%",
                              height: "44px",
                              fontSize: "16px",
                            }}
                            disabled={!phoneNumber || phoneNumber.length < 10}
                          >
                            Pay UGX 1,000,000
                          </Button>
                        </Form.Item>
                      </Form>

                      <div
                        style={{
                          marginTop: "16px",
                          fontSize: "14px",
                          color: "#6B7280",
                        }}
                      >
                        <div style={{ fontWeight: "600", marginBottom: "8px" }}>
                          Payment Instructions:
                        </div>
                        <ol style={{ paddingLeft: "20px", marginBottom: "0" }}>
                          <li style={{ marginBottom: "8px" }}>
                            Enter your mobile money number and click the "Pay"
                            button.
                          </li>
                          <li style={{ marginBottom: "8px" }}>
                            You will receive a prompt on your phone to authorize
                            the payment.
                          </li>
                          <li style={{ marginBottom: "8px" }}>
                            Enter your mobile money PIN to confirm the payment.
                          </li>
                          <li>
                            Once payment is confirmed, your nomination fee will
                            be marked as paid.
                          </li>
                        </ol>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h3 style={drawerTitleStyle}>Seconders</h3>
                  <Alert
                    message="Seconders Required"
                    description="You need at least 3 registered students to second your candidacy."
                    type="info"
                    showIcon
                    style={{ marginBottom: "16px" }}
                  />

                  <div style={{ marginBottom: "16px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <span>Seconders Progress:</span>
                      <span style={{ fontWeight: "600" }}>
                        {selectedSeconders.length}/100 (3 minimum)
                      </span>
                    </div>
                    <Progress
                      percent={
                        (selectedSeconders.length / 3) * 100 > 100
                          ? 100
                          : (selectedSeconders.length / 3) * 100
                      }
                      status={
                        selectedSeconders.length >= 3 ? "success" : "active"
                      }
                      showInfo={false}
                    />
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <Input
                      placeholder="Search for seconders by name, ID, or faculty..."
                      prefix={
                        <Search
                          style={{
                            color: "#9CA3AF",
                            width: "16px",
                            height: "16px",
                          }}
                        />
                      }
                      value={searchSeconders}
                      onChange={(e) => setSearchSeconders(e.target.value)}
                      style={{ width: "100%" }}
                    />
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        marginBottom: "8px",
                      }}
                    >
                      Selected Seconders ({selectedSeconders.length})
                    </div>
                    {selectedSeconders.length > 0 ? (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "8px",
                        }}
                      >
                        {selectedSeconders.map((seconder) => (
                          <Tag
                            key={seconder.id}
                            closable
                            onClose={() => handleSeconderSelection(seconder)}
                            style={{
                              padding: "4px 8px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Avatar
                              src={seconder.image}
                              size="small"
                              style={{ marginRight: "4px" }}
                            />
                            {seconder.name} ({seconder.faculty})
                          </Tag>
                        ))}
                      </div>
                    ) : (
                      <div
                        style={{
                          padding: "12px",
                          backgroundColor: "#F9FAFB",
                          borderRadius: "8px",
                          textAlign: "center",
                          color: "#6B7280",
                        }}
                      >
                        No seconders selected yet
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        marginBottom: "8px",
                      }}
                    >
                      Available Seconders
                    </div>
                    {filteredSeconders.map((seconder) => {
                      const isSelected = selectedSeconders.some(
                        (s) => s.id === seconder.id
                      );
                      return (
                        <div
                          key={seconder.id}
                          style={
                            isSelected
                              ? seconderCardSelectedStyle
                              : seconderCardStyle
                          }
                          onClick={() => handleSeconderSelection(seconder)}
                        >
                          <Avatar src={seconder.image} size={40} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: "600" }}>
                              {seconder.name}
                            </div>
                            <div style={{ fontSize: "12px", color: "#6B7280" }}>
                              ID: {seconder.studentId} | Faculty:{" "}
                              {seconder.faculty}
                            </div>
                          </div>
                          {isSelected ? (
                            <Check
                              style={{
                                width: "18px",
                                height: "18px",
                                color: "#10B981",
                              }}
                            />
                          ) : (
                            <Button
                              size="small"
                              type="text"
                              icon={
                                <UserPlus
                                  style={{ width: "14px", height: "14px" }}
                                />
                              }
                            >
                              Add
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <Alert
                    message="Note"
                    description="All seconders will receive a notification to confirm their support for your candidacy."
                    type="warning"
                    showIcon
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <Result
            status="success"
            title="Registration Submitted Successfully!"
            subTitle={`Your application for ${currentElection?.title} has been submitted and is pending verification. You will be notified once your candidacy is confirmed.`}
            extra={[
              <Button
                key="dashboard"
                type="primary"
                style={{
                  backgroundColor: "#10B981",
                  borderColor: "#10B981",
                }}
              >
                View Application Status
              </Button>,
            ]}
          />
        )}
      </Drawer>

      {/* Mobile Money Payment Modal */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Smartphone style={{ width: "20px", height: "20px" }} />
            <span>Confirm Mobile Money Payment</span>
          </div>
        }
        open={paymentModalVisible}
        onCancel={() => setPaymentModalVisible(false)}
        footer={null}
        centered
      >
        {paymentProcessing ? (
          <div style={{ textAlign: "center", padding: "24px" }}>
            <Spin size="large" />
            <div style={{ marginTop: "16px", fontWeight: "600" }}>
              Processing Payment
            </div>
            <div style={{ marginTop: "8px", color: "#6B7280" }}>
              Please wait while we process your payment. Do not close this
              window.
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  marginBottom: "4px",
                }}
              >
                Payment Amount
              </div>
              <div style={{ fontSize: "24px", fontWeight: "600" }}>
                UGX 1,000,000
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  marginBottom: "4px",
                }}
              >
                Payment Method
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "4px",
                    backgroundColor:
                      paymentMethod === "mtn" ? "#FFCC00" : "#FF0000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Smartphone
                    style={{ color: "white", width: "18px", height: "18px" }}
                  />
                </div>
                <div style={{ fontWeight: "600" }}>
                  {paymentMethod === "mtn"
                    ? "MTN Mobile Money"
                    : "Airtel Money"}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  marginBottom: "4px",
                }}
              >
                Phone Number
              </div>
              <div style={{ fontWeight: "600" }}>{phoneNumber}</div>
            </div>

            <Alert
              message="Payment Confirmation"
              description={
                <div>
                  <p>
                    You will receive a prompt on your phone to authorize this
                    payment. Please enter your mobile money PIN to complete the
                    transaction.
                  </p>
                  <p style={{ marginTop: "8px", marginBottom: "0" }}>
                    For demonstration purposes, the payment will be
                    automatically confirmed in a few seconds.
                  </p>
                </div>
              }
              type="info"
              showIcon
              style={{ marginBottom: "24px" }}
            />

            <div style={{ display: "flex", gap: "12px" }}>
              <Button
                style={{ flex: 1 }}
                onClick={() => setPaymentModalVisible(false)}
                disabled={paymentProcessing}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                style={{
                  flex: 1,
                  backgroundColor: "#10B981",
                  borderColor: "#10B981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onClick={handleConfirmPayment}
                disabled={paymentProcessing}
              >
                <ArrowRight style={{ width: "16px", height: "16px" }} />
                Confirm Payment
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
