const Problem = require("../../models/problem.model");

module.exports.review = async (req, res) => {
  try {
    // Retrieve all problems from the database
    const problems = await Problem.find({status: "pending"}).populate("user");

    res.render("admin/pages/customer/index", {
      title: "Customer Issues",
      message: "Here are all the reported problems from customers.",
      titleTopbar: "Customer Problems",
      problems,
    });
  } catch (error) {
    console.error("Error fetching customer problems:", error);
    res.redirect("back");
  }
};

module.exports.resolve = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    // Update the problem's status and admin note
    const updatedProblem = await Problem.findByIdAndUpdate(
      id,
      { status, adminNote, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedProblem) {
      req.flash("error", "Problem not found.");
      return res.redirect("back");
    }

    req.flash("success", "Problem marked as resolved successfully.");
    res.redirect("back"); // Redirect to the problems list
  } catch (error) {
    console.error("Error resolving problem:", error);
    req.flash("error", "An error occurred while resolving the problem.");
    res.redirect("back");
  }
};
