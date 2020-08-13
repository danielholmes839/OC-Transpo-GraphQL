import { Date } from './types';

export default {
    string: ({ year, month, day }: Date): String => {
        let mm: String | number = (month < 10) ? `0${month}` : month;
        let dd: String | number = (day < 10) ? `0${day}` : day;
        return `${year}/${mm}/${dd}`;
    }
}