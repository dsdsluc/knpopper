const md5 = require("md5");
const system = require("../../configs/system");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

module.exports.index = async (req, res)=>{
    const accounts = await Account.find({
      deleted: false
    })
    const role = await Role.findOne({
      _id: res.locals.user.role_id
    })

    res.render('admin/pages/account/index', {
        title: 'Shop của tôi',
        message: 'Hello there!',
        titleTopbar: "ACCOUNTS LIST",
        accounts: accounts,
        role: role
      });
}
module.exports.create = async (req, res)=>{
    const roles = await Role.find({
      deleted: false
    })

    res.render('admin/pages/account/create', {
        title: 'Shop của tôi',
        message: 'Hello there!',
        titleTopbar: "CREATE ADMIN",
        roles: roles
      });
}
module.exports.createPost = async (req, res) => {
  try {
    req.body.password = md5(req.body.password);

    const newAccount = new Account(req.body);
    await newAccount.save();

    req.flash('success', 'Create new Account Success');
    res.redirect(`/admin/account/list`);

  } catch (error) {

    console.error('Error creating account:', error);
    req.flash('error', 'Failed to create new Account');
    res.redirect(`/admin/account/create`);

  }
};

module.exports.edit = async (req, res)=>{
  const id = req.params.id;
  const account = await Account.findOne({
    _id: id
  })
  
  const roles = await Role.find({
    deleted: false,
  })


  res.render('admin/pages/account/edit', {
      title: 'Shop của tôi',
      message: 'Hello there!',
      titleTopbar: "CREATE ADMIN",
      roles: roles,
      account: account
    });
}

module.exports.editPatch = async (req, res)=>{
  try {
    const id = req.params.id;

    await Account.updateOne({ _id: id }, req.body);

    req.flash('success', 'Update Success!');
    res.redirect(`/admin/account/list`);

  } catch (error) {
    console.error(error);

    req.flash('error', 'Đã có lỗi xảy ra, vui lòng thử lại.');
    res.redirect(`/admin/account/edit/${id}`);
  }
}



