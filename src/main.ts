import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5173', 'https://commentserver.onrender.com'],
    methods: ['GET', 'POST'],
    credentials: true,
  });
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://your-frontend.com');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers',
    );
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Private-Network', true);
    //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
    res.setHeader('Access-Control-Max-Age', 7200);

    next();
  });
  await app.listen(PORT);
  console.log(`Server runing on: http://localhost${PORT}`);
}
bootstrap();
