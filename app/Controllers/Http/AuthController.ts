import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import Image from 'App/Models/Image';
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
    const data = await request.validate({
      schema: schema.create({
        name: schema.string({ trim: true }, [rules.maxLength(255)]),
        username: schema.string({ trim: true }, [
          rules.alphaNum({ allow: ['underscore'] }),
          rules.unique({ table: 'users', column: 'username', caseInsensitive: true }),
          rules.maxLength(255),
        ]),
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
      }),
    });
    const user = await User.create(data);
    const token = await auth.use('api').attempt(data.email, data.password);
    return { user, token };
  }

  public async show({ auth }: HttpContextContract) {
    await auth.user?.load('avatar');
    return auth.user;
  }

  public async update({ auth, request }: HttpContextContract) {
    const { avatar, name, username, email, password } = await request.validate({
      schema: schema.create({
        avatar: schema.file.optional({
          size: '20mb',
          extnames: ['jpg', 'gif', 'png', 'webp'],
        }),
        name: schema.string.optional({ trim: true }, [rules.maxLength(255)]),
        username: schema.string.optional({ trim: true }, [
          rules.alphaNum({ allow: ['underscore'] }),
          rules.unique({
            table: 'users',
            column: 'username',
            caseInsensitive: true,
            whereNot: { id: auth.user!.id },
          }),
          rules.maxLength(255),
        ]),
        email: schema.string.optional({ trim: true }, [
          rules.email(),
          rules.unique({
            table: 'users',
            column: 'email',
            caseInsensitive: true,
            whereNot: { id: auth.user!.id },
          }),
          rules.maxLength(255),
        ]),
        password: schema.string.optional({ trim: true }, [
          rules.minLength(8),
          rules.maxLength(32),
          rules.confirmed('passwordConfirm'),
        ]),
      }),
    });

    if (avatar?.tmpPath) {
      const avatarImage = await Image.createFromFile({
        filePath: avatar.tmpPath,
        userId: auth.user!.id,
        folder: 'avatars',
        resizeOptions: {
          width: 512,
          height: 512,
          fit: 'cover',
        },
      });
      if (auth.user?.avatarId) {
        const oldAvatarImage = await Image.find(auth.user?.avatarId);
        await oldAvatarImage?.delete();
      }
      await auth.user!.related('avatar').associate(avatarImage);
    }

    await auth.user!.save();

    await auth.user!.load('avatar');

    return auth.user;
  }
}
