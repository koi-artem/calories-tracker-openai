import { Injectable } from '@nestjs/common';
import { Hears, Help, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { OpenaiService } from './openai/openai.service';

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

  @Hears('audio')
  async hearsHi(ctx: Context) {
    const response = await this.openAiService.transcript(null);
    await ctx.reply(response);
  }
}
