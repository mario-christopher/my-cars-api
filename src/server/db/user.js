import { newId, theDB } from './util';

export const addUser = (email, name, password, avatar_url) => {

    try {
        let db = theDB();
        let user;

        user = db.users.find(u => u.email == email);
        if (!user) {
            user = {
                email: (email || '').required().emailId(),
                name: (name || '').required().min(1).max(100),
                password: hashPwd(((password || '').required().password())),
                avatar_url: avatar_url,
                created_at: new Date()
            };
            user.id = newId();
            db.users.push(user);
            return {
                outcome: true,
                body: user
            };
        }
        else {
            return {
                outcome: false,
                body: "User with this emailId already exists."
            };
        }
    }
    catch (err) {
        return {
            outcome: false,
            body: err.message
        };
    }
}

export const getUser = (email, password) => {

    try {
        let db = theDB();
        let hash = hashPwd(password);

        let user = db.users.find(u => u.email == email && u.password == hash);
        if (user) {
            return {
                outcome: true,
                body: user
            };
        }
        else {
            return {
                outcome: false,
                body: "Invalid email or password."
            };
        }
    }
    catch (err) {
        return {
            outcome: false,
            body: err.message
        };
    }
}

//Use an Hashing algorithm here to return and store a Hashed Pwd.
const hashPwd = (pwd) => {
    return "hash-mask" + pwd + "hash-mask";
}