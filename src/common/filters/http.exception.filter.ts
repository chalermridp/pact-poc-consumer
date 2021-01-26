import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from '../responses/error.response';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const error = JSON.parse(JSON.stringify(exception.getResponse()));

    const errorResponse: ErrorResponse = new ErrorResponse(
      status,
      error.error,
      error.message,
    );
    response.status(status).json(errorResponse);
  }
}
