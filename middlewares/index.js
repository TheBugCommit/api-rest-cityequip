import auth from "./auth.middleware.js"
import cors from "./cors.middleware.js"
import error from "./error.middleware.js"
import response from "./response.middleware.js"
import equipmentValidator from "./validators/equipment.validator.js"
import mongoIdValidator from "./validators/id.validator.js"
import validationErrorHandler from "./validationErrorHandler.middleware.js"

const middlewares = {
    authMiddleware: auth,
    corsMiddleware: cors,
    errorHandler: error,
    responseHandler: response,
    validationErrorHandler: validationErrorHandler,
    reqValidators: {
        equipmentValidator: equipmentValidator,
        idValidator: mongoIdValidator
    }
}

export default middlewares
