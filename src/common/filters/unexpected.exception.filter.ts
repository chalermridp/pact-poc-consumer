import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { ErrorResponse } from '../responses/error.response';

@Catch()
export class UnexpectedExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const errorResponse: ErrorResponse = new ErrorResponse(
      HttpStatus.INTERNAL_SERVER_ERROR,
      'internal_server_error',
      'an unexpected error has occurred',
    );
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
}
