import jwt from "jsonwebtoken";

const SECRET_KEY = "your-secret-key"; // same key used to sign the token

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // Bearer <token>
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = { id: decoded.id }; // attach user ID to request
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authenticate;
