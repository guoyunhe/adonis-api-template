import Hash from '@ioc:Adonis/Core/Hash';
import { BelongsTo, beforeSave, belongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import Image from './Image';
import Model from './Model';

export default class User extends Model {
  @belongsTo(() => Image)
  public avatar: BelongsTo<typeof Image>;

  @column()
  public avatarId: number;

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
