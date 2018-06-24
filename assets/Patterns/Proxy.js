class User {
    constructor({id, name}) {
        this.id = id;
        this.name = name;
    }
}

class Storage {
    constructor({users}) {
        this._data = {users};
    }
    loadUser(id) {
        return new Promise((res, rej) => {
            setTimeout(() => {
                if (this._data.users[id]) {
                    res(this._data.users[id]);
                } else {
                    rej(new Error('Cannot find user with id'));
                }
            }, 1000);
        });
    }
}

class Cache {
    constructor() {
        this._cache = {};
    }
    set(id, data, time) {
        this._cache[id] = {
            time: Date.now() + time,
            data: JSON.stringify(data)
        };
    }
    get(id) {
        return new Promise((res, rej) => {
            setTimeout(() => {
                if (this._cache[id] && this._cache[id].time > Date.now()) {
                    res(JSON.parse(this._cache[id].data));
                } else {
                    rej(new Error('Cannot find id'));
                }
            }, 200);
        });
    }
}
//Реализует заместителя для доступа к Storage только в том случае, если нет их в Cache
class CachedStorage extends Storage {
    constructor(storage, cache) {
        super({});
        this._storage = storage;
        this._cache = cache;
    }
    loadUser(id) {
        return this._cache.get('user:' + id)
            .then(data => new User(data))
            .catch(err => {
                return this._storage.loadUser(id)
                    .then(user => {
                        this._cache.set('user:' + id, user, 2000);
                        return user;
                    });
            })
    }
}

const storage = new Storage({
    users: {
        0: new User({id: 0, name: 'Marry'}),
        2: new User({id: 2, name: 'Malkolm'}),
        7: new User({id: 7, name: 'Jerry'})
    }
});

const cache = new Cache();
const cachedStorage = new CachedStorage(storage, cache);

function testLoad(id) {
    console.time('load user id ' + id);
    return cachedStorage.loadUser(id)
        .then(user => console.timeEnd('load user id ' + id))
        .catch(err => console.timeEnd('load user id ' + id));
}

testLoad(0)
    .then(() => testLoad(2))
    .then(() => testLoad(2))
    .then(() => testLoad(2))
    .then(() => testLoad(0))
    .then(() => testLoad(2))
    .then(() => testLoad(2))
    .then(() => testLoad(0))
    .then(() => testLoad(2))
    .then(() => testLoad(2))
    .then(() => testLoad(0));