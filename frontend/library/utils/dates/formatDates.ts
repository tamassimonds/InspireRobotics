


import moment from 'moment';

export function calculateAgeFromDOB(birthDateString: string): number {
    const birthDate = moment(birthDateString);
    const today = moment();
    return today.diff(birthDate, 'years');
}


