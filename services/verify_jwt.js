let verify_jwt = async function verify_jwt(token, email = "why do we even need email here?") {
    const jwt = require('jsonwebtoken');

    try {
        jwt.verify(token, global.JWT_SECRET);

        const payload = { user: email };
        const options = { expiresIn: '4h', issuer: 'https://studentloop.com' };
        const secret = global.JWT_SECRET;
        const new_token = jwt.sign(payload, secret, options);

        return {session_valid: true, new_token: new_token};
    } catch (err) {
        if (err.message === "jwt expired") {
            return {session_valid: false, reason: "Token timed out"};
        } else if (err.message === "jwt malformed") {
            return {session_valid: false, reason: "Token malformed"};
        } else {
            return {session_valid: false, reason: err};
        }
    }
}

exports.verify_jwt = verify_jwt; 