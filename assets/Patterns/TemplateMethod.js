function format(str, length, space = ' ') {
    return (space.repeat(length) + str).slice(-length);
}
//Реализует класс по проверке и переформатированию файла и предостовляет шаблонные методы для переопределения в наследниках
class FileHandler {
    constructor() {
        this.output = this._makeOutput();
        this.idMap = {};
    }

    _makeOutput() {
        return {
            'valid': [],
            'unvalid': [],
            'output': [],
            'sumoutput': []
        };
    }

    _verifyContent(content) {
        this.output = this._makeOutput();
        content.split(/\r?\n/)
            .map(this._parseRow)
            .forEach(data => {
                if (this._isValid(data)) {
                    this.output['valid'].push(data);
                } else {
                    this.output['unvalid'].push(data);
                }
            });
    }
    //шаблонный метод
    _parseRow(row) {}
    //шаблонный метод
    _isValid(data) {}

    _groupData() {
        this.idMap = this.output['valid'].reduce((idMap, data) => {
            const id = this._makeId(data);
            if (!idMap[id]) {
                idMap[id] = [];
            }
            idMap[id].push(this._makeBlock(data));
            return idMap;
        }, {});
    }

    //шаблонный метод
    _makeId(data) {}
    //шаблонный метод
    _makeBlock(data) {}

    handle(content) {
        this._verifyContent(content);
        this._groupData();
        Object.keys(this.idMap).forEach(id => {
            let count = 0;
            let sum = 0;
            this.idMap[id].forEach(block => {
                count++;
                sum += this._getValue(block);
                this.output['output'].push(this._stringifyBlock(block));
            });
            this.output['sumoutput'].push(`Id: ${id}, count: ${count}, sum: ${sum}$`);
        });
        return this.output;
    }

    //шаблонный метод
    _getValue(block) {}
    //шаблонный метод
    _stringifyBlock(block) {}
}

class ProductFileHandler extends FileHandler {
    _parseRow(row) {
        return row.split(';');
    }
    _isValid(data) {
        return data.length === 3
            && /^\d+$/.test(data[1])
            && /^\d+$/.test(data[2])
    }
    _makeId(data) {
        return data[1];
    }
    _makeBlock(data) {
        return {
            userName: data[0],
            id: +data[1],
            value: +data[2]
        };
    }
    _getValue(block) {
        return block.value;
    }
    _stringifyBlock(block) {
        return [
            format(block.id, 4),
            format(block.userName, 20),
            format(block.value, 10, '-') + '$']
            .join('|');
    }
}

class HouseFileHandler extends FileHandler {
    _parseRow(row) {
        return row.split(':');
    }
    _isValid(data) {
        return data.length === 4
            && /^\d+$/.test(data[3])
    }
    _makeId(data) {
        return data[0] + ':' + data[1];
    }
    _makeBlock(data) {
        return {
            street: data[0],
            house: data[1],
            flat: data[2],
            value: +data[3]
        };
    }
    _getValue(block) {
        return block.value;
    }
    _stringifyBlock(block) {
        return [
            format(block.street, 10),
            format(block.house, 6),
            format(block.flat, 6),
            format(block.value, 10, '-') + '$']
            .join('|');
    }
}

function print(arr) {
    console.log(arr.join('\n'));
}
let fileHandler;
let output;

fileHandler = new ProductFileHandler();
output = fileHandler.handle([
    'Fisher;12;1000',
    'Jake;15;500',
    'Rod;12;17800',
    'Mike;12d;5000',
    'Jake;12;1000',
    'Jake;14;580'
].join('\n'));
print(output['output']);
print(output['sumoutput']);

fileHandler = new HouseFileHandler();
output = fileHandler.handle([
    '11 Line:12:406:5865000',
    '12 Line:12:12a:4561000',
    '12 Line:13:406-2:165000v',
    '11 Line:12:89:1465000',
    '16 Line:12:145:146000',
    '11 Line:12:4865:1456000',
].join('\n'));
print(output['output']);
print(output['sumoutput']);