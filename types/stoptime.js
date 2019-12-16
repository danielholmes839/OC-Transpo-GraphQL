class StopTime {
    /*  Access with trip_id-stop_id */
    constructor({ id, trip_id, stop_id, time }) {
        this.id = id //`${trip_id}-${stop_id}`;
        this.trip_id = trip_id;
        this.stop_id = stop_id;
        this.time = time;
    }
}

module.exports = {
    StopTime: StopTime
};
