/**
 * @function createTree
 * @description Chuyển đổi một mảng danh mục phẳng thành cấu trúc cây.
 * @param {Array} arr - Mảng danh mục phẳng từ MongoDB.
 * @param {String|ObjectId} parentId - ID của danh mục cha (mặc định là "").
 * @returns {Array} - Mảng danh mục dạng cây.
 */
const createTree = (arr, parentId = "") => {
  const tree = [];
  
  arr.forEach(item => {
    // So sánh parent_id chính xác (chuyển ObjectId thành chuỗi)
    if (String(item.parent_id) === String(parentId)) {
      const newItem = { ...item }; // Sao chép đối tượng (đã lean())
      newItem.index = tree.length + 1; // Thay thế count bằng index trong mảng hiện tại

      // Đệ quy tìm các mục con
      const children = createTree(arr, item._id); 
      if (children.length > 0) {
        newItem.children = children;
      }

      tree.push(newItem);
    }
  });

  return tree;
};

// Xuất hàm
module.exports = createTree;
