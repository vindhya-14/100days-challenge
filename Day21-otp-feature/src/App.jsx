import React from "react";
import OtpInput from "../../Day22-CountDown-Timer/frontend/src/component/OtpInput";


function App() {
  const handleOtpSubmit = (otp) => {
    alert("OTP entered: " + otp);
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Enter OTP</h2>
      <OtpInput length={6} onOtpSubmit={handleOtpSubmit} />
    </div>
  );
}

export default App;
