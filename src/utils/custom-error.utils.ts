import { StatusCodesEnum } from '../enums/status-codes.enum';

export class CustomError extends Error {
    code: StatusCodesEnum;

    constructor(code: StatusCodesEnum, message: string) {
        super(message);
        this.code = code;
    }
}