const current_time = () => {
    let date = new Date();
    return (date.getHours() * 60) + date.getMinutes();
}

// Time Resolvers
export default {
    string: (parent: number): string => {
        let hour = Math.floor(parent / 60);
        
        // Determine AM/PM
        let half = 'am';
        if (hour >= 24) {
            half = 'am';
        } else if (hour >= 12) {
            half = 'pm';
        }

        // hour % 0 and if the remainder is 0 replace with 12
        hour %= 12;
        if (hour === 0) {
            hour = 12
        }

        // Create the string
        let minute = parent % 60;
        let minute_str = (minute < 10) ? `0${minute}` : `${minute}`;
        return `${hour}:${minute_str}${half}`;
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