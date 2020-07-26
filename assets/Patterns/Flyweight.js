class Storage {
    constructor() {
        this._storage = {};
        this._delay = 1000;
    }
    save(id, data) {
        return new Promise((res, rej) => {
            setTimeout(() => {
                this._storage[id] = data;
                res(true);
            }, this._delay);
        });
    }
    load(id) {
        return new Promise((res, rej) => {
            setTimeout(() => {
                res(this._storage[id]);
            }, this._delay);
        });
    }
}
//Приспособлениц
class Connection {
    constructor(storage) {
        this._busy = false;
        this._storage = storage;
    }
    save(id, data) {
        if (this._busy) {
            return Promise.reject(new Error('Connection busy'))
        }
        this._busy = true;
        return this._storage.save(id, data)
            .then((res) => {
                this._busy = false;
                return res;
            }, (err) => {
                this._busy = false;
                return err;
            });
    }
    load(id) {
        //console.log(`Load from db: ${id}`);
        if (this._busy) {
            return Promise.reject(new Error('Connection busy'))
        }
        this._busy = true;
        return this._storage.load(id)
            .then((res) => {
                this._busy = false;
                return res;
            }, (err) => {
                this._busy = false;
                return err;
            });
    }
    isBusy() {
        return this._busy;
    }
}
//Хранит в себе приспособленцев Connection и возвращает их по мере освобождения
class ConnectionManager {
    constructor(storage, count) {
        this._storage = storage;
        this._connections = [];
        //this._counter = 0;
        this._queries = [];
        for (let i = 0; i < count; i++) {
            this._connections.push(new Connection(storage));
        }
    }
    _getFreeConnection() {
        for (let i = 0; i < this._connections.length; i++) {
            if (!this._connections[i].isBusy()) {
                return i;
            }
        }
        return -1;
    }
    _exec() {
        const i = this._getFreeConnection();
        if (i === -1) {
            return;
        }
        const query = this._queries.shift();
        if (query) {
            console.log('exec on ', i);
            if (query.type === 'load') {
                this._connections[i].load(query.data.id)
                    .then(query.promise.res, query.promise.rej)
                    .then(this._exec.bind(this));
            }
            if (query.type === 'save') {
                this._connections[i].save(query.data.id, query.data.data)
                    .then(query.promise.res, query.promise.rej)
                    .then(this._exec.bind(this));
            }
        }
    }
    _addQuery(type, data) {
        return new Promise((res, rej) => {
            this._queries.push({type, data, promise: {res, rej}});
            this._exec();
        });
    }
    save(id, data) {
        return this._addQuery('save', {id, data});
    }
    load(id) {
        return this._addQuery('load', {id});
    }
}

const storage = new Storage();

const connectionManager = new ConnectionManager(storage, 2);
connectionManager.save('0', {user: 'Zero'})
    .then(res => console.log(res));
connectionManager.save('0', {user: 'Zero'})
    .then(res => console.log(res));
connectionManager.save('0', {user: 'Zero'})
    .then(res => console.log(res));
connectionManager.save('0', {user: 'Zero'})
    .then(res => console.log(res));
connectionManager.save('0', {user: 'Zero'})
    .then(res => console.log(res));
connectionManager.save('0', {user: 'Zero'})
    .then(res => console.log(res));
connectionManager.save('0', {user: 'Zero'})
    .then(res => console.log(res));