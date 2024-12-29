const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// 🔑 **Cấu hình Cloudinary**
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_KEY, 
  api_secret: process.env.CLOUD_SECRET 
});

// 📥 **Stream Upload Function**
const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => { 
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto', // Phát hiện loại file (image, video, audio, ...)
        folder: 'knpopper', // Thư mục lưu trữ trên Cloudinary
      },
      (error, result) => {
        if (result) {
          resolve(result); // ✅ Trả về kết quả upload thành công
        } else {
          reject(error); // ❌ Xử lý lỗi upload
        }
      }
    );

    // Tạo stream từ buffer và chuyển vào Cloudinary
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// 🚀 **Upload Function**
const uploadToCloudinary = async (buffer) => {
  try {
    const result = await streamUpload(buffer); // Gọi hàm streamUpload
    return result.secure_url; // ✅ Trả về URL bảo mật từ Cloudinary
  } catch (error) {
    console.error("❌ Error uploading to Cloudinary:", error);
    throw new Error('Error uploading to Cloudinary'); // Ném lỗi nếu upload thất bại
  }
};

// 📤 **Export Module**
module.exports = uploadToCloudinary;
