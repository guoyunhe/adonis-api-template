import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import Activity from 'App/Models/Activity';
import User from 'App/Models/User';

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const email = request.input('email');
    const password = request.input('password');

    try {
      const token = await auth.use('api').attempt(email, password);
      const user = await User.findBy('email', email);
      return { token, user };
    } catch {
      return response.unauthorized('Invalid credentials');
    }
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.use('api').revoke();
    return {
      revoked: true,
    };
  }

  public async register({ auth, request }: HttpContextContract) {
    const validations = await schema.create({
      name: schema.string({ trim: true }, [rules.maxLength(255)]),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: 'users', column: 'email', caseInsensitive: true }),
        rules.maxLength(255),
      ]),
      password: schema.string({ trim: true }, [
        rules.minLength(8),
        rules.maxLength(32),
        rules.confirmed('passwordConfirm'),
      ]),
    });
    const data = await request.validate({ schema: validations });
    const user = await User.create(data);
    await Activity.create({ type: 'user', userId: user.id, action: 'register' });
    const token = await auth.use('api').attempt(data.email, data.password);
    return { user, token };
  }

  public async user({ auth }: HttpContextContract) {
    return auth.user;
  }
}
