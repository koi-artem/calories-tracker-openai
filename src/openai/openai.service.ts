import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenaiService {
  constructor(private readonly configService: ConfigService) {
    const key = this.configService.get('OPENAI_API_KEY');
    console.log(key);
  }
}
