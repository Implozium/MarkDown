//Субъект
class Subject {
    constructor() {
        this.observers = [];
    }
    attach(observer) {
        this.observers.push(observer);
    }
    detach(observer) {
        const id = this.observers.indexOf(observer);
        if (id !== -1) {
            this.observers.splice(id, 1);
        }
    }
    notify() {
        this.observers.forEach(observer => observer.update(this));
    }
}
//Хранилище данных погоды
class WeatherData extends Subject {
    constructor() {
        super();
        this.data = {
            temperature: 0,
            pressure: 120
        };
    }
    setTemperature(temperature) {
        this.data.temperature = temperature;
        this.notify();
    }
    setPressure(pressure) {
        this.data.pressure = pressure;
        this.notify();
    }
    getData() {
        return this.data;
    }
}
//Наблюдатель
class Observer {
    update(subject) {}
}
//Отображает данные в точном формате
class WeatherShortDisplay extends Observer {
    constructor() {
        super();
    }
    update(subject) {
        const data = subject.getData();
        console.log(`Temperature is ${data.temperature} degrees Celsius, pressure is ${data.pressure}`);
    }
}
//Отображает данные в относительном формате
class WeatherLongDisplay extends Observer {
    constructor() {
        super();
        this.temperature = 0;
    }
    update(subject) {
        const data = subject.getData();
        let temperatureType = '';
        if (data.temperature < -10) {
            temperatureType = 'very cold';
        } else if (data.temperature < 0) {
            temperatureType = 'cold';
        } else if (data.temperature < 10) {
            temperatureType = 'cool';
        } else if (data.temperature < 20) {
            temperatureType = 'normal';
        } else if (data.temperature < 30) {
            temperatureType = 'hot';
        } else {
            temperatureType = 'very hot';
        }
        if (this.temperature === data.temperature) {
            console.log(`Temperature in the street is not changed, still ${temperatureType}`);
            return;
        }
        this.temperature = data.temperature;
        console.log(`Temperature in the street is ${temperatureType}`);
    }
}

const weatherData = new WeatherData();
weatherData.attach(new WeatherShortDisplay());
weatherData.attach(new WeatherLongDisplay());
weatherData.setTemperature(20);
weatherData.setPressure(40);
weatherData.setTemperature(0);