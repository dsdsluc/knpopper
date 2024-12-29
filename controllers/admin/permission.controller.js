const Role = require("../../models/role.model");


module.exports.index = async (req, res) => {
    const roles = await Role.find({
      deleted: false
    })

    res.render('admin/pages/permission/index', {
      title: 'Shop của tôi',
      message: 'Hello there!',
      titleTopbar: "SETTING PERMISSION ",
      roles: roles
    });
  };
  