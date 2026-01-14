// AuthLayout.jsx
import React from "react";

const AuthLayout = ({ children }) => {
  const bgImage = "/assests/bgImage.png";

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, rgba(0, 0, 0, 0.70) 100%), url(${bgImage})`,
      }}
    >
      <div className="w-full min-h-screen relative z-10" style={{ minHeight: "100vh" }}>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
