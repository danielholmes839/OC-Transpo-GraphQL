import { getCurrentTime } from 'helpers';
import { Context } from 'middleware';

const intRemaining = (parent: number): number => {
    let currentTime = getCurrentTime();
    return (parent > currentTime) ? parent - currentTime : (1440 - currentTime) + parent;
}

// Time Resolvers
export default {
    string: (parent: number): string => {
        let hour = Math.floor(parent / 60);
        let half = (hour < 12) ? 'am' : 'pm';
        hour %= 12
        hour = (hour === 0) ? 12 : hour;

        let minute = parent % 60;
        let minute_str = (minute < 10) ? `0${minute}` : minute;

        return `${hour}:${minute_str}${half}`;
    },

    stringRemaining: (parent: number): string => {
        let remaining: number = intRemaining(parent);
        let hours = Math.floor(remaining / 60);
        let minutes = Math.floor(remaining % 60);
        return (hours !== 0) ? `${hours}h ${minutes}m` : `${minutes}m`;
    },

    int: (parent: number): number => parent,
    intRemaining: intRemaining,
    passed: (parent: number, _: void, { datetime }: Context): boolean => datetime.currentTime > parent

}