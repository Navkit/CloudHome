
import { useEffect, useState } from "react";
import Navbar from "../components/navbar/index";
import { useSelector } from "react-redux";
import useGenerateOtp from "../hooks/useGenerateNewOtp";
import useVerifyOtp from "../hooks/useVerifyOtp";
import "../styles/otpPage.css";

const OtpPage = () => {
  const { email } = useSelector((e) => e.auth);
  const [otp, setOtp] = useState();
  const {generateNewOtp} = useGenerateOtp();
  const {verifyOtp} = useVerifyOtp()

  const handleSubmit = () => {
    if(otp == null) {
      alert("Please enter OTP");
    }

    else if(otp.length < 4) {
      alert("Please enter proper OTP");
    }

    else {
      const num = (otp);
      if(num >= 1000 && num < 10000) {
        
        verifyOtp(num)
      }

      else {
        alert("Invalid OTP, OTP must be number");
      }
    }
    console.log(otp);
  };

  useEffect(() => {
    generateNewOtp();
  }, [])

  return (
    <> <Navbar />
      <div className="otp-page-container">
        <p>Email: {email}</p>
        <div className="otp-input-container">
          <input
            maxLength={4}
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <div className="otp-column c1"></div>
          <div className="otp-column c2"></div>
          <div className="otp-column c3"></div>
          <div className="otp-column c4"></div>

        </div>

        <button onClick={handleSubmit}>Verify OTP</button>
      </div>
    </>
  );
};

export default OtpPage;
