//Представляет собой базовый элемент для вывода в консоль
class ConsoleElement {
    protected tag = '';

    display(level = 0): string {
        return '    '.repeat(level) + `<${this.tag} />`;
    }
}

class ComplexConsoleElement extends ConsoleElement {
    protected children: ConsoleElement[] = [];

    append(consoleElement: ConsoleElement): this {
        this.children.push(consoleElement);
        return this;
    }

    display(level = 0): string {
        const output: string[] = [];
        output.push('    '.repeat(level) + `<${this.tag}>`);
        this.children.forEach(child => output.push('    '.repeat(level) + child.display(level + 1)));
        output.push('    '.repeat(level) + `<${this.tag}/>`);
        return output.join('\n');
    }
}

class TextConsoleElement extends ConsoleElement {
    protected tag = '';

    public value: string = '';

    display(level = 0): string {
        return '    '.repeat(level) + `${this.value}`;
    }
}

class BRConsoleElement extends ConsoleElement {
    protected tag = 'br';
}

class InputConsoleElement extends ConsoleElement {
    protected tag = 'input';

    public value: string = '';

    public type: string = 'text';

    display(level = 0): string {
        return '    '.repeat(level) + `<${this.tag} type="${this.type}" value="${this.value}" />`;
    }
}

class HeaderConsoleElement extends ComplexConsoleElement {
    protected tag = 'header';
}

class FormConsoleElement extends ComplexConsoleElement {
    protected tag = 'form';
}

type ConsoleElementType = 'text' | 'header' | 'br' | 'input' | 'form';

//Реализует фабрику, которая по имени возвращает один из подтипов ConsoleElement или его
class ConsoleDocument {
    constructor() {}
    create(type: ConsoleElementType): ConsoleElement {
        switch (type) {
            case 'text':
                return new TextConsoleElement();
            case 'header':
                return new HeaderConsoleElement();
            case 'br':
                return new BRConsoleElement();
            case 'input':
                return new InputConsoleElement();
            case 'form':
                return new FormConsoleElement();
            default:
                return new ConsoleElement();
        }
    }
}

const consoleDocument = new ConsoleDocument();
const text = consoleDocument.create('text') as TextConsoleElement;
text.value = 'Header';
const header = consoleDocument.create('header') as HeaderConsoleElement;
header
    .append(text)
    .append(consoleDocument.create('br'));
const input = consoleDocument.create('input') as InputConsoleElement;
input.type = 'number';
input.value = '101';
const form = consoleDocument.create('form') as FormConsoleElement;
form.append(header);
form.append(input);
console.log(form.display());