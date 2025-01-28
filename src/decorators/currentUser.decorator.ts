import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  // never type means data will never be used
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.session;
  },
);
