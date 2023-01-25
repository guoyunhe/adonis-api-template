import { belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm';
import Model from './Model';
import User from './User';

export default class Activity extends Model {
  /** Categorize system activities, admin activities and user activities */
  @column()
  public type: 'system' | 'admin' | 'user';

  /** Action executor ID */
  @column()
  public userId: number | null;

  /** Action executor */
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  /** Action target model type */
  @column()
  public targetType: string | null;

  /** Action target model ID */
  @column()
  public targetId: number | null;

  /** Action code, like 'user.register', 'game.favorite', 'game.image.upload' */
  @column()
  public action: string;

  /** Action data, like { gameId: 24, imageId: 2354 } */
  @column()
  public data: any;
}
