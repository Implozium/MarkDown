class Formater {
    toText(obj) {
        throw new Error('Must be realized');
    }
}

class JSONFormater extends Formater {
    toText(obj) {
        return JSON.stringify(obj, null, 4);
    }
}

class XMLFormater extends Formater {
    toText(obj, level = 0) {
        if (level === 0) {
            return '<xml>\n' + this.toText(obj, level + 1) + '</xml>';
        }
        return Object.keys(obj).map(key => {
            if (obj[key] instanceof Object) {
                return '    '.repeat(level) + '<' + key + '>\n' + this.toText(obj[key], level + 1) + '    '.repeat(level) + '</' + key + '>\n';
            } else {
                return '    '.repeat(level) + '<' + key + '>' + obj[key] + '</' + key + '>\n';
            }
        }).join('');
    }
}
//Представляет собой абстрактную фабрику, по созданию форматировщика объекта
class Outputter {
    //Должен вернуть наследника Formater
    createFormater() {
        throw new Error('Must be realized');
    }
}

class JSONOutputter extends Outputter {
    createFormater() {
        return new JSONFormater();
    }
}

class XMLOutputter extends Outputter {
    createFormater() {
        return new XMLFormater();
    }
}
//Использует фабрику для создания форматировщика объекта
class Writter {
    constructor(outputter) {
        this._outputter = outputter;
    }
    display(obj) {
        const formatter = this._outputter.createFormater();
        console.log(formatter.toText(obj));
    }
}

const obj = {a: 3, b: {c: 4, d: {d: 1}, b: 2}};
let writter = new Writter(new JSONOutputter());
writter.display(obj);
writter = new Writter(new XMLOutputter());
writter.display(obj);