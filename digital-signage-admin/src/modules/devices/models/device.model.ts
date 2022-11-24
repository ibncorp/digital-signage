import { Outlet } from "@modules/outlets/models";

export interface Device {
    id: string;
    code: string;
    name: string;
    description: string;
    type: string;
    outlet: Outlet;
}
