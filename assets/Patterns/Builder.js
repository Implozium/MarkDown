class Rule {
    constructor() {}
    validate(str) {}
    message() {}
}

class RequiredRule extends Rule {
    validate(str) {
        return !!str;
    }
    message() {
        return `не задано`;
    }
}

class MinLengthRule extends Rule {
    constructor(length) {
        super();
        this._length = length;
    }
    validate(str) {
        return !str || str.length >= this._length;
    }
    message() {
        return `длина меньше ${this._length}`;
    }
}

class MaxLengthRule extends Rule {
    constructor(length) {
        super();
        this._length = length;
    }
    validate(str) {
        return !str || str.length <= this._length;
    }
    message() {
        return `длина больше ${this._length}`;
    }
}

class PatternRule extends Rule {
    constructor(regexp, message) {
        super();
        this._regexp = regexp;
        this._message = message;
    }
    validate(str) {
        return !str || this._regexp.test(str);
    }
    message() {
        return `не проходит по маске, должно быть вида: ${this._message}`;
    }
}

class Validator {
    constructor(name) {
        this._name = name;
        this._rules = [];
    }
    get name() {return this._name;}
    validate(str = '') {
        return this._rules.map(rule => {
            if (!rule.validate(str)) {
                return rule.message();
            }
            return '';
        }).filter(message => !!message);
    }
    addRule(rule) {
        this._rules.push(rule);
    }
}
//Строитель
class Builder {
    constructor() {
        this._validator = null;
    }
    make(name) {
        this._validator = new Validator(name);
        return this;
    }
    required() {
        this._validator.addRule(new RequiredRule());
        return this;
    }
    max(length) {
        this._validator.addRule(new MaxLengthRule(length));
        return this;
    }
    min(length) {
        this._validator.addRule(new MinLengthRule(length));
        return this;
    }
    regexp(regexp, message) {
        this._validator.addRule(new PatternRule(regexp, message));
        return this;
    }
    get() {
        return this._validator;
    }
}

class ObjectValidator {
    constructor(ruledObject) {
        this._ruledObject = ruledObject;
    }
    validate(obj) {
        return Object.keys(this._ruledObject)
            .reduce((errorObj, key) => {
                const errors = this._ruledObject[key].validate(obj[key]);
                if (errors.length) {
                    errorObj[key] = {
                        name: this._ruledObject[key].name,
                        errors
                    };
                }
                return errorObj;
            }, {});
    }
}

const builder = new Builder();
const personBlockValidator = new ObjectValidator({
    'name': builder.make('Имя').required().min(4).max(12).get(),
    'password': builder.make('Пароль').required().min(8).max(20).get(),
    'age': builder.make('Возраст').regexp(/^\d+$/, '12').get()
});

function showErrors(obj) {
    console.log(Object.keys(obj).map(key => {
        return `Поле "${obj[key].name}" ${obj[key].errors.join(' и ')}`;
    }).join('\n'));
}

showErrors(personBlockValidator.validate({
    'name': 'Miker',
    'age': '18 лет'
}));