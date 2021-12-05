const fs = require('fs');

function makeError(msg, position, length) {
    return {
        msg,
        position,
        length,
    };
}

const checkers = [
    (current, prev, next) => {
        const invalidSymbols = /[^0-9a-zA-Zа-яА-Я \-.,<>/?`'";:\[\]|=*()!@#$%^&_+~{}\\]/g;
        const errors = [];
        for (let symbols = invalidSymbols.exec(current); symbols; symbols = invalidSymbols.exec(current)) {
            errors.push(makeError(`Invalid symbol '${symbols[0]}'`, symbols.index, 1))
        }
        return errors;
    },
    (current, prev, next) => {
        const endSpace = /(\S) $|(\S) {3,}\n|^ +$/;
        const errors = [];
        const matched = current.match(endSpace);
        if (matched && !matched[0].includes('|')) {
            errors.push(makeError(`Invalid end space '${matched[0]}'`, matched.index, matched[0].length))
        }
        return errors;
    },
    (current, prev, next) => {
        const endList = /^\s*- .*([^;.:])$/;
        const errors = [];
        const matched = current.match(endList);
        if (matched) {
            errors.push(makeError(`Invalid end list symbol '${matched[1]}'`, matched[0].length - 1, matched[0].length))
        }
        return errors;
    },
    (current, prev, next) => {
        const endLine = /^\s*- .*([^\.])$/;
        const errors = [];
        const matched = current.match(endLine);
        if (matched && next === '') {
            errors.push(makeError(`Invalid end line symbol '${matched[1]}'`, matched[0].length - 1, matched[0].length))
        }
        return errors;
    }
];

function check(content) {
    const arr = content.split(/\r?\n/);

    let isBlock = false;

    arr.forEach((line, i) => {
        if (/^```/.test(line)) {
            isBlock = !isBlock;
        }
        if (!isBlock) {
            const errors = checkers.map(checker => checker(line, arr[i - 1], arr[i + 1])).flat();
            if (errors.length) {
                console.log(`    In line ${i + 1} has errors:`);
                errors.forEach((error) => {
                    const substring = `${error.position - 20 < 0 ? '' : '...'}${line.substr(error.position - 20 < 0 ? 0 : error.position - 20, error.length + 20)}${error.length + 20 > line.length ? '' : '...'}`;
                    console.log(`        - error "${error.msg}" position: ${error.position}:${error.position + error.length} - "${substring}"`);
                });
            }
        }
    });
}

const inputDir = './raw';

fs.readdir(inputDir, (err, filenames) => {
    if (err) {
        return console.log(err);
    }
    filenames.filter(filename => /\.md$/.test(filename))
        .reduce((promise, filename) => promise.then(() => new Promise((res, rej) => {
            fs.readFile(`${inputDir}/${filename}`, 'utf8', (err, content) => {
                if (err) {
                    return rej(err);
                }
                console.log(`Check file: ${inputDir}/${filename}`);
                check(content);
                res();
            });
        })), Promise.resolve());
});