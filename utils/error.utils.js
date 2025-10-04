const createError = (message, status, error = null) => {
    const err = new Error(message)
    err.status = status
    err.errors = error?.errors || null

    console.error(error, err)
    return err
}

export default createError