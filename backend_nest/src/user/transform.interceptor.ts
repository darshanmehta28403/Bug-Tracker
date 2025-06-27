import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((res) => ({
      statusCode: context.switchToHttp().getResponse().statusCode,
      message: "Request Successfull !",
      data: res,
    })));
  }
}
