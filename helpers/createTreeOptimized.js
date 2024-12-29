const createTreeOptimized = (categories) => {
    const map = {};
    const roots = [];
  
    // Step 1: Create a map of each item by its `_id`
    categories.forEach((item) => {
      map[item._id] = { ...item._doc || item, children: [] }; // Initialize with `children` array
    });
  
    // Step 2: Populate the tree using the map
    categories.forEach((item) => {
      if (item.parent_id) {
        // Add as a child to its parent if the parent exists in the map
        if (map[item.parent_id]) {
          map[item.parent_id].children.push(map[item._id]);
        }
      } else {
        // Root item with no parent
        roots.push(map[item._id]);
      }
    });
  
    return roots; 
  };
  
  module.exports = (arr) => {
    const tree = createTreeOptimized(arr);
    return tree;
  };
  