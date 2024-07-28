const nodemailer = require("nodemailer")
const OtpModel = require("../model/otpSchema")
const UserModel = require("../model/userModel")

const sendOTPMail = async (email, otp) => {
    try {

        let mailer = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            port: 465,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD,
            }
        })
        console.log(mailer.auth);

        const response = await mailer.sendMail({
            from: '"MyCloud storage ☁️" <mycloud.storage.app1@gmail.com>"',
            to: email,
            subject: "OTP Verification for your account",
            html: `
            <html>
                <body>
                    <h1>Your OTP for myCloud app is </h1>
                    <h2>${otp}</h2>
                </body>
            </html>`,
        });

        console.log(response.messageId);

        return true

    }
    catch (error) {
        console.log("--------------------------------");
        console.log(error);
        console.log("--------------------------------");

        return false;

    }
}


const generateOTP = async (req, res) => {

    try {
        const { email, _id } = req.user;
        const restrictedTimeForOTP = 10 * 60 * 1000;

        const sentOTPMail = await OtpModel.findOne({
            email,
            createdAt: {
                $gte: Date.now() - restrictedTimeForOTP,
            },
        });

        if (sentOTPMail) {
            res.status(200);
            res.json({
                status: "success",
                message: "OTP already sent, check your email",
                data: { createdAt: OtpModel.createdAt },
            });
            return
        }

        console.log("sentOTPMail", sentOTPMail);

        const randomOTP = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

        const isMailSent = await sendOTPMail(email, randomOTP);

        if (!isMailSent) {
            res.status(500);
            res.json({
                status: "fail",
                message: `OTP not sent to ${email}`,
                data: {},
            });
            return;
        }


        // create an entry in database with that OTP
        await OtpModel.create({
            otp: randomOTP,
            email,
            userId: _id,
        })

        res.status(201);
        res.json({
            status: "success",
            message: `OTP sent to ${email}`,
            data: {},
        });

    } catch (error) {
        console.log("---------------------");
        console.log(error);
        console.log("----------------------");
        res.status(500).json({
            status: "fail",
            message: "Internal server error",
            data: error,
        });
    }
}


const verifyOtp = async (req, res) => {

    try {

        const { otp } = req.body;
        const {email} = req.user;

        const restrictedTimeForOTP = 10 * 60 * 1000;
        const sentOTPMail = await OtpModel.findOne({
            email,
            createdAt: {
                $gte: Date.now() - restrictedTimeForOTP,
            },
        });

        if (!sentOTPMail) {
            res.status(404);
            res.json({
                status: "fail",
                message: "verification failed, please generate new OTP!"
            })

            return;
        }

        const hashedOTP = sentOTPMail.otp;
        const isCorrect = await sentOTPMail.verifyOTP(otp, hashedOTP);

        if (!isCorrect) {
            res.status(400);
            res.json({
                status: "fail",
                message: "Incorrect OTP!"
            })
            return;
        }

        await UserModel.findOneAndUpdate(
            { email },
            { isEmailVerified: true }
        )

        res.status(200);
        res.json({
            status: "success",
            message: "Verification successful",
            data: {}
        })

    } catch (error) {
        console.log(error.message);
    }

}

module.exports = { generateOTP, verifyOtp }