//Реализует обработчик, если есть ссылка на следующий обработчик,
//то передает обработку в него после собственной обработки
class Middleware {
    constructor() {
        this._nextMiddleware = null;
    }
    setNext(middleware) {
        this._nextMiddleware = middleware;
        return this._nextMiddleware;
    }
    handle(request) {
        if (this._nextMiddleware) {
            this._nextMiddleware.handle(request);
        }
    }
}

class GetParser extends Middleware {
    constructor() {
        super();
    }
    handle(request) {
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
        super.handle(request);
    }
}

class PostParser extends Middleware {
    constructor() {
        super();
    }
    handle(request) {
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
        super.handle(request);
    }
}

class CookieParser extends Middleware {
    constructor() {
        super();
    }
    handle(request) {
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
        super.handle(request);
    }
}

const request = {
    url: '/dtpio/har?count=1&filter=all&order=name#domain',
    cookie: '_ga=GA1.2.1936902557.1527501556; __gads=ID=552aa07da96ca9be:T=1527501555:S=ALNI_MameugsFnYsQg1DxJEVwS0Q64sv-w; __qca=P0-1751555711-1527501556381',
    body: 'Name=Jonathan+Doe&Age=23&Formula=a+%2B+b+%3D%3D+13+%25%21'
}

const parsers = new Middleware();
parsers.setNext(new GetParser())
    .setNext(new PostParser())
    .setNext(new CookieParser());

parsers.handle(request);

console.log(request);