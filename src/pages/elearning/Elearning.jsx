import React, { useState } from "react";
import { Spin } from "antd";

function News() {
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div className="news-container" style={{ position: "relative" }}>
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
