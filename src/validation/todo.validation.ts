import { checkSchema } from "express-validator";
import { trimInput } from "../utils/fuctionList";

export const todoValidation = () => {
  return checkSchema({
    title: {
      notEmpty: {
        errorMessage: "Please enter the title of the task.",
      },
      customSanitizer: {
        options: trimInput,
      },
    },
    description: {
      notEmpty: {
        errorMessage: "Please enter the task description.",
      },
      customSanitizer: {
        options: trimInput,
      },
    },
    dueDate: {
      notEmpty: {
        errorMessage: "Please select the due date of the task.",
      },
    },
  });
};
