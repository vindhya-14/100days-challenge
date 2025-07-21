import React, { useState, useRef } from "react";
import "./OtpInput.css";

const OtpInput = ({ length = 6, onOtpSubmit }) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    if (newOtp.every((val) => val !== "")) {
      onOtpSubmit?.(newOtp.join(""));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, length);
    if (/^\d+$/.test(paste)) {
      const newOtp = paste.split("").slice(0, length);
      setOtp(newOtp);
      newOtp.forEach((digit, i) => {
        inputRefs.current[i].value = digit;
      });
      onOtpSubmit?.(newOtp.join(""));
    }
    e.preventDefault();
  };

  return (
    <div className="otp-container">
      {otp.map((_, i) => (
        <input
          key={i}
          type="text"
          maxLength={1}
          className="otp-input"
          ref={(el) => (inputRefs.current[i] = el)}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
};

export default OtpInput;
