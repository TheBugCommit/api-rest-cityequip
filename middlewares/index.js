import auth from "./auth.middleware.js"
import cors from "./cors.middleware.js"
import error from "./error.middleware.js"
import response from "./response.middleware.js"
import validate from "./validate.middleware.js"

const middlewares = {
    authMiddleware: auth,
    corsMiddleware: cors,
    errorHandler: error,
    responseHandler: response,
    validateRequest: validate
}

export default middlewares
