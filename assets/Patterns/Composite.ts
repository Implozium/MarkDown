interface Item {
    name: string;
    value: number;
    units: string;
    price: number;
    items: {
        item: Item;
        count: number;
    }[];
    add(item: Item, count: number): void;
    toString(): string;
    getComposition(): Item | {
        item: Item;
        count: number;
    }[];
}

abstract class Part implements Item {
    name: string;
    value: number;
    units: string;
    items: {
        item: Item;
        count: number;
    }[] = [];

    constructor(name: string, value: number, units: string) {
        this.name = name;
        this.value = value;
        this.units = units;
    }

    get price(): number {
        return this.value;
    }

    add(item: Item, count: number): void {
        this.items.push({ item, count });
    };

    abstract toString(): string;
    abstract getComposition(): Item | {
        item: Item;
        count: number;
    }[];
}

class Material extends Part {
    add(item: Item, count: number): void {
        throw new Error('Material cannot have items')
    };

    toString(): string {
        return `${this.name}: ${this.value}\$ (${this.units})`;
    }

    getComposition(): Item | {
        item: Item;
        count: number;
    }[] {
        return this;
    }
}

class Tool extends Part {
    add(item: Item, count: number): void {
        throw new Error('Tool cannot have items')
    };

    toString(): string {
        return `${this.name}: ${this.value}\$ (${this.units})`;
    }

    getComposition(): Item | {
        item: Item;
        count: number;
    }[] {
        return this;
    }
}

class Detail extends Part {
    get price(): number {
        return this.value + this.items.reduce((sum, { item, count }) => sum + item.price * count, 0);
    }

    toString(): string {
        return `${this.name}: ${this.value}\$ (${this.units})`;
    }

    getComposition(): Item | {
        item: Item;
        count: number;
    }[] {
        const arr: {
            item: Item;
            count: number;
        }[] = this.items.map(item => {
            const composition = item.item.getComposition();
            if (!Array.isArray(composition)) {
                return {
                    item: item.item,
                    count: item.count,
                };
            }
            return composition.map(inerItem => ({
                item: inerItem.item,
                count: item.count * inerItem.count,
            }));
        }).flat();

        const groupedArr: {
            item: Item;
            count: number;
        }[] = [];

        arr.forEach(item => {
            const found = groupedArr.find(anItem => anItem.item === item.item);
            if (found) {
                found.count += item.count;
            } else {
                groupedArr.push(item);
            }
        })

        return groupedArr;
    }
}

const board = new Material('board', 10, 'piece');
const nail = new Material('nail', 2, 'piece');
const hammer = new Tool('hammer', 0.2, 'hour');

const wall = new Detail('wall', 20, 'units');
wall.add(board, 10);
wall.add(nail, 16);
wall.add(hammer, 0.5);

const door = new Detail('door', 100, 'units');
door.add(board, 8);
door.add(nail, 32);
door.add(hammer, 2.5);

const house = new Detail('house', 0, 'units');
house.add(wall, 11);
house.add(board, 12);
door.add(nail, 48);
house.add(door, 1);
door.add(hammer, 4);

console.log('wall price is', wall.price);
console.log('door price is', door.price);
console.log('house price is', house.price);

const composition = house.getComposition();
if (Array.isArray(composition)) {
    composition.forEach(item => console.log(item.count, item.item.toString()));
}