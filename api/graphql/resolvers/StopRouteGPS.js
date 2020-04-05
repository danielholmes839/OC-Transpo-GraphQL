module.exports = {
    // StopRouteGPS
    busCount: (parent) => {
        return parent.buses.length
    },

    buses: (parent) => {
        return parent.buses;
    }
}