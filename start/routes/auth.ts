import Route from '@ioc:Adonis/Core/Route';
import { rules, schema } from '@ioc:Adonis/Core/Validator';
import User from 'App/Models/User';

Route.post('login', async ({ auth, request, response }) => {
  const email = request.input('email');
  const password = request.input('password');

  try {
    const token = await auth.use('api').attempt(email, password);
    return token;
  } catch {
    return response.unauthorized('Invalid credentials');
  }
});

Route.post('register', async ({ request, response }) => {
  const validations = await schema.create({
    username: schema.string({}, [
      rules.unique({ table: 'users', column: 'username' }),
    ]),
    email: schema.string({}, [
      rules.email(),
      rules.unique({ table: 'users', column: 'email' }),
    ]),
    password: schema.string({}, [rules.confirmed()]),
  });
  const data = await request.validate({ schema: validations });
  const user = await User.create(data);
  return response.created(user);
});

Route.get('user', async ({ auth, response }) => {
  return response.ok(auth.user || null);
}).middleware('auth');
