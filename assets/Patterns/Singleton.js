const config = {
    isDebug: true
};
//Реализует шаблон одиночка, используется для логирования
class Logger {
    constructor(config) {
        this._isDebug = config.isDebug;
    }
    //Возвращает единственный экземпляр
    static getInstance() {
        if (this.instance === null) {
            console.log('read config');
            this.instance = new Logger(config);
        }
        return this.instance;
    }

    log(...str) {
        if (this._isDebug) {
            console.log(...str);
        }
    }
}
Logger.instance = null; //ссылка на статическую переменную

Logger.getInstance().log('some text 1');
Logger.getInstance().log('some text 2');
Logger.getInstance().log('some text 3');