class ApiError extends Error {
  constructor(statusCode, code, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.code = code
    this.details = details
  }

  static badRequest(code, message, details) {
    return new ApiError(400, code, message, details)
  }

  static notFound(code, message) {
    return new ApiError(404, code, message)
  }

  static conflict(code, message, details) {
    return new ApiError(409, code, message, details)
  }
}

module.exports = ApiError;