class Trip {
    /* Access with trip_id */
    constructor({ id, service_id, route_id, trip_headsign }) {
        this.id = id;
        this.service_id = service_id;
        this.route_id = route_id;
        this.trip_headsign = trip_headsign;
    }
}

module.exports = {
    Trip: Trip
};
