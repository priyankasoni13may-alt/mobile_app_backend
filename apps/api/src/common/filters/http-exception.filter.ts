import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'An unexpected server error occurred';
    let fieldErrors: Array<{ field: string; message: string }> | undefined = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        message = res.message || exception.message;
        code = res.code || `HTTP_${status}`;

        // Handle class-validator errors
        if (Array.isArray(res.message)) {
          fieldErrors = res.message.map((msg: string) => {
            const parts = msg.split(' ');
            return {
              field: parts[0] || 'general',
              message: msg
            };
          });
          message = 'Validation failed for one or more fields';
          code = 'VALIDATION_FAILED';
        } else if (res.field_errors) {
          fieldErrors = res.field_errors;
        }
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const requestId = (request.headers['x-request-id'] as string) || `req-${Date.now()}`;

    response.status(status).json({
      statusCode: status,
      code,
      message,
      field_errors: fieldErrors,
      request_id: requestId,
      timestamp: new Date().toISOString()
    });
  }
}
