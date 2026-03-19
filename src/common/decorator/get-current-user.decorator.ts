import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/auth/entities';

export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext): string | User => {
    const request = context.switchToHttp().getRequest();
    if (!data) {
      return request.user;
    }
    return request.user[data];
  },
);
