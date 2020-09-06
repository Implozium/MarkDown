interface ButtonElement {
    label: string;
    display(): string;
}

interface TextElement {
    text: string;
    display(): string;
}

interface Components {
    makeButton(label: string): ButtonElement;
    makeText(text: string): TextElement;
}

class ConsoleButtonElement implements ButtonElement {
    label: string;

    constructor(label: string) {
        this.label = label;
    }

    display(): string {
        return `[ ${this.label} ]`;
    }
}

class ConsoleTextElement implements TextElement {
    text: string;

    constructor(text: string) {
        this.text = text;
    }

    display(): string {
        return this.text.split('\n').map(str => '| ' + str).join('\n');
    }
}

class ConsoleComponents implements Components {
    makeButton(label: string): ButtonElement {
        return new ConsoleButtonElement(label);
    }

    makeText(text: string): TextElement {
        return new ConsoleTextElement(text);
    }
}

class XMLButtonElement implements ButtonElement {
    label: string;

    constructor(label: string) {
        this.label = label;
    }

    display(): string {
        return `<button label="${this.label}" />`;
    }
}

class XMLTextElement implements TextElement {
    text: string;

    constructor(text: string) {
        this.text = text;
    }

    display(): string {
        return `<text>${this.text}</text>`;
    }
}

class XMLComponents implements Components {
    makeButton(label: string): ButtonElement {
        return new XMLButtonElement(label);
    }

    makeText(text: string): TextElement {
        return new XMLTextElement(text);
    }
}

function getComponents(type: 'console' | 'XML'): Components {
    if (type === 'console') {
        return new ConsoleComponents();
    } else {
        return new XMLComponents();
    }
}

function display(components: Components): void {
    console.log(components.makeText('first and\nsecond').display());
    console.log(components.makeButton('click me').display());
}

display(getComponents('console'));
display(getComponents('XML'));