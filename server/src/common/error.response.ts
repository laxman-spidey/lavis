import { RESPONSE } from "./response";

export class ErrorResponse extends RESPONSE {
  private errorCode;
  constructor(errorCode: string, message: string) {
    super();
    this.status = false;
    this.message = message;
    this.errorCode = errorCode;
    this.data = undefined;
  }
}

const ERROR_MESSAGES = {
  AUTH_ERROR: "Authentication Failed",
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
