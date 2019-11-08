import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';

export enum GrpcStatus {
  OK = 0,
  CANCELLED,
  UNKNOWN,
  INVALID_ARGUMENT,
  DEADLINE_EXCEEDED,
  NOT_FOUND,
  ALREADY_EXISTS,
  PERMISSION_DENIED,
  RESOURCE_EXHAUSTED,
  FAILED_PRECONDITION,
  ABORTED,
  OUT_OF_RANGE,
  UNIMPLEMENTED,
  INTERNAL,
  UNAVAILABLE,
  DATA_LOSS,
  UNAUTHENTICATED,
}

@Catch()
export class ErrorHandlingFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status: HttpStatus;
    switch (exception.code) {
      case GrpcStatus.PERMISSION_DENIED:
        status = HttpStatus.FORBIDDEN;
        break;
      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
      path: request.url,
    });
  }
}
