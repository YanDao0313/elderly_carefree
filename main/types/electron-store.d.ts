declare module "electron-store" {
    export default class Store<T> {
        constructor(options?: { name?: string });
        get<K extends keyof T>(key: K, defaultValue?: T[K]): T[K];
        set<K extends keyof T>(key: K, value: T[K]): void;
    }
}
