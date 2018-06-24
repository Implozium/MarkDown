//Реализует базовый Component
class Part {
    constructor(name, value, units) {
        this._name = name;
        this._value = value;
        this._units = units;
    }
    add(part) {}
    remove(part) {}
    getChild(name) {}
    get name() {
        return this._name;
    }
    get units() {
        return this._units;
    }
    get value() {
        return this._value;
    }
    get price() {
        return this._value;
    }
    consist(level = 0) {
        return level === 0
            ? `${this._name}: ${this.price}$(+${this._value}$)`
            : [`${this._name}: ${this.price}$(+${this._value}$)`];
    }
}
//Реализует материал Leaf
class Material extends Part {
    constructor(name, value, units) {
        super(name, value, units);
    }
    consist(level = 0) {
        return level === 0
            ? `${this._name}: ${this.price}$`
            : [`${this._name}: ${this.price}$`];
    }
}
//Реализует инструмент Leaf
class Tool extends Part {
    constructor(name, value) {
        super(name, value, 'hours');
    }
    consist(level = 0) {
        return level === 0
            ? `Tool ${this._name}: ${this.price}$`
            : [`Tool ${this._name}: ${this.price}$`];
    }
}
//Реализует составную деталь Composite
class Detail extends Part {
    constructor(name, value, units) {
        super(name, value, units);
        this._parts = {};
    }
    add(part, count = 1) {
        if (!this._parts[part.name]) {
            this._parts[part.name] = {
                part: part,
                count: count
            };
        } else {
            this._parts[part.name].count++;
        }
    }
    remove(part) {
        delete this._parts[part.name];
    }
    getChild(name) {
        return this._parts[name];
    }
    get price() {
        return Object.keys(this._parts).reduce((price, key) => {
            return price + this._parts[key].count * this._parts[key].part.price;
        }, this.value);
    }
    consist(level = 0) {
        const strParts = Object.keys(this._parts).reduce((arr, key) => {
            const {part, count} = this._parts[key];
            const price = part.price;
            const value = part.value;
            const prefix = '    '.repeat(level) + `'--`;
            const suffix = `x ${count} ${part.units} = ${price*count}$`;
            const parr = part.consist(level + 1);
            parr[0] = prefix + ' ' + parr[0] + ' ' + suffix;
            arr.push(...parr);
            return arr;
        }, []);
        const str = Object.keys(this._parts).length === 0
            ? `${this._name}: ${this.price}$`
            : `${this._name}: ${this.price}$ (+${this._value}$)`;
        if (level === 0) {
            return [str].concat(strParts).join('\n');
        }
        return [str].concat(strParts);
    }
    [Symbol.iterator]() {
        const parts = Object.keys(this._parts).map(key => this._parts[key]);
        let position = 0;
        return {
            next() {
                return {
                    done: position >= parts.length,
                    value: parts[position++]
                };
            }
        };
    }
}
//Реализует составной итератор для прохода древовидной структуры Компоновщика
class CompositeIterator {
    constructor(iterator) {
        this._stack = [iterator];
        this._iterator = iterator;
    }
    next() {
        if (this._stack.length === 0) {
            return {done: true};
        } else {
            const iterator = this._stack[this._stack.length - 1];
            const block = iterator.next();
            if (block.done) {
                this._stack.pop();
                return this.next();
            } else {
                if (block.value.part instanceof Detail) {
                    this._stack.push(block.value.part[Symbol.iterator]());
                }
                return {done: false, value: block.value};
            }
        }
    }
}

const materials = {
    'salt': new Material('Salt', 10, 'g'),
    'sand': new Material('Sand', 3, 'g'),
    'iron': new Material('Iron', 120, 'g'),
    'wood': new Material('Wood', 40, 'm3'),
    'coal': new Material('Coal', 10, 'm3'),
}

const glass = new Detail('Glass', 2, 'unit');
glass.add(materials['salt'], 2);
glass.add(materials['sand'], 12);

const toolBake = new Tool('Bake', 1);

const nail = new Detail('Nail', 2, 'unit');
nail.add(materials['iron'], 2);
nail.add(materials['coal'], 4);
nail.add(toolBake, 10);

const window = new Detail('Window', 20, 'unit');
window.add(glass, 2);
window.add(nail, 12);
window.add(materials['wood'], 10);

console.log(window.price);
console.log(window.consist());

console.log(glass.consist());

for (let i of window) {
    console.log(i);
}

let compositeIterator;
let block;
compositeIterator = new CompositeIterator(window[Symbol.iterator]());
while (block = compositeIterator.next(), !block.done) {
    if (block.value.part instanceof Material) {
        console.log('Material', block.value.part.name);
    }
}
compositeIterator = new CompositeIterator(window[Symbol.iterator]());
while (block = compositeIterator.next(), !block.done) {
    if (block.value.part instanceof Detail) {
        console.log('Detail', block.value.part.name);
    }
}
compositeIterator = new CompositeIterator(window[Symbol.iterator]());
while (block = compositeIterator.next(), !block.done) {
    if (block.value.part instanceof Tool) {
        console.log('Tool', block.value.part.name);
    }
}