import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import axios from 'axios';
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';

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
      temperature: 1,
      model: 'gpt-4',
    });
  }

  async transcript(url: string) {
    const filename = `${uuid()}.ogg`;
    const fileResponse = await axios({
      url,
      method: 'get',
      responseType: 'stream',
    });

    await new Promise((resolve, reject) => {
      const stream = fileResponse.data.pipe(fs.createWriteStream(filename));
      stream.on('finish', () => resolve(null));
      stream.on('error', () => reject('Stream error'));
    });

    const audio = fs.createReadStream(filename);
    const { text } = await this.openai.audio.transcriptions.create({
      file: audio,
      model: 'whisper-1',
    });
    await fs.promises.unlink(filename);

    return text;
  }
}
