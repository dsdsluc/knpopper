const multer = require('multer');

// Configure multer with in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

module.exports = upload.fields([
  { name: 'banners[0][image]', maxCount: 1 },
  { name: 'banners[1][image]', maxCount: 1 },
  { name: 'banners[2][image]', maxCount: 1 },
  { name: 'featuredCategories[0][image]', maxCount: 1 },
  { name: 'featuredCategories[1][image]', maxCount: 1 },
  { name: 'featuredCategories[2][image]', maxCount: 1 },
  { name: 'advs[0][image]', maxCount: 1 },
  { name: 'advs[1][image]', maxCount: 1 },
]);
