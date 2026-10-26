import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response, Request } from 'express';

// Recursively serialize BigInts to strings
export function serializeBigInts(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInts);
  if (typeof obj === 'object') {
    const serialized: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      serialized[key] = serializeBigInts(obj[key]);
    }
    return serialized;
  }
  return obj;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const requestId = (request.headers['x-request-id'] as string) || `req-${Date.now()}`;
    response.setHeader('X-Request-Id', requestId);

    return next.handle().pipe(
      map((res) => {
        // If response is already in standard ApiResponse shape
        if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
          return serializeBigInts(res);
        }

        // If response has { data, meta }
        if (res && typeof res === 'object' && 'data' in res && 'meta' in res) {
          return serializeBigInts({
            success: true,
            data: res.data,
            meta: {
              ...res.meta,
              requestId,
              timestamp: new Date().toISOString()
            }
          });
        }

        return serializeBigInts({
          success: true,
          data: res,
          meta: {
            requestId,
            timestamp: new Date().toISOString()
          }
        });
      })
    );
  }
}
