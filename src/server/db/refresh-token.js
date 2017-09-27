import { v1 } from 'uuid';
import { newId, theDB } from './util';

export const createRefreshToken = (userId) => {

    let db = theDB();
    let refreshToken = v1();            //Generate GUID as refresh token for user.

    db.refreshTokens.push({
        id: newId(),
        userId,
        refreshToken: hashToken(refreshToken),
        revoked: false
    });

    return {
        outcome: true,
        body: refreshToken
    };
}

export const getUserFromToken = (refreshToken) => {

    let db = theDB();
    let rtoken = db.refreshTokens.find(rt => rt.refreshToken == hashToken(refreshToken) && !rt.revoked);
    if (rtoken) {
        let user = db.users.find(u => u.id == rtoken.userId);
        if (user) {
            return {
                outcome: true,
                body: user
            };
        }
    }
    else {
        return {
            outcome: false,
            body: 'Invalid or revoked RefreshToken.'
        };
    }
}

export const deleteToken = (refreshToken) => {

    let db = theDB();
    let rtokenIndex = db.refreshTokens.findIndex(rt => rt.refreshToken == hashToken(refreshToken) && !rt.revoked);
    if (rtokenIndex >= 0) {
        db.refreshTokens.splice(rtokenIndex, 1);
        return {
            outcome: true,
            body: ''
        };
    }
    else{
        return {
            outcome: false,
            body: 'Invalid RefreshToken.'
        };
    }
}

//Use an Hashing algorithm here to return and store a Hashed Token.
const hashToken = (token) => {
    return "hash-mask" + token + "hash-mask";
}