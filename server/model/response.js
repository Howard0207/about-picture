const moment = require("moment");
class BaseResponse {
    constructor(code, data, message) {
        this.code = code;
        this.data = data;
        this.message = message;
        this.srvTime = moment().format("YYYY-MM-DD HH:mm:ss");
    }
}

class SuccessResponse extends BaseResponse {
    constructor(code, data, message) {
        if (typeof data === "string" && !message) {
            message = data;
            data = null;
        }
        if (typeof code !== "number") {
            if (typeof code === "string" && !data) {
                message = code;
            } else {
                data = code;
            }
            code = null;
        }
        code = code || 200;
        super(code, data, message);
    }
}

class ErrorResponse extends BaseResponse {
    constructor(code, message) {
        super(code, undefined, message);
    }
}

module.exports = {
    SuccessResponse,
    ErrorResponse
};
