import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities';
import { ArrayContains, In, Repository } from 'typeorm';
import { CreateLibraryDto } from './dto/create-library.dto';
import { LibraryPaginationResponse } from './dto/library-pagination-response.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { Library } from './entities/library.entity';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(Library)
    private libraryRepository: Repository<Library>,
  ) {}

  async create(
    createLibraryDto: CreateLibraryDto,
    user: User,
  ): Promise<Library> {
    console.log(createLibraryDto, user);
    try {
      const library = await this.libraryRepository.save({
        name: createLibraryDto.name,
        status: createLibraryDto.status,
        createdBy: user,
      });
      return library;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        `Something went wrong while creating library`,
      );
    }
  }

  async findAll(
    offset: number,
    limit: number,
  ): Promise<LibraryPaginationResponse> {
    try {
      const skip = offset > 1 ? (offset - 1) * limit : 0;
      const [libraries, count] = await this.libraryRepository.findAndCount({
        skip: skip,
        take: limit,
        select: ['name', 'status', 'createAt', 'updatedAt', 'id'],
      });
      return { libraries, count };
    } catch (err) {
      console.log('err', err);
      throw new InternalServerErrorException('Something bad happened');
    }
  }

  findOne(id: string) {
    return this.libraryRepository.findOne({
      where: { id },
    });
  }

  findByIds(ids: string[]) {
    return this.libraryRepository.find({
      where: {
        id: ArrayContains(ids),
      },
    });
  }

  async update(
    id: string,
    updateLibraryDto: UpdateLibraryDto,
  ): Promise<Library> {
    try {
      const library = await this.libraryRepository.save({
        id,
        ...updateLibraryDto,
      });
      return library;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        `Something went wrong while creating library`,
      );
    }
  }

  /* TODO: implement delete library. both the steps will be done in a transaction
    1. remove library Id from all the designs
    2. remove library from database
  */
  async remove(id: string) {
    try {
      const library = await this.libraryRepository.findOne({
        where: { id },
      });
      return this.libraryRepository.remove(library);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(
        `Something went wrong while creating library`,
      );
    }
  }

  async getAllLibraries(ids: Library[]) {
    const libraries = await this.libraryRepository.find({
      where: { id: In(ids) },
      order: {
        createAt: 'DESC',
      },
    });
    return libraries;
  }
}
