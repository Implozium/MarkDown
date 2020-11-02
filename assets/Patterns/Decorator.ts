interface TextStream {
    write(str: string): void;
    read(): string | undefined;
}

class StringTextStream implements TextStream {
    private buffer: string[] = [];

    write(str: string): void {
        this.buffer.push(str);
    }

    read(): string | undefined {
        return this.buffer.shift();
    }
}

class UpperStringTextStream implements TextStream {
    private textStream: TextStream;

    constructor(textStream: TextStream) {
        this.textStream = textStream;
    }

    write(str: string): void {
        this.textStream.write(str.toUpperCase());
    }

    read(): string | undefined {
        return this.textStream.read();
    }
}

class ReplacerStringTextStream implements TextStream {
    private textStream: TextStream;

    private searchValue: string;

    private replaceValue: string;

    constructor(textStream: TextStream, searchValue: string, replaceValue: string) {
        this.textStream = textStream;
        this.searchValue = searchValue;
        this.replaceValue = replaceValue;
    }

    write(str: string): void {
        this.textStream.write(str.replaceAll(this.searchValue, this.replaceValue));
    }

    read(): string | undefined {
        return this.textStream.read();
    }
}

const textStream = new ReplacerStringTextStream(new UpperStringTextStream(new StringTextStream()), 'x', 'o');

textStream.write('x-rays');
textStream.write('xerox');
textStream.write('x-man');

for (let str = textStream.read(); str; str = textStream.read()) {
    console.log(str);
}