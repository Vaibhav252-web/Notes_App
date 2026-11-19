class ErrorHandler extends Error {
  statusCode: number;

  constructor(error: string, statusCode: number) {
    super(error);
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, ErrorHandler.prototype);
  }
}

export default ErrorHandler;