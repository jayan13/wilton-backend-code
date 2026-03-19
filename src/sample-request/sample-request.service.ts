import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities';
import { DesignService } from 'src/design/design.service';
import { Repository } from 'typeorm';
import { CreateSampleRequestDto } from './dto/create-sample-request.dto';
import { UpdateSampleRequestDto } from './dto/update-sample-request.dto';
import { SampleRequest } from './entities/sample-request.entity';
import { ResponseDto } from 'src/common';
import { AWSEmailService } from 'src/email/email.service';
import { CompanyColor } from 'src/company-color/entities/company-color.entity';
import sharp from 'sharp';
@Injectable()
export class SampleRequestService {
  constructor(
    @InjectRepository(SampleRequest)
    private sampleRequestRepository: Repository<SampleRequest>,
    @Inject(DesignService)
    private designService: DesignService,
    private sesService: AWSEmailService,
    @InjectRepository(CompanyColor)
    private companyColorRepository: Repository<CompanyColor>,
  ) {}

  async create(
    createSampleRequestDto: CreateSampleRequestDto,
    user: User,
  ): Promise<ResponseDto> {
    try {
      const design = await this.designService.findOne(
        createSampleRequestDto.designId,
      );
      if (!design) {
        console.log(`Design not found`);
        throw new InternalServerErrorException(`Design not found`);
      }

      const sampleRequest = await this.sampleRequestRepository.save({
        sampleSize: createSampleRequestDto.sampleSize,
        productConstruction: createSampleRequestDto.productConstruction,
        pileType: createSampleRequestDto.pileType,
        colors: design.colors,
        patternImage: design.patternImage,
        design: design,
        requestedBy: user,
      });

      const companyColors = await this.companyColorRepository.find();
      const designName = sampleRequest.design.title;
      const userEmail = sampleRequest.requestedBy.email;
      const sampleSize = sampleRequest.sampleSize;
      const svgString = sampleRequest.patternImage;
      // Encode SVG string to base64
      const encodedSvg = btoa(svgString);
      // Convert the base64 SVG to PNG buffer
      const buffer = Buffer.from(encodedSvg, 'base64');
      const pngBuffer = await sharp(buffer).png().toBuffer();
      // Prepare the email body
      const body = `
      <html>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f9f9f9;">
    <!-- Wrapper -->
    <div style="max-width: 600px; margin: 50px auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
      
      <!-- Logo -->
      <div style="margin-bottom: 20px; text-align: center;">
        <img 
          src="https://wilton-assets.s3.ap-south-1.amazonaws.com/wilton-logo.png" 
          alt="Wilton Weavers Logo" 
          style="max-width: 200px; height: auto;"
        />
      </div>

      <!-- Greeting -->
      <h2 style="font-size: 24px; font-weight: normal; color: #333; text-align: left;">Dear Wilton Admin,</h2>

      <!-- Message -->
      <p style="font-size: 16px; color: #555; margin: 20px 0; text-align: left;">
        You have a new request for a sample with the following details:
      </p>

      <!-- Details -->
      <table style="width: 100%; margin: 20px 0; border-collapse: collapse; text-align: left;">
        <tr>
          <td style="font-size: 16px; color: #555; font-weight: bold; padding: 8px;">From:</td>
          <td style="font-size: 16px; color: #555; padding: 8px;">
            <a href="mailto:${userEmail}" style="color: #0066cc;">${userEmail}</a>
          </td>
        </tr>
        <tr>
          <td style="font-size: 16px; color: #555; font-weight: bold; padding: 8px;">Design:</td>
          <td style="font-size: 16px; color: #555; padding: 8px;">${designName}</td>
        </tr>
        <tr>
          <td style="font-size: 16px; color: #555; font-weight: bold; padding: 8px;">Size:</td>
          <td style="font-size: 16px; color: #555; padding: 8px;">${sampleSize}</td>
        </tr>
        <tr>
          <td style="font-size: 16px; color: #555; font-weight: bold; padding: 8px;">Colors:</td>
          <td style="font-size: 16px; color: #555; padding: 8px;">
            ${design.colors
              .map(
                (color) => `
                <span style="display: inline-block; margin-right: 10px; text-align: center;">
                  <div style="width: 20px; height: 20px; background-color: ${color}; display: inline-block; border: 1px solid #ccc;"></div>
                  <br>
                  ${
                    companyColors.find((c) => c.colorCode === color)?.name ||
                    color
                  }
                </span>`,
              )
              .join('')}
          </td>
        </tr>
      </table>

      <!-- Footer -->
      <p style="font-size: 14px; color: #888; margin-top: 20px; text-align: left;">Thank you,</p>
      <p style="font-size: 14px; color: #888; text-align: left;">Wilton</p>
    </div>
  </body>
</html>
      `;
      // Prepare the email message for AWS SES
      const emailMessage = {
        to: process.env.SAMPLE_REQUEST_EMAIL_TO,
        cc: process.env.SAMPLE_REQUEST_CC_TO,
        from: process.env.AWS_SES_FROM_EMAIL,
        subject: `Sample Request from Wilton`,
        body: body,
        attachments: [
          {
            filename: 'pattern.png',
            content: pngBuffer,
            contentType: 'image/png',
          },
        ],
      };

      // Use AWS SES to send the email with attachment
      return await this.sesService.sendEmailWithAttachment(emailMessage);
    } catch (err) {
      console.error('Error while creating sampleRequest:', err);
      throw new InternalServerErrorException(
        `Something went wrong while creating sampleRequest`,
      );
    }
  }

  findOne(id: string) {
    return this.sampleRequestRepository.findOne({
      where: { id },
    });
  }

  async update(id: string, updateSampleRequestDto: UpdateSampleRequestDto) {
    try {
      const sampleRequest = await this.sampleRequestRepository.save({
        id,
        ...updateSampleRequestDto,
      });
      return sampleRequest;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        `Something went wrong while creating sample Request`,
      );
    }
  }
}
