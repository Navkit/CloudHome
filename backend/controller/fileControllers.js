const cloudinary = require("../config/cloudinary");
const FileFolderModel = require("../model/fileSchema");
const fsPromises = require("fs/promises");

const createFileDocumentInMongoDB = async (req, res) => {
    try {
        const data = req.file;
        const { parentId } = req.body;
        const { _id } = req.user;

        const file = await FileFolderModel.create({
            name: data.originalname,
            userId: _id,
            type: "file",
            parentId: parentId === "null" ? undefined : parentId,
            metaData: { multer: data },
        });

        res.status(201).json({
            status: "in-progress",
            data: { file: file },
        });

        return file;
    } catch (err) {
        console.error("------------------------");
        console.error(err);
        console.error("------------------------");
        res.status(500).json({
            status: "fail",
            message: "Internal Server Error",
        });
        return false;
    }
};

const uploadFileToCloudinary = async (req, file) => {
    try {
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = `data:${req.file.mimetype};base64,${b64}`;
        const result = await cloudinary.uploader.upload(dataURI, {
            resource_type: "auto",
            folder: `Cloud-Home/${file.userId}/${file.parentId || ''}`,
            timeout: 60000,
        });

        try {
            await FileFolderModel.findByIdAndUpdate(file._id, {
                link: result.secure_url || result.url,
                "metaData.cloudinary": result,
            });

            return true;
        } catch (err) {
            console.error("---------------------------------");
            console.error("❌❌❌❌ File UPDATE Error ❌❌❌❌");
            console.error(err);
            console.error("---------------------------------");
            return false;
        }
    } catch (err) {
        console.error("---------------------------------");
        console.error("❌❌❌❌ Cloudinary Error ❌❌❌❌");
        console.error(err);
        console.error("---------------------------------");
        return false;
    }
};

const createFile = async (req, res) => {
    try {
        const documentCreated = await createFileDocumentInMongoDB(req, res);
        if (documentCreated) {
            const isFileUploadedToCloudinary = await uploadFileToCloudinary(req, documentCreated);
            if (isFileUploadedToCloudinary) {
                // Optionally delete the file from the server
            }
        }
    } catch (err) {
        console.error("------------------------");
        console.error(err);
        console.error("------------------------");
        res.status(500).json({
            status: "fail",
            message: "Internal Server Error",
        });
    }
};

module.exports = { createFile };
