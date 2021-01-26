import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { BaseException } from '../exceptions/base.exception';
import { ErrorResponse } from '../responses/error.response';

@Catch(BaseException)
export class BaseExceptionFilter implements ExceptionFilter {
  catch(exception: BaseException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponse: ErrorResponse = new ErrorResponse(
      exception.code,
      exception.errorName,
      exception.errorMessage,
    );
    response.status(errorResponse.code).json(errorResponse);
  }
}
