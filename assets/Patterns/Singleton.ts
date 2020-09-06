interface Config {
    isDebug: boolean;
}

const config: Config = {
    isDebug: true
};

class Logger {
    private config: Config;

    private static instance: Logger | null = null;

    constructor(config: Config) {
        this.config = config;
    }

    static getInstance() {
        if (this.instance === null) {
            console.log('read config');
            this.instance = new Logger(config);
        }
        return this.instance;
    }

    log(...str: string[]) {
        if (this.config.isDebug) {
            console.log(...str);
        }
    }
}

Logger.getInstance().log('some text 1');
Logger.getInstance().log('some text 2');
Logger.getInstance().log('some text 3');