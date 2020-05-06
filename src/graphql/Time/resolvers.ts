import { currentTime } from '../Schedule/helpers';


export default {
    string: (parent: number): string => {
        let hour = Math.floor(parent / 60);
        let minute = parent % 60;
        let minute_str: string = (minute < 10) ? `0${minute}` : `${minute}`;
        return `${hour}:${minute_str}`;
    },

    remaining: (parent: number): number => {
        let now = currentTime();
        return (parent > now) ? parent - now : (1440 - parent) + now;
    },

    int: (parent: number): number => parent,
    
    hour: (parent: number): number => {
        return Math.floor(parent / 60);
    },

    minute: (parent: number): number => {
        return parent % 60;
    }
}