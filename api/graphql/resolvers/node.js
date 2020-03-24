const resolvers = {
    Node: {
        __resolveType: (node, context, info) => {
            return null;
        }
    }
}

module.exports = resolvers;