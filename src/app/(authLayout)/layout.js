// AuthLayout.jsx
import React from "react";

const AuthLayout = ({ children }) => {
  const bgImage = "https://i.ibb.co.com/C5dPm7xb/Frame-2147226698.png"; // You can define the bgImage variable here or pass it as a prop

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
