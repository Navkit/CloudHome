const FileFolderModel = require("../model/fileSchema");

const createFolder = async (req, res) => {

    try {

        const { name, parentId } = req.body;
        const { _id } = req.user;

        const isFileNameExists = await FileFolderModel.findOne({
            name, userId: _id,parentId
        });

        if (isFileNameExists) {
            res.status(400);
            res.json({
                status: "fail",
                message: "Folder name already exists",
            })
            return;
        }

        const newFolder = await FileFolderModel.create({
            name,
            userId: _id,
            type: "folder",
            parentId,
        })

        res.status(201);
        res.json({
            status: "success",
            message: "Folder created successfully",
            data: {
                folder: newFolder
            }
        })

    }

    catch (error) {

        console.log("----------------------------------");
        console.log(error);
        console.log("----------------------------------");
        res.status(500);
        res.json({
            status: "fail",
            message: "Internal server error",
        })

    }

}

module.exports = {
    createFolder
}