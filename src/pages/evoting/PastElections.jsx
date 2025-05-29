import { useState } from "react";
import { Card, Button, Input, Select, Badge, Tooltip, DatePicker } from "antd";
import {
  History,
  Search,
  BarChart,
  PieChart,
  Trophy,
  Info,
  Filter,
  Calendar,
  Download,
  Share2,
} from "lucide-react";
import dayjs from "dayjs";

// Mock data for past elections
const pastElections = [
  {
    id: 101,
    title: "Makerere University Guild Presidential Election 2022/2023",
    endDate: dayjs().subtract(6, "month"),
    description:
      "Election for the Guild President who represented student interests for the 2022/2023 academic year.",
    totalVotes: 3245,
    turnout: "78%",
    candidates: [
      {
        id: 1,
        name: "Alionzi Lawrence",
        party: "UYD",
        votes: 1423,
        manifesto: "Improved student welfare and accommodation facilities",
        image:
          "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
        color: "#FFD700",
      },
      {
        id: 2,
        name: "Bbosa Price",
        party: "Independent",
        votes: 989,
        manifesto: "Better internet and library facilities",
        image:
          "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
        color: "#000000",
      },
      {
        id: 3,
        name: "Katushabe Kenneth",
        party: "NRM",
        votes: 833,
        manifesto: "More student scholarships and internship opportunities",
        image:
          "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
        color: "#DC143C",
      },
    ],
  },
  {
    id: 102,
    title: "Kyambogo University Student Council Representatives 2022",
    endDate: dayjs().subtract(8, "month"),
    description:
      "Election for faculty representatives to the Student Council for effective representation of academic concerns.",
    totalVotes: 2176,
    turnout: "65%",
    candidates: [
      {
        id: 1,
        name: "Namubiru Sarah",
        party: "Independent",
        votes: 912,
        manifesto: "Push for practical-oriented curriculum",
        image:
          "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
        color: "#000000",
      },
      {
        id: 2,
        name: "Mugisha Brian",
        party: "UYD",
        votes: 798,
        manifesto: "Advocate for more research opportunities",
        image:
          "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
        color: "#FFD700",
      },
      {
        id: 3,
        name: "Nabukenya Joyce",
        party: "NRM",
        votes: 466,
        manifesto: "Better faculty facilities and equipment",
        image:
          "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
        color: "#DC143C",
      },
    ],
  },
  {
    id: 103,
    title: "Mbarara University of Science & Technology Health Minister 2022",
    endDate: dayjs().subtract(10, "month"),
    description:
      "Election for the Health Minister who oversaw health-related concerns and initiatives on campus.",
    totalVotes: 1854,
    turnout: "72%",
    candidates: [
      {
        id: 1,
        name: "Tumusiime Peter",
        party: "Independent",
        votes: 745,
        manifesto: "Improved campus clinic services",
        image:
          "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
        color: "#000000",
      },
      {
        id: 2,
        name: "Namukwaya Esther",
        party: "UYD",
        votes: 631,
        manifesto: "Mental health awareness and support",
        image:
          "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
        color: "#FFD700",
      },
      {
        id: 3,
        name: "Mugisha Robert",
        party: "NRM",
        votes: 478,
        manifesto: "Regular health checkups and campaigns",
        image:
          "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
        color: "#DC143C",
      },
    ],
  },
  {
    id: 104,
    title: "Uganda Christian University Student Guild Elections 2022",
    endDate: dayjs().subtract(9, "month"),
    description:
      "Election for the Student Guild leadership positions at Uganda Christian University.",
    totalVotes: 2543,
    turnout: "81%",
    candidates: [
      {
        id: 1,
        name: "Nsubuga Timothy",
        party: "Independent",
        votes: 1243,
        manifesto: "Enhanced spiritual and academic growth",
        image:
          "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
        color: "#000000",
      },
      {
        id: 2,
        name: "Nakato Rebecca",
        party: "UYD",
        votes: 831,
        manifesto: "Better student welfare and community outreach",
        image:
          "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
        color: "#FFD700",
      },
      {
        id: 3,
        name: "Okello James",
        party: "NRM",
        votes: 469,
        manifesto: "Improved campus facilities and student services",
        image:
          "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
        color: "#DC143C",
      },
    ],
  },
];

export default function PastElections() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState([null, null]);
  const [expandedElection, setExpandedElection] = useState(null);
  const [activeResultTab, setActiveResultTab] = useState({});

  // Initialize active result tabs
  useState(() => {
    const initialTabs = {};
    pastElections.forEach((election) => {
      initialTabs[election.id] = "podium";
    });
    setActiveResultTab(initialTabs);
  });

  // Filter elections based on search term, filter type, and date range
  const filteredElections = pastElections.filter((election) => {
    // Search term filter
    const matchesSearch =
      election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      election.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      election.candidates.some(
        (candidate) =>
          candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.party.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Filter type
    const matchesFilter =
      filterType === "all" ||
      (filterType === "high-turnout" &&
        Number.parseInt(election.turnout) > 70) ||
      (filterType === "recent" &&
        election.endDate.isAfter(dayjs().subtract(6, "month")));

    // Date range filter
    const matchesDateRange =
      !dateRange[0] ||
      !dateRange[1] ||
      (election.endDate.isAfter(dateRange[0]) &&
        election.endDate.isBefore(dateRange[1]));

    return matchesSearch && matchesFilter && matchesDateRange;
  });

  // Function to render the podium (ladder) for winners
  const renderPodium = (election) => {
    // Sort candidates by votes (descending)
    const sortedCandidates = [...election.candidates].sort(
      (a, b) => b.votes - a.votes
    );

    // Get top 3 candidates
    const topThree = sortedCandidates.slice(0, 3);

    // If less than 3 candidates, fill with empty slots
    while (topThree.length < 3) {
      topThree.push(null);
    }

    // Arrange in podium order: 2nd, 1st, 3rd
    const podiumOrder = [topThree[1], topThree[0], topThree[2]];

    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          height: "280px",
          padding: "20px 0",
          position: "relative",
        }}
      >
        {/* Background with Uganda flag colors */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            right: "0",
            height: "10px",
            background:
              "linear-gradient(to right, #000000 33%, #FFD700 33%, #FFD700 66%, #DC143C 66%)",
            zIndex: "0",
          }}
        ></div>

        {podiumOrder.map((candidate, index) => {
          if (!candidate)
            return (
              <div
                key={`empty-${index}`}
                style={{
                  width: "120px",
                  height:
                    index === 1 ? "200px" : index === 0 ? "160px" : "120px",
                  margin: "0 10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "40px",
                    backgroundColor: "#e5e7eb",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#9ca3af",
                    fontWeight: "bold",
                  }}
                >
                  EMPTY
                </div>
              </div>
            );

          const position = index === 1 ? 1 : index === 0 ? 2 : 3;
          const height =
            position === 1 ? "200px" : position === 2 ? "160px" : "120px";
          const podiumHeight =
            position === 1 ? "40px" : position === 2 ? "40px" : "40px";

          return (
            <div
              key={candidate.id}
              style={{
                width: "120px",
                height: height,
                margin: "0 10px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                position: "relative",
                zIndex: "1",
              }}
            >
              {/* Medal/Trophy for winner */}
              {position === 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: "-20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: "2",
                  }}
                >
                  <Trophy
                    style={{ height: "40px", width: "40px", color: "#FFD700" }}
                  />
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    width: "70px",
                    height: "70px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: `3px solid ${
                      position === 1
                        ? "#FFD700"
                        : position === 2
                        ? "#C0C0C0"
                        : "#CD7F32"
                    }`,
                    marginBottom: "8px",
                    backgroundColor: "white",
                  }}
                >
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
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "14px",
                    textAlign: "center",
                    maxWidth: "100px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {candidate.name}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6B7280",
                    marginBottom: "4px",
                  }}
                >
                  {candidate.votes} votes
                </div>
                <div
                  style={{
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "11px",
                    fontWeight: "500",
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
              </div>

              <div
                style={{
                  width: "100%",
                  height: podiumHeight,
                  backgroundColor:
                    position === 1
                      ? "#FFD700"
                      : position === 2
                      ? "#C0C0C0"
                      : "#CD7F32",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#000",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                {position}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Function to render bar chart for results
  const renderBarChart = (election) => {
    const maxVotes = Math.max(...election.candidates.map((c) => c.votes));

    return (
      <div style={{ padding: "20px 0" }}>
        <h4
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          Vote Distribution
        </h4>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {election.candidates.map((candidate) => {
            const percentage = Math.round(
              (candidate.votes / election.totalVotes) * 100
            );
            const barWidth = `${(candidate.votes / maxVotes) * 100}%`;

            return (
              <div
                key={candidate.id}
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
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

                <div style={{ flex: "1" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "500", fontSize: "14px" }}>
                        {candidate.name}
                      </span>
                      <span
                        style={{
                          marginLeft: "8px",
                          fontSize: "12px",
                          color: "#6B7280",
                          backgroundColor: "#F3F4F6",
                          padding: "1px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        {candidate.party}
                      </span>
                    </div>
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>
                      {candidate.votes} ({percentage}%)
                    </div>
                  </div>

                  <div
                    style={{
                      height: "12px",
                      backgroundColor: "#F3F4F6",
                      borderRadius: "6px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: barWidth,
                        backgroundColor: candidate.color,
                        borderRadius: "6px",
                        transition: "width 1s ease-out",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "14px",
            color: "#6B7280",
          }}
        >
          Total Votes: {election.totalVotes}
        </div>
      </div>
    );
  };

  // Function to render pie chart for results
  const renderPieChart = (election) => {
    // Calculate total angle for each candidate (in degrees)
    const totalVotes = election.totalVotes;
    let startAngle = 0;
    const segments = election.candidates.map((candidate) => {
      const percentage = candidate.votes / totalVotes;
      const degrees = percentage * 360;
      const segment = {
        candidate,
        startAngle,
        endAngle: startAngle + degrees,
        percentage: Math.round(percentage * 100),
      };
      startAngle += degrees;
      return segment;
    });

    // Size of the pie chart
    const size = 200;
    const radius = size / 2;
    const centerX = radius;
    const centerY = radius;

    return (
      <div
        style={{
          padding: "20px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h4
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          Vote Percentage
        </h4>

        <div
          style={{
            position: "relative",
            width: `${size}px`,
            height: `${size}px`,
          }}
        >
          {segments.map((segment, index) => {
            // Convert angles to radians for calculations
            const startRad = (segment.startAngle - 90) * (Math.PI / 180);
            const endRad = (segment.endAngle - 90) * (Math.PI / 180);

            // Calculate SVG arc path
            const x1 = centerX + radius * Math.cos(startRad);
            const y1 = centerY + radius * Math.sin(startRad);
            const x2 = centerX + radius * Math.cos(endRad);
            const y2 = centerY + radius * Math.sin(endRad);

            // Determine if the arc should take the long path (> 180 degrees)
            const largeArcFlag =
              segment.endAngle - segment.startAngle > 180 ? 1 : 0;

            // Create SVG path
            const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

            return (
              <svg
                key={index}
                width={size}
                height={size}
                style={{ position: "absolute", top: 0, left: 0 }}
              >
                <path
                  d={path}
                  fill={segment.candidate.color}
                  stroke="#fff"
                  strokeWidth="1"
                />

                {/* Add percentage label if segment is large enough */}
                {segment.percentage >= 10 && (
                  <text
                    x={
                      centerX +
                      radius *
                        0.6 *
                        Math.cos(
                          ((segment.startAngle + segment.endAngle) / 2) *
                            (Math.PI / 180) -
                            Math.PI / 2
                        )
                    }
                    y={
                      centerY +
                      radius *
                        0.6 *
                        Math.sin(
                          ((segment.startAngle + segment.endAngle) / 2) *
                            (Math.PI / 180) -
                            Math.PI / 2
                        )
                    }
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#fff"
                    fontWeight="bold"
                    fontSize="14"
                  >
                    {segment.percentage}%
                  </text>
                )}
              </svg>
            );
          })}
        </div>

        <div
          style={{
            marginTop: "30px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          {election.candidates.map((candidate) => {
            const percentage = Math.round((candidate.votes / totalVotes) * 100);

            return (
              <div
                key={candidate.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  minWidth: "120px",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: candidate.color,
                    borderRadius: "4px",
                  }}
                ></div>
                <div>
                  <div style={{ fontSize: "14px", fontWeight: "500" }}>
                    {candidate.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#6B7280" }}>
                    {percentage}% ({candidate.votes})
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Function to render detailed statistics
  const renderStats = (election) => {
    const totalVotes = election.totalVotes;
    const winner = [...election.candidates].sort(
      (a, b) => b.votes - a.votes
    )[0];
    const winnerPercentage = Math.round((winner.votes / totalVotes) * 100);
    const totalCandidates = election.candidates.length;

    return (
      <div style={{ padding: "20px 0" }}>
        <h4
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          Election Statistics
        </h4>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              padding: "16px",
              backgroundColor: "#F9FAFB",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#6B7280",
                marginBottom: "4px",
              }}
            >
              Total Votes Cast
            </div>
            <div
              style={{ fontSize: "24px", fontWeight: "700", color: "#111827" }}
            >
              {totalVotes}
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              backgroundColor: "#F9FAFB",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#6B7280",
                marginBottom: "4px",
              }}
            >
              Voter Turnout
            </div>
            <div
              style={{ fontSize: "24px", fontWeight: "700", color: "#111827" }}
            >
              {election.turnout}
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              backgroundColor: "#F9FAFB",
              borderRadius: "8px",
              textAlign: "center",
              gridColumn: "span 2",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#6B7280",
                marginBottom: "4px",
              }}
            >
              Winner
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #FFD700",
                }}
              >
                <img
                  src={winner.image || "/placeholder.svg"}
                  alt={winner.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#111827",
                  }}
                >
                  {winner.name}
                </div>
                <div style={{ fontSize: "14px", color: "#6B7280" }}>
                  {winner.votes} votes ({winnerPercentage}%)
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h5
            style={{
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "12px",
            }}
          >
            Vote Distribution
          </h5>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#F3F4F6" }}>
                <th
                  style={{
                    padding: "8px 12px",
                    textAlign: "left",
                    fontSize: "13px",
                    fontWeight: "600",
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  Candidate
                </th>
                <th
                  style={{
                    padding: "8px 12px",
                    textAlign: "center",
                    fontSize: "13px",
                    fontWeight: "600",
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  Party
                </th>
                <th
                  style={{
                    padding: "8px 12px",
                    textAlign: "right",
                    fontSize: "13px",
                    fontWeight: "600",
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  Votes
                </th>
                <th
                  style={{
                    padding: "8px 12px",
                    textAlign: "right",
                    fontSize: "13px",
                    fontWeight: "600",
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody>
              {[...election.candidates]
                .sort((a, b) => b.votes - a.votes)
                .map((candidate) => {
                  const percentage = Math.round(
                    (candidate.votes / totalVotes) * 100
                  );
                  const isWinner = candidate.id === winner.id;

                  return (
                    <tr
                      key={candidate.id}
                      style={{
                        backgroundColor: isWinner
                          ? "rgba(255, 215, 0, 0.1)"
                          : "transparent",
                        borderBottom: "1px solid #E5E7EB",
                      }}
                    >
                      <td
                        style={{
                          padding: "8px 12px",
                          fontSize: "13px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {isWinner && (
                          <Trophy
                            style={{
                              height: "14px",
                              width: "14px",
                              color: "#FFD700",
                            }}
                          />
                        )}
                        {candidate.name}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          fontSize: "13px",
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "11px",
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
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          fontSize: "13px",
                          fontWeight: isWinner ? "600" : "normal",
                          textAlign: "right",
                        }}
                      >
                        {candidate.votes}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          fontSize: "13px",
                          fontWeight: isWinner ? "600" : "normal",
                          textAlign: "right",
                        }}
                      >
                        {percentage}%
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const containerStyle = {
    marginBottom: "24px",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "linear-gradient(to right, #4B5563, #6B7280, #374151)",
    padding: "16px",
    borderRadius: "8px",
    color: "white",
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
    color: "#4B5563",
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

  const tabsContainerStyle = {
    display: "flex",
    borderBottom: "1px solid #E5E7EB",
    marginBottom: "20px",
  };

  const tabStyle = (isActive) => ({
    padding: "12px 16px",
    fontWeight: "500",
    cursor: "pointer",
    borderBottom: isActive ? "2px solid #4B5563" : "none",
    color: isActive ? "#4B5563" : "#6B7280",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  });

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h2 style={headerTextStyle}>Past Elections</h2>
          <p style={headerSubtitleStyle}>
            Review results from previous university elections
          </p>
        </div>
        <Badge
          count={pastElections.length}
          overflowCount={10}
          style={{ backgroundColor: "#6B7280", color: "#FFF" }}
        >
          <div style={badgeContainerStyle}>
            <History style={iconStyle} />
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
            { value: "all", label: "All Elections" },
            { value: "high-turnout", label: "High Turnout (>70%)" },
            { value: "recent", label: "Recent (Last 6 Months)" },
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

      {/* Election Cards */}
      {filteredElections.length > 0 ? (
        filteredElections.map((election) => {
          const isExpanded = expandedElection === election.id;
          const winner = [...election.candidates].sort(
            (a, b) => b.votes - a.votes
          )[0];

          return (
            <Card
              key={election.id}
              style={isExpanded ? cardExpandedStyle : cardStyle}
              bodyStyle={{ padding: 0 }}
            >
              <div style={cardHeaderStyle}>
                <h3 style={cardTitleStyle}>{election.title}</h3>
                <div style={cardMetaStyle}>
                  <Calendar style={{ width: "14px", height: "14px" }} />
                  <span>{election.endDate.format("MMMM D, YYYY")}</span>
                </div>
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
                  {/* Winner Card */}
                  <div
                    style={{
                      flex: "1",
                      minWidth: "250px",
                      backgroundColor: "#F9FAFB",
                      borderRadius: "8px",
                      padding: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: "3px solid #FFD700",
                      }}
                    >
                      <img
                        src={winner.image || "/placeholder.svg"}
                        alt={winner.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6B7280",
                          marginBottom: "4px",
                        }}
                      >
                        Winner
                      </div>
                      <div style={{ fontSize: "16px", fontWeight: "600" }}>
                        {winner.name}
                      </div>
                      <div style={{ fontSize: "14px", color: "#6B7280" }}>
                        {Math.round((winner.votes / election.totalVotes) * 100)}
                        % of votes
                      </div>
                    </div>
                  </div>

                  {/* Election Stats */}
                  <div
                    style={{
                      flex: "1",
                      minWidth: "250px",
                      display: "flex",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        flex: "1",
                        backgroundColor: "#F9FAFB",
                        borderRadius: "8px",
                        padding: "16px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6B7280",
                          marginBottom: "4px",
                        }}
                      >
                        Total Votes
                      </div>
                      <div style={{ fontSize: "20px", fontWeight: "700" }}>
                        {election.totalVotes}
                      </div>
                    </div>
                    <div
                      style={{
                        flex: "1",
                        backgroundColor: "#F9FAFB",
                        borderRadius: "8px",
                        padding: "16px",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6B7280",
                          marginBottom: "4px",
                        }}
                      >
                        Turnout
                      </div>
                      <div style={{ fontSize: "20px", fontWeight: "700" }}>
                        {election.turnout}
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
                    {election.candidates.map((candidate) => (
                      <div
                        key={candidate.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          backgroundColor: "#F3F4F6",
                          padding: "4px 8px",
                          borderRadius: "16px",
                          fontSize: "12px",
                        }}
                      >
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            overflow: "hidden",
                          }}
                        >
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
                        <span>{candidate.name}</span>
                        <span
                          style={{
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
                            padding: "1px 6px",
                            borderRadius: "10px",
                            fontSize: "10px",
                          }}
                        >
                          {candidate.party}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {isExpanded && (
                  <div>
                    <div style={tabsContainerStyle}>
                      <div
                        onClick={() =>
                          setActiveResultTab({
                            ...activeResultTab,
                            [election.id]: "podium",
                          })
                        }
                        style={tabStyle(
                          activeResultTab[election.id] === "podium"
                        )}
                      >
                        <Trophy style={{ height: "16px", width: "16px" }} />
                        Winner Podium
                      </div>
                      <div
                        onClick={() =>
                          setActiveResultTab({
                            ...activeResultTab,
                            [election.id]: "bar",
                          })
                        }
                        style={tabStyle(activeResultTab[election.id] === "bar")}
                      >
                        <BarChart style={{ height: "16px", width: "16px" }} />
                        Bar Chart
                      </div>
                      <div
                        onClick={() =>
                          setActiveResultTab({
                            ...activeResultTab,
                            [election.id]: "pie",
                          })
                        }
                        style={tabStyle(activeResultTab[election.id] === "pie")}
                      >
                        <PieChart style={{ height: "16px", width: "16px" }} />
                        Pie Chart
                      </div>
                      <div
                        onClick={() =>
                          setActiveResultTab({
                            ...activeResultTab,
                            [election.id]: "stats",
                          })
                        }
                        style={tabStyle(
                          activeResultTab[election.id] === "stats"
                        )}
                      >
                        <Info style={{ height: "16px", width: "16px" }} />
                        Statistics
                      </div>
                    </div>

                    {activeResultTab[election.id] === "podium" &&
                      renderPodium(election)}
                    {activeResultTab[election.id] === "bar" &&
                      renderBarChart(election)}
                    {activeResultTab[election.id] === "pie" &&
                      renderPieChart(election)}
                    {activeResultTab[election.id] === "stats" &&
                      renderStats(election)}
                  </div>
                )}
              </div>

              <div style={cardActionsStyle}>
                {isExpanded ? (
                  <>
                    <Tooltip title="Download Results">
                      <Button
                        type="default"
                        icon={
                          <Download style={{ width: "16px", height: "16px" }} />
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Share Results">
                      <Button
                        type="default"
                        icon={
                          <Share2 style={{ width: "16px", height: "16px" }} />
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                    </Tooltip>
                    <Button
                      type="primary"
                      onClick={() => setExpandedElection(null)}
                      style={{
                        backgroundColor: "#4B5563",
                        borderColor: "#4B5563",
                      }}
                    >
                      Collapse
                    </Button>
                  </>
                ) : (
                  <Button
                    type="primary"
                    onClick={() => setExpandedElection(election.id)}
                    style={{
                      backgroundColor: "#4B5563",
                      borderColor: "#4B5563",
                    }}
                  >
                    View Detailed Results
                  </Button>
                )}
              </div>
            </Card>
          );
        })
      ) : (
        <div style={emptyStateStyle}>
          <History
            style={{
              width: "48px",
              height: "48px",
              color: "#9CA3AF",
              marginBottom: "16px",
            }}
          />
          <h3
            style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}
          >
            No past elections found
          </h3>
          <p
            style={{
              color: "#6B7280",
              textAlign: "center",
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            Try adjusting your search or filters to find past elections
          </p>
        </div>
      )}
    </div>
  );
}
