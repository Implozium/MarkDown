interface Rule<T> {
    validate(value: T): string;
}

interface StringRule extends Rule<string> {

};

class RequiredRule implements StringRule {
    validate(str: string): string {
        return !str ? `не задано` : '';
    }
}

class MinLengthRule implements StringRule {
    private length: number;

    constructor(length: number) {
        this.length = length;
    }

    validate(str: string): string {
        return str.length < this.length ? `длина меньше ${this.length}` : '';
    }
}

class MaxLengthRule implements StringRule {
    private length: number;

    constructor(length: number) {
        this.length = length;
    }

    validate(str: string): string {
        return str.length > this.length ? `длина больше ${this.length}` : '';
    }
}

class PatternRule implements StringRule {
    private regexp: RegExp;

    private message: string;

    constructor(regexp: RegExp, message: string) {
        this.regexp = regexp;
        this.message = message;
    }

    validate(str: string): string {
        return !this.regexp.test(str) ? `не проходит по маске, должно быть вида: ${this.message}` : '';
    }
}

class Validator {
    readonly name: string;

    private rules: StringRule[] = [];

    constructor(name: string) {
        this.name = name;
    }

    validate(str: string): string[] {
        return this.rules
            .map(rule => rule.validate(str))
            .filter(message => !!message);
    }

    addRule(rule: StringRule): this {
        this.rules.push(rule);
        return this;
    }
}

class Builder {
    private validator?: Validator;

    constructor() {
    }

    make(name: string): this {
        this.validator = new Validator(name);
        return this;
    }

    required(): this {
        if (!this.validator) {
            throw new Error('Validator must be created with method "make"');
        }
        this.validator.addRule(new RequiredRule());
        return this;
    }

    max(length: number): this {
        if (!this.validator) {
            throw new Error('Validator must be created with method "make"');
        }
        this.validator.addRule(new MaxLengthRule(length));
        return this;
    }

    min(length: number): this {
        if (!this.validator) {
            throw new Error('Validator must be created with method "make"');
        }
        this.validator.addRule(new MinLengthRule(length));
        return this;
    }

    regexp(regexp: RegExp, message: string) {
        if (!this.validator) {
            throw new Error('Validator must be created with method "make"');
        }
        this.validator.addRule(new PatternRule(regexp, message));
        return this;
    }

    get(): Validator {
        if (!this.validator) {
            throw new Error('Validator must be created with method "make"');
        }
        return this.validator;
    }
}

class ObjectValidator {
    private ruledObject: Record<string, Validator>;

    constructor(ruledObject: Record<string, Validator>) {
        this.ruledObject = ruledObject;
    }

    validate(obj: Record<string, string>): Record<string, { name: string, errors: string[] }> {
        return Object.keys(this.ruledObject)
            .reduce((errorObj, key) => {
                const errors = this.ruledObject[key].validate(obj[key] ?? '');
                if (errors.length) {
                    errorObj[key] = {
                        name: this.ruledObject[key].name,
                        errors
                    };
                }
                return errorObj;
            }, {} as Record<string, { name: string, errors: string[] }>);
    }
}

const builder = new Builder();
const personBlockValidator = new ObjectValidator({
    'name': builder.make('Имя').required().min(4).max(12).get(),
    'password': builder.make('Пароль').required().min(8).max(20).get(),
    'age': builder.make('Возраст').regexp(/^\d+$/, '12').get()
});

function showErrors(obj: Record<string, { name: string, errors: string[] }>) {
    console.log(Object.keys(obj).map(key => {
        return `Поле "${obj[key].name}" ${obj[key].errors.join(' и ')}`;
    }).join('\n'));
}

showErrors(personBlockValidator.validate({
    'name': 'Miker',
    'age': '18 лет'
}));