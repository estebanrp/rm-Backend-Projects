const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
	const token = req.header("Authorization");
	if (!token) return res.status(401).json({ message: "Auth Error" });

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded.user;
		next();
	} catch (error) {
		res.status(401).json({ message: "Invalid Token" });
	}
};

module.exports = auth;
