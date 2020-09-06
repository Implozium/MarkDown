interface Storageable {
    save(id: string, data: string): void;
    load(id: string): string | undefined;
}

class ObjectStorage implements Storageable {
    private object: Record<string, string> = {};

    save(id: string, data: string): void {
        this.object[id] = data;
    }

    load(id: string): string | undefined {
        return this.object[id];
    }
}

class MapStorage implements Storageable {
    private map: Map<string, string> = new Map<string, string>();

    save(id: string, data: string): void {
        this.map.set(id, data);
    }

    load(id: string): string | undefined {
        return this.map.get(id);
    }
}

class Store {
    private storage: Storageable;

    constructor(storage: Storageable) {
        this.storage = storage;
    }
    
    loadIds(ids: string[]): (string | undefined)[] {
        return ids.map(id => this.storage.load(id));
    }

    check(id: string): boolean {
        return !!this.storage.load(id);
    }

    append(data: string): string {
        const id = Math.random().toFixed(20).slice(2);
        this.storage.save(id, data);
        return id;
    }
}

const store = new Store(new ObjectStorage());
const ids = [store.append('str'), store.append('asd'), store.append('dfdf')];
console.log(ids, store.loadIds(ids));
console.log(store.check(ids[0]));