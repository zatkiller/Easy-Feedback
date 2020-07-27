//middleware to check login
module.exports = (req, res, next) => {
	if (!req.user) {
		return res.status(401).send({ error: "Not Logged In!" });
	}

	next();
};
