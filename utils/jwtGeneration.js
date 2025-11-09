import jwt from "jsonwebtoken";

export const jwtTokenGeneration = async (userInfo) => {
  const jwtToken = jwt.sign(
    { email: userInfo.email, _id: userInfo._id },
    "abhi123@user",
    { expiresIn: "90d" }
  );
  return jwtToken;
};

export const jwtVerification = async (token, key) => {
  const decoded = jwt.verify(token, key, {
    algorithms: ["RS256"],
    audience: "phone-email-auth-48e7e",
    issuer: "https://securetoken.google.com/phone-email-auth-48e7e",
  });
  return decoded;
};
