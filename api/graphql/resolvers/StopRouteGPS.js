module.exports = {
    // StopRouteGPS
    busCount: (parent) => {
        return parent.length
    },

    buses: (parent) => {
        return parent.buses;
    }
}