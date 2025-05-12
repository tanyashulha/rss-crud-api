import { IUser } from '../interfaces/user.interface';

export const validateUserObj = (user: IUser): boolean | void => {
    if (!user && typeof user !== 'object') return;

    const isNameValid: boolean = Object.prototype.hasOwnProperty.call(user, 'userName') && typeof user.userName === 'string';
    const isAgeValid: boolean = Object.prototype.hasOwnProperty.call(user, 'age') && typeof user.age === 'number';
    const isHoddiesArrValid: boolean = Object.prototype.hasOwnProperty.call(user, 'hobbies')
        && Array.isArray(user.hobbies)
        && user.hobbies.every((el) => typeof el === 'string');
   
    return isNameValid && isAgeValid && isHoddiesArrValid;
};