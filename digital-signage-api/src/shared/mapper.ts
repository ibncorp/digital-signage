import { UserRoleService } from './../user-role/user-role.service';
import { OutletService } from '../modules/outlet/outlet.service';
import { Outlet } from './../model/outlet.entity';
import { OutletCreateDTO } from './../model/dto/outlet/outlet-create.dto';
import { OutletDTO } from './../model/dto/outlet/outlet.dto';
import { RoleUpdateDTO } from './../model/dto/roles/role-update.dto';
import { RolesService } from './../roles/roles.service';
import { RoleCreateDTO } from './../model/dto/roles/role-create.dto';
import { RolesDTO } from './../model/dto/roles/role.dto';
import { UserService } from './../user/user.service';
import { UserRolesDTO } from './../model/dto/user-roles/user-roles.dto';
import { UserRole } from './../model/user-role.entity';
import { UserCreateDTO } from '../user/dto/user-create.dto';
import { User } from '../model/user.entity';
import { UserDTO } from '../user/dto/user-dto';
import { UserRoleCreateDTO } from '../model/dto/user-roles/user-roles-create.dto';
import { Role } from '../model/role.entity';
import { Device } from 'src/model/device.entity';
import { DeviceDTO } from 'src/model/dto/device/device.dto';
import { DeviceCreateDTO } from 'src/model/dto/device/device-create.dto';
import { MediaDTO } from 'src/model/dto/media/media.dto';
import { Media } from 'src/model/media.entity';
import { MediaCreateDTO } from 'src/model/dto/media/media-create.dto';
import { OutletSimpleDTO } from 'src/model/dto/outlet/outlet-simple.dto';
import { Content } from 'src/model/content.entity';
import { ContentDTO } from 'src/model/dto/content/content.dto';
import { ContentCreateDTO } from 'src/model/dto/content/content-create.dto';
import { DeviceService } from 'src/modules/device/device.service';
import { MediaService } from 'src/modules/media/media.service';

// User Mapper
export const toUserDto = (source: User): UserDTO => {
  const userDto: UserDTO = {
    id: source.id,
    username: source?.username,
    firstname: source?.firstname,
    lastname: source?.lastname,
    email: source?.email,
    status: source?.status,
    createDateTime: source?.createDateTime,
    createdBy: source?.createdBy,
    updateDate: source?.updateDate,
    updateBy: source?.updateBy,
  };

  return userDto;
};

export const convertToUser = (source: UserCreateDTO): User => {
  const userObject = new User();

  userObject.username = source?.username;
  userObject.firstname = source?.firstname;
  userObject.lastname = source?.lastname;
  userObject.email = source?.email;

  return userObject;
};

export const toUserDtoList = (source: User[]): UserDTO[] => {
  const result: UserDTO[] = [];
  source.map((x) => {
    const userDto: UserDTO = {
      id: x.id,
      username: x?.username,
      firstname: x?.firstname,
      lastname: x?.lastname,
      email: x?.email,
      status: x?.status,
      createDateTime: x?.createDateTime,
      createdBy: x?.createdBy,
      updateDate: x?.updateDate,
      updateBy: x?.updateBy,
    };
    result.push(userDto);
  });
  return result;
};

// User Roles Mapper
export const toUserRoleDtoList = (source: UserRole[]): UserRolesDTO[] => {
  const result: UserRolesDTO[] = [];
  if (source && source.length === 0) {
    return result;
  }

  source.map((x) => {
    const userRoleDto: UserRolesDTO = {
      id            : x.id,
      userId        : x?.user?.id,
      roleId        : x?.role?.id,
      userName      : x?.user?.firstname + ' ' + x?.user?.lastname,
      roleName      : x?.role?.rolename,
      status        : x?.status,
      createDateTime: x?.createDateTime,
      createdBy     : x?.createdBy,
      updateDate    : x?.updateDate,
      updateBy      : x?.updateBy,
    };
    result.push(userRoleDto);
  });
  return result;
};

export const toUserRoleDto = (source: UserRole): UserRolesDTO => {
  if (!source) {
    return null;
  }
  const userRoleDto: UserRolesDTO = {
    id: source?.id,
    userId: source?.user?.id,
    roleId: source?.role?.id,
    userName:
      source?.user !== null
        ? source?.user?.firstname + ' ' + source?.user?.lastname
        : '',
    roleName: source?.role?.rolename,
    status: source?.status,
    createDateTime: source?.createDateTime,
    createdBy: source?.createdBy,
    updateDate: source?.updateDate,
    updateBy: source?.updateBy,
  };
  return userRoleDto;
};

export const convertToUserRole = (source: UserRoleCreateDTO): UserRole => {
  const userRole = new UserRole();
  let userService: UserService;

  userService.findById(source?.userId).then((x) => {
    userRole.user = x;
  });
  userRole.status = source?.status;

  return userRole;
};

export const convertToUserRoleDto = (source: UserRole[]): UserRolesDTO[] => {
  const result: UserRolesDTO[] = [];
  let userRole = new UserRole();
  let userRoleService: UserRoleService;
  source.map((x) => {
    userRoleService.findById(x?.id).then((y) => {
      userRole = y;
    });
    userRole.status = x?.status;
    result.push(toUserRoleDto(userRole));
  });
  return result;
};

// Roles Mapper
export const toRoleDtoList = (source: Role[]): RolesDTO[] => {
  const result: RolesDTO[] = [];
  source.map((x) => {
    const userRoleDto: RolesDTO = {
      id: x.id,
      roleName: x?.rolename,
      status: x?.status,
      createDateTime: x?.createDateTime,
      createdBy: x?.createdBy,
      updateDate: x?.updateDate,
      updateBy: x?.updateBy,
    };
    result.push(userRoleDto);
  });
  return result;
};

export const toRoleDto = (source: Role): RolesDTO => {
  const roleDto: RolesDTO = {
    id: source?.id,
    roleName: source?.rolename,
    status: source?.status,
    createDateTime: source?.createDateTime,
    createdBy: source?.createdBy,
    updateDate: source?.updateDate,
    updateBy: source?.updateBy,
  };
  return roleDto;
};

export const convertToCreateRole = (source: RoleCreateDTO): Role => {
  const role = new Role();

  role.rolename = source?.roleName;
  role.status = source?.status;

  return role;
};

export const convertToUpdateRole = (source: Partial<RoleUpdateDTO>): Role => {
  let role = new Role();
  let roleService: RolesService;

  roleService.findById(source?.roleId).then((x) => {
    role = x;
  });
  role.rolename = source?.roleName;
  role.status = source?.status;

  return role;
};

// Outlet
export const toOutletDtoList = (source: Outlet[]): OutletDTO[] => {

  const result: OutletDTO[] = [];
  if (source && source.length === 0) {
    return result;
  }
  source.map((x) => {
    const outletDto: OutletDTO = {
      id: x.id,
      code: x?.code,
      name: x?.name,
      address: x?.address,
      region: x?.region,
      status: x?.status,
      createDateTime: x?.createDateTime,
      createdBy: x?.createdBy,
      updateDate: x?.updateDate,
      updateBy: x?.updateBy,
      devices: x?.devices,
    };
    result.push(outletDto);
  });
  return result;
};

export const toOutletSimpleDto = (source: Outlet): OutletSimpleDTO => {
  if (!source) {
    return null;
  }
  const outletDto: OutletSimpleDTO = {
    id: source?.id,
    code: source?.code,
    name: source?.name,
    address: source?.address,
    region: source?.region,
    status: source?.status,
    createDateTime: source?.createDateTime,
    createdBy: source?.createdBy,
    updateDate: source?.updateDate,
    updateBy: source?.updateBy,
  };
  return outletDto;
};

export const toOutletDto = (source: Outlet): OutletDTO => {
  if (!source) {
    return null;
  }
  const outletDto: OutletDTO = {
    id: source?.id,
    code: source?.code,
    name: source?.name,
    address: source?.address,
    region: source?.region,
    status: source?.status,
    createDateTime: source?.createDateTime,
    createdBy: source?.createdBy,
    updateDate: source?.updateDate,
    updateBy: source?.updateBy,
    devices: []//toDeviceDtoList(source?.devices),
  };
  return outletDto;
};

export const toOutletDtoAll = (source: Outlet): OutletDTO => {
  if (!source) {
    return null;
  }
  const outletDto: OutletDTO = {
    id: source?.id,
    code: source?.code,
    name: source?.name,
    address: source?.address,
    region: source?.region,
    status: source?.status,
    createDateTime: source?.createDateTime,
    createdBy: source?.createdBy,
    updateDate: source?.updateDate,
    updateBy: source?.updateBy,
    devices: toDeviceDtoList(source?.devices),
  };
  return outletDto;
};

export const convertToCreateOutlet = (source: OutletCreateDTO): Outlet => {
  const outlet = new Outlet();

  outlet.code = source?.code;
  outlet.name = source?.name;
  outlet.address = source?.address;
  outlet.region = source?.region;
  outlet.status = source?.status;

  return outlet;
};

// Content
export const toContentDtoList = (source: Content[]): ContentDTO[] => {
  
  const result: ContentDTO[] = [];
  if (source && source.length === 0) {
    return result;
  }

  source.map((x) => {
    const contentDto: ContentDTO = toContentDto(x);
    result.push(contentDto);
  });
  return result;
};

export const toContentDto = (source: Content): ContentDTO => {
  if (!source) {
    return null;
  }
  const contentDto: ContentDTO = {
    id: source.id,
    status: source?.status,
    createDateTime: source?.createDateTime,
    createdBy: source?.createdBy,
    updateDate: source?.updateDate,
    updateBy: source?.updateBy,

    device: toDeviceDto(source?.device),
    media: toMediaDto(source?.media),
    type: source.type,
  };
  return contentDto;
};

export const convertToCreateContent = async (
    source: ContentCreateDTO, 
    deviceService: DeviceService,
    mediaService: MediaService,
  ): Promise<Content> => {
  
  const content = new Content();

  content.status = source?.status;
  content.type = source?.type;
  
  content.device = toDeviceDto(await deviceService.findById(source.deviceId));  
  
  content.media = toMediaDto(await mediaService.findById(source.mediaId));

  return content;
};

// Device
export const toDeviceDtoList = (source: Device[]): DeviceDTO[] => {
  const result: DeviceDTO[] = [];
  if (source && source.length === 0) {
    return result;
  }

  source.map((x) => {
    const deviceDto: DeviceDTO = toDeviceDto(x);
    result.push(deviceDto);
  });
  return result;
};

export const toDeviceDto = (source: Device): DeviceDTO => {
  if (!source) {
    return null;
  }
  const deviceDto: DeviceDTO = {
      id: source.id,
      code: source?.code,
      name: source?.name,
      status: source?.status,
      createDateTime: source?.createDateTime,
      createdBy: source?.createdBy,
      updateDate: source?.updateDate,
      updateBy: source?.updateBy,
      outlet: toOutletSimpleDto(source?.outlet),
      type: source?.type,
      description: source?.description
  };
  return deviceDto;
};

export const convertToCreateDevice = async (source: DeviceCreateDTO, outletService: OutletService): Promise<Device> => {
  const device = new Device();

  device.code = source?.code;
  device.name = source?.name;
  device.type = source?.type;
  device.description = source?.description;
  device.status = source?.status;
  device.outlet = toOutletDto(await outletService.findById(source.outletId)); 
  return device;
};

// Media
export const toMediaDtoList = (source: Media[]): MediaDTO[] => {
  const result: MediaDTO[] = [];
  if (source && source.length === 0) {
    return result;
  }
  source.map((x) => {
    const mediaDto: MediaDTO = toMediaDto(x);
    result.push(mediaDto);
  });
  return result;
};

export const toMediaDto = (source: Media): MediaDTO => {
  if (!source) {
    return null;
  }
  const mediaDto: MediaDTO = {
      id: source.id,
      status: source?.status,
      createDateTime: source?.createDateTime,
      createdBy: source?.createdBy,
      updateDate: source?.updateDate,
      updateBy: source?.updateBy,
      fileName: source?.fileName,
      displayName: source?.displayName,
      mimeType: source?.mimeType,
      path: source?.path,
      description: source?.description,
      type: source?.type
  };
  return mediaDto;
};

export const convertToCreateMedia = (source: MediaCreateDTO): Media => {
  const media = new Media();

  media.status = source?.status;
  media.description = source?.description;

  return media;
};

