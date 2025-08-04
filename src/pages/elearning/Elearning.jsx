import React, { useState } from "react";
import { Spin } from "antd";
import { Helmet } from "react-helmet";

function News() {
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div className="news-container" style={{ position: "relative" }}>
      <Helmet>
        <title>E-Learning - Nkumba University</title>
        <meta
          name="description"
          content="Stay updated with the latest news and access e-learning resources at Nkumba University."
        />
        <meta
          name="keywords"
          content="news, e-learning, Nkumba University, university updates, online learning"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Nkumba University" />
      </Helmet>
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 1,
          }}
        >
          <Spin size="large" />
        </div>
      )}
      <iframe
        src="https://elearning.nkumbauniversity.ac.ug/"
        title="Nkumba University Elearning"
        className="w-full border-0 rounded-md"
        style={{ height: "auto", minHeight: "600px", width: "100%" }}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        onLoad={handleLoad}
      />
    </div>
  );
}

export default News;
