class ArrayIterator {
    constructor(array) {
        this._array = array;
        this._position = 0;
    }
    next() {
        return {
            done: this._position >= this._array.length,
            value: this._array[this._position++]
        };
    }
}

class ObjectIterator {
    constructor(object) {
        this._object = object;
        this._keys = Object.keys(this._object);
        this._position = 0;
    }
    next() {
        return {
            done: this._position >= this._keys.length,
            value: this._object[this._keys[this._position++]]
        };
    }
}

class KeyValue {
    constructor(key, value) {
        this.key = key; 
        this.value = value;
    }
}

class UserData {
    constructor(keyValueArray) {
        this._data = keyValueArray;
    }
    [Symbol.iterator]() {
        return new ArrayIterator(this._data);
    }
    get(key) {
        const keyValue = this._data.find(keyValue => keyValue.key === key);
        return keyValue ? keyValue.value : undefined;
    }
}

class UserDataMap {
    constructor(object) {
        this._data = Object.keys(object).reduce((obj, key) => {
            obj[key] = new KeyValue(key, object[key]);
            return obj;
        }, {});
    }
    [Symbol.iterator]() {
        return new ObjectIterator(this._data);
    }
    get(key) {
        const keyValue = this._data[key];
        return keyValue ? keyValue.value : undefined;
    }
}

class PrintUserData {
    constructor() {}
    print(aggregate) {
        for (let value of aggregate) {
            console.log(`${value.key}: ${value.value}`);
        }
    }
}

let iterator;
iterator = new ArrayIterator([1, 2, 3, 4, 5]);
let block;
while (block = iterator.next(), !block.done) {
    console.log(block.value);
}
iterator = new ObjectIterator({a: 2, b: 4, g: 3, d: 1});    
while (block = iterator.next(), !block.done) {
    console.log(block.value);
}

const userData = new UserData([
    new KeyValue('SURNAME', 'Mi'),
    new KeyValue('NAME', 'Mike'),
    new KeyValue('AGE', '28'),
]);

const userMap = new UserDataMap({
    'SURNAME': 'Anderson',
    'NAME': 'Jam',
    'AGE': '55',
    'COMPLEXTION': 'white'
});

const printUserData = new PrintUserData();
printUserData.print(userData);
printUserData.print(userMap);