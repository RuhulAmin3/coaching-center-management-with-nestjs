import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class ErrorExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ErrorException');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof HttpException) {
      const statusCode =
        exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
      const errMessage = this.getErrorMessage(exception);

      this.logger.error({
        name: exception.name,
        code: statusCode,
        message: exception.message,
        response: exception.getResponse(),
        stack: exception.stack,
      });

      response.status(statusCode).json({
        statusCode,
        message: errMessage,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else {
      this.logger.error({
        name: (exception as Error).name,
        message: (exception as Error).message,
        stack: (exception as Error).stack,
      });

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }

  private getErrorMessage(exception: HttpException): string {
    const response = exception.getResponse();
    if (typeof response === 'string') {
      return response;
    } else if (response && (response as any).message) {
      return (response as any).message;
    }
    return 'Internal server error';
  }
}
