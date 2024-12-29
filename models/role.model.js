const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    title: String,
    workspace: String,
    userName: String,
    tag: {
      type: Array,
      default: [] 
    },
    description: String,
    thumbnail: String,
    status: String,
    permissions: {
      type: Array,
      default: [] 
    },
    deleted: {
      type: Boolean,
      default: false
    },
  },{ timestamps: true });
const Role = mongoose.model('Role', RoleSchema,"roles");
module.exports = Role;