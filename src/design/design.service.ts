import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities';
import { LibraryService } from 'src/library/library.service';
import { In, Like, Repository } from 'typeorm';
import { CreateDesignDto } from './dto/create-design.dto';
import { DesignPaginationResponse } from './dto/design-pagination-response.dto';
import { UpdateDesignDto } from './dto/update-design.dto';
import { Design } from './entities/design.entity';
import { ShareDesignDto } from './dto/share-design.dto';
import { AWSEmailService } from 'src/email/email.service';

@Injectable()
export class DesignService {
  constructor(
    @InjectRepository(Design)
    private designRepository: Repository<Design>,
    private libraryService: LibraryService,
    private sesService: AWSEmailService,
  ) {}

  async create(createDesignDto: CreateDesignDto, user: User): Promise<any> {
    console.log(createDesignDto, user);
    try {
      const { libraries } = createDesignDto;

      // find all libraries for design.
      const libraryList = await this.libraryService.getAllLibraries(libraries);

      // create design
      const design = await this.designRepository.save({
        title: createDesignDto.title,
        designNumber: createDesignDto.designNumber,
        productConstruction: createDesignDto.productConstruction,
        picksMtr: createDesignDto.picksMtr,
        pileType: createDesignDto.pileType,
        repeatSize: createDesignDto.repeatSize,
        colors: createDesignDto.colors,
        patternImage: createDesignDto.patternImage,
        createdRole: user.role,
        libraries: libraryList,
        createdBy: user,
      });
      return design;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        `Something went wrong while creating design`,
      );
    }
  }

  async shareDesign(shareDesignDto: ShareDesignDto, user: User): Promise<any> {
    try {
      // Prepare the email content
      const subject = 'Share Design from Wilton';
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
          <h2 style="font-size: 24px; font-weight: normal; color: #333; text-align: left;">Hello,</h2>
          <!-- Message -->
          <p style="font-size: 16px; color: #555; margin: 20px 0; text-align: left;">
            ${user.email} has shared a design with you. Please check the attachment.
          </p>
          <!-- Footer -->
          <p style="font-size: 14px; color: #888; margin-top: 20px; text-align: left;">Thank you,</p>
          <p style="font-size: 14px; color: #888; text-align: left;">Wilton</p>
        </div>
      </body>
    </html>
      `;
      // Attachment as a base64 encoded string
      const attachment = Buffer.from(shareDesignDto.base64Image, 'base64');

      // Send email with AWS SES
      const emailMessage = {
        to: shareDesignDto.email,
        from: process.env.AWS_SES_FROM_EMAIL,
        subject: subject,
        body: body,
        attachments: [
          {
            filename: 'design.png',
            content: attachment,
            contentType: 'image/png',
          },
        ],
      };
      return await this.sesService.sendEmailWithAttachment(emailMessage);
    } catch (err) {
      console.error('Error while sharing design:', err);
      throw new InternalServerErrorException(
        'Something went wrong while sharing the design',
      );
    }
  }
  async findAll(
    offset: number,
    limit: number,
    libraries: string,
    q: string,
  ): Promise<DesignPaginationResponse> {
    try {
      const skip = offset > 1 ? (offset - 1) * limit : 0;
      let splitLibraries: string[];
      const query = {};
      if (libraries.length > 0) {
        splitLibraries = libraries.split(',');
        query['libraries'] = { id: In(splitLibraries) };
      }
      query['title'] = Like(`%${q}%`);
      const [designs, count] = await this.designRepository.findAndCount({
        where: { ...query, createdRole: 'SuperAdmin' },
        skip: skip,
        take: limit,
        order: {
          createAt: 'DESC',
        },

        select: [
          'title',
          'designNumber',
          'productConstruction',
          'picksMtr',
          'pileType',
          'repeatSize',
          'colors',
          'patternImage',
          'createAt',
          'updatedAt',
          'id',
          'createdRole',
        ],
        relations: ['libraries'],
      });
      return { designs, count };
    } catch (err) {
      console.log('err', err);
      throw new InternalServerErrorException('Something bad happened');
    }
  }

  async findAllDesignsForUser(
    id: string,
    offset: number,
    limit: number,
  ): Promise<DesignPaginationResponse> {
    try {
      const skip = offset > 1 ? (offset - 1) * limit : 0;
      const [designs, count] = await this.designRepository.findAndCount({
        where: { createdBy: { id } },
        order: {
          updatedAt: 'DESC',
        },
        skip: skip,
        take: limit,
        select: [
          'title',
          'designNumber',
          'productConstruction',
          'picksMtr',
          'pileType',
          'repeatSize',
          'colors',
          'patternImage',
          'createAt',
          'updatedAt',
          'id',
        ],
        relations: ['libraries'],
      });
      return { designs, count };
    } catch (err) {
      console.log('err', err);
      throw new InternalServerErrorException('Something bad happened');
    }
  }

  findOne(id: string) {
    return this.designRepository.findOne({
      where: { id },
      relations: ['libraries'],
    });
  }

  async update(id: string, updateDesignDto: UpdateDesignDto): Promise<Design> {
    try {
      const { libraries } = updateDesignDto;
      if (libraries && libraries.length) {
        const libraryList = await this.libraryService.getAllLibraries(
          libraries,
        );
        updateDesignDto.libraries = libraryList;
      }
      const design = await this.designRepository.save({
        id,
        ...updateDesignDto,
      });
      return design;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        `Something went wrong while creating library`,
      );
    }
  }

  async delete(id: string): Promise<any> {
    try {
      const design = await this.designRepository.findOne({
        where: {
          id,
        },
      });
      if (!design) throw new NotFoundException('Design not found');
      return await this.designRepository.softDelete(design.id);
    } catch (err) {
      throw new InternalServerErrorException(
        `Something went wrong while creating library`,
      );
    }
  }
}
