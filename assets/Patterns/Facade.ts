interface Storageable<T> {
    load(id: string): T | undefined;
    save(id: string, data: T): void;
}

interface User {
    id: string;
    name: string;
}

interface Readable {
    read(): User | undefined;
}

class UserStorage implements Storageable<User> {
    buffer: User[] = [];

    load(id: string): User | undefined {
        return this.buffer.find(user => user.id === id);
    }

    save(id: string, data: User): void {
        const index = this.buffer.findIndex(user => user.id === id);
        if (index !== -1) {
            this.buffer[index] = data;
        } else {
            this.buffer.push(data);
        }
    }
}

class UserHandler implements Storageable<User>, Readable {
    private userStorage: UserStorage = new UserStorage();

    load(id: string): User | undefined {
        return this.userStorage.load(id);
    }

    save(id: string, data: User): void {
        return this.userStorage.save(id, data);
    }

    private i = 0;

    read(): User | undefined {
        const user = this.userStorage.buffer[this.i];
        if (!user) {
            this.i = 0;
            return;
        }
        this.i = this.i + 1;
        return user;
    }

    get length(): number {
        return this.userStorage.buffer.length;
    }
}

const userHandler = new UserHandler();

userHandler.save('123123', { id: '123123', name: 'first' });
userHandler.save('325234', { id: '325234', name: 'second' });
userHandler.save('235233', { id: '235233', name: 'third' });
userHandler.save('123562', { id: '123562', name: 'fourth' });

console.log(userHandler.load('235233'));
for (let user = userHandler.read(); user; user = userHandler.read()) {
    console.log(user);
}