const current_time = () => {
    let date = new Date();
    return (date.getHours() * 60) + date.getMinutes();
}

// Time Resolvers
export default {
    string: (parent: number): string => {
        
        let hour = Math.floor(parent / 60) % 24;
        let half = (hour < 12) ? 'am' : 'pm';

        hour %= 12;
        hour = (hour === 0) ? 12 : hour;
        
        let minute = parent % 60;
        let minute_str = (minute < 10) ? `0${minute}` : minute;
        
        return `${hour }:${minute_str}${half}`;
    },

    remaining: (parent: number): number => {
        let now = current_time();
        return (parent > now) ? parent - now : (1440 - parent) + now;
    },

    int: (parent: number): number => parent
}