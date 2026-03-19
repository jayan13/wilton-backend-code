import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import SendGrid, { MailDataRequired } from '@sendgrid/mail';
import { ResponseStatus } from 'src/auth/auth.type';
import { ResponseDto } from 'src/common';
import * as AWS from 'aws-sdk';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get<string>('SEND_GRID_KEY'));
  }

  async sendEmail(mail: MailDataRequired): Promise<ResponseDto> {
    const transport = await SendGrid.send(mail);
    if (transport[0]?.statusCode === 202) {
      return {
        status: ResponseStatus.SUCCESS,
        message: `E-Mail sent to successfully.`,
      };
    } else {
      throw new InternalServerErrorException('Something bad happened');
    }
  }
}

export class AWSEmailService {
  private ses: AWS.SES;

  constructor() {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    this.ses = new AWS.SES();
  }

  async sendEmail(mail: {
    to: string;
    from: string;
    cc?: string;
    subject: string;
    body: string;
  }): Promise<ResponseDto> {
    const params = {
      Source: mail.from,
      Destination: {
        ToAddresses: [mail.to],
        CcAddresses: mail.cc ? [mail.cc] : [], // Add CC if provided
      },
      Message: {
        Subject: {
          Data: mail.subject,
        },
        Body: {
          Html: {
            Data: mail.body,
          },
        },
      },
    };

    try {
      await this.ses.sendEmail(params).promise();
      return {
        status: ResponseStatus.SUCCESS,
        message: 'E-Mail sent successfully.',
      };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException('Something bad happened');
    }
  }

  async sendEmailWithAttachment(mail: {
    to: string;
    from: string;
    cc?: string; // Optional CC field
    subject: string;
    body: string;
    attachments: { filename: string; content: Buffer; contentType: string }[];
  }): Promise<ResponseDto> {
    // Use nodemailer to construct the raw email
    const transporter = nodemailer.createTransport({
      SES: { ses: this.ses, aws: AWS },
    });

    const message = {
      from: mail.from,
      to: mail.to,
      cc: mail.cc,
      subject: mail.subject,
      html: mail.body,
      attachments: mail.attachments.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    };

    try {
      await transporter.sendMail(message);
      return {
        status: ResponseStatus.SUCCESS,
        message: 'E-Mail with attachment sent successfully.',
      };
    } catch (error) {
      console.error('Error sending email with attachment:', error);
      throw new InternalServerErrorException('Something bad happened');
    }
  }
}
