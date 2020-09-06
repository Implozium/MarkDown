interface Clonable<T> {
    clone(): T;
}

class Item implements Clonable<Item> {
    private key: string;

    private value: string | number;

    constructor(key: string, value: string | number) {
        this.key = key;
        this.value = value;
    }

    clone(): Item {
        return new Item(this.key, this.value);
    }

    toString(): string {
        return `${this.key}: ${this.value}`;
    }
}

class TextRequest implements Clonable<TextRequest> {
    private from: string;

    private to: string;

    private items: Item[] = [];

    constructor(from: string, to: string) {
        this.from = from;
        this.to = to;
    }

    addItem(key: string, value: string | number): void {
        this.items.push(new Item(key, value));
    }

    getItems(): Item[] {
        return this.items;
    }

    setItems(items: Item[]): void {
        this.items = items;
    }

    clone(): TextRequest {
        const clone = new TextRequest(this.from, this.to);
        clone.setItems(this.items.map(item => item.clone()));
        return clone;
    }

    make() {
        const strArr = [];
        strArr.push(`From: ${this.from}`);
        strArr.push(`To: ${this.to}`);
        strArr.push(``);
        strArr.push(...this.items.map(item => item.toString()));
        return strArr.join('\n');
    }
}

const originRequest = new TextRequest('localhost', '8.8.8.8');
originRequest.addItem('Length', 400);
originRequest.addItem('Format-type', 'xml');
const cloneRequest = originRequest.clone();
cloneRequest.addItem('Offset', 200);
console.log(originRequest.make());
console.log(cloneRequest.make());