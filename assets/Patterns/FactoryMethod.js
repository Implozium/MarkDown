//Представляет собой базовый элемент для вывода в консоль
class ConsoleElement {
    constructor() {}
    display(str) {
        console.log(str);
    }
}

class LogConsoleElement extends ConsoleElement {
    display(str) {
        console.log(str);
    }
}

class UpperLogConsoleElement extends ConsoleElement {
    display(str) {
        console.log(str.toUpperCase());
    }
}

class WarnConsoleElement extends ConsoleElement {
    display(str) {
        console.warn(str);
    }
}

class UpperWarnConsoleElement extends ConsoleElement {
    display(str) {
        console.warn(str.toUpperCase());
    }
}
//Представляет собой класс с фабричным методом, для форматированного вывода в консоль
class ConsoleWritter {
    constructor(type) {
        this._consoleElement = this._creacteConsoleElement(type);
    }
    //Должен переопределяться и возвращать один из подтипов ConsoleElement
    _creacteConsoleElement(type) {
        throw new Error('Must be realized');
    }
    display(str) {
        this._consoleElement.display('------ ' + new Date().toISOString() + ' ------');
        this._consoleElement.display(str);
        this._consoleElement.display('------ end ------');
    }
}
//Реализует вывод через метод log
class LogConsoleWritter extends ConsoleWritter {
    constructor(type) {
        super(type);
    }
    _creacteConsoleElement(type) {
        switch (type) {
            case 'upper':
                return new UpperLogConsoleElement();
            case 'simple':
            default:
                return new LogConsoleElement();
        }
    }
}
//Реализует вывод через метод warn
class WarnConsoleWritter extends ConsoleWritter {
    constructor(type) {
        super(type);
    }
    _creacteConsoleElement(type) {
        switch (type) {
            case 'upper':
                return new UpperWarnConsoleElement();
            case 'simple':
            default:
                return new WarnConsoleElement();
        }
    }
}

const text = 'Some string to Display';
let consoleWritter = new LogConsoleWritter('upper');
consoleWritter.display(text);
consoleWritter = new LogConsoleWritter('simple');
consoleWritter.display(text);
consoleWritter = new WarnConsoleWritter('upper');
consoleWritter.display(text);
consoleWritter = new WarnConsoleWritter('simple');
consoleWritter.display(text);