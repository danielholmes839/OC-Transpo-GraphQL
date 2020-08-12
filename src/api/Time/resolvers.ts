const current_time = () => {
    let date = new Date();
    return (date.getHours() * 60) + date.getMinutes();
}

// Time Resolvers
export default {
    string: (parent: number): string => {
        let hour = Math.floor(parent / 60);
        let half = 'am';
        if (hour >= 24) {
            hour %= 12;
        } else if (hour > 12) {
            hour %= 12;
            half = 'pm';
        }

        if (hour === 0) {
            hour = 12
        }

        let hour_str = (hour == 0) ? `0${hour}` : `${hour}`;
        let minute = parent % 60;
        let minute_str = (minute < 10) ? `0${minute}` : `${minute}`;
        return `${hour_str}:${minute_str}${half}`;
    },

    remaining: (parent: number): number => {
        let now = current_time();
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