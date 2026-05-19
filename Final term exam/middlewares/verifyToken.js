// ============================================================
// JWT VERIFICATION MIDDLEWARE — Stateless API Authentication
// ============================================================
// Extracts Bearer token from Authorization header, verifies it,
// and attaches decoded user info (id, role) to req.user.
// Returns 401 if token is missing, 403 if token is invalid/expired.

const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    // Get the Authorization header
    const authHeader = req.headers["authorization"];

    // Check if header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Access denied. No token provided."
        });
    }

    // Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(" ")[1];

    try {
        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to request object for use in subsequent handlers
        req.user = {
            id: decoded.user_id,
            role: decoded.role
        };

        next();
    } catch (err) {
        return res.status(403).json({
            success: false,
            message: "Invalid or expired token."
        });
    }
}

module.exports = verifyToken;
