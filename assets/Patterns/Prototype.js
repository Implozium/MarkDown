class Item {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
    clone() {
        return new Item(this.key, this.value);
    }
}

class Request {
    constructor(from, to) {
        this._from = from;
        this._to = to;
        this._items = [];
    }
    addItem(key, value) {
        this._items.push(new Item(key, value));
    }
    get items() {
        return this._items;
    }
    set items(items) {
        this._items = items;
    }
    clone() {
        const clone = new Request(this._from, this._to);
        clone.items = this.items.map(item => item.clone());
        return clone;
    }
    make() {
        const strArr = [];
        strArr.push(`From: ${this._from}`);
        strArr.push(`To: ${this._to}`);
        strArr.push(``);
        strArr.push(...this._items.map(item => `${item.key}: ${item.value}`));
        return strArr.join('\n');
    }
}

const originRequest = new Request('localhost', '8.8.8.8');
originRequest.addItem('Length', 400);
originRequest.addItem('Format-type', 'xml');
const cloneRequest = originRequest.clone();
cloneRequest.addItem('Offset', 200);
console.log(originRequest.make());
console.log(cloneRequest.make());