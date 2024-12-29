
module.exports = (page, totalItems, limit = 4) => {
    // Ensure page is an integer and default to 1 if not provided or invalid
    const currentPage = parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const limitItem = parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 4;

    // Calculate pagination details
    const totalPages = Math.ceil(totalItems / limitItem);
    const skip = (currentPage - 1) * limitItem;

    return {
        currentPage,
        limitItem,
        totalPages,
        skip,
        hasPrevPage: currentPage > 1,
        hasNextPage: currentPage < totalPages
    };
};
