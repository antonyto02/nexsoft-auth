import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      secure: Number(process.env.EMAIL_PORT) === 465,
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const link = `https://nexusutd.online/reset-password?token=${token}`;
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperación de contraseña',
      text: `Hola,\n\nHas solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:\n${link}\n\nSi no fuiste tú, ignora este mensaje.`,
    });
  }
}
