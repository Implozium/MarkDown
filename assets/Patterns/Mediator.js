class Message {
    constructor(type, data = {}) {
        this.type = type;
        this.data = data;
    }
}

class Mediator {
    constructor() {
        this._colleagues = [];
    }
    add(colleague) {
       this._colleagues.push(colleague);
    }
    send(message, sender) {
        this._colleagues.forEach((colleague) => {
            //console.log(colleague, message);
            if (colleague !== sender) {
                colleague.notify(message);
            }
        });
    }
}

class Colleague {
    constructor(mediator) {
        this._mediator = mediator;
        this._mediator.add(this);
    }
    send(message) {
        this._mediator.send(message, this);
    }
    notify(message) {}
}

class User {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }
}

class AjaxEmmiter extends Colleague {
    constructor(mediator) {
        super(mediator);
    }
    start() {
        const step = () => {
            const choice = Math.floor(Math.random() * 10);
            console.log('step', choice);
            switch (choice) {
                case 0:
                case 1:
                case 2:
                    this.send(new Message('add-user', new User('New', Math.floor(Math.random()*10000))));
                break;
                case 3:
                    this.send(new Message('refresh-users', [
                        new User('User1', 203), new User('User2', 1203), new User('User3', 123)
                    ]));
                break;                    
                case 9:
                    console.log('end');
                    return;
                break;
            }
            setTimeout(step, 1000);
        }
        setTimeout(step, 1000);
    }
    notify(message) {
    }
}

class UserWidget extends Colleague {
    constructor(mediator) {
        super(mediator);
        this._users = [];
    }
    _addUser(user) {
       this._users.push(user);
    }
    addUser(user) {
        this._addUser(user);
        this.send(new Message('add-user', user));
    }
    refresh(users) {
        this._users = users;
    }
    notify(message) {
        switch (message.type) {
            case 'refresh-users':
                this.refresh(message.data);
            break;
            case 'add-user':
                this._addUser(message.data);
            break;
        }
    }
}

class TopUserWidget extends Colleague {
    constructor(mediator) {
        super(mediator);
        this.topUser = null;
    }
    refresh(users) {
        this.topUser = users.reduce((maxUser, user) => {
            if (maxUser.value < user.value) {
                return user;
            }
        });
        this.show();
    }
    addUser(user) {
        if (!this.topUser || user.value > this.topUser.value) {
            this.topUser = user;
            this.show();
        }
    }
    show() {
        if (!this.topUser) {
            return;
        }
        console.log(`TOP USER IS: ${this.topUser.name}; HAS ${this.topUser.value}`);
    }
    notify(message) {
        switch (message.type) {
            case 'refresh-users':
                this.refresh(message.data);
            break;
            case 'add-user':
                this.addUser(message.data);
            break;
        }
    }
}

const bus = new Mediator();

const ajaxEmmiter = new AjaxEmmiter(bus);
const userWidget = new UserWidget(bus);
const topUserWidget = new TopUserWidget(bus);
ajaxEmmiter.start();