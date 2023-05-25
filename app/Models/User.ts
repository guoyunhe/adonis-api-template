import { AttachmentContract, attachment } from '@ioc:Adonis/Addons/AttachmentLite';
import Hash from '@ioc:Adonis/Core/Hash';
import { beforeSave, column } from '@ioc:Adonis/Lucid/Orm';
import Model from './Model';

export default class User extends Model {
  @attachment({ folder: 'avatars', preComputeUrl: true })
  public avatar: AttachmentContract | null;

  @column()
  public name: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public rememberMeToken: string | null;

  @column()
  public role: string | null;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
