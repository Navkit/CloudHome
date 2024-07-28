// const jwt = require("jsonwebtoken")

// const verifyToken = (req, res, next) => {

//     try {

//         const { authorization } = req.headers;

//         if (!authorization) {
//             res.status(401).json({
//                 status: "fail",
//                 message: "Unauthorized",
//                 data: {},
//             });
//             return;
//         }

//         const token = authorization?.split(" ")?.[1];

//         if (!token) {
//             res.status(401).json({
//                 status: "fail",
//                 message: "Unauthorized",
//                 data: {},
//             });
//             return;
//         }

//         // console.log(authorization,'\n-->',token);
//         jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
//             if(err) {
//                 console.log(err);
//                 res.status(401).json({
//                     status: "fail",
//                     message: "Unauthorizes",
//                     data: {},
//                 });
//                 return;
//             }

//             else {
//                 req.user = {email: decoded.data.email, _id: decoded.data._id};
//                 next()
//             }
//         })
//     }

//     catch (error) {
//         console.log(error);
//     }
// };

// module.exports = verifyToken


const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({
                status: "fail",
               message: "Unauthorized: No authorization header",
                data: {},
            });
        }

        const token = authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                status: "fail",
               message: "Unauthorized: No token provided",
                data: {},
            });
        }

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
            if (err) {
                console.error("JWT verification error:", err);
                return res.status(401).json({
                    status: "fail",
                   message: "Unauthorized: Invalid token",
                    data: {},
                });

            } else {
                req.user = { email: decoded.data.email, _id: decoded.data._id };
                next();
            }
        });
    } catch (error) {
       console.error("Error in verifyToken middleware:", error);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
            data: {},
        });
    }
};

module.exports = verifyToken;