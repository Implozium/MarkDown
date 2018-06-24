//Абстрактный класс для Потока ввода
class InputStream {
    constructor() {}
    read() {}
}
//Входной поток как строка 
class StringInputStream extends InputStream {
    constructor(str) {
        super();
        this._str = str;
    }
    read() {
        return this._str;
    }
}
//Декоратор для оборачивания для предостовления дополнительной функциональности
class FilteredInputStream extends InputStream {
    constructor(inputStream) {
        super();
        this._inputStream = inputStream;
    }
    read() {
        return this._inputStream.read();
    }
}
//Конкретный декоратор по приводу символов к нижнему регистру
class LowerCaseInputStream extends FilteredInputStream {
    constructor(inputStream) {
        super(inputStream);
    }
    read() {
        return super.read().toLowerCase();
    }
}
//Конкретный декоратор по фильтру символов на уникальность
class DedoubleInputStream extends FilteredInputStream {
    constructor(inputStream) {
        super(inputStream);
        this._characters = {};
    }
    read() {
        return super.read()
            .split('')
            .filter(c => {
                if (this._characters[c]) {
                    return false;
                }
                this._characters[c] = true;
                return true;
            })
            .join('');
    }
}

const inputStream =
    new DedoubleInputStream(
        new LowerCaseInputStream(
            new StringInputStream('some STRING to check correct')));
console.log(inputStream.read());