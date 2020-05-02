import { currentTime } from '../Schedule/helpers';

import { Time } from '../types';

export default {
    string: (parent: Time): string => {
        let minute: string = (parent.minute < 10) ? `0${parent.minute}` : `${parent.minute}`;
        return `${parent.hour}:${minute}`;
    },

    remaining: (parent: Time): number => {
        let now = currentTime();
        return (parent.int > now) ? parent.int - now : (1440 - parent.int) + now;
    }
}