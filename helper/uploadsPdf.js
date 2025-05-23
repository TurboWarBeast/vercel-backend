require('dotenv').config();
const cloudinary = require("cloudinary").v2;
          
cloudinary.config({ 
  cloud_name: process.env.COULD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const uploadFile = async (filePath) => {
    try {
//filePath+='.pdf';
        const result = await cloudinary.uploader.upload(filePath,{
            secure: true,
        });
        console.log(result);
        return result.secure_url;
    } catch (error) {
        console.error("Error uploading file:", error.message);
    }
}

const deleteFile = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' });
        console.log("Delete result:", result);
        return result;
    } catch (error) {
        console.error("Error deleting file:", error.message);
    }
}

module.exports = {
    uploadFile,
    deleteFile
}
