const FileFolderModel = require("../model/fileSchema");

const getFileFolder = async (req, res) => {
  try {
    const { _id } = req.user;
    const fileFolders = await FileFolderModel.find({ userId: _id });
    res.status(200).json({
      status: "success",
      data: {
        fileFolders,
      },
      message: "File Folders fetched successfully",
    });
  } catch (error) {
    console.log("Error in fetching file folders", error);
    res.status(500).json({
      status: "fail",
      message: "Internal Server Error",
      data: error,
    });
  }
};

module.exports = {
  getFileFolder,
};