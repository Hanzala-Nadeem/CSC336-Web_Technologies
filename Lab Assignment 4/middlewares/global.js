// Global Middleware — Runs on every request
const Category = require("../models/Category");

module.exports = async (req, res, next) => {
    // 1. Flash Messages (powered by connect-flash)
    // Read flash messages into res.locals so EJS templates can access them
    res.locals.success_msg = req.flash("success");
    res.locals.error_msg = req.flash("error");

    // 2. Pass Current User to locals (for dynamic navbar)
    res.locals.user = req.session.user || null;

    // 3. Load Categories for nav dropdowns
    try {
        const categories = await Category.find().sort("name");
        res.locals.categories = categories;
    } catch (err) {
        res.locals.categories = [];
    }

    next();
};
