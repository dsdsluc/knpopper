const HomePage = require('../../models/homePage.model');


module.exports.homePage = async (req, res) => {
    try {
      // Fetch home page data
      let homePageData = await HomePage.findOne();
  
      // If no data exists, initialize default structure and save it
      if (!homePageData) {
        homePageData = new HomePage({
          banners: [
            { title: '', image: '', link: '' },
            { title: '', image: '', link: '' },
            { title: '', image: '', link: '' },
          ],
          featuredCategories: [
            { name: '', image: '', link: '' },
            { name: '', image: '', link: '' }
          ],
          advs: [
            { title: '', image: '', link: '' },
            { title: '', image: '', link: '' }
          ],
        });
        await homePageData.save(); // Save default structure to the database
      } else {
        // Ensure there are always 3 banners
        while (homePageData.banners.length < 3) {
          homePageData.banners.push({ title: '', image: '', link: '' });
        }
  
        // Ensure there are always 3 featured categories
        while (homePageData.featuredCategories.length < 3) {
          homePageData.featuredCategories.push({ name: '', image: '', link: '' });
        }
  
        // Ensure there are always 3 advertisements
        while (homePageData.advs.length < 2) {
          homePageData.advs.push({ title: '', image: '', link: '' });
        }
      }
  
      res.render('admin/pages/page/home', {
        title: 'Shop của tôi',
        message: 'Here you can manage your home page content.',
        titleTopbar: 'Home Page Management',
        banners: homePageData.banners,
        featuredCategories: homePageData.featuredCategories,
        advs: homePageData.advs,
      });
    } catch (error) {
      console.error('❌ Error fetching home page data:', error);
      req.flash('error', 'An error occurred while loading the home page.');
      res.redirect('back');
    }
  };
  

  module.exports.updateHomePage = async (req, res) => {
    try {
      // Fetch existing HomePage or create a new one
      let homePage = await HomePage.findOne();
      if (!homePage) homePage = new HomePage();
  
      // Update banners
      homePage.banners = (req.body.banners || []).map((banner, index) => ({
        title: banner.title || req.body[`banners[${index}][title]`] || '',
        link: banner.link || req.body[`banners[${index}][link]`] || '#',
        image: req.body[`banners[${index}][image]`] 
          ? req.body[`banners[${index}][image]`] 
          : (homePage.banners[index] && homePage.banners[index].image) || '', // Keep existing image if no new image is provided
      }));
  
      // Update featured categories
      homePage.featuredCategories = (req.body.featuredCategories || []).map((category, index) => ({
        name: category.name || req.body[`featuredCategories[${index}][name]`] || '',
        link: category.link || req.body[`featuredCategories[${index}][link]`] || '#',
        image: req.body[`featuredCategories[${index}][image]`]
          ? req.body[`featuredCategories[${index}][image]`]
          : (homePage.featuredCategories[index] && homePage.featuredCategories[index].image) || '', // Keep existing image if no new image is provided
      }));
  
      // Update advertisements
      homePage.advs = (req.body.advs || []).map((adv, index) => ({
        title: adv.title || req.body[`advs[${index}][title]`] || '',
        link: adv.link || req.body[`advs[${index}][link]`] || '#',
        image: req.body[`advs[${index}][image]`]
          ? req.body[`advs[${index}][image]`]
          : (homePage.advs[index] && homePage.advs[index].image) || '', // Keep existing image if no new image is provided
      }));
  
      // Save the updated home page data
      await homePage.save();
  
      req.flash('success', 'Home page updated successfully.');
      res.redirect('back'); // Redirect to the homepage management page
    } catch (error) {
      console.error('❌ Error updating home page:', error);
      req.flash('error', 'An error occurred while updating the home page.');
      res.redirect('back');
    }
  };
  
  