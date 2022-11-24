import { Device } from "@modules/devices/models";
import { Media } from "@modules/media/models";

export interface Video {
    id: string;
    device: Device;
    media: Media;
}
