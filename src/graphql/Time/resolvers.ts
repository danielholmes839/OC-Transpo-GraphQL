
import { Time } from '../types';

export default {
    string: (parent: Time): string => {
        let minute: string = (parent.minute < 10) ? `0${parent.minute}` : `${parent.minute}`;
        return `${parent.hour}:${minute}`;
    },
}