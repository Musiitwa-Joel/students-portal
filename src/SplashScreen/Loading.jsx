import React from "react";
import "./Loading.css"; // Assuming your CSS is in Loader.css
import loaderImage from "/assets/splash/loader.png"; // Update with the path to your loader image

function Loading() {
  return (
    <div className="loader-container">
      <img src={loaderImage} alt="Loading..." className="loader" />
    </div>
  );
}

export default Loading;
