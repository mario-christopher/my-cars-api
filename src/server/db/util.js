import { addModelValidations } from './validation';
import { addUser } from './user';
import { addCar } from './car';

const in_memory_db = {
    users: [],
    cars: [],
    refreshTokens: []
};

const newIdGen = () => {
    let id = 0;
    return () => {
        return ++id;
    }
}

export const newId = newIdGen();
export const theDB = () => in_memory_db;

export const initDb = () => {

    addModelValidations();
    seedDb();
    console.log('Database initialized !');
}

export const resetDB = () => {

    let db = theDB();
    db.users = [];
    db.cars = [];
    db.refreshTokens = [];
    seedDb();
    console.log('Database Reset !');
}

const seedDb = () => {

    addUser('John.Deere@yahoo.com', 'John Deere', 'Johndeere123', 'http://avatars.com/johndeere.jpg');
    addUser('Michael.More@hotmail.com', 'Micheal More', 'Michaelmore123', 'http://avatars.com/michaelmore.jpg');
    addUser('Tanya.Darling@gmail.com', 'Tanya Darling', 'Tanyadarling123', 'http://avatars.com/tanyadarling.jpg');
    addUser('Phillip.Thomas@outlook.com', 'Phillip Thomas', 'Phillipthomas123', 'http://avatars.com/phillipthomas.jpg');
    addUser('Seba.Cruz@abc.com', 'Seba Cruz', 'Sebacruz123', 'http://avatars.com/sebacruz.jpg');

    let db = theDB();
    db.users.forEach(u => {
        addCar('Toyota', 'Camry', 2001, u.id);
        addCar('Honda', 'CRV', 2002, u.id);
        addCar('Acura', 'Model 1', 2003, u.id);
        addCar('Dodge', '150 RAM', 2004, u.id);
        addCar('Ford', 'X', 2005, u.id);
    });
}