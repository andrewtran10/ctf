const jwt = require("jsonwebtoken");
require('dotenv').config();

function jwtGenerator(empl_id) {
    payload = {
        id: empl_id
    }

    return jwt.sign(payload, process.env.jwtSecret, {expiresIn: "1hr"});
}

module.exports = jwtGenerator;