import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: [
      'http://localhost:5173',         // tu frontend local en desarrollo
      'http://127.0.0.1:5173',         // IP local (lo mismo que localhost)
      'https://nexusutd.online',       // tu dominio en producción
      'https://app.nexusutd.online',   // subdominio para una app (por ejemplo, dashboard o mobile)
    ],
    credentials: true, // permite enviar cookies o tokens en headers
  })

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
