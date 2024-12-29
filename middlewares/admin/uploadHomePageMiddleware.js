const uploadToCloudinary = require('../../helpers/uploadToClouldinary');

const uploadHomePageMiddleware = async (req, res, next) => {
  try {
    if (req.files) {
      for (const fieldName in req.files) {
        const files = req.files[fieldName];
        const uploadedUrls = await Promise.all(
          files.map((file) => uploadToCloudinary(file.buffer))
        );

        // Store Cloudinary URLs back in `req.body`
        req.body[fieldName] = uploadedUrls.length === 1 ? uploadedUrls[0] : uploadedUrls;
      }
    }
    next();
  } catch (error) {
    console.error('❌ Error uploading to Cloudinary:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading images to Cloudinary',
    });
  }
};

module.exports = uploadHomePageMiddleware;
