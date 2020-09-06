interface BaseStorage {
    set(key: string, data: string): void;
    get(key: string): string | undefined;
}

class ObjectStorage implements BaseStorage {
    private storage: Record<string, string> = {};

    set(key: string, data: string): void {
        this.storage[key] = data;
    }
    get(key: string): string | undefined {
        return this.storage[key];
    }
}

class MapStorage implements BaseStorage {
    private storage = new Map<string, string>();

    set(key: string, data: string): void {
        this.storage.set(key, data);
    }
    get(key: string): string | undefined {
        return this.storage.get(key);
    }
}

abstract class Creator {
    private maxStorages = 4;

    private i = 0;

    private storages: BaseStorage[] = [];

    constructor(maxStorages: number) {
        this.maxStorages = maxStorages;
    }

    protected abstract makeStorage(): BaseStorage;

    getStorage(): BaseStorage {
        const i = this.i;
        if (!this.storages[i]) {
            this.storages[i] = this.makeStorage();
        }
        this.i = this.i % this.maxStorages;
        return this.storages[i];
    }
}

class ObjectCreator extends Creator {
    protected makeStorage(): BaseStorage {
        return new ObjectStorage();
    }
}

class MapCreator extends Creator {
    protected makeStorage(): BaseStorage {
        return new MapStorage();
    }
}

function init(speedType: 'low' | 'high', isInMemory: boolean): Creator {
    const maxStorages = speedType === 'low' ? 4 : 10;
    if (isInMemory) {
        return new ObjectCreator(maxStorages);
    } else {
        return new MapCreator(maxStorages);
    }
}

const creator = init('low', true);
const storage = creator.getStorage();
storage.set('a', '{ "a": 100 }');
console.log(storage.get('a'));