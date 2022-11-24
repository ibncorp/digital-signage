import { OutletCreateDTO } from '../../model/dto/outlet/outlet-create.dto';
import {
  convertToCreateOutlet,
  toOutletDto,
  toOutletDtoAll,
  toOutletDtoList,
} from '../../shared/mapper';
import { OutletDTO } from '../../model/dto/outlet/outlet.dto';
import { Outlet } from '../../model/outlet.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusConstants } from '../../shared/constants';

@Injectable()
export class OutletService {
  constructor(
    @InjectRepository(Outlet)
    private outletRepository: Repository<Outlet>,
  ) {}

  async showAll(): Promise<OutletDTO[]> {
    return toOutletDtoList(
      await this.outletRepository.find({
        where: {
          status: StatusConstants.ACTIVE,
        },
        relations: ['devices'],
      }),
    );
  }

  async read(id: string): Promise<OutletDTO> {
    return toOutletDtoAll(
      await this.outletRepository.findOne({
        where: { id, status: StatusConstants.ACTIVE },
        relations: ['devices'],
      }),
    );
  }

  async findById(id: string): Promise<Outlet> {
    return await this.outletRepository.findOne({
      where: { id },
      relations: ['devices'],
    });
  }

  async create(data: OutletCreateDTO) {
    const objEntity = convertToCreateOutlet(data);

    const outlet = this.outletRepository.create(objEntity);
    await this.outletRepository.save(outlet);
    return toOutletDto(outlet);
  }

  async update(id: string, data: Partial<OutletCreateDTO>) {
    const objEntity = await this.findById(id);
    if (!objEntity) {
      throw new HttpException('Outlet Not Found', HttpStatus.NOT_ACCEPTABLE);
    }

    const saveObj = new Outlet();
    saveObj.id = id;
    saveObj.code = data?.code;
    saveObj.name = data?.name;
    saveObj.address = data?.address;
    saveObj.region = data?.region;
    saveObj.status = data?.status;

    // Test
    await this.outletRepository.update({ id }, saveObj);
    return toOutletDto(await this.outletRepository.findOne({ where: { id } }));
  }

  async destroy(id: string) {
    const outlet = await this.outletRepository.findOne({ id });
    outlet.status = StatusConstants.NOT_ACTIVE;
    await this.outletRepository.update({ id }, outlet);
    return { deleted: true };
  }
}
