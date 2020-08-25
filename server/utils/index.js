const uuid = require("uuid");

const generateUUID = () => {
    let uid = uuid.v1();
    uid = uid.replace(/\-/g, "");
    return uid;
};

module.exports = {
    generateUUID,
};
