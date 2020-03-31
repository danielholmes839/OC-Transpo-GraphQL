const resolvers = {
    RouteGPS: {
        busCount: (parent, args, context) => {
            return parent.length
        },

        buses: (parent, args, context) => {
            return parent;
        }
    }
}

module.exports = resolvers;