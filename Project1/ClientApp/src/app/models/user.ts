import { ValueColor } from "./droneModel";

export enum UserRole {
    NOT_SELECTED = -1,
    ADMIN = 1,
    PILOT = 2,
    PPO = 3,
    REB = 4,
    BRIGADE_ADMIN = 5,
    BRIGADE_PPO = 6,
    BRIGADE_REB = 7
};

export interface User {

    _id?: string;
    login?: string;
    password?: string;
    role?: UserRole;
    userOptions?: {
        nickName?: string;
        unitNumber?: string;
        dronModel?: string;
        dronAppointment?: string;
        dronType?: string;
        unit?: string;
        templates?: Template[];
    }
};

export interface Template {
    id?: string;
    templateName: string;
    controlRange?: string;
    videoRange?: string;
    assignment?: ValueColor;
    model?: ValueColor;
    workingHeight?: string;
}
