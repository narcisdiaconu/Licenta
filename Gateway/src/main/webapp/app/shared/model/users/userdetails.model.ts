export interface IUserdetails {
    id?: number;
    firstName?: string;
    lastName?: string;
    address?: string;
    phoneNumber?: string;
    email?: string;
    accountId?: number;
}

export class Userdetails implements IUserdetails {
    constructor(
        public id?: number,
        public firstName?: string,
        public lastName?: string,
        public address?: string,
        public phoneNumber?: string,
        public email?: string,
        public accountId?: number
    ) {}
}
