const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
    site_name: { type: String, default: "My Website" }, 
    site_logo: { type: String, default: "" }, 
    contact_email: { type: String, default: "admin@example.com" }, 
    contact_phone: { type: String, default: "" }, 
    address: { type: String, default: "" }, 
    social_links: { // Các liên kết mạng xã hội
        facebook: { type: String, default: "" },
        twitter: { type: String, default: "" },
        instagram: { type: String, default: "" },
        zalo: { type: String, default: "" }
    }
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});

const Setting = mongoose.model('Setting', SettingSchema, "settings");
module.exports = Setting;
