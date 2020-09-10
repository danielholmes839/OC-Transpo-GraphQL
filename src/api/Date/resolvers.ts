import { Date } from './types';

export default {
    string: ({ year, month, day }: Date): string => {
        let mm: string | number = (month < 10) ? `0${month}` : month;
        let dd: string | number = (day < 10) ? `0${day}` : day;
        return `${year}/${mm}/${dd}`;
    }
}