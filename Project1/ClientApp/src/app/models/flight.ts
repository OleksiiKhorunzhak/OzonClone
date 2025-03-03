import { ValueColor } from "./droneModel";

export enum FlightSteps {
    START = 0,
    FLIGHT = 1,
    LBZ_FORWARD = 2,
    RETURN = 3,
    LBZ_HOME = 4,
    REDUCTION = 5,
    END = 6
}

export interface FlightStep {
    step?: number;
    isApproved?: boolean;
    isApprovedByAdmin?: boolean;
    isApprovedByPPO?: boolean;
    isApprovedByREB?: boolean;

    visibleStep?:number;
}

export interface Flight {
    _id?: string;
    operator?: string;
    unit?: string;
    zone?: string;
    streamLink?: string;
    assignment?: ValueColor;
    model?: ValueColor;
    controlRange?: string;
    videoRange?: string;
    workingHeight?: string;
    taskPerformanceArea?: string;

    dateOfFlight?: Date;

    routeForward?: string;
    routeBack?: string;

    discordUrl?: string; // ?
    isInDiscord?: boolean;

    flightStartDate?: Date;
    isFlightStarted?: boolean;

    LBZForwardDate?: Date;
    isLBZForward?: boolean;

    isForwardChanged?: boolean;
    changedForwardRoute?: string;

    returnDate?: Date;
    isReturnChanged?: boolean;
    changedReturnRoute?: string;

    boardingStatus?: string;

    LBZBackDate?: Date;
    isLBZBack?: boolean;

    reductionDate?: Date;
    reductionDistance?: number;
    reductionLocation?: string;

    langingStatus?: ValueColor;

    endDate?: Date;

    ppoPhone?: string; // ?
    rebPhone?: string; // ?

    userId?: string;

    isRejected?: boolean;
    rejectedReason?: string;
    isRejectedbyPPO?: boolean;
    isRejectedbyREB?: boolean;
    isRejectedbyAdmin?: boolean;

    isTerminated?: boolean;
    terminatedPilotReason?: string;

    flightStep: FlightStep;

    isRequireAttention: boolean;

    isChecked?: boolean;
    isExpanded?: boolean;

    timeFromLastStep?: string;

    isShowShortVersion?: boolean,
    isFlightStepChecked?: boolean,
    isLbzForwardStepChecked?: boolean,
    isLbzBackStepChecked?: boolean,
    isReductionStepChecked?: boolean
}
