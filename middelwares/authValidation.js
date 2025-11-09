import Joi from "joi";
import { userValidationSchema } from "../validatingSchema/userValidationSchema.js";

export const signupValidation = (req, res, next) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

export const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  console.log(req.body);

  const { error } = schema.validate(req.body);
  console.log(error);
  if (error) {
    return res.status(400).json({ message: "Bad request", error });
  }
  next();
};

// module.exports = { signupValidation, loginValidation };
