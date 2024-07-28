const express = require("express");

const {generateOTP, verifyOtp} = require("../controller/otpControllers")

const otpRouter = express.Router();

otpRouter.get("/generate", generateOTP)

otpRouter.post("/verify", verifyOtp)

module.exports = otpRouter;