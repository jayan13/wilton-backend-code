import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SampleRequestService } from './sample-request.service';
import { CreateSampleRequestDto } from './dto/create-sample-request.dto';
import { UpdateSampleRequestDto } from './dto/update-sample-request.dto';
import { JwtAuthGuard } from 'src/common/guards';
import { User } from 'src/auth/entities';
import { GetCurrentUser } from 'src/common/decorator';

@UseGuards(JwtAuthGuard)
@Controller('sample-requests')
export class SampleRequestController {
  constructor(private readonly sampleRequestService: SampleRequestService) {}

  @Post()
  create(
    @GetCurrentUser() user: User,
    @Body() createSampleRequestDto: CreateSampleRequestDto,
  ) {
    return this.sampleRequestService.create(createSampleRequestDto, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sampleRequestService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSampleRequestDto: UpdateSampleRequestDto,
  ) {
    console.log(id, updateSampleRequestDto);
    return this.sampleRequestService.update(id, updateSampleRequestDto);
  }
}
