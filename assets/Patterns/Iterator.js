//Агрегат
class Aggregate {
    createIterator() {}
}
//Итератор
class Iterator {
    hasNext() {}
    next() {}
}
//Реализует итератор для массива
class ArrayIterator extends Iterator {
    constructor(array) {
        super();
        this._array = array;
        this._position = 0;
    }
    hasNext() {
        return this._position < this._array.length;
    }
    next() {
        return this._array[this._position++];
    }
}
//Реализует итератор для объекта
class ObjectIterator extends Iterator {
    constructor(object) {
        super();
        this._object = object;
        this._keys = Object.keys(this._object);
        this._position = 0;
    }
    hasNext() {
        return this._position < this._keys.length;
    }
    next() {
        return this._object[this._keys[this._position++]];
    }
}

class KeyValue {
    constructor(key, value) {
        this.key = key; 
        this.value = value;
    }
}

class UserData extends Aggregate {
    constructor(keyValueArray) {
        super();
        this._data = keyValueArray;
    }
    createIterator() {
        return new ArrayIterator(this._data);
    }
    get(key) {
        const keyValue = this._data.find(keyValue => keyValue.key === key);
        return keyValue ? keyValue.value : undefined;
    }
}

class UserDataMap extends Aggregate {
    constructor(object) {
        super();
        this._data = Object.keys(object).reduce((obj, key) => {
            obj[key] = new KeyValue(key, object[key]);
            return obj;
        }, {});
    }
    createIterator() {
        return new ObjectIterator(this._data);
    }
    get(key) {
        const keyValue = this._data[key];
        return keyValue ? keyValue.value : undefined;
    }
}
//Реализует печатанье данных пользователя, использует только Aggregate, а в нем проход только с использованием Iterator 
class PrintUserData {
    constructor() {}
    print(aggregate) {
        const iterator = aggregate.createIterator();
        while (iterator.hasNext()) {
            const keyValue = iterator.next();
            console.log(`${keyValue.key}: ${keyValue.value}`);
        }
    }
}

let iterator;
iterator = new ArrayIterator([1, 2, 3, 4, 5]);
while (iterator.hasNext()) {
    console.log(iterator.next());
}
iterator = new ObjectIterator({a: 2, b: 4, g: 3, d: 1});
while (iterator.hasNext()) {
    console.log(iterator.next());
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