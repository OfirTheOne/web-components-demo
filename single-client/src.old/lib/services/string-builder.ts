
export class StringBuilder {
  protected values: string[] = [];


  constructor(value: string | string[] | StringBuilder) {
    if (value instanceof StringBuilder) {
        this.values = [...value.values];
    } else if (Array.isArray(value)) {
        this.values = [...value];
    }  else {
        this.append(value);
    }
}

  append(value: string): StringBuilder {
    this.values.push(value);
    return this;
  }

  toString(): string {
    return this.values.join();
  }
}






