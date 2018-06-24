class UserListModelInterface {
    getUsers() {}
    addUser(user) {}
    getFields() {}
    setFields(fields) {}
    orderBy(field) {}
    attach(obj) {}
    notify() {}
}

class User {
    constructor({id, name, age, value}) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.value = value;
    }
}

class UserListModel extends UserListModelInterface {
    constructor(users) {
        super();
        this._users = users;
        this._fields = ['name'];
        this._observers = [];
        this._orderBy = 'name';
    }
    getUsers() {
        return this._users;
    }
    addUser(user) {
        if (!user.id) {
            user.id = this._users.reduce((lastId, user) => {
                return user.id > lastId ? user.id : lastId;
            } , -1) + 1;
        }
        this._users.push(user);
        this.orderBy();
        this.notify();
    }
    getFields() {
        return this._fields;
    }
    setFields(fields) {
        this._fields = fields;
        this.notify();
    }
    orderBy(field) {
        if (this._users[0] && this._users[0][field] === undefined) {
            return;
        }
        if (field === this._orderBy) {
            return;
        }
        this._orderBy = field;
        this._users.sort((a, b) => {
            return a[this._orderBy] < b[this._orderBy] ? -1
                : a[this._orderBy] === b[this._orderBy] ? 0 : 1;
        });
        field && this.notify();
    }
    attach(obj) {
        this._observers.push(obj);
    }
    notify() {
        this._observers.forEach(observer => observer.update(this));
    }
}

class Observer {
    update(model) {}
}

function format(str, length, space = ' ') {
    return (space.repeat(length) + str).slice(-length);
}

class UserListView extends Observer {
    constructor(controller, userListModel) {
        super();
        this._controller = controller;
        this._model = userListModel;
        this._model.attach(this);
    }
    paint() {
        const fields = this._model.getFields();
        const users = this._model.getUsers();
        const width = 25;
        let arrStr = [fields.map(field => format(field, width)).join('|')];
        arrStr.push('-'.repeat(fields.length * width + fields.length - 1));
        arrStr = arrStr.concat(users.map(user => {
            return fields.map(field => format(user[field], width)).join('|');
        }));
        console.log(arrStr.join('\n'));
    }
    update(model) {
        this.paint();
    }
}

class FieldListView extends Observer {
    constructor(controller, userListModel) {
        super();
        this._controller = controller;
        this._model = userListModel;
        this._model.attach(this);
    }
    paint() {
        const fields = this._model.getFields();
        const width = 25;
        let arrStr = ['Fields: [' + fields.join(',') + ']',
            'New fields: -f <fields>, ...',
            'Order by: -o <field>'
        ];
        console.log(arrStr.join('\n'));
    }
    type(str) {
        let match = null;
        if (match = str.match(/^-f (.+)/)) {
            this._controller.setFields(match[1].split(/, ?/));
        } else if (match = str.match(/^-o (.+)/)) {
            this._controller.setOrderBy(match[1]);
        } else {
            console.log('Error');
        }
    }
    update(model) {
        this.paint();
    }
}

class Controller {
    constructor(userListModel) {
        this._model = userListModel;
    }
    /*addUser(name, age, value) {
        this._model.addUser(new User({id: 121, name: 'Eve', age: 15, value: 580}));
    }*/
    setFields(fields) {
        this._model.setFields(fields);
    }
    setOrderBy(field) {
        this._model.orderBy(field);
    }
}

const users = [
    new User({id: 12, name: 'Fidel', age: 84, value: 12330}),
    new User({id: 23, name: 'Carl', age: 34, value: 1233}),
    new User({id: 16, name: 'Marry', age: 15, value: 124}),
    new User({id: 54, name: 'Mark', age: 26, value: 900000}),
];

const model = new UserListModel(users);
const controller = new Controller(model);
const userListView = new UserListView(controller, model);
const fieldListView = new FieldListView(controller, model);
userListView.paint();
fieldListView.paint();
fieldListView.type('-o id');
fieldListView.type('-f id, name, age, value');
fieldListView.type('-o age');
fieldListView.type('-f name, age');