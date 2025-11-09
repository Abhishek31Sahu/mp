import Joi from "joi";

export const userValidationSchema = Joi.object({
  fullName: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 3 characters long",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),

  phone: Joi.string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be a valid 10-digit Indian number",
    }),

  aadhaarNumber: Joi.string()
    .pattern(/^\d{12}$/)
    .required()
    .messages({
      "string.pattern.base": "Aadhaar number must be exactly 12 digits",
    }),

  password: Joi.string()
    .min(8)
    .pattern(/[A-Z]/, "uppercase")
    .pattern(/[a-z]/, "lowercase")
    .pattern(/[0-9]/, "number")
    .pattern(/[^a-zA-Z0-9]/, "symbol")
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters",
      "string.pattern.name":
        "Password must include uppercase, lowercase, number, and symbol",
    }),

  role: Joi.string().valid("user", "admin").default("user"),

  kycStatus: Joi.string()
    .valid("pending", "verified", "rejected")
    .default("pending"),

  verifiedPhone: Joi.string()
    .valid("pending", "verified", "rejected")
    .default("pending"),
});
