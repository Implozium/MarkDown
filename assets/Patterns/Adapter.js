//Объявляет класс (интерфейс) коллекции
class Collection {
    constructor() {}
    get(index) {}
    remove(index) {}
    add(value) {}
    length() {}
    forEach(func) {
        return this;
    }
    map(func) {
        return this;
    }
}
//Адаптирует класс Array к интерфейсу колекции
class ArrayCollectionAdapter extends Collection {
    constructor(array) {
        super();
        this._array = array;
    }
    get(index) {
        return this._array[index];
    }
    remove(index) {
        this._array.splice(index, 1);
    }
    add(value) {
        this._array.push(value);
    }
    length() {
        return this._array.length;
    }
    forEach(func) {
        this._array.forEach(func);
        return this;
    }
    map(func) {
        this._array = this._array.map(func);
        return this;
    }
}
//Адаптирует класс Object к интерфейсу колекции
class ObjectCollectionAdapter extends Collection {
    constructor(object) {
        super();
        this._object = object;
    }
    get(index) {
        return this._object[Object.keys(this._object)[index]];
    }
    remove(index) {
        delete this._object[Object.keys(this._object)[index]];
    }
    add(value) {
        let key = Object.keys(this._object).length;
        while (this._object[key]) {
            key += 1;
        }
        this._object[key] = value;
    }
    length() {
        return Object.keys(this._object).length;
    }
    forEach(func) {
        Object.keys(this._object)
            .map(key => this._object[key])
            .forEach(func);
        return this;
    }
    map(func) {
        const keys = Object.keys(this._object);
        keys.map(key => this._object[key])
            .map(func)
            .forEach((value, i) => this._object[keys[i]] = value);
        return this;
    }
}

function print(val, i, arr) {
    console.log(`${i}: ${val}`);
}

function toRad(val) {
    return val * 2 * Math.PI / 360;
}

function toDeg(val) {
    return val / 2 / Math.PI * 360;
}
//Использует класс Collection
class Tester {
    constructor(collection) {
        this._collection = collection;
    }
    info() {
        this._collection.forEach(print);
    }
    infoExt() {
        this._collection.forEach(print);
        console.log(`First: ${this._collection.get(0)}`);
        console.log(`Last: ${this._collection.get(this._collection.length() - 1)}`);
        console.log(`Length: ${this._collection.length()}`);
    }
    clear() {
        while (this._collection.length()) {
            this._collection.remove(this._collection.length() - 1);
        }
    }
    addRandom() {
        for (let i = 0; i < 4; i++) {
            this._collection.add(Math.floor(Math.random() * 100));
        }
    }
    toRad() {
        this._collection
            .map(toRad);
    }
    toDeg() {
        this._collection
            .map(toDeg);
    }
    test() {
        this.infoExt();
        this.clear();
        this.addRandom();
        this.info();
        this.toRad();
        this.info();
        this.toDeg();
        this.info();
    }
}

let collection = new ArrayCollectionAdapter([4, 3, 2, 56]);
let tester = new Tester(collection);
tester.test();

collection = new ObjectCollectionAdapter({'23': 12, 'asd': 13, "boba": 2, "fet": 57});
tester = new Tester(collection);
tester.test();