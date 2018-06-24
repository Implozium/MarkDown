//Представляет собой базовый элемент для вывода в консоль
class ConsoleElement {
    constructor() {}
    display(str) {
        console.log(str);
    }
}

class ShortConsoleElement extends ConsoleElement {
    display(str) {
        console.log(str.substring(0, 10));
    }
}

class UpperConsoleElement extends ConsoleElement {
    display(str) {
        console.log(str.toUpperCase());
    }
}

class QuoteConsoleElement extends ConsoleElement {
    display(str) {
        console.log('"' + str + '"');
    }
}
//Реализует фабрику, которая по имени возвращает один из подтипов ConsoleElement или его 
class ConsoleOutputter {
    constructor() {}
    create(type) {
        switch (type) {
            case 'short':
                return new ShortConsoleElement();
            break;
            case 'quote':
                return new QuoteConsoleElement();
            break;
            case 'upper':
                return new UpperConsoleElement();
            break;
            case 'long':
            case 'simple':
            default:
                return new ConsoleElement();
            break;
        }
    }
}

const consoleOutputter = new ConsoleOutputter();
const text = 'Some string to Display';
let consoleElement = consoleOutputter.create('short');
consoleElement.display(text);
consoleElement = consoleOutputter.create('upper');
consoleElement.display(text);
consoleElement = consoleOutputter.create('long');
consoleElement.display(text);
consoleElement = consoleOutputter.create('quote');
consoleElement.display(text);