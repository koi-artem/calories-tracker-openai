import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI, toFile } from 'openai';
import * as fs from 'fs';

@Injectable()
export class OpenaiService {
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
    const audio = fs.createReadStream('audio.mp3');
    const response = await this.openai.audio.transcriptions.create({
      file: audio,
      model: 'whisper-1',
    });

    return response.text;
  }
}
