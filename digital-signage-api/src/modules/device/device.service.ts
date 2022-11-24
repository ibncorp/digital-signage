import { DeviceCreateDTO } from '../../model/dto/device/device-create.dto';
import {
  convertToCreateDevice,
  toDeviceDto,
  toDeviceDtoList,
} from '../../shared/mapper';
import { DeviceDTO } from '../../model/dto/device/device.dto';
import { Device } from '../../model/device.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusConstants } from '../../shared/constants';
import { OutletService } from '../outlet/outlet.service';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private deviceRepo: Repository<Device>,
    private outletService: OutletService
  ) {}

  async showAll(type: string): Promise<DeviceDTO[]> {
    const whereArgs = {
      status: StatusConstants.ACTIVE
    };

    if(type) {
      whereArgs['type'] = type;
    }

    return toDeviceDtoList(
      await this.deviceRepo.find({
        where: whereArgs,
        relations: ['outlet'],
      }),
    );
  }

  async read(id: string): Promise<DeviceDTO> {
    return toDeviceDto(
      await this.deviceRepo.findOne({
        where: { id, status: StatusConstants.ACTIVE },
        relations: ['outlet'],
      }),
    );
  }

  async findById(id: string): Promise<Device> {
    return await this.deviceRepo.findOne({
      where: { id },
      relations: ['outlet'],
    });
  }

  async create(data: DeviceCreateDTO) {
    const objEntity = await convertToCreateDevice(data, this.outletService);

    const device = this.deviceRepo.create(objEntity);
    await this.deviceRepo.save(device);
    return toDeviceDto(device);
  }

  async update(id: string, data: Partial<DeviceCreateDTO>) {
    const objEntity = await this.findById(id);
    if (!objEntity) {
      throw new HttpException('Device Not Found', HttpStatus.NOT_ACCEPTABLE);
    }

    objEntity.code = data?.code ?? objEntity.code;
    objEntity.name = data?.name ?? objEntity.name;
    objEntity.description = data?.description ?? objEntity.description;
    objEntity.outlet = await this.outletService.findById(data?.outletId) ?? objEntity.outlet;
    objEntity.status = data?.status ?? objEntity.status;
    objEntity.type = data?.type ?? objEntity.type;

    await this.deviceRepo.update({ id }, objEntity);
    return toDeviceDto(await this.deviceRepo.findOne({ where: { id } }));
  }

  async destroy(id: string) {
    const device = await this.deviceRepo.findOne({ id });
    device.status = StatusConstants.NOT_ACTIVE;
    await this.deviceRepo.update({ id }, device);
    return { deleted: true };
  }
}
