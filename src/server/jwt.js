import { sign, verify } from 'jsonwebtoken';

export const encodeToken = (user) => {
    let options = {
        issuer: 'marioajayc',
        expiresIn: 10 * 60 * 60,
        subject: 'my-cars-api'
    };
    let userToEncode = {
        id: user.id,
        email: user.email,
        name: user.name
    }
    let jwt = sign(userToEncode, getKey(), options);
    return jwt;
}

export const decodeToken = (token) => {
    let decodedUser = verify(token, getKey());
    return {
        id: decodedUser.id,
        name: decodedUser.name,
        email: decodedUser.email
    };
}

const getKey = () => {
    //Return string, buffer or cert here.
    return "abcdefghijkABCDEFGHIJK";
}