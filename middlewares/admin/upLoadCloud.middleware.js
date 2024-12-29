const uploadToCloudinary = require("../../helpers/uploadToClouldinary");

// 📤 **Middleware Upload File**
const upload = async (req, res, next) => {
  if (req.files && req.files.length > 0) { 
    
    try {
      const uploadedFiles = [];
      for (const file of req.files) {
        const link = await uploadToCloudinary(file.buffer); 
        uploadedFiles.push(link); 
      }
      req.body[req.files[0].fieldname]  = uploadedFiles; 
    } catch (error) {
      console.error("❌ Error uploading to Cloudinary:", error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error uploading to Cloudinary' 
      });
    }
  }else {
    if (req.file) {
      // 🌩️ Tải tệp lên Cloudinary
      const link = await uploadToCloudinary(req.file.buffer);

      // 📝 Gắn URL vào trường `thumbnail`
      req.body[req.file.fieldname]  = link;
    }
  }
  next();
};

module.exports = upload;
