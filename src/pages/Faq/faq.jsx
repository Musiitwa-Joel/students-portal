"use client";

import { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Input,
  Card,
  Row,
  Col,
  Tabs,
  Tree,
  Tag,
  Button,
  Drawer,
  Divider,
  Space,
  Statistic,
  Avatar,
  List,
  Timeline,
  Tooltip,
  Badge,
  Skeleton,
  Empty,
  Steps,
  Segmented,
  FloatButton,
  Dropdown,
  ConfigProvider,
  theme as antTheme,
  Rate,
  Progress,
  Radio,
  Checkbox,
  Select,
  Modal,
  Collapse,
} from "antd";
import {
  SearchOutlined,
  QuestionCircleOutlined,
  LockOutlined,
  BookOutlined,
  DollarOutlined,
  CalendarOutlined,
  SettingOutlined,
  StarOutlined,
  StarFilled,
  FilterOutlined,
  BulbOutlined,
  RightOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  BarChartOutlined,
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  DownOutlined,
  UpOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  GlobalOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  RobotOutlined,
  ApiOutlined,
  ToolOutlined,
  CustomerServiceOutlined,
  FormOutlined,
  PlayCircleOutlined,
  OrderedListOutlined,
  LinkOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider, Footer } = Layout;
const { Title, Paragraph, Text, Link } = Typography;
const { Search } = Input;
const { TabPane } = Tabs;
const { Step } = Steps;
const { DirectoryTree } = Tree;
const { Meta } = Card;
const { useToken } = antTheme;

// Mock data for analytics
const analyticsData = {
  totalViews: 12487,
  helpfulRatings: 8934,
  searchCount: 5621,
  topCategories: [
    { name: "Authentication", count: 3245, percent: 26 },
    { name: "Academics", count: 2876, percent: 23 },
    { name: "Finances", count: 2134, percent: 17 },
    { name: "Technical", count: 1987, percent: 16 },
    { name: "Services", count: 1432, percent: 11 },
    { name: "Calendar", count: 813, percent: 7 },
  ],
  popularQuestions: [
    {
      id: "auth-1",
      question: "How do I reset my student portal password?",
      views: 1245,
    },
    {
      id: "tech-1",
      question:
        "What should I do if I'm having technical issues with the portal?",
      views: 987,
    },
    { id: "acad-2", question: "How do I register for courses?", views: 876 },
    { id: "fin-1", question: "How do I view my tuition balance?", views: 754 },
    {
      id: "serv-1",
      question: "How do I access the e-learning platform?",
      views: 632,
    },
  ],
};

// FAQ data organized by categories with enhanced metadata
const faqData = {
  authentication: [
    {
      id: "auth-1",
      question: "How do I reset my student portal password?",
      answer:
        "To reset your student portal password, go to the login page and click on the 'Forgot Password' link. Enter your email address or username associated with your account and submit. You will receive an email with password reset instructions; check your inbox and spam folder. Follow the instructions in the email to set a new password. Once done, return to the login page and log in with your new password. If you experience any issues or do not receive the reset email, please contact our technical support team for assistance.",
      tags: ["password", "login", "reset"],
      views: 1245,
      helpful: 876,
      notHelpful: 43,
      lastUpdated: "2025-03-15",
      relatedQuestions: ["auth-2", "tech-1"],
      complexity: "basic",
      steps: [
        "Navigate to the login page",
        "Click 'Forgot Password'",
        "Enter your email/username",
        "Check your email for instructions",
        "Follow the link to reset your password",
        "Create a new password",
        "Log in with your new credentials",
      ],
      video: "password-reset-tutorial.mp4",
    },
    {
      id: "auth-2",
      question: "What should I do if my account is locked?",
      answer:
        "If your account is locked due to multiple failed login attempts, please wait 30 minutes for it to automatically unlock. If you still cannot access your account after this period, contact the IT helpdesk with your student ID for assistance. Our security system automatically locks accounts after 5 consecutive failed login attempts to protect your account from unauthorized access attempts.",
      tags: ["account", "locked", "login"],
      views: 876,
      helpful: 654,
      notHelpful: 32,
      lastUpdated: "2025-02-28",
      relatedQuestions: ["auth-1", "tech-1"],
      complexity: "basic",
      steps: [
        "Wait 30 minutes for automatic unlock",
        "If still locked, contact IT helpdesk",
        "Provide your student ID and verification details",
        "Follow instructions from support team",
      ],
    },
    {
      id: "auth-3",
      question: "How do I update my profile information?",
      answer:
        "To update your profile information, log in to the student portal and navigate to 'Bio Data' from the dashboard. Click on 'Edit Profile' to update your personal information. Note that some information like your student ID and program cannot be changed without administrative approval. Changes to critical information such as your name, date of birth, or national ID number require verification documents to be submitted to the registrar's office.",
      tags: ["profile", "update", "bio data"],
      views: 654,
      helpful: 543,
      notHelpful: 21,
      lastUpdated: "2025-01-10",
      relatedQuestions: ["auth-1", "tech-3"],
      complexity: "intermediate",
      steps: [
        "Log in to the student portal",
        "Navigate to 'Bio Data'",
        "Click 'Edit Profile'",
        "Update your information",
        "Save changes",
        "For critical information changes, submit verification documents",
      ],
    },
    {
      id: "auth-4",
      question: "How do I enable two-factor authentication?",
      answer:
        "Two-factor authentication adds an extra layer of security to your account. To enable it, go to 'Account Settings' under your profile, select 'Security', and click 'Enable Two-Factor Authentication'. You can choose between SMS verification or an authenticator app. Follow the on-screen instructions to complete the setup. Once enabled, you'll need both your password and a verification code to log in.",
      tags: ["security", "2FA", "authentication"],
      views: 543,
      helpful: 432,
      notHelpful: 15,
      lastUpdated: "2025-04-05",
      relatedQuestions: ["auth-1", "auth-2"],
      complexity: "advanced",
      steps: [
        "Go to 'Account Settings'",
        "Select 'Security'",
        "Click 'Enable Two-Factor Authentication'",
        "Choose verification method (SMS or app)",
        "Follow setup instructions",
        "Test the authentication process",
        "Save settings",
      ],
    },
  ],
  academics: [
    {
      id: "acad-1",
      question: "Where can I find my class schedule?",
      answer:
        "Your class schedule is available in the 'Academics' section of the student portal. Click on 'Class Schedule' to view your current semester's timetable. You can also download or print your schedule for offline reference. The schedule displays course codes, class times, locations, and instructor information. You can toggle between daily, weekly, and monthly views to better plan your academic activities.",
      tags: ["schedule", "timetable", "classes"],
      views: 987,
      helpful: 876,
      notHelpful: 21,
      lastUpdated: "2025-03-20",
      relatedQuestions: ["acad-2", "cal-1"],
      complexity: "basic",
      steps: [
        "Log in to the student portal",
        "Navigate to 'Academics'",
        "Click on 'Class Schedule'",
        "View your timetable",
        "Optional: Download or print for offline reference",
      ],
    },
    {
      id: "acad-2",
      question: "How do I register for courses?",
      answer:
        "Course registration is done through the 'Registration' module in the student portal. The exact dates for registration are announced by the Registrar's office each semester. To register, select your program, choose available courses for the semester, and submit your selection for approval. Make sure to complete registration before the deadline to avoid late registration fees. The system will check for prerequisites and scheduling conflicts automatically. Your academic advisor must approve your course selection before it's finalized.",
      tags: ["registration", "courses", "enrollment"],
      views: 876,
      helpful: 765,
      notHelpful: 43,
      lastUpdated: "2025-02-15",
      relatedQuestions: ["acad-1", "acad-3", "fin-1"],
      complexity: "intermediate",
      steps: [
        "Check registration dates",
        "Log in to the student portal",
        "Navigate to 'Registration'",
        "Select your program",
        "Choose available courses",
        "Check for conflicts or prerequisites",
        "Submit for advisor approval",
        "Confirm registration after approval",
      ],
    },
    {
      id: "acad-3",
      question: "Where can I view my grades?",
      answer:
        "Your grades are accessible in the 'Results Hub' section. Click on 'Grade Report' to view your current and past semester grades. You can also see your GPA calculation and academic standing from this section. The system allows you to filter grades by semester, academic year, or course type. You can generate official and unofficial transcripts from this section as well. Grade disputes must be initiated within 14 days of grade posting.",
      tags: ["grades", "results", "GPA"],
      views: 765,
      helpful: 654,
      notHelpful: 32,
      lastUpdated: "2025-01-25",
      relatedQuestions: ["acad-2", "acad-4"],
      complexity: "basic",
      steps: [
        "Log in to the student portal",
        "Navigate to 'Results Hub'",
        "Click on 'Grade Report'",
        "View your grades and GPA",
        "Optional: Filter by semester or generate transcripts",
      ],
    },
    {
      id: "acad-4",
      question: "How do I contact my academic advisor?",
      answer:
        "Your academic advisor's contact information can be found in the 'Advising' section of the portal. You can usually schedule appointments or send messages directly through this section. Academic advisors are available during office hours or by appointment to discuss course selection, academic progress, and career planning. The system allows you to view your advisor's availability calendar and book appointments accordingly. You can also set up virtual meetings through the integrated video conferencing tool.",
      tags: ["advisor", "contact", "academic support"],
      views: 654,
      helpful: 543,
      notHelpful: 21,
      lastUpdated: "2025-03-05",
      relatedQuestions: ["acad-2", "acad-3"],
      complexity: "basic",
      steps: [
        "Log in to the student portal",
        "Navigate to 'Advising'",
        "View advisor information",
        "Schedule an appointment or send a message",
        "Prepare questions or topics for discussion",
      ],
    },
  ],
  finances: [
    {
      id: "fin-1",
      question: "How do I view my tuition balance?",
      answer:
        "To view your tuition balance, navigate to the 'My Finances' section on the dashboard. Here you can see your current balance, payment history, and upcoming payment deadlines. The system is updated daily to reflect recent transactions. You can also generate detailed statements for specific periods and view breakdowns of tuition, fees, scholarships, and other financial transactions. Payment receipts can be downloaded for your records.",
      tags: ["tuition", "balance", "finances"],
      views: 754,
      helpful: 632,
      notHelpful: 28,
      lastUpdated: "2025-04-10",
      relatedQuestions: ["fin-2", "fin-3"],
      complexity: "basic",
      steps: [
        "Log in to the student portal",
        "Navigate to 'My Finances'",
        "View your current balance",
        "Check payment history and deadlines",
        "Optional: Generate statements or download receipts",
      ],
    },
    {
      id: "fin-2",
      question: "What payment methods are accepted?",
      answer:
        "The university accepts several payment methods including bank transfers, mobile money, credit/debit cards, and direct deposits at the finance office. Each payment method has specific instructions available in the 'Payment Methods' subsection of 'My Finances'. International students can make payments through wire transfers or international payment platforms. All electronic payments are processed securely and typically reflect in your account within 1-2 business days.",
      tags: ["payment", "methods", "finances"],
      views: 632,
      helpful: 543,
      notHelpful: 21,
      lastUpdated: "2025-02-20",
      relatedQuestions: ["fin-1", "fin-3"],
      complexity: "intermediate",
      steps: [
        "Navigate to 'My Finances'",
        "Select 'Payment Methods'",
        "Choose your preferred payment option",
        "Follow the specific instructions for that method",
        "Keep payment confirmation for your records",
        "Allow 1-2 business days for processing",
      ],
    },
    {
      id: "fin-3",
      question: "How do I apply for a scholarship or financial aid?",
      answer:
        "Scholarship and financial aid applications are processed through the 'Financial Aid' subsection under 'My Finances'. Check the eligibility criteria, application deadlines, and required documentation. Submit your application online and track its status through the portal. Different scholarships have different requirements and deadlines, so be sure to review all available options. Supporting documents such as academic transcripts, recommendation letters, and financial need assessments may be required.",
      tags: ["scholarship", "financial aid", "application"],
      views: 543,
      helpful: 432,
      notHelpful: 15,
      lastUpdated: "2025-03-25",
      relatedQuestions: ["fin-1", "fin-2"],
      complexity: "advanced",
      steps: [
        "Navigate to 'My Finances'",
        "Select 'Financial Aid'",
        "Review available scholarships and eligibility",
        "Prepare required documentation",
        "Complete and submit application",
        "Track application status",
        "Respond to any additional information requests",
      ],
    },
  ],
  calendar: [
    {
      id: "cal-1",
      question: "How do I add events to my academic calendar?",
      answer:
        "To add personal events to your academic calendar, navigate to 'Acc. Calendar' on the dashboard. Click on the date you want to add an event to, fill in the event details in the popup form, and save. You can set reminders and recurrence patterns for your events. The calendar allows you to categorize events (academic, personal, extracurricular) and set different visibility options. You can also sync your university calendar with external calendar applications.",
      tags: ["calendar", "events", "schedule"],
      views: 432,
      helpful: 376,
      notHelpful: 12,
      lastUpdated: "2025-01-15",
      relatedQuestions: ["cal-2", "acad-1"],
      complexity: "intermediate",
      steps: [
        "Navigate to 'Acc. Calendar'",
        "Click on a date to add an event",
        "Fill in event details (title, time, location)",
        "Set reminders if needed",
        "Configure recurrence for repeating events",
        "Save the event",
      ],
    },
    {
      id: "cal-2",
      question: "Where can I find the academic calendar for the year?",
      answer:
        "The university's official academic calendar is available in the 'Acc. Calendar' section. Click on 'View Academic Calendar' to see important dates including semester start/end dates, examination periods, holidays, and registration deadlines. The calendar is available in multiple formats including list view, monthly view, and downloadable PDF. You can filter the calendar to show only specific types of events such as exams, holidays, or registration periods.",
      tags: ["academic calendar", "important dates", "semester"],
      views: 376,
      helpful: 321,
      notHelpful: 8,
      lastUpdated: "2025-02-05",
      relatedQuestions: ["cal-1", "acad-2"],
      complexity: "basic",
      steps: [
        "Navigate to 'Acc. Calendar'",
        "Click on 'View Academic Calendar'",
        "Browse important dates",
        "Optional: Filter by event type or download PDF",
      ],
    },
  ],
  services: [
    {
      id: "serv-1",
      question: "How do I access the e-learning platform?",
      answer:
        "Access the e-learning platform by clicking on the 'E-Learning' module from the dashboard. This will redirect you to the learning management system where you can find course materials, assignments, and online discussions for your enrolled courses. The platform supports various content types including video lectures, interactive quizzes, discussion forums, and digital textbooks. Technical requirements for optimal use include a modern web browser and stable internet connection.",
      tags: ["e-learning", "online courses", "LMS"],
      views: 632,
      helpful: 587,
      notHelpful: 15,
      lastUpdated: "2025-03-10",
      relatedQuestions: ["serv-2", "tech-1"],
      complexity: "basic",
      steps: [
        "Log in to the student portal",
        "Click on 'E-Learning' module",
        "Access your enrolled courses",
        "Navigate course materials and assignments",
        "Participate in online discussions and activities",
      ],
    },
    {
      id: "serv-2",
      question: "How do I reserve library books?",
      answer:
        "To reserve library books, navigate to the 'Library' module from the dashboard. Search for the book you need, click on 'Reserve', and select your preferred pickup date. You'll receive a notification when the book is ready for collection. The library system allows you to search by title, author, subject, or ISBN. You can reserve up to 5 books at a time, and reservations are held for 3 days after notification. Digital resources like e-books and journal articles can be accessed immediately without reservation.",
      tags: ["library", "books", "reservation"],
      views: 543,
      helpful: 498,
      notHelpful: 12,
      lastUpdated: "2025-02-25",
      relatedQuestions: ["serv-1", "serv-3"],
      complexity: "intermediate",
      steps: [
        "Navigate to 'Library' module",
        "Search for the book you need",
        "Click 'Reserve' on the book's page",
        "Select your preferred pickup date",
        "Wait for notification of availability",
        "Collect the book from the library",
      ],
    },
    {
      id: "serv-3",
      question: "How do I participate in student elections?",
      answer:
        "Student elections are conducted through the 'E-Voting' module. During election periods, you can view candidate profiles, manifestos, and cast your vote securely. The system ensures one vote per student and maintains anonymity. Election announcements are made through the portal and university email. The voting system is accessible during the designated election period, typically lasting 24-48 hours. Results are published on the portal after verification by the electoral commission.",
      tags: ["voting", "elections", "student government"],
      views: 432,
      helpful: 387,
      notHelpful: 9,
      lastUpdated: "2025-01-20",
      relatedQuestions: ["serv-1", "serv-2"],
      complexity: "basic",
      steps: [
        "Navigate to 'E-Voting' module during election period",
        "Review candidate profiles and manifestos",
        "Select your preferred candidate(s)",
        "Confirm your selections",
        "Submit your ballot",
        "View election results after the voting period",
      ],
    },
  ],
  technical: [
    {
      id: "tech-1",
      question:
        "What should I do if I'm having technical issues with the portal?",
      answer:
        "If you are experiencing technical issues with the portal, start by checking the available help resources. The FAQs and help guides on the portal are designed to address common problems and provide step-by-step solutions. Additionally, clearing your browser's cache and cookies can often resolve many technical issues. It might also help to access the portal using a different web browser or device to see if the issue persists. Ensuring your web browser is up-to-date and disabling any browser extensions that might interfere with the portal's functionality are also recommended steps. If these steps do not resolve the issue, please contact our technical support team for further assistance. When reaching out, provide as much detail as possible about the problem, including any error messages you have encountered and the steps you have already taken to try and resolve the issue. Our support team is here to help you and will work to ensure that you can access and use the portal without further problems.",
      tags: ["technical issues", "support", "troubleshooting"],
      views: 987,
      helpful: 876,
      notHelpful: 43,
      lastUpdated: "2025-04-05",
      relatedQuestions: ["tech-2", "tech-3"],
      complexity: "advanced",
      steps: [
        "Check FAQs and help guides",
        "Clear browser cache and cookies",
        "Try a different browser or device",
        "Update your browser",
        "Disable browser extensions",
        "If issue persists, contact technical support",
        "Provide detailed information about the problem",
      ],
      troubleshootingTree: [
        {
          issue: "Cannot log in",
          solutions: [
            "Reset password",
            "Check if account is locked",
            "Verify username/email",
            "Clear browser cache",
            "Contact support",
          ],
        },
        {
          issue: "Pages not loading properly",
          solutions: [
            "Clear browser cache",
            "Update browser",
            "Disable extensions",
            "Try different browser",
            "Check internet connection",
          ],
        },
        {
          issue: "Cannot submit forms",
          solutions: [
            "Check required fields",
            "Clear browser cache",
            "Try different browser",
            "Check file size limits",
            "Contact support",
          ],
        },
      ],
    },
    {
      id: "tech-2",
      question: "Which browsers are supported by the student portal?",
      answer:
        "The student portal is optimized for the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, we recommend keeping your browser updated to the latest version. Internet Explorer is not fully supported and may cause display or functionality issues. The portal is regularly tested on these browsers to ensure compatibility and optimal performance. Mobile browsers on iOS and Android devices are also supported for on-the-go access.",
      tags: ["browsers", "compatibility", "technical"],
      views: 765,
      helpful: 732,
      notHelpful: 8,
      lastUpdated: "2025-03-15",
      relatedQuestions: ["tech-1", "tech-3"],
      complexity: "basic",
      browserCompatibility: [
        { browser: "Chrome", version: "88+", support: "Full" },
        { browser: "Firefox", version: "85+", support: "Full" },
        { browser: "Safari", version: "14+", support: "Full" },
        { browser: "Edge", version: "88+", support: "Full" },
        {
          browser: "Internet Explorer",
          version: "All",
          support: "Not Supported",
        },
      ],
    },
    {
      id: "tech-3",
      question: "Can I access the portal on my mobile device?",
      answer:
        "Yes, the student portal is responsive and can be accessed on smartphones and tablets. For the best mobile experience, we also offer a dedicated mobile app available for download on iOS and Android devices from their respective app stores. The mobile app provides optimized access to key features including class schedules, grades, notifications, and campus maps. Some advanced features may only be available on the full web version of the portal.",
      tags: ["mobile", "app", "access"],
      views: 654,
      helpful: 621,
      notHelpful: 5,
      lastUpdated: "2025-02-10",
      relatedQuestions: ["tech-1", "tech-2"],
      complexity: "basic",
      steps: [
        "Access via mobile browser at portal.nkumba.edu",
        "Or download the mobile app from App Store/Google Play",
        "Log in with your student credentials",
        "Use optimized mobile interface",
      ],
    },
  ],
};

// Tree data for category navigation
const treeData = [
  {
    title: "All FAQs",
    key: "all",
    icon: <QuestionCircleOutlined />,
  },
  {
    title: "Authentication",
    key: "authentication",
    icon: <LockOutlined />,
    children: [
      { title: "Password Reset", key: "auth-1" },
      { title: "Account Locked", key: "auth-2" },
      { title: "Profile Updates", key: "auth-3" },
      { title: "Two-Factor Authentication", key: "auth-4" },
    ],
  },
  {
    title: "Academics",
    key: "academics",
    icon: <BookOutlined />,
    children: [
      { title: "Class Schedule", key: "acad-1" },
      { title: "Course Registration", key: "acad-2" },
      { title: "Grades & Results", key: "acad-3" },
      { title: "Academic Advising", key: "acad-4" },
    ],
  },
  {
    title: "Finances",
    key: "finances",
    icon: <DollarOutlined />,
    children: [
      { title: "Tuition Balance", key: "fin-1" },
      { title: "Payment Methods", key: "fin-2" },
      { title: "Scholarships & Aid", key: "fin-3" },
    ],
  },
  {
    title: "Calendar",
    key: "calendar",
    icon: <CalendarOutlined />,
    children: [
      { title: "Adding Events", key: "cal-1" },
      { title: "Academic Calendar", key: "cal-2" },
    ],
  },
  {
    title: "Services",
    key: "services",
    icon: <SettingOutlined />,
    children: [
      { title: "E-Learning", key: "serv-1" },
      { title: "Library", key: "serv-2" },
      { title: "E-Voting", key: "serv-3" },
    ],
  },
  {
    title: "Technical Support",
    key: "technical",
    icon: <ToolOutlined />,
    children: [
      { title: "Portal Issues", key: "tech-1" },
      { title: "Browser Compatibility", key: "tech-2" },
      { title: "Mobile Access", key: "tech-3" },
    ],
  },
];

// Function to get all FAQs
const getAllFAQs = () => {
  return Object.values(faqData).flat();
};

// Function to get FAQ by ID
const getFAQById = (id) => {
  const allFAQs = getAllFAQs();
  return allFAQs.find((faq) => faq.id === id);
};

// Function to get related FAQs
const getRelatedFAQs = (relatedIds) => {
  return relatedIds.map((id) => getFAQById(id));
};

// Advanced FAQ Portal Component
const AdvancedFAQPortal = () => {
  const { token } = useToken();
  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const [viewMode, setViewMode] = useState("card");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [analyticsDrawerVisible, setAnalyticsDrawerVisible] = useState(false);
  const [savedFAQs, setSavedFAQs] = useState([]);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filters, setFilters] = useState({
    complexity: [],
    lastUpdated: null,
    tags: [],
  });
  const [sortBy, setSortBy] = useState("relevance");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedKeys, setExpandedKeys] = useState([
    "authentication",
    "academics",
  ]);
  const [selectedKeys, setSelectedKeys] = useState(["all"]);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [feedbackFAQ, setFeedbackFAQ] = useState(null);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Handle tree select
  const onTreeSelect = (selectedKeys, info) => {
    if (selectedKeys.length > 0) {
      const key = selectedKeys[0];
      setSelectedKeys(selectedKeys);

      // Check if it's a category or specific FAQ
      if (key.includes("-")) {
        // It's a specific FAQ
        const faq = getFAQById(key);
        setSelectedFAQ(faq);
        setDrawerVisible(true);
      } else {
        // It's a category
        setActiveCategory(key);
        setSelectedFAQ(null);
      }
    }
  };

  // Handle tree expand
  const onTreeExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
  };

  // Filter FAQs based on search text and filters
  const filterFAQs = () => {
    let filteredFAQs = [];

    if (activeCategory === "all") {
      filteredFAQs = getAllFAQs();
    } else {
      filteredFAQs = faqData[activeCategory] || [];
    }

    // Apply search filter
    if (searchText) {
      filteredFAQs = filteredFAQs.filter(
        (item) =>
          item.question.toLowerCase().includes(searchText.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchText.toLowerCase()) ||
          item.tags.some((tag) =>
            tag.toLowerCase().includes(searchText.toLowerCase())
          )
      );
    }

    // Apply complexity filter
    if (filters.complexity.length > 0) {
      filteredFAQs = filteredFAQs.filter((item) =>
        filters.complexity.includes(item.complexity)
      );
    }

    // Apply date filter
    if (filters.lastUpdated) {
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() - filters.lastUpdated);
      filteredFAQs = filteredFAQs.filter(
        (item) => new Date(item.lastUpdated) > cutoffDate
      );
    }

    // Apply tag filter
    if (filters.tags.length > 0) {
      filteredFAQs = filteredFAQs.filter((item) =>
        item.tags.some((tag) => filters.tags.includes(tag))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "views":
        filteredFAQs.sort((a, b) => b.views - a.views);
        break;
      case "helpful":
        filteredFAQs.sort((a, b) => b.helpful - a.helpful);
        break;
      case "recent":
        filteredFAQs.sort(
          (a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated)
        );
        break;
      case "alphabetical":
        filteredFAQs.sort((a, b) => a.question.localeCompare(b.question));
        break;
      default:
        // Default is relevance, no additional sorting needed
        break;
    }

    return filteredFAQs;
  };

  const filteredFAQs = filterFAQs();

  // Toggle saved FAQ
  const toggleSavedFAQ = (faqId) => {
    if (savedFAQs.includes(faqId)) {
      setSavedFAQs(savedFAQs.filter((id) => id !== faqId));
    } else {
      setSavedFAQs([...savedFAQs, faqId]);
    }
  };

  // Show feedback modal
  const showFeedback = (faq) => {
    setFeedbackFAQ(faq);
    setFeedbackVisible(true);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      complexity: [],
      lastUpdated: null,
      tags: [],
    });
    setSortBy("relevance");
  };

  // Get all unique tags
  const getAllTags = () => {
    const allFAQs = getAllFAQs();
    const tagSet = new Set();
    allFAQs.forEach((faq) => {
      faq.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  };

  const allTags = getAllTags();

  // Render FAQ card
  const renderFAQCard = (faq) => {
    const isSaved = savedFAQs.includes(faq.id);

    return (
      <Card
        key={faq.id}
        className="faq-card"
        hoverable
        style={{ marginBottom: 16 }}
        actions={[
          <Tooltip title={isSaved ? "Remove from saved" : "Save for later"}>
            <Button
              type="text"
              icon={
                isSaved ? (
                  <StarFilled style={{ color: token.colorPrimary }} />
                ) : (
                  <StarOutlined />
                )
              }
              onClick={(e) => {
                e.stopPropagation();
                toggleSavedFAQ(faq.id);
              }}
              key="save"
            />
          </Tooltip>,
          <Tooltip title="Give feedback">
            <Button
              type="text"
              icon={<MessageOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                showFeedback(faq);
              }}
              key="feedback"
            />
          </Tooltip>,
          <Tooltip title="Share">
            <Button type="text" icon={<ShareAltOutlined />} key="share" />
          </Tooltip>,
          <Tooltip title="Print">
            <Button type="text" icon={<PrinterOutlined />} key="print" />
          </Tooltip>,
        ]}
        onClick={() => {
          setSelectedFAQ(faq);
          setDrawerVisible(true);
        }}
      >
        <Skeleton loading={loading} active avatar>
          <Meta
            avatar={
              <Avatar
                icon={
                  faq.complexity === "basic" ? (
                    <InfoCircleOutlined />
                  ) : faq.complexity === "intermediate" ? (
                    <BookOutlined />
                  ) : (
                    <ToolOutlined />
                  )
                }
                style={{
                  backgroundColor:
                    faq.complexity === "basic"
                      ? token.colorSuccess
                      : faq.complexity === "intermediate"
                      ? token.colorWarning
                      : token.colorError,
                }}
              />
            }
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text strong>{faq.question}</Text>
                <Badge
                  count={faq.views}
                  overflowCount={999}
                  style={{ backgroundColor: token.colorPrimary }}
                />
              </div>
            }
            description={
              <>
                <Paragraph ellipsis={{ rows: 2 }}>{faq.answer}</Paragraph>
                <Space size={[0, 8]} wrap style={{ marginTop: 8 }}>
                  {faq.tags.map((tag, index) => (
                    <Tag color="blue" key={index}>
                      {tag}
                    </Tag>
                  ))}
                </Space>
                <div
                  style={{
                    marginTop: 8,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Text type="secondary">Last updated: {faq.lastUpdated}</Text>
                  <Space>
                    <Tooltip title="Helpful ratings">
                      <span>
                        <LikeOutlined /> {faq.helpful}
                      </span>
                    </Tooltip>
                  </Space>
                </div>
              </>
            }
          />
        </Skeleton>
      </Card>
    );
  };

  // Render FAQ list item
  const renderFAQListItem = (faq) => {
    const isSaved = savedFAQs.includes(faq.id);

    return (
      <List.Item
        key={faq.id}
        actions={[
          <Button
            type="text"
            icon={
              isSaved ? (
                <StarFilled style={{ color: token.colorPrimary }} />
              ) : (
                <StarOutlined />
              )
            }
            onClick={(e) => {
              e.stopPropagation();
              toggleSavedFAQ(faq.id);
            }}
            key="save"
          />,
          <Button
            type="text"
            icon={<MessageOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              showFeedback(faq);
            }}
            key="feedback"
          />,
          <Button type="text" icon={<RightOutlined />} key="view" />,
        ]}
        onClick={() => {
          setSelectedFAQ(faq);
          setDrawerVisible(true);
        }}
      >
        <Skeleton loading={loading} active>
          <List.Item.Meta
            avatar={
              <Avatar
                icon={
                  faq.complexity === "basic" ? (
                    <InfoCircleOutlined />
                  ) : faq.complexity === "intermediate" ? (
                    <BookOutlined />
                  ) : (
                    <ToolOutlined />
                  )
                }
                style={{
                  backgroundColor:
                    faq.complexity === "basic"
                      ? token.colorSuccess
                      : faq.complexity === "intermediate"
                      ? token.colorWarning
                      : token.colorError,
                }}
              />
            }
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text strong>{faq.question}</Text>
                <Badge
                  count={faq.views}
                  overflowCount={999}
                  style={{ backgroundColor: token.colorPrimary }}
                />
              </div>
            }
            description={
              <Space size={[0, 8]} wrap>
                {faq.tags.map((tag, index) => (
                  <Tag color="blue" key={index}>
                    {tag}
                  </Tag>
                ))}
              </Space>
            }
          />
        </Skeleton>
      </List.Item>
    );
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode
          ? antTheme.darkAlgorithm
          : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: "#1890ff",
          borderRadius: 6,
        },
      }}
    >
      <Layout className="faq-portal" style={{ minHeight: "100vh" }}>
        <Layout>
          <Layout style={{ marginLeft: 0, padding: "0px" }}>
            <Content>
              <Card
                bordered={false}
                style={{ marginBottom: 24 }}
                title={
                  <Space size="large">
                    <Title level={4} style={{ margin: 0 }}>
                      {activeCategory === "all"
                        ? "All FAQs"
                        : activeCategory.charAt(0).toUpperCase() +
                          activeCategory.slice(1)}
                    </Title>
                    <Tag color="blue">{filteredFAQs.length} results</Tag>
                  </Space>
                }
                extra={
                  <Space>
                    <Tooltip title="Filter">
                      <Button
                        icon={<FilterOutlined />}
                        onClick={() => setFilterDrawerVisible(true)}
                      >
                        Filter
                      </Button>
                    </Tooltip>
                    <Dropdown
                      menu={{
                        items: [
                          { key: "relevance", label: "Relevance" },
                          { key: "views", label: "Most Viewed" },
                          { key: "helpful", label: "Most Helpful" },
                          { key: "recent", label: "Recently Updated" },
                          { key: "alphabetical", label: "Alphabetical" },
                        ],
                        onClick: ({ key }) => setSortBy(key),
                      }}
                    >
                      <Button>
                        <Space>
                          Sort:{" "}
                          {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                          <DownOutlined />
                        </Space>
                      </Button>
                    </Dropdown>
                    <Segmented
                      options={[
                        {
                          value: "card",
                          icon: <AppstoreOutlined />,
                        },
                        {
                          value: "list",
                          icon: <UnorderedListOutlined />,
                        },
                      ]}
                      value={viewMode}
                      onChange={setViewMode}
                    />
                  </Space>
                }
              >
                {filteredFAQs.length > 0 ? (
                  viewMode === "card" ? (
                    <Row gutter={[16, 16]}>
                      {filteredFAQs.map((faq) => (
                        <Col xs={24} md={12} xl={8} key={faq.id}>
                          {renderFAQCard(faq)}
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <List
                      itemLayout="horizontal"
                      dataSource={filteredFAQs}
                      renderItem={renderFAQListItem}
                    />
                  )
                ) : (
                  <Empty
                    description={
                      <span>
                        No FAQs found matching your criteria. Try adjusting your
                        filters or search terms.
                      </span>
                    }
                  />
                )}
              </Card>

              <Card bordered={false} title="Need More Help?">
                <Row gutter={24}>
                  <Col xs={24} md={8}>
                    <Card bordered={false}>
                      <Meta
                        avatar={
                          <Avatar
                            icon={<CustomerServiceOutlined />}
                            style={{ backgroundColor: token.colorPrimary }}
                          />
                        }
                        title="Contact Support"
                        description="Our support team is available to help you with any questions or issues."
                      />
                      <Button type="primary" style={{ marginTop: 16 }}>
                        Contact Us
                      </Button>
                    </Card>
                  </Col>
                  <Col xs={24} md={8}>
                    <Card bordered={false}>
                      <Meta
                        avatar={
                          <Avatar
                            icon={<RobotOutlined />}
                            style={{ backgroundColor: token.colorSuccess }}
                          />
                        }
                        title="AI Assistant"
                        description="Get instant answers to your questions with our AI assistant."
                      />
                      <Button type="primary" style={{ marginTop: 16 }}>
                        Chat Now
                      </Button>
                    </Card>
                  </Col>
                  <Col xs={24} md={8}>
                    <Card bordered={false}>
                      <Meta
                        avatar={
                          <Avatar
                            icon={<PlayCircleOutlined />}
                            style={{ backgroundColor: token.colorWarning }}
                          />
                        }
                        title="Video Tutorials"
                        description="Watch step-by-step video guides for common tasks."
                      />
                      <Button type="primary" style={{ marginTop: 16 }}>
                        Watch Videos
                      </Button>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Content>
          </Layout>
        </Layout>

        <FloatButton.Group
          trigger="hover"
          style={{ right: 24, bottom: 24 }}
          icon={<QuestionCircleOutlined />}
        >
          <FloatButton
            icon={<CustomerServiceOutlined />}
            tooltip="Contact Support"
          />
          <FloatButton icon={<MessageOutlined />} tooltip="Live Chat" />
          <FloatButton icon={<RobotOutlined />} tooltip="AI Assistant" />
          <FloatButton
            icon={<UpOutlined />}
            tooltip="Back to Top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          />
        </FloatButton.Group>

        {/* FAQ Detail Drawer */}
        <Drawer
          title={
            selectedFAQ && (
              <Space>
                <Title level={4} style={{ margin: 0 }}>
                  {selectedFAQ.question}
                </Title>
                <Button
                  type="text"
                  icon={
                    savedFAQs.includes(selectedFAQ.id) ? (
                      <StarFilled style={{ color: token.colorPrimary }} />
                    ) : (
                      <StarOutlined />
                    )
                  }
                  onClick={() => toggleSavedFAQ(selectedFAQ.id)}
                />
              </Space>
            )
          }
          placement="right"
          width={720}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          extra={
            <Space>
              <Button icon={<PrinterOutlined />}>Print</Button>
              <Button icon={<ShareAltOutlined />}>Share</Button>
              <Button type="primary" onClick={() => showFeedback(selectedFAQ)}>
                Was this helpful?
              </Button>
            </Space>
          }
        >
          {selectedFAQ && (
            <>
              <Skeleton loading={loading} active paragraph={{ rows: 10 }}>
                <div className="faq-detail">
                  <Row gutter={[0, 24]}>
                    <Col span={24}>
                      <Card bordered={false} className="faq-answer-card">
                        <Paragraph>{selectedFAQ.answer}</Paragraph>

                        <Space size={[0, 8]} wrap style={{ marginTop: 16 }}>
                          {selectedFAQ.tags.map((tag, index) => (
                            <Tag color="blue" key={index}>
                              {tag}
                            </Tag>
                          ))}
                        </Space>
                      </Card>
                    </Col>

                    {selectedFAQ.steps && (
                      <Col span={24}>
                        <Card
                          title={
                            <Space>
                              <OrderedListOutlined /> Step-by-Step Guide
                            </Space>
                          }
                          bordered={false}
                        >
                          <Steps
                            direction="vertical"
                            current={-1}
                            items={selectedFAQ.steps.map((step, index) => ({
                              title: `Step ${index + 1}`,
                              description: step,
                            }))}
                          />
                        </Card>
                      </Col>
                    )}

                    {selectedFAQ.troubleshootingTree && (
                      <Col span={24}>
                        <Card
                          title={
                            <Space>
                              <ApiOutlined /> Troubleshooting Guide
                            </Space>
                          }
                          bordered={false}
                        >
                          <Collapse>
                            {selectedFAQ.troubleshootingTree.map(
                              (item, index) => (
                                <Collapse.Panel header={item.issue} key={index}>
                                  <List
                                    dataSource={item.solutions}
                                    renderItem={(solution, i) => (
                                      <List.Item key={i}>
                                        <Space>
                                          <CheckCircleOutlined
                                            style={{
                                              color: token.colorSuccess,
                                            }}
                                          />
                                          {solution}
                                        </Space>
                                      </List.Item>
                                    )}
                                  />
                                </Collapse.Panel>
                              )
                            )}
                          </Collapse>
                        </Card>
                      </Col>
                    )}

                    {selectedFAQ.browserCompatibility && (
                      <Col span={24}>
                        <Card
                          title={
                            <Space>
                              <GlobalOutlined /> Browser Compatibility
                            </Space>
                          }
                          bordered={false}
                        >
                          <List
                            dataSource={selectedFAQ.browserCompatibility}
                            renderItem={(item) => (
                              <List.Item
                                key={item.browser}
                                actions={[
                                  <Tag
                                    color={
                                      item.support === "Full"
                                        ? "success"
                                        : "error"
                                    }
                                  >
                                    {item.support}
                                  </Tag>,
                                ]}
                              >
                                <List.Item.Meta
                                  title={item.browser}
                                  description={`Version ${item.version}`}
                                />
                              </List.Item>
                            )}
                          />
                        </Card>
                      </Col>
                    )}

                    {selectedFAQ.relatedQuestions &&
                      selectedFAQ.relatedQuestions.length > 0 && (
                        <Col span={24}>
                          <Card
                            title={
                              <Space>
                                <LinkOutlined /> Related Questions
                              </Space>
                            }
                            bordered={false}
                          >
                            <List
                              dataSource={getRelatedFAQs(
                                selectedFAQ.relatedQuestions
                              )}
                              renderItem={(relatedFAQ) => (
                                <List.Item
                                  key={relatedFAQ.id}
                                  actions={[
                                    <Button
                                      type="link"
                                      onClick={() => setSelectedFAQ(relatedFAQ)}
                                    >
                                      View
                                    </Button>,
                                  ]}
                                >
                                  <List.Item.Meta
                                    title={relatedFAQ.question}
                                    description={
                                      <Space size={[0, 8]} wrap>
                                        {relatedFAQ.tags.map((tag, index) => (
                                          <Tag
                                            color="blue"
                                            key={index}
                                            style={{ marginRight: 0 }}
                                          >
                                            {tag}
                                          </Tag>
                                        ))}
                                      </Space>
                                    }
                                  />
                                </List.Item>
                              )}
                            />
                          </Card>
                        </Col>
                      )}

                    <Col span={24}>
                      <Card bordered={false}>
                        <Row gutter={16} align="middle">
                          <Col>
                            <Text type="secondary">
                              Last updated: {selectedFAQ.lastUpdated}
                            </Text>
                          </Col>
                          <Col flex="auto">
                            <Divider type="vertical" style={{ height: 20 }} />
                          </Col>
                          <Col>
                            <Space>
                              <Tooltip title="Views">
                                <Space>
                                  <EyeOutlined />
                                  <Text>{selectedFAQ.views}</Text>
                                </Space>
                              </Tooltip>
                              <Divider type="vertical" style={{ height: 20 }} />
                              <Tooltip title="Helpful ratings">
                                <Space>
                                  <LikeOutlined />
                                  <Text>{selectedFAQ.helpful}</Text>
                                </Space>
                              </Tooltip>
                            </Space>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Skeleton>
            </>
          )}
        </Drawer>

        {/* Analytics Drawer */}
        <Drawer
          title={
            <Space>
              <BarChartOutlined /> FAQ Analytics Dashboard
            </Space>
          }
          placement="right"
          width={720}
          onClose={() => setAnalyticsDrawerVisible(false)}
          open={analyticsDrawerVisible}
        >
          <Row gutter={[16, 24]}>
            <Col span={8}>
              <Card bordered={false}>
                <Statistic
                  title="Total Views"
                  value={analyticsData.totalViews}
                  prefix={<EyeOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                <Statistic
                  title="Helpful Ratings"
                  value={analyticsData.helpfulRatings}
                  prefix={<LikeOutlined />}
                  valueStyle={{ color: token.colorSuccess }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                <Statistic
                  title="Search Count"
                  value={analyticsData.searchCount}
                  prefix={<SearchOutlined />}
                />
              </Card>
            </Col>

            <Col span={12}>
              <Card title="Top Categories" bordered={false}>
                {analyticsData.topCategories.map((category, index) => (
                  <div key={index} style={{ marginBottom: 12 }}>
                    <Space style={{ marginBottom: 4 }}>
                      <Text>{category.name}</Text>
                      <Text type="secondary">{category.count} views</Text>
                    </Space>
                    <Progress percent={category.percent} showInfo={false} />
                  </div>
                ))}
              </Card>
            </Col>

            <Col span={12}>
              <Card title="Most Popular Questions" bordered={false}>
                <List
                  dataSource={analyticsData.popularQuestions}
                  renderItem={(item, index) => (
                    <List.Item
                      key={item.question}
                      actions={[
                        <Text type="secondary">{item.views} views</Text>,
                      ]}
                    >
                      <Text>
                        {index + 1}. {item.question}
                      </Text>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            <Col span={24}>
              <Card title="Recent Activity" bordered={false}>
                <Timeline
                  items={[
                    {
                      color: "green",
                      children: (
                        <>
                          <Text strong>FAQ Updated</Text>
                          <Paragraph>
                            "How do I reset my student portal password?" was
                            updated
                          </Paragraph>
                          <Text type="secondary">2 hours ago</Text>
                        </>
                      ),
                    },
                    {
                      color: "blue",
                      children: (
                        <>
                          <Text strong>New FAQ Added</Text>
                          <Paragraph>
                            "How do I enable two-factor authentication?" was
                            added to Authentication
                          </Paragraph>
                          <Text type="secondary">1 day ago</Text>
                        </>
                      ),
                    },
                    {
                      color: "red",
                      children: (
                        <>
                          <Text strong>FAQ Removed</Text>
                          <Paragraph>
                            "How do I access the old student portal?" was
                            removed
                          </Paragraph>
                          <Text type="secondary">3 days ago</Text>
                        </>
                      ),
                    },
                    {
                      color: "gray",
                      children: (
                        <>
                          <Text strong>Category Reorganized</Text>
                          <Paragraph>
                            Technical Support category was reorganized
                          </Paragraph>
                          <Text type="secondary">1 week ago</Text>
                        </>
                      ),
                    },
                  ]}
                />
              </Card>
            </Col>
          </Row>
        </Drawer>

        {/* Filter Drawer */}
        <Drawer
          title="Filter FAQs"
          placement="right"
          onClose={() => setFilterDrawerVisible(false)}
          open={filterDrawerVisible}
          extra={<Button onClick={resetFilters}>Reset</Button>}
        >
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <div>
              <Title level={5}>Complexity Level</Title>
              <Checkbox.Group
                options={[
                  { label: "Basic", value: "basic" },
                  { label: "Intermediate", value: "intermediate" },
                  { label: "Advanced", value: "advanced" },
                ]}
                value={filters.complexity}
                onChange={(values) =>
                  setFilters({ ...filters, complexity: values })
                }
              />
            </div>

            <div>
              <Title level={5}>Last Updated</Title>
              <Radio.Group
                value={filters.lastUpdated}
                onChange={(e) =>
                  setFilters({ ...filters, lastUpdated: e.target.value })
                }
              >
                <Space direction="vertical">
                  <Radio value={null}>Any time</Radio>
                  <Radio value={1}>Last month</Radio>
                  <Radio value={3}>Last 3 months</Radio>
                  <Radio value={6}>Last 6 months</Radio>
                  <Radio value={12}>Last year</Radio>
                </Space>
              </Radio.Group>
            </div>

            <div>
              <Title level={5}>Tags</Title>
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="Select tags"
                value={filters.tags}
                onChange={(values) => setFilters({ ...filters, tags: values })}
                options={allTags.map((tag) => ({ label: tag, value: tag }))}
              />
            </div>

            <div>
              <Title level={5}>Sort By</Title>
              <Radio.Group
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <Space direction="vertical">
                  <Radio value="relevance">Relevance</Radio>
                  <Radio value="views">Most Viewed</Radio>
                  <Radio value="helpful">Most Helpful</Radio>
                  <Radio value="recent">Recently Updated</Radio>
                  <Radio value="alphabetical">Alphabetical</Radio>
                </Space>
              </Radio.Group>
            </div>
          </Space>
        </Drawer>

        {/* Feedback Modal */}
        <Modal
          title="Was this FAQ helpful?"
          open={feedbackVisible}
          onCancel={() => setFeedbackVisible(false)}
          footer={[
            <Button key="cancel" onClick={() => setFeedbackVisible(false)}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => setFeedbackVisible(false)}
            >
              Submit Feedback
            </Button>,
          ]}
        >
          {feedbackFAQ && (
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <div>
                <Title level={5}>{feedbackFAQ.question}</Title>
                <Rate allowHalf defaultValue={4.5} />
              </div>

              <div>
                <Title level={5}>What could we improve?</Title>
                <Checkbox.Group
                  options={[
                    { label: "Clarity", value: "clarity" },
                    { label: "Completeness", value: "completeness" },
                    { label: "Accuracy", value: "accuracy" },
                    { label: "Examples", value: "examples" },
                    { label: "Organization", value: "organization" },
                  ]}
                />
              </div>

              <div>
                <Title level={5}>Additional Comments</Title>
                <Input.TextArea
                  rows={4}
                  placeholder="Please share any additional feedback..."
                />
              </div>
            </Space>
          )}
        </Modal>
      </Layout>
    </ConfigProvider>
  );
};

export default AdvancedFAQPortal;
