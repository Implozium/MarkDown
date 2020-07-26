//Реализует команду
class Command {
    execute() {throw new Error('Realize me');}
    undo() {throw new Error('Realize me');}
}
//Реализует команду без исполнения
class NoCommand extends Command {
    execute() {}
    undo() {}
}
//Реализует макро команду, для комбинации команд
class MacroCommand extends Command {
    constructor(commands) {
        super();
        this._commands = commands;
    }
    execute() {
        for (let i = 0; i < this._commands.length; i++) {
            this._commands[i].execute();
        }
    }
    undo() {
        for (let i = this._commands.length - 1; i >= 0; i--) {
            this._commands[i].execute();
        }
    }
}
//Реализует хранилище пользователей
class UserStorage {
    constructor () {
        this._users = [];
    }

    addUser(name, id, value) {
        this._users.push({name, id, value});
    }

    toString() {
        function format(str, length, space = ' ') {
            return (space.repeat(length) + str).slice(-length);
        }
        return this._users.map((user, i) => {
            return `#${format(i, 4)}: ${format(user.id, 4)}; ${format(user.name, 20)}; ${format(user.value, 8, '_')}$`;
        }).join('\n');
    }

    orderByName() {
        this._users.sort((userA, userB) => userA.name === userB.name ? 0 : userA.name < userB.name ? -1 : 1);
    }

    orderById() {
        this._users.sort((userA, userB) => userA.id - userB.id);
    }

    orderByValue() {
        this._users.sort((userA, userB) => userA.value - userB.value);
    }

    getFirst() {
        return this._users[0];
    }

    getLast() {
        return this._users[this._users.length - 1];
    }

    get users() {
        return this._users;
    }
}
//Реализует службу печати
class PrintServise {
    constructor(output) {
        this._output = output;
    }
    print(str) {
        this._output(str);
    }
}
//Реализует базовый класс отчетов по пользователю
class Report {
    constructor(user) {
        this._user = user;
    }
    setUser(user) {
        this._user = user;
    }
    make() {
        return '';
    }
}

class ValueReport extends Report {
    constructor(user) {
        super(user);
    }
    make() {
        return [
        `User ID: ${this._user.id}`,
        `Report about user ${this._user.name}`,
        `--------------------`,
        `his value is about ${this._user.value}$ on month`,
        `for year it is about ${this._user.value * 12}$`,
        `and for every day it is about ${this._user.value * 12 / 365}$`
        ].join('\n');
    }
}

class FiredReport extends Report {
    constructor(user) {
        super(user);
    }
    make() {
        return [
        `Report about user ${this._user.name} (ID: ${this._user.id})`,
        `--------------------`,
        `Is fired`,
        ``,
        ``,
        `Date ${new Date().toISOString()}`,
        `User's sign ____________________`,
        ].join('\n');
    }
}

class RaiseReport extends Report {
    constructor(user) {
        super(user);
    }
    make() {
        return [
        `Report about user ${this._user.name} (ID: ${this._user.id})`,
        `--------------------`,
        `You are raise.`,
        `Now you are given ${this._user.value}$ + ${this._user.value*0.1}$ = ${this._user.value*1.1}$`,
        ``,
        `Date ${new Date().toISOString()}`,
        `User's sign ____________________`,
        ].join('\n');
    }
}

class OrderByValueCommand extends Command {
    constructor(userStorage) {
        super();
        this._userStorage = userStorage;
    }
    execute() {
        this._userStorage.orderByValue();
    }
}

class PrintTopUserCommand extends Command {
    constructor(userStorage, printServise) {
        super();
        this._userStorage = userStorage;
        this._printServise = printServise;
    }
    execute() {
        const user = this._userStorage.getLast();
        printServise.print(new ValueReport(user).make());
    }
}

class PrintAllReportCommand extends Command {
    constructor(userStorage, printServise) {
        super();
        this._userStorage = userStorage;
        this._printServise = printServise;
    }
    execute() {
        this._userStorage.orderById();
        this._userStorage.users.forEach(user => {
            printServise.print(new ValueReport(user).make());
        });
    }
}

class FireLastAndRaiseFirstReportCommand extends Command {
    constructor(userStorage, printServise) {
        super();
        this._userStorage = userStorage;
        this._printServise = printServise;
    }
    execute() {
        this._userStorage.orderByValue();
        const first = this._userStorage.getFirst();
        printServise.print(new ValueReport(first).make());
        printServise.print(new FiredReport(first).make());
        const last = this._userStorage.getLast();
        printServise.print(new ValueReport(last).make());
        printServise.print(new RaiseReport(last).make());
    }
}
//Реализует меню, для вызова команд
class Menu {
    constructor() {
        this._items = {};
    }
    register(name, command) {
        this._items[name] = command;
    }
    call(name) {
        this._items[name].execute();
    }
}

const userStorage = new UserStorage();
userStorage.addUser('Jerry', 12, 2004);
userStorage.addUser('Mary', 11, 6092);
userStorage.addUser('John for Neighmah', 18, 3400);
userStorage.addUser('Fry', 13, 3700);
userStorage.addUser('Freya', 18, 1256);
userStorage.addUser('Erlang', 14, 3720);
userStorage.addUser('Jo Jo', 15, 1960);

const printServise = new PrintServise(console.log);

const menu = new Menu();
menu.register('Print Top User', new MacroCommand([
    new OrderByValueCommand(userStorage),
    new PrintTopUserCommand(userStorage, printServise),
]));
menu.register('Report about All',
    new PrintAllReportCommand(userStorage, printServise));
menu.register('Fire Last and Raise First',
    new FireLastAndRaiseFirstReportCommand(userStorage, printServise));

menu.call('Print Top User');
menu.call('Report about All');
menu.call('Fire Last and Raise First');