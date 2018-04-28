const crypto = require('crypto');
const fs = require('fs');

const secret = 'markdown';

function mdParse(content) {
    const arr = content.split(/\r?\n/);
    const resArr = [];
    
    let buffer = [];
    let isBlock = false;

    arr.forEach((line, i) => {
        if (/^```/.test(line)) {
            isBlock = !isBlock;
        }
        if (line !== '') {
            buffer.push(line);
        }
        if ((line === '' && isBlock === false) || i === arr.length - 1) {
            resArr.push(buffer.join('\r\n'));
            buffer = [];
        }
    });
    return resArr;
}

function getHash(str) {
    return str.replace(/ /g, '-').replace(/[^a-z0-9а-яё\-]/gi, '');
    /*return crypto.createHmac('sha256', secret)
        .update(str)
        .digest('hex')
        .substr(0, 10);*/
}

function mekeHrefId(content) {
    const hash = getHash(content);
    return `<a id="${hash}" href="#${hash}">${content}</a>`;
}

function makeHeader(content, level) {
    const hash = getHash(content);
    return '    '.repeat(level - 1) + `- [${content}](#${hash})`;
}

function makeContent(arr) {
    const headers = [];

    const madeArr = arr.map(row => {
        let match = null;
        if (match = /(.*?)\r?\n(===+)$/m.exec(row)) {
            headers.push({
                level: 1,
                title: match[1]
            });
            return mekeHrefId(match[1]) + '\r\n' + match[2];
        } else if (match = /^(#+) (.*)/.exec(row)) {
            headers.push({
                level: match[1].length,
                title: match[2]
            });
            return match[1] + ' ' + mekeHrefId(match[2]);
        } else {
            return row;
        }
    });

    return {headers, madeArr};
}

function prependHeaders(str) {
    const {headers, madeArr} = makeContent(mdParse(str));
    const resultArr = [];
    headers.forEach(header => {
        resultArr.push(makeHeader(header.title, header.level));
    });

    madeArr.unshift(resultArr.join('\r\n'));
    const content = 'Содержание';
    const hash = getHash(content);
    madeArr.unshift(`[${content}](#${hash})` + '\r\n==========');
    return madeArr;
}

const inputDir = './raw';
const outputDir = './output';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}
fs.readdirSync(outputDir).forEach(filename => fs.unlinkSync(`${outputDir}/${filename}`));

fs.readdir(inputDir, (err, filenames) => {
    if (err) {
        return console.log(err);
    }
    filenames.filter(filename => /\.md$/.test(filename))
        .reduce((promise, filename) => promise.then(() => new Promise((res, rej) => {
            fs.readFile(`${inputDir}/${filename}`, 'utf8',  (err, content) => {
                if (err) {
                    return rej(err);
                }
                const newFilename = `${outputDir}/${filename}`;
                fs.writeFile(newFilename, prependHeaders(content).join('\r\n\r\n'), (err) => {
                    console.log(`Handled: ${inputDir}/${filename} to ${newFilename}`);
                    err ? rej(err) : res();
                });
            });
        })), Promise.resolve());
});