type Singleton<T> = {
  instance: T;
};

export function toSingleton<T>(Constructor: new () => T): Singleton<T> {
  const Ctor = Constructor as new () => any;
  return class extends Ctor {
    protected constructor() {
      super();
    }
    private static _instance: typeof Ctor;

    static get instance() {
      if (!this._instance) {
        this._instance = new Ctor();
      }
      return this._instance;
    }
  } as unknown as Singleton<T>;
}
