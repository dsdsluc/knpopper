const Setting = require("../../models/setting.model");

module.exports.attachSettings = async (req, res, next) => {
    try {
        
        const settings = await Setting.findOne();

        
        res.locals.settings = settings || {
            site_name: "Default Website",
            site_logo: "",
            contact_email: "contact@default.com",
            contact_phone: "",
            address: "",
            social_links: {
                facebook: "",
                twitter: "",
                instagram: ""
            }
        };

        next(); // Chuyển sang middleware hoặc route tiếp theo
    } catch (error) {
        console.error("❌ Lỗi khi tải cài đặt chung:", error);

        // Gắn giá trị mặc định nếu lỗi
        res.locals.settings = {
            site_name: "Default Website",
            site_logo: "",
            contact_email: "contact@default.com",
            contact_phone: "",
            address: "",
            social_links: {
                facebook: "",
                twitter: "",
                instagram: ""
            }
        };

        next(); // Tiếp tục ngay cả khi có lỗi
    }
};
