import { checkSchema } from "express-validator";
import { trimInput } from "../utils/fuctionList";
trimInput;

export const loginValidation = () => {
  return checkSchema({
    emailOrUserName: {
      notEmpty: {
        errorMessage: "Please enter the contact number or email.",
      },
      customSanitizer: {
        options: trimInput,
      },
    },
    password: {
      notEmpty: {
        errorMessage: "Please enter the password.",
      },
      customSanitizer: {
        options: trimInput,
      },
    },
  });
};
