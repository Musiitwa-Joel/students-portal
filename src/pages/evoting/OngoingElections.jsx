import { useState, useEffect } from "react";
import { Card, Button, Badge, Modal, Radio, Space, message, Spin } from "antd";
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Award,
  Vote,
  BarChart,
  PieChart,
  Trophy,
} from "lucide-react";
import dayjs from "dayjs";

// Update the mock data to include candidate images and colors
const ongoingElections = [
  {
    id: 1,
    title: "Nkumba University Guild Presidential Election",
    endTime: dayjs().add(2, "day").add(5, "hour").add(23, "minute"),
    description:
      "Vote for your next Guild President who will represent student interests for the 2023/2024 academic year.",
    totalVotes: 1243,
    candidates: [
      {
        id: 1,
        name: "Namugwanya Sarah",
        party: "UYD",
        votes: 423,
        manifesto: "Improve student welfare and accommodation",
        image:
          "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
        color: "#FFD700",
      },
      {
        id: 2,
        name: "Mukasa David",
        party: "Independent",
        votes: 389,
        manifesto: "Better internet and library facilities",
        image:
          "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100125",
        color: "#000000",
      },
      {
        id: 3,
        name: "Okello James",
        party: "NRM",
        votes: 431,
        manifesto: "More student scholarships and internship opportunities",
        image:
          "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100539",
        color: "#DC143C",
      },
    ],
  },
  {
    id: 2,
    title: "Nkumba University Student Council Representatives",
    endTime: dayjs().add(1, "day").add(8, "hour").add(45, "minute"),
    description:
      "Elect your faculty representatives to the Student Council for effective representation of academic concerns.",
    totalVotes: 876,
    candidates: [
      {
        id: 1,
        name: "Nantongo Mary",
        party: "Independent",
        votes: 312,
        manifesto: "Push for practical-oriented curriculum",
        image:
          "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
        color: "#000000",
      },
      {
        id: 2,
        name: "Wasswa Brian",
        party: "UYD",
        votes: 298,
        manifesto: "Advocate for more research opportunities",
        image:
          "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
        color: "#FFD700",
      },
      {
        id: 3,
        name: "Nabukenya Joyce",
        party: "NRM",
        votes: 266,
        manifesto: "Better faculty facilities and equipment",
        image:
          "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
        color: "#DC143C",
      },
    ],
  },
  {
    id: 3,
    title: "Nkumba University of Science & Technology Health Minister",
    endTime: dayjs().add(12, "hour").add(30, "minute"),
    description:
      "Select your Health Minister who will oversee health-related concerns and initiatives on campus.",
    totalVotes: 654,
    candidates: [
      {
        id: 1,
        name: "Tumusiime Peter",
        party: "Independent",
        votes: 245,
        manifesto: "Improved campus clinic services",
        image:
          "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
        color: "#000000",
      },
      {
        id: 2,
        name: "Namukwaya Esther",
        party: "UYD",
        votes: 231,
        manifesto: "Mental health awareness and support",
        image:
          "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
        color: "#FFD700",
      },
      {
        id: 3,
        name: "Mugisha Robert",
        party: "NRM",
        votes: 178,
        manifesto: "Regular health checkups and campaigns",
        image:
          "https://student1.zeevarsity.com:8001/get_photo.yaws?ic=nkumba&stdno=2000100121",
        color: "#DC143C",
      },
    ],
  },
];

export default function OngoingElections() {
  const [timeLeft, setTimeLeft] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedElection, setSelectedElection] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [hasVoted, setHasVoted] = useState({});
  const [showResults, setShowResults] = useState({});
  const [isVoting, setIsVoting] = useState(false);
  const [showVoteSuccess, setShowVoteSuccess] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState({});

  // Add a function to check if an election has ended
  const isElectionEnded = (endTime) => {
    return dayjs().isAfter(endTime);
  };

  // Calculate time remaining for each election
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = {};

      ongoingElections.forEach((election) => {
        const difference = election.endTime.diff(dayjs(), "second");

        if (difference > 0) {
          const days = Math.floor(difference / (60 * 60 * 24));
          const hours = Math.floor((difference % (60 * 60 * 24)) / (60 * 60));
          const minutes = Math.floor((difference % (60 * 60)) / 60);
          const seconds = difference % 60;

          newTimeLeft[election.id] = { days, hours, minutes, seconds };
        } else {
          newTimeLeft[election.id] = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          };
        }
      });

      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Initialize active result tabs
  useEffect(() => {
    const initialTabs = {};
    ongoingElections.forEach((election) => {
      initialTabs[election.id] = "podium";
    });
    setActiveResultTab(initialTabs);
  }, []);

  const showVotingModal = (election) => {
    setSelectedElection(election);
    setSelectedCandidate(null);
    setIsModalOpen(true);
    setShowVoteSuccess(false);
  };

  const handleVote = () => {
    if (selectedCandidate === null) {
      message.error("Please select a candidate to vote");
      return;
    }

    setIsVoting(true);

    // Simulate voting process with a delay
    setTimeout(() => {
      setIsVoting(false);
      setShowVoteSuccess(true);

      // After showing success, update the state
      setTimeout(() => {
        setHasVoted({ ...hasVoted, [selectedElection.id]: true });
        setShowResults({ ...showResults, [selectedElection.id]: true });
        setIsModalOpen(false);
      }, 2000);
    }, 1500);
  };

  const getProgressColor = (index) => {
    const colors = ["#FFD700", "#DC143C", "#000000"]; // Uganda flag colors: yellow, red, black
    return colors[index % colors.length];
  };

  // Improved timer display
  const renderTimeLeft = (electionId) => {
    const time = timeLeft[electionId];
    const election = ongoingElections.find((e) => e.id === electionId);

    if (!time) return <span>Calculating...</span>;

    if (election && isElectionEnded(election.endTime)) {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <CheckCircle
            style={{
              height: "16px",
              width: "16px",
              marginRight: "8px",
              color: "#10B981",
            }}
          />
          <span style={{ color: "#10B981", fontWeight: "600" }}>
            Election Ended
          </span>
        </div>
      );
    }

    // Enhanced timer display
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          background:
            "linear-gradient(135deg, rgba(220,20,60,0.1) 0%, rgba(220,20,60,0.05) 100%)",
          padding: "4px 8px",
          borderRadius: "16px",
          border: "1px solid rgba(220,20,60,0.2)",
          whiteSpace: "nowrap",
          fontSize: "12px",
        }}
      >
        <Clock
          style={{
            height: "14px",
            width: "14px",
            marginRight: "6px",
            color: "#DC143C",
            flexShrink: 0,
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {time.days > 0 && (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "monospace",
                  fontWeight: 600,
                  fontSize: "12px",
                }}
              >
                {time.days}
              </div>
              <div style={{ fontSize: "8px", color: "#666" }}>DAYS</div>
            </div>
          )}

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "monospace",
                fontWeight: 600,
                fontSize: "12px",
              }}
            >
              {time.hours.toString().padStart(2, "0")}
            </div>
            <div style={{ fontSize: "8px", color: "#666" }}>HRS</div>
          </div>

          <div style={{ fontWeight: "bold", color: "#DC143C" }}>:</div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "monospace",
                fontWeight: 600,
                fontSize: "12px",
              }}
            >
              {time.minutes.toString().padStart(2, "0")}
            </div>
            <div style={{ fontSize: "8px", color: "#666" }}>MIN</div>
          </div>

          <div style={{ fontWeight: "bold", color: "#DC143C" }}>:</div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "monospace",
                fontWeight: 600,
                fontSize: "12px",
              }}
            >
              {time.seconds.toString().padStart(2, "0")}
            </div>
            <div style={{ fontSize: "8px", color: "#666" }}>SEC</div>
          </div>
        </div>
      </div>
    );
  };

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
              Number of Candidates
            </div>
            <div
              style={{ fontSize: "24px", fontWeight: "700", color: "#111827" }}
            >
              {totalCandidates}
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
    background: "linear-gradient(to right, #FFD700, #DC143C, #000000)",
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
    color: "black",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h2 style={headerTextStyle}>Ongoing Elections</h2>
          <p style={headerSubtitleStyle}>
            Cast your vote for current elections before they close
          </p>
        </div>
        <Badge
          count={ongoingElections.length}
          overflowCount={10}
          style={{ backgroundColor: "#FFD700", color: "#000" }}
        >
          <div style={badgeContainerStyle}>
            <Award style={iconStyle} />
          </div>
        </Badge>
      </div>

      {ongoingElections.map((election) => {
        const electionEnded = isElectionEnded(election.endTime);
        const showElectionResults = electionEnded || showResults[election.id];

        return (
          <Card
            key={election.id}
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "18px", fontWeight: "600" }}>
                  {election.title}
                </span>
                {renderTimeLeft(election.id)}
              </div>
            }
            style={{
              marginBottom: "24px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
            extra={
              hasVoted[election.id] || electionEnded ? (
                <Button
                  type="primary"
                  onClick={() =>
                    setShowResults({
                      ...showResults,
                      [election.id]: !showResults[election.id],
                    })
                  }
                  style={{
                    backgroundColor: "#4CAF50",
                    borderColor: "#4CAF50",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <BarChart style={{ height: "16px", width: "16px" }} />
                  {showResults[election.id] ? "Hide Results" : "View Results"}
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={() => showVotingModal(election)}
                  style={{
                    backgroundColor: "#DC143C",
                    borderColor: "#DC143C",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    padding: "0 16px",
                    height: "38px",
                  }}
                >
                  <Vote style={{ height: "16px", width: "16px" }} />
                  Vote Now
                </Button>
              )
            }
          >
            <p style={{ marginBottom: "20px", fontSize: "15px" }}>
              {election.description}
            </p>

            {!showElectionResults && (
              <div style={{ marginBottom: "24px" }}>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "16px",
                  }}
                >
                  Candidates
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                  {election.candidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      style={{
                        flex: "1 1 calc(33.333% - 16px)",
                        minWidth: "200px",
                        border: "1px solid #eee",
                        borderRadius: "8px",
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        backgroundColor: "#f9f9f9",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        cursor: "pointer",
                        position: "relative",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow =
                          "0 6px 12px rgba(0,0,0,0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          borderRadius: "50%",
                          overflow: "hidden",
                          marginBottom: "12px",
                          border: "3px solid",
                          borderColor: candidate.color,
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
                      <h4
                        style={{
                          margin: "0 0 4px 0",
                          fontSize: "16px",
                          fontWeight: "600",
                        }}
                      >
                        {candidate.name}
                      </h4>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "500",
                          marginBottom: "8px",
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
                      <p
                        style={{
                          fontSize: "13px",
                          margin: "0",
                          color: "#4B5563",
                        }}
                      >
                        {candidate.manifesto}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showElectionResults && (
              <div style={{ marginTop: "20px" }}>
                <div
                  style={{
                    display: "flex",
                    borderBottom: "1px solid #E5E7EB",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    onClick={() =>
                      setActiveResultTab({
                        ...activeResultTab,
                        [election.id]: "podium",
                      })
                    }
                    style={{
                      padding: "12px 16px",
                      fontWeight: "500",
                      cursor: "pointer",
                      borderBottom:
                        activeResultTab[election.id] === "podium"
                          ? "2px solid #DC143C"
                          : "none",
                      color:
                        activeResultTab[election.id] === "podium"
                          ? "#DC143C"
                          : "#6B7280",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
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
                    style={{
                      padding: "12px 16px",
                      fontWeight: "500",
                      cursor: "pointer",
                      borderBottom:
                        activeResultTab[election.id] === "bar"
                          ? "2px solid #DC143C"
                          : "none",
                      color:
                        activeResultTab[election.id] === "bar"
                          ? "#DC143C"
                          : "#6B7280",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
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
                    style={{
                      padding: "12px 16px",
                      fontWeight: "500",
                      cursor: "pointer",
                      borderBottom:
                        activeResultTab[election.id] === "pie"
                          ? "2px solid #DC143C"
                          : "none",
                      color:
                        activeResultTab[election.id] === "pie"
                          ? "#DC143C"
                          : "#6B7280",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
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
                    style={{
                      padding: "12px 16px",
                      fontWeight: "500",
                      cursor: "pointer",
                      borderBottom:
                        activeResultTab[election.id] === "stats"
                          ? "2px solid #DC143C"
                          : "none",
                      color:
                        activeResultTab[election.id] === "stats"
                          ? "#DC143C"
                          : "#6B7280",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
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

            {!showElectionResults && (
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#F9FAFB",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <Info
                  style={{ height: "20px", width: "20px", color: "#6B7280" }}
                />
                <p
                  style={{
                    margin: 0,
                    fontSize: "15px",
                    color: "#4B5563",
                    fontWeight: "500",
                  }}
                >
                  Results will be available after the election ends
                </p>
                <p style={{ margin: 0, fontSize: "13px", color: "#6B7280" }}>
                  Cast your vote before the deadline
                </p>
              </div>
            )}
          </Card>
        );
      })}

      {/* Improved Modal with better selection highlighting and voting animation */}
      <Modal
        title={selectedElection?.title}
        open={isModalOpen}
        onCancel={() => !isVoting && !showVoteSuccess && setIsModalOpen(false)}
        footer={[
          <Button
            key="cancel"
            onClick={() =>
              !isVoting && !showVoteSuccess && setIsModalOpen(false)
            }
            disabled={isVoting || showVoteSuccess}
          >
            Cancel
          </Button>,
          <Button
            key="vote"
            type="primary"
            onClick={handleVote}
            loading={isVoting}
            disabled={selectedCandidate === null || showVoteSuccess}
            style={{
              backgroundColor: "#DC143C",
              borderColor: "#DC143C",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              height: "38px",
            }}
          >
            {!isVoting && <Vote style={{ height: "16px", width: "16px" }} />}
            Cast Vote
          </Button>,
        ]}
        width={700}
        closable={!isVoting && !showVoteSuccess}
        maskClosable={!isVoting && !showVoteSuccess}
      >
        {selectedElection && !showVoteSuccess && (
          <>
            <div style={{ marginBottom: "20px" }}>
              <p style={{ fontSize: "15px" }}>{selectedElection.description}</p>
              <div
                style={{
                  marginTop: "12px",
                  padding: "12px",
                  backgroundColor: "#FFFBEB",
                  borderLeft: "4px solid #F59E0B",
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <AlertTriangle
                  style={{
                    height: "16px",
                    width: "16px",
                    marginRight: "8px",
                    color: "#F59E0B",
                  }}
                />
                <span>
                  Your vote is confidential and secure. You can only vote once.
                </span>
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <h3
                style={{
                  fontWeight: "600",
                  marginBottom: "16px",
                  fontSize: "16px",
                }}
              >
                Select your candidate:
              </h3>
              <Radio.Group
                onChange={(e) => setSelectedCandidate(e.target.value)}
                value={selectedCandidate}
                style={{ width: "100%" }}
                disabled={isVoting}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  {selectedElection.candidates.map((candidate) => {
                    const isSelected = selectedCandidate === candidate.id;

                    return (
                      <Radio
                        key={candidate.id}
                        value={candidate.id}
                        style={{
                          width: "100%",
                          border: isSelected
                            ? `2px solid ${candidate.color}`
                            : "1px solid #eee",
                          padding: "16px",
                          borderRadius: "8px",
                          marginBottom: "8px",
                          transition: "all 0.2s ease",
                          backgroundColor: isSelected
                            ? `${candidate.color}10`
                            : "white",
                          boxShadow: isSelected
                            ? `0 4px 8px ${candidate.color}30`
                            : "none",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <div
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "50%",
                              overflow: "hidden",
                              marginRight: "16px",
                              border: "2px solid",
                              borderColor: candidate.color,
                              transition: "transform 0.2s ease",
                              transform: isSelected ? "scale(1.1)" : "scale(1)",
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
                          <div>
                            <div
                              style={{ fontWeight: "600", fontSize: "16px" }}
                            >
                              {candidate.name}
                            </div>
                            <div
                              style={{
                                display: "inline-block",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                fontSize: "12px",
                                fontWeight: "500",
                                marginTop: "4px",
                                marginBottom: "8px",
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
                            <div style={{ fontSize: "14px", marginTop: "4px" }}>
                              {candidate.manifesto}
                            </div>
                          </div>
                        </div>
                      </Radio>
                    );
                  })}
                </Space>
              </Radio.Group>
            </div>
          </>
        )}

        {/* Vote Success Animation */}
        {showVoteSuccess && selectedElection && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "30px 0",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                backgroundColor: "#10B981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
                animation: "scale-in 0.5s ease-out",
              }}
            >
              <CheckCircle
                style={{ width: "40px", height: "40px", color: "white" }}
              />
            </div>

            <h3
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#111827",
                marginBottom: "12px",
              }}
            >
              Vote Cast Successfully!
            </h3>

            <p
              style={{
                fontSize: "16px",
                color: "#6B7280",
                marginBottom: "24px",
              }}
            >
              Thank you for participating in the {selectedElection.title}
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#F3F4F6",
                padding: "12px 20px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  marginRight: "16px",
                  border: "2px solid",
                  borderColor:
                    selectedElection.candidates.find(
                      (c) => c.id === selectedCandidate
                    )?.color || "#ccc",
                }}
              >
                <img
                  src={
                    selectedElection.candidates.find(
                      (c) => c.id === selectedCandidate
                    )?.image || "/placeholder.svg"
                  }
                  alt="Selected candidate"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: "600", fontSize: "16px" }}>
                  {
                    selectedElection.candidates.find(
                      (c) => c.id === selectedCandidate
                    )?.name
                  }
                </div>
                <div style={{ fontSize: "14px", color: "#6B7280" }}>
                  {
                    selectedElection.candidates.find(
                      (c) => c.id === selectedCandidate
                    )?.party
                  }
                </div>
              </div>
            </div>

            <Button
              type="primary"
              onClick={() => {
                setIsModalOpen(false);
                setShowResults({ ...showResults, [selectedElection.id]: true });
              }}
              style={{
                backgroundColor: "#4CAF50",
                borderColor: "#4CAF50",
              }}
            >
              View Results
            </Button>
          </div>
        )}

        {/* Loading Animation */}
        {isVoting && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 0",
              textAlign: "center",
            }}
          >
            <Spin size="large" />
            <p
              style={{ marginTop: "20px", fontSize: "16px", color: "#6B7280" }}
            >
              Processing your vote...
            </p>
          </div>
        )}
      </Modal>

      <style>
        {`
          @keyframes scale-in {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            60% {
              transform: scale(1.2);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          @keyframes pulse {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0.6;
            }
            100% {
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}
