import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.KEY;

export const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1] || req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .render("Login", { message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).render("Login", { message: "Invalid token" });
  }
};
