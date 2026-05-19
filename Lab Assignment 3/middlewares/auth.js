// Authentication & Authorization Middleware

module.exports = {
    // Check if user is logged in
    isLoggedIn: function (req, res, next) {
        if (req.session.user) {
            return next();
        }
        req.flash("error", "Please log in to view that resource");
        res.redirect("/auth/login");
    },

    // Check if user is an admin
    isAdmin: function (req, res, next) {
        if (req.session.user && req.session.user.role === "admin") {
            return next();
        }
        req.flash("error", "Access denied. Admin only.");
        res.redirect("/");
    }
};
