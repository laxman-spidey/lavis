import { RESPONSE } from "./response";

export const ERROR_MESSAGES = {
    GOOGLE_AUTH_ERROR : "Something went wrong with google authentication"
}

export class ErrorResponse extends RESPONSE {
    constructor(message: string) {
        super();
        this.status = false;
        this.message = message;
        this.data = null;
    }
    public static GOOGLE_ERROR = new ErrorResponse(ERROR_MESSAGES.GOOGLE_AUTH_ERROR);
}

