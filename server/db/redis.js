const redis = require("redis");
const { REDIS_CONFIG } = require("../config");
const client = redis.createClient(REDIS_CONFIG);

client.on("error", error => {
    console.log(error);
});

const set = (key, val) => {
    if (typeof val === "object") {
        val = JSON.stringify(val);
    }
    client.set(key, val, () => {});
};

const get = key => {
    return new Promise((resolve, reject) => {
        client.get(key, (err, val) => {
            if (err) {
                reject(err);
                return;
            }
            try {
                resolve(JSON.parse(val));
            } catch (error) {
                resolve(val);
            }
        });
    });
};

module.exports = {
    get,
    set,
};
