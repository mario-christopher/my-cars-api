import { newId, theDB } from './util';

export const addCar = (make, model, year, userId) => {

    try {
        let db = theDB();
        let newCar = {
            make: make.required().max(50).min(5),
            model: model.required().max(50).min(5),
            year: year.required().range(1900, (new Date()).getFullYear())
        };
        newCar.id = newId();
        newCar.created = Date.now();
        newCar.userId = userId;
        db.cars.push(newCar);
        return {
            outcome: true,
            body: newCar
        };
    }
    catch (err) {
        return {
            outcome: false,
            body: err.message
        };
    }
}

export const updateCar = (id, make, model, year, userId) => {

    try {
        let db = theDB();
        let car = db.cars.find(c => c.id == id && c.userId == userId);
        if (car) {
            car.make = make.required().max(50).min(5);
            car.model = model.required().max(50).min(5);
            car.year = year.required().range(1900, (new Date()).getFullYear());
            return {
                outcome: true,
                body: car
            };
        }
        else {
            return {
                outcome: false,
                body: 'Car not found.'
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

export const deleteCar = (id, userId) => {

    try {
        let db = theDB();
        let carIndex = db.cars.findIndex(c => c.id == id && c.userId == userId);
        if (carIndex >= 0) {
            db.cars.splice(carIndex, 1);
            return {
                outcome: true,
                body: null
            };
        }
        else {
            return {
                outcome: false,
                body: 'Car not found.'
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

export const getCars = (userId) => {

    try {
        let db = theDB();
        return {
            outcome: true,
            body: db.cars.filter(c => c.userId == userId)
        };
    }
    catch (err) {
        return {
            outcome: false,
            body: err.message
        };
    }
}