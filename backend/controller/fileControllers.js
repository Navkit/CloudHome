const { cloudinary } = require("../config/cloudinary");
const FileFolderModel = require("../model/fileSchema");

const createFileDocumentInMongoDB = async (req, res) => {

    try {

        const data = req.file;
        const {parentId} = req.body;
        const {_id} = req.user;

        const file = await FileFolderModel.create({
            name: data.originalname,
            userId: _id,
            type: "file",
            parentId: parentId === "null" ? undefined : parentId,
            metaData: {multer: data},
        })
        res.status(201);
        res.json({
            status: "In Progess",
            data: {
                file: file
            },
        })

        return file;

    } 
    
    catch (error) {
        console.log("-------------------------");
        console.log(error);
        console.log("-------------------------");
        res.status(500).json({
            status: "fail",
            message: "Internal server Error"
        });
    }
    return false;

}

const uploadFileToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.metaData.multer.path, {
            folder: `Cloud-Home/${file.userId}/${file.parentId}`,
            timeout: 60000,
        });
 
 
        try {
            await FileFolderModel.findByIdAndUpdate(file._id, {
                link: result.secure_url || result.url,
                "metaData.cloudinary": result,
            });
        } catch (err) {
            console.log("---------------------------------");
            console.log("❌❌❌❌ File UPDATE Error ❌❌❌❌");
            console.log(err);
            console.log("---------------------------------");
        }
    } catch (err) {
        console.log("---------------------------------");
        console.log("❌❌❌❌ Cloudinary Error ❌❌❌❌");
        console.log(err);
        console.log("---------------------------------");
    }
 };


 const deleteFileFromServer = async (file) => {
    try {
        await fsPromises.rm(file.metaData.multer.path);
        console.log("File deleted ✅");
    } catch (err) {
        console.log("---------------------------------");
        console.log("❌❌❌❌ File Deletion from Server Failed ❌❌❌❌");
        console.log(err);
        console.log("---------------------------------");
        return false;
    }
 };
 
 
 const createFile = async (req, res) => {
    try {
        const documentCreated = await createFileDocumentInMongoDB(req, res);
        if (documentCreated) {
            const isFileUploadedToCloudinary = await uploadFileToCloudinary(documentCreated);
            if (isFileUploadedToCloudinary) {
                deleteFileFromServer(documentCreated);
            }
        }
    } catch (err) {
        console.log("------------------------");
        console.log(err);
        console.log("------------------------");
        res.status(500).json({
            status: "fail",
            message: "Internal Server Error",
        });
    }
 };
 

module.exports = {createFile}