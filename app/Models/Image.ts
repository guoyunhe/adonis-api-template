import Drive from '@ioc:Adonis/Core/Drive';
import Env from '@ioc:Adonis/Core/Env';
import { column, computed } from '@ioc:Adonis/Lucid/Orm';
import driveConfig from 'Config/drive';
import { readFile } from 'fs/promises';
import { imageSize } from 'image-size';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import Model from './Model';
export default class Image extends Model {
  @column()
  public userId: number;

  @column()
  public path: string;

  @column()
  public size: number;

  @column()
  public width: number;

  @column()
  public height: number;

  @computed()
  public get url(): string {
    return `${Env.get('APP_URL')}${driveConfig.disks.local.basePath}/${this.path}`;
  }

  public async delete() {
    await super.delete();
    if (await Drive.exists(this.path)) {
      await Drive.delete(this.path);
    }
  }

  public static async createFromFile(
    filePath: string,
    userId: number,
    resizeWidth: number,
    resizeHeight: number,
    resizeFit: 'contain' | 'cover'
  ) {
    let buffer = await readFile(filePath);
    buffer = await sharp(buffer)
      .webp()
      .resize({ width: resizeWidth, height: resizeHeight, fit: resizeFit })
      .toBuffer();
    const path = `images/${uuidv4()}.webp`;
    await Drive.put(path, buffer);
    const size = buffer.byteLength;
    const { width, height } = imageSize(buffer);
    const image = await Image.firstOrCreate({
      userId,
      path,
      size,
      width,
      height,
    });

    return image;
  }
}
