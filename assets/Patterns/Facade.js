class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
        this.cars = [];
        this.id = -1;
    }
}

class Car {
    constructor(number, color) {
        this.number = number;
        this.color = color;
        this.id = -1;
        this.serialNumber = '';
    }
}

class Storage {
    constructor() {
        this._users = [];
        this._cars = [];
    }
    addCar(car) {
        this._cars.push(car);
        car.id = this._cars.reduce((id, last) => last.id > id ? last.id : id, -1) + 1;
    }
    addUser(user) {
        this._users.push(user);
        user.id = this._users.reduce((id, last) => last.id > id ? last.id : id, -1) + 1;
    }
    getUserByName(name) {
        return this._users.find(user => user.name === name);
    }
}

class Registrator {
    constructor() {}
    registerCar(user, car) {
        car.serialNumber = user.name.length + ' ' + Math.floor(1000 + Math.random() * 9000) + '';
        return car;
    }
}

class Validator {
    constructor() {}
    isValidCar(car) {
        return car.number.length === 6 && car.serialNumber.length === 6;
    }
}
//Фасад, используется для связи подсистем
class CarService {
    constructor(storage, registrator, validator) {
        this._storage = storage;
        this._registrator = registrator;
        this._validator = validator;
    }
    add(name, age, number, color) {
        let user = this._storage.getUserByName(name);
        if (!user) {
            user = new User(name, age);
            this._storage.addUser(user);
        }
        if (user.cars.find(car => car.number === number)) {
            return;
        }
        const car = new Car(number, color);
        this._registrator.registerCar(user, car);
        if (this._validator.isValidCar(car)) {
            this._storage.addCar(car);
            user.cars.push(car);
        }
    }
}

const storage = new Storage();
const registrator = new Registrator();
const validator = new Validator();

const carService = new CarService(storage, registrator, validator);

carService.add('Bill', 23, '124587', 'green');
carService.add('Bill', 23, '124587', 'green');
carService.add('Bill', 23, '569853', 'red');
carService.add('Mark Aliu', 24, '895643', 'black');

console.log(storage);