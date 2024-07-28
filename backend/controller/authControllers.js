const UserModel = require("../model/userModel");
const jwt = require("jsonwebtoken")

const getUserByEmail = async (email) => {
    const user = await UserModel.findOne({ email })
    return user;
}

const generateJWTToken = (obj) => {
    const token = jwt.sign({
        exp: Math.floor(Date.now()/ 1000) + (60 * 60) * 100, 
        data: obj,
    },
        process.env.JWT_SECRET_KEY
    )
    return token
}

const signup = async (req, res) => {

    try {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            res.status(400).json({
                status: "Fail",
                message: "Please fill all details",
                data: {},
            });
            return;
        }

        const user = await getUserByEmail(email);

        if (user) {
            res.status(400).json({
                status: "Fail",
                message: "Email already registered with an account",
                data: {},
            });
            return;
        }

        const newUser = await UserModel.create({ email, name, password });

        res.status(201).json({
            status: "success",
            message: "User Created",
            data: {
                user: {
                    _id: newUser._id,
                    email: newUser.email,
                    isEmailVerified: newUser.isEmailVerified,
                },
            },
        })

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status: "Fail",
            message: "Internal server error",
            data: error
        })
    }

}


const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({
                status: "Fail",
                message: "Please fill all details",
                data: {},
            });
            return;
        }

        const user = await getUserByEmail(email);

        if (!user) {
            res.status(400).json({
                status: "Fail",
                message: "invalid User",
                data: {},
            });
            return;
        }

        const isCorrect = await user.verifyPassword(password, user.password)
        if (!isCorrect) {
            res.status(400).json({
                status: "Fail",
                message: "Incorrect Password",
                data: {},
            });
            return;
        }

        res.status(200).json({
            status: "Success",
            data: {
                user: {
                    email: user.email,
                    _id: user._id,
                    name: user.name,
                    isEmailVerified: user.isEmailVerified
                },

                token: generateJWTToken({ _id: user._id, email: user.email })
            }
        })

    }

    catch (error) {
        console.log(error);
        res.status(500).json({
            status: "Fail",
            message: "Internal server error",
            data: error
        })
    }
}


module.exports = { signup, login }