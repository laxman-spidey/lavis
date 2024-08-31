import { RESPONSE } from "./response";

export class ErrorResponse extends RESPONSE {
  private errorCode: string;
  constructor(errorCode: string, message: string) {
    super();
    this.status = false;
    this.message = message;
    this.errorCode = errorCode;
    this.data = undefined;
  }
}

const ERROR_MESSAGES = {
  SOMETHING_WENT_WRONG: "Something went wrong! please try again after sometime",
  AUTH_ERROR: "Authentication Failed",
  AUTH_INVALID_CREDS: "Invalid Crendentials",
  AUTH_USER_NOT_FOUND: "User not found",
  REGISTER_ERROR: "Failed to Register account, please try again",
  REGISTER_USER_ALREADY_EXISTS:
    "User already exists, please login from login page",
  GOOGLE_AUTH_ERROR: "Something went wrong with google authentication",
} as const;

type ErrorCodes = keyof typeof ERROR_MESSAGES;
type ErrorResponses = {
  [key in ErrorCodes]: ErrorResponse;
};

const generateErrorReponses = () =>
  Object.entries(ERROR_MESSAGES).reduce((acc, [key, value]) => {
    acc[key as ErrorCodes] = new ErrorResponse(key, value);
    return acc;
  }, {} as ErrorResponses);

export const ERROR_RESPONSES = generateErrorReponses();
