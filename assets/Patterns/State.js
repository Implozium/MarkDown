class Context {
    constructor(data = {}) {
        this._data = data;
        this._states = {};
        this._currentState = null;
        this._onChangeState = () => {};
    }

    add(name, state) {
        this._states[name] = state;
        return this;
    }

    dispatch(name, data = {}) {
        this._states[this._currentState].dispatch(name, data, this);
        return this;
    }

    setState(name, data = {}) {
        this._onChangeState(this._currentState, name, data, this);
        if (this._states[this._currentState]) {
            this.dispatch('leave');
        }
        this._currentState = name;
        if (this._states[this._currentState]) {
            this.dispatch('enter', data);
        }
    }

    getState() {
        return this._currentState;
    }

    getData() {
        return this._data;
    }

    onChangeState(func) {
        this._onChangeState = func;
        return this;
    }
}

class State {
    constructor() {
        this._emmiters = {};
    }

    on(name, func) {
        this._emmiters[name] = func;
        return this;
    }

    dispatch(name, data, context) {
        if (this._emmiters[name]) {
            this._emmiters[name](data, context);
        }
    }

    onEnter(func) {
        return this.on('enter', func);
    }

    onLeave(func) {
        return this.on('leave', func);
    }
}

//Контекст, делегирует все операции текущему состоянию
const robot = new Context({
    health: 30,
    armor: 3
});

robot.add('armor', new State()
    .on('take damage', ({value}, robot) => {
        const data = robot.getData();
        data.health -= Math.floor(value/2);
        data.armor--;
        if (data.health <= 0) {
            data.health = 0;
            return robot.setState('stunned');
        }
        if (data.armor <= 0) {
            return robot.setState('naked');
        }
    })
    .on('take heal', ({value}, robot) => {
        const data = robot.getData();
        data.health += value;
        data.armor++;
    })
);

robot.add('naked', new State()
    .on('take damage', ({value}, robot) => {
        const data = robot.getData();
        data.health -= value;
        if (data.health <= 0) {
            return robot.setState('stunned');
        }
    })
    .on('take heal', ({value}, robot) => {
        const data = robot.getData();
        data.health += value;
        data.armor++;
        return robot.setState('armor');
    })
);

robot.add('stunned', new State()
    .on('enter', (d, robot) => {
        const data = robot.getData();
        data.health = 0;
        data.armor = 0;
    })
    .on('take damage', ({value}, robot) => {
        const data = robot.getData();
        data.health--;
        if (data.health <= -3) {
            return robot.setState('destroyed');
        }
    })
    .on('take heal', ({value}, robot) => {
        const data = robot.getData();
        data.health = value;
        return robot.setState('armor');
    })
);

robot.add('destroyed', new State()
    .on('enter', (d, robot) => {
        const data = robot.getData();
        data.health = 0;
        data.armor = 0;
    })
);

robot.onChangeState((prev, next, data, robot) => {
    console.log(`From: ${prev} to: ${next}`);
    console.log(`Robot health: ${robot.getData().health} armor: ${robot.getData().armor}`);
});

robot.setState('armor');

while(robot.getState() !== 'destroyed') {
    const roll = Math.floor(Math.random() * 10);
    if (roll <= 2) {
        const value = Math.floor(Math.random() * 10) + 1;
        console.log(`Robot took heal: ${value}`);
        robot.dispatch('take heal', {value: value});
    } else {
        const value = Math.floor(Math.random() * 8) + 1;
        console.log(`Robot took damage: ${value}`);
        robot.dispatch('take damage', {value: value});
    }
}