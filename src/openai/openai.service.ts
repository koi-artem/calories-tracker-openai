import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

@Injectable()
export class OpenaiService implements OnModuleInit {
  private readonly openai: OpenAI;
  constructor(private readonly configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get('OPENAI_API_KEY'),
    });
  }

  async prompt(content: string) {
    return this.openai.chat.completions.create({
      messages: [{ role: 'user', content }],
      model: 'gpt-3.5-turbo',
    });
  }

  async transcript(audioFile: File) {
    this.openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
    });
  }

  async onModuleInit(): Promise<void> {
    const result = await this.prompt('Say this is test');
    console.log(result);
  }
}
