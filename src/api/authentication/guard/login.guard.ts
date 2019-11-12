import { AuthGuard } from '@nestjs/passport';

export class Login extends AuthGuard('emailPassword') {
  public handleRequest(err, user, info, context) {
    const validatedUser = super.handleRequest(err, user, info, context);
    this.logIn(validatedUser);
    return user;
  }
}
