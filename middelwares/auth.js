import jwt from "jsonwebtoken";

export const verifyAuthorization = (req, res, next) => {
  const auth = req.headers["authorization"];
  if (!auth) {
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT token is require" });
  }
  try {
    const decode = jwt.verify(auth, "abhi123@user");
    req.user = decode;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Unauthorized, JWT token wrong or expired" });
  }
};
