import {
  BaseModel,
  column,
  LucidModel,
  SnakeCaseNamingStrategy,
} from '@ioc:Adonis/Lucid/Orm';
import { DateTime } from 'luxon';

class CamelCaseNamingStrategy extends SnakeCaseNamingStrategy {
  public serializedName(_model: LucidModel, attributeName: string): string {
    return attributeName;
  }

  public paginationMetaKeys() {
    return {
      total: 'total',
      perPage: 'perPage',
      currentPage: 'currentPage',
      lastPage: 'lastPage',
      firstPage: 'firstPage',
      firstPageUrl: 'firstPageUrl',
      lastPageUrl: 'lastPageUrl',
      nextPageUrl: 'nextPageUrl',
      previousPageUrl: 'previousPageUrl',
    };
  }
}

export default class Model extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy();
  @column({ isPrimary: true })
  public id: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
