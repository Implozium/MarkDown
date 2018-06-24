//Использует внутри себя цепочку обязаностей, которые представлены в виде функций
//последовательно для обработки запроса
class Handler {
    constructor() {
        this._middlewares = [];
    }
    handle(request) {
        let i = 0;
        const next = (err) => {
            if (err) {
                console.log(err);
            }
            if (this._middlewares[i]) {
                console.log(i);
                this._middlewares[i++](request, next);
            }
        }
        next();
    }
    use(middleware) {
        this._middlewares.push(middleware);
        return this;
    }
}

function getParser(request, next) {
    if (request.url) {
        if (!request.urlParts) {
            request.urlParts = {};
        }
        let parts = request.url.split('?');
        request.urlParts.path = parts[0];
        if (parts[1]) {
            parts = parts[1].split('#');
            request.urlParts.params = parts[0].split('&').reduce((params, str) => {
                const [key, value] = str.split('=');
                params[key] = value;
                return params;
            }, {});
            if (parts[1]) {
                request.urlParts.anchor = parts[1];
            }
        }
    }
    next();
}

function postParser(request, next) {
    if (request.body) {
        if (!request.bodyParts) {
            request.bodyParts = {};
        }
        request.bodyParts.params = request.body.split('&').reduce((params, str) => {
            const [key, value] = str.split('=');
            params[key] = value;
            return params;
        }, {});
    }
    next();
}

function cookieParser(request, next) {
    if (request.cookie) {
        if (!request.cookieParts) {
            request.cookieParts = {};
        }
        request.cookieParts.params = request.cookie.split('; ').reduce((params, str) => {
            const [key, value] = str.split('=');
            params[key] = value;
            return params;
        }, {});
    }
    next();
}

const request = {
    url: '/dtpio/har?count=1&filter=all&order=name#domain',
    cookie: '_ga=GA1.2.1936902557.1527501556; __gads=ID=552aa07da96ca9be:T=1527501555:S=ALNI_MameugsFnYsQg1DxJEVwS0Q64sv-w; __qca=P0-1751555711-1527501556381',
    body: 'Name=Jonathan+Doe&Age=23&Formula=a+%2B+b+%3D%3D+13+%25%21'
}

const handler = new Handler();
handler
    .use(getParser)
    .use(postParser)
    .use(cookieParser);

handler.handle(request);

console.log(request);