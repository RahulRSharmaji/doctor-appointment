import jwt from "jsonwebtoken";

export default function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) return res.status(401).json({ message: "No Authorization header" });

    // support "Bearer <token>" or raw token
    const parts = authHeader.split(" ");
    const token = parts.length === 2 && /^Bearer$/i.test(parts[0]) ? parts[1] : (parts.length === 1 ? parts[0] : null);

    if (!token) return res.status(401).json({ message: "Token missing or bad format. Use: Authorization: Bearer <token>" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    } catch (err) {
        console.error("JWT verify error:", err.message);
        return res.status(401).json({ message: "Invalid or expired token", error: err.message });
    }
};