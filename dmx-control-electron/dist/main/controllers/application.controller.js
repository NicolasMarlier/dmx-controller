"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrors = exports.NotFoundError = exports.InvalidParamError = void 0;
class InvalidParamError extends Error {
}
exports.InvalidParamError = InvalidParamError;
class NotFoundError extends Error {
}
exports.NotFoundError = NotFoundError;
// export const validateUrlParam = (req: Request, key: string) => {
//       const param = req.params[key]
//       if (!param || typeof param !== "string") {
//         throw new InvalidParamError(`Invalid ${key} parameter`)
//       }
//       return param
//     }
// export const validateQueryParam = (req: Request, key: string) => {
//       const param = req.query[key]
//       if (!param || typeof param !== "string") {
//         throw new InvalidParamError(`Invalid ${key} parameter`)
//       }
//       return param
//     }
const handleErrors = async (action) => {
    try {
        return JSON.parse(JSON.stringify(await action()));
    }
    catch (error) {
        if (error instanceof InvalidParamError) {
            return { error: error.message };
        }
        if (error instanceof NotFoundError) {
            return { error: error.message };
        }
        console.error(error);
        return { error: 'Unknown error' };
    }
};
exports.handleErrors = handleErrors;
//# sourceMappingURL=application.controller.js.map