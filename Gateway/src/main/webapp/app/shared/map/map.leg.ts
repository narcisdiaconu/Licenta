export interface ILeg {
    distance: number;
    duration: number;
    summary: string;
    steps: any[];
    weight: number;
}

export class Leg implements ILeg {
    constructor(public distance: number, public duration: number, public summary: string, public weight: number, public steps: any[]) {}
}
