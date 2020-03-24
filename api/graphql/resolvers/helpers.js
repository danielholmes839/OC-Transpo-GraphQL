const { User } = require('../../models/index');

const populateOne = async (id, Table) => {
    return await Table.findById(id);
};

const populateMany = async (ids, Table) => {
    return await Table.find({ _id: { $in: ids } });
};

const populateUser = async (id) => {
    let user = await populateOne(id, User);
    user.password = null;
    return user;
};

const docId = (parent, args, context) => {
    return parent._id;
}

module.exports = { populateOne, populateMany, populateUser, docId };