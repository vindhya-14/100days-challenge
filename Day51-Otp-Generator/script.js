let generatedOTP = "";
let countdown;
let timeLeft = 0;

document.getElementById("generateBtn").addEventListener("click", generateOTP);
document.getElementById("verifyBtn").addEventListener("click", verifyOTP);

function generateOTP() {
  // Generate 6-digit OTP
  generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

  document.getElementById("otpDisplay").innerText = "Your OTP: " + generatedOTP;
  document.getElementById("result").innerText = "";

  // Start 30 seconds countdown
  timeLeft = 30;
  document.getElementById("timer").innerText =
    "OTP valid for: " + timeLeft + "s";

  clearInterval(countdown);
  countdown = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(countdown);
      generatedOTP = ""; // expire OTP
      document.getElementById("timer").innerText = "OTP Expired!";
      document.getElementById("otpDisplay").innerText =
        "Your OTP will appear here";
    } else {
      document.getElementById("timer").innerText =
        "OTP valid for: " + timeLeft + "s";
    }
  }, 1000);
}

function verifyOTP() {
  const userOTP = document.getElementById("otpInput").value;

  if (generatedOTP === "") {
    document.getElementById("result").innerText =
      "⚠️ OTP Expired! Generate again.";
    document.getElementById("result").style.color = "red";
  } else if (userOTP === generatedOTP) {
    document.getElementById("result").innerText =
      "✅ OTP Verified Successfully!";
    document.getElementById("result").style.color = "green";
  } else {
    document.getElementById("result").innerText = " Incorrect OTP!";
    document.getElementById("result").style.color = "red";
  }
}
