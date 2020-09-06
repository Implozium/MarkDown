interface Collection<T> {
    add(item: T): void;
    get(index: number): T;
    length: number;
}

class FixedStorage<T> {
    private maxLength: number;

    private storage: T[] = [];

    constructor(maxLength: number) {
        this.maxLength = maxLength;
    }

    push(item: T): void {
        if (this.storage.length >= this.maxLength) {
            this.storage.shift();
        }
        this.storage.push(item);
    }

    get(index: number): T {
        return this.storage[index];
    }

    get size(): number {
        return this.storage.length;
    }
}

class FixedStorageCollection<T> implements Collection<T> {
    private storage: FixedStorage<T>;

    constructor(storage: FixedStorage<T>) {
        this.storage = storage;
    }

    add(item: T): void {
        this.storage.push(item);
    }

    get(index: number): T {
        return this.storage.get(index);
    }

    get length(): number {
        return this.storage.size;
    }
}

function appendCollection<T>(collection: Collection<T>, value: T, count: number): void {
    for (let i = 0; i < count; i++) {
        collection.add(value);
    }
}

function forEach<T>(collection: Collection<T>, func: (item: T) => void): void {
    for (let i = 0; i < collection.length; i++) {
        func(collection.get(i));
    }
}

const fixedStorageCollection = new FixedStorageCollection(new FixedStorage<number>(3));
appendCollection(fixedStorageCollection, 0, 10);
forEach(fixedStorageCollection, item => console.log(item));