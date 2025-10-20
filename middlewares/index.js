import auth from "./auth.middleware.js"
import cors from "./cors.middleware.js"
import error from "./error.middleware.js"
import response from "./response.middleware.js"
import { equipmentIdValidator, equipmentValidator } from "./validators/equipment.validator.js"
import validateErrorHandler from "./validators/validateErrorHandler.middleware.js"

const middlewares = {
    authMiddleware: auth,
    corsMiddleware: cors,
    errorHandler: error,
    responseHandler: response,
    reqValidators: {
        validateErrorHandler: validateErrorHandler,
        equipmentValidator: equipmentValidator,
        equipmentIdValidator: equipmentIdValidator
    }
}

export default middlewares
