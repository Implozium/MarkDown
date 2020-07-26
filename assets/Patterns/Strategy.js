//Используется для обработки строк данных и возвращения их в виде объекта
class Parser {
    constructor(extractor) {
        this.extractor = extractor;
    }
    setExtractor(extractor) {
        this.extractor = extractor;
    }
    parse(str) {
        const {headers, values} = this.extractor.extract(str);
        return values.map(rowArr => rowArr
            .reduce((obj, value, i) => {
                obj[headers[i] ? headers[i] : i] = value;
                return obj;
            }, {})
        );
    }
}

//Реализует алгоритм по разбору строк
class Extractor {
    extract(str) {
        return {headers: [], values: []};
    }
}

//Разбирает CSV строки
class CSVExtractor extends Extractor {
    constructor(delimiter) {
        super();
        this.delimiter = delimiter;
    }
    extract(str) {
        const rows = str.split(/\r?\n/);
        return {
            headers: rows[0].split(this.delimiter),
            values: rows.slice(1)
                .map(row => row.split(this.delimiter))
        };
    }
}

//Разбирает строки в табличном формате
class TableExtractor extends Extractor {
    constructor(delimiter) {
        super();
        this.delimiter = delimiter;
    }
    extract(str) {
        const rows = str.split(/\r?\n/);
        return {
            headers: rows[0].split(this.delimiter)
                .map(elem => elem.trim()),
            values: rows.slice(2)
                .map(row => row.split(this.delimiter)
                    .map(elem => elem.trim())
                )
        }
    }
}

const csvStr =
'number,id,name,sum\n' +
'1,123,Verk,3.00\n' +
'2,23,Mark,13.00\n' +
'3,142,Rozen,23.10';
let parser = new Parser(new CSVExtractor(','));
console.log(parser.parse(csvStr));

const tableStr =
'number | id  | name  | sum  \n' +
'----------------------------\n' +
'1      | 123 | Verk  |  3.00\n' +
'2      | 23  | Mark  | 13.00\n' +
'3      | 142 | Rozen | 23.10';
parser.setExtractor(new TableExtractor('|'));
console.log(parser.parse(tableStr));