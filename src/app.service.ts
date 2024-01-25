import { Injectable } from '@nestjs/common';
import { Hears, Help, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { OpenaiService } from './openai/openai.service';

const PROMPT =
  'Я тебе сейчас напишу предложение в котором перечислю, что я съел. Есть правила ответа:\n' +
  '1) Тебе нужно вернуть мне список следующего формата без какого-либо дополнительного текста "Продукт 1, вес продукта, каллорийность; Продукт 2, вес продукта, каллорийность" \n' +
  '2) Количественные показатели конвертируй в вес \n' +
  '3) Для этого продукта и его веса посчитай примерное количество каллорий, учитывай что продукты уже приготовлены';

@Update()
@Injectable()
export class AppService {
  constructor(private readonly openAiService: OpenaiService) {}
  getData(): { message: string } {
    return { message: 'Welcome to server!' };
  }

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Welcome');
  }

  @Help()
  async helpCommand(ctx: Context) {
    await ctx.reply('Send me a sticker');
  }

  @On('sticker')
  async onSticker(ctx: Context) {
    await ctx.reply('👍');
  }

  @On('voice')
  async onVoice(ctx: Context) {
    const fileId = (ctx.message as any).voice;
    const { href } = await ctx.telegram.getFileLink(fileId);
    const text = await this.openAiService.transcript(href);
    await ctx.reply(`Запрос ${text}`);

    const output = await this.openAiService.prompt(`${PROMPT} + \n + ${text} `);

    const {
      choices: [
        {
          message: { content },
        },
      ],
    } = output;
    await ctx.reply(content);
  }

  @Hears('audio')
  async hearsHi(ctx: Context) {
    const response = await this.openAiService.transcript(null);
    await ctx.reply(response);
  }
}
