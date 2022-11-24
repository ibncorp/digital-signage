import { Device } from "@modules/devices/models";
import { Media } from "@modules/media/models";

export interface Promo {
    id: string;
    device: Device;
    media: Media;
}
