class Storage {
    constructor() {
        this._storage = {};
    }
    save(id, data) {
        this._storage[id] = data;
    }
    load(id) {
        return this._storage[id];
    }
}
//Реализует мост для класса Storage, что позволяет не зависить от реализации класса Storage
class Store {
    constructor(storage) {
        this._storage = storage;
    }
    save(id, data) {
        console.log(`Save in db: ${id}, data: ${JSON.stringify(data)}`);
        this._storage.save(id, data);
    }
    load(id) {
        console.log(`Load from db: ${id}`);
        return this._storage.load(id);
    }
    check(id) {
        return !!this._storage.load(id);
    }
}

const storage = new Storage();
storage.save('0', {user: 'Zero'});
storage.save('0-car', {car: 'Minus'});
const store = new Store(storage);
console.log(store.load('0'));
store.save('1', store.load('0'));
console.log(store.check('0'));