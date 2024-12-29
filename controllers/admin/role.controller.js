const Role = require("../../models/role.model");


module.exports.index = async (req, res) => {
  const roles = await Role.find({
    deleted: false
  })  

    res.render('admin/pages/role/index', {
      title: 'Shop của tôi',
      message: 'Hello there!',
      titleTopbar: "ROLES LIST",
      roles: roles
    });
  };
  
module.exports.create = async (req, res) => {
    

    res.render('admin/pages/role/create', {
      title: 'Shop của tôi',
      message: 'Hello there!',
      titleTopbar: "ROLES CREATE"
    });
  };
  
module.exports.createPost = async (req, res) => {
    try {
      const newRole = new Role(req.body);  
  
      await newRole.save();
  
      req.flash('success', 'Create new Role Success');
      res.redirect(`/admin/role/list`);

    } catch (error) {
      console.error(error);
      req.flash('error', 'Đã có lỗi xảy ra, vui lòng thử lại.');
      res.redirect('/admin/role/create');
    }
  };

  module.exports.edit = async (req, res) => {

    const id = req.params.id;
    const role = await Role.findOne({
        _id: id
    })

    res.render('admin/pages/role/edit', {
        title: 'Shop của tôi',
        message: 'Hello there!',
        titleTopbar: "EDIT ROLE",
        role:role
    });

};

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    await Role.updateOne({ _id: id }, req.body);

    req.flash('success', 'Update Success!');
    res.redirect(`/admin/role/list`);

  } catch (error) {
    console.error(error);

    req.flash('error', 'Đã có lỗi xảy ra, vui lòng thử lại.');
    res.redirect(`/admin/role/edit/${id}`);
  }
};

module.exports.permissionPatch = async (req, res) => {
  const permissions = JSON.parse(req.body.permissions);
    for (const item of permissions) {
        await Role.updateOne({
            _id:item.id
        },{
            permissions: item.permissions
        })
    }
    req.flash("success","Phân quyền thành công")
    res.redirect("back");
};

  

  