import { useState } from "react";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import UpcomingElections from "./UpcomingElections";
import Evoting from "./Evoting";
import PastElections from "./PastElections";

const cardData = [
  {
    id: 1,
    title: "Upcoming Elections",
    icon: "/assets/logos/comingSoon.png",
    route: "/upcoming-elections",
  },
  {
    id: 2,
    title: "Vote Now",
    icon: "/assets/logos/voteNow.png",
    route: "/vote-now",
  },
  {
    id: 3,
    title: "Previous Elections",
    icon: "/assets/logos/voteResults.png",
    route: "/previous-elections",
  },
];

const Component = () => {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleBackToCards = () => {
    setSelectedCard(null);
  };

  const renderCardContent = (card) => {
    switch (card.route) {
      case "/upcoming-elections":
        return <UpcomingElections />;
      case "/vote-now":
        return <Evoting />;
      case "/previous-elections":
        return <PastElections />;
      default:
        return <div>Content not found</div>;
    }
  };

  return (
    <>
      <style jsx>{`
        .container {
          min-height: calc(100vh - 200px);
          background: linear-gradient(
            135deg,
            rgb(255, 255, 255) 0%,
            #e9ecef 100%
          );
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 0.3rem 0.3rem;
          overflow: hidden;
        }
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          grid-gap: 1.5rem;
          max-width: 700px;
          width: 100%;
        }
        @media (min-width: 768px) {
          .cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 480px) {
          .cards-grid {
            grid-template-columns: 1fr;
            grid-gap: 1rem;
          }
        }
        .animated-card-wrapper {
          position: relative;
          border-radius: 8px;
          padding: 2px;
          background: linear-gradient(
            45deg,
            #ff6b6b,
            #4ecdc4,
            #45b7d1,
            #96ceb4,
            #feca57,
            #ff9ff3,
            #54a0ff
          );
          background-size: 400% 400%;
          animation: gradientShift 4s ease infinite;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: grid;
          place-items: center;
        }
        .animated-card-wrapper:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }
        .animated-card-wrapper:nth-child(1) {
          animation-delay: 0s;
        }
        .animated-card-wrapper:nth-child(2) {
          animation-delay: -1.3s;
        }
        .animated-card-wrapper:nth-child(3) {
          animation-delay: -2.6s;
        }
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .professional-card {
          border-radius: 6px;
          border: none;
          background: white;
          width: 100%;
          height: 100%;
          overflow: hidden;
          position: relative;
          display: grid;
        }
        .professional-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.8),
            transparent
          );
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .card-content {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-rows: auto auto 1fr;
          gap: 0.75rem;
          place-items: center;
          text-align: center;
          padding: 0.6rem;
        }
        .icon-container {
          display: grid;
          place-items: center;
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border-radius: 50%;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
          overflow: hidden;
        }
        .logo-image {
          width: 100px;
          height: 100px;
          object-fit: contain;
          border-radius: 4px;
        }
        .animated-card-wrapper:hover .icon-container {
          transform: scale(1.1) rotate(5deg);
        }
        .professional-card :global(.ant-card-body) {
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          padding: 0 !important;
          height: 100%;
          display: grid;
        }
        .card-title {
          background: linear-gradient(135deg, #2c3e50, #3498db);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          letter-spacing: -0.5px;
          font-size: 14px;
          margin: 0;
          grid-row: 2;
        }
        .card-description {
          line-height: 1.4;
          font-size: 12px;
          color: #6c757d;
          margin: 0;
          grid-row: 3;
          align-self: start;
        }
        .card-detail-content {
          max-width: "auto";
          width: 100%;
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.3s ease-in;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .back-button {
          background: linear-gradient(135deg, #3498db, #2c3e50);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          margin-bottom: 1.5rem;
          transition: transform 0.2s ease;
        }
        .back-button:hover {
          transform: translateY(-2px);
        }
        .election-list,
        .results-list {
          display: grid;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        .election-item,
        .result-item {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          border-left: 4px solid #3498db;
        }
        .voting-section {
          margin-top: 1.5rem;
        }
        .active-election {
          background: #f8f9fa;
          padding: 2rem;
          border-radius: 8px;
          text-align: center;
        }
        .candidate-list {
          display: grid;
          gap: 1rem;
          margin-top: 1rem;
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }
        .candidate-btn {
          background: linear-gradient(135deg, #4ecdc4, #45b7d1);
          color: white;
          border: none;
          padding: 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s ease;
        }
        .candidate-btn:hover {
          transform: translateY(-2px);
        }
      `}</style>
      <div className="container">
        {selectedCard ? (
          <div className="card-detail-content">
            <button
              className="back-button"
              onClick={() => setSelectedCard(null)}
            >
              ← Back to Menu
            </button>
            {renderCardContent(selectedCard)}
          </div>
        ) : (
          <div className="cards-grid">
            {cardData.map((card) => (
              <div
                key={card.id}
                className="animated-card-wrapper"
                onClick={() => handleCardClick(card)}
                style={{ cursor: "pointer" }}
              >
                <Card className="professional-card">
                  <div className="card-content">
                    <div className="icon-container">
                      <img
                        src={card.icon || "/placeholder.svg"}
                        alt={`${card.title} logo`}
                        className="logo-image"
                      />
                    </div>
                    <h3 className="card-title">{card.title}</h3>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Component;
