export const FormExp = {
  parse(part, content) {
    if (part instanceof Repeat) return part.parse(content);
    if (part instanceof Any) return part.parse(content);
    if (part instanceof Object && 'parse' in part) return part.parse(content);

    if (typeof part === 'string') {
      const regex = new RegExp(`^${part}`);
      const matches = content.match(regex);
      if (matches) return matches[0];else return null;
    }

    throw new TypeError(`Part's type "${typeof part}" is wrong type`);
  }

};
export class Form extends Array {
  constructor(...arr) {
    if (Array.isArray(arr[0]) && arr.length === 1) arr = arr[0];
    super();
    super.push(...arr);
  }

  parse(content) {
    if (typeof content !== 'string') throw new TypeError('Content is not string');
    const tree = new Content();

    for (const part of this) {
      const match = FormExp.parse(part, content);
      tree.push(match);
      if (match) content = content.slice(match.toString().length);
    }

    return tree;
  }

  static new(str, ...exp) {
    const arr = [];

    for (let index = 0; index < str.raw.length; index++) {
      arr.push(str.raw[index]);
      if (index in exp) arr.push(exp[index]);
    }

    return new this(arr);
  }

}
export let Quantitier;

(function (Quantitier) {
  Quantitier[Quantitier["GREEDY"] = 0] = "GREEDY";
  Quantitier[Quantitier["LAZY"] = 1] = "LAZY";
})(Quantitier || (Quantitier = {}));

export class Repeat {
  constructor(form, min, max, quantitier) {
    this.content = form;
    this.min = min || 0;
    this.max = max || min;
    this.quantitier = quantitier;
  }

  parse(content, count = 0) {
    if (count >= this.max) return content;
    if (count < this.min) throw new TypeError("Given content doesn't match with format");
    const match = FormExp.parse(this.content, content);
    if (match == null) return null;
    content = content.slice(match.toString().length);
    if (typeof match === 'string') return match + this.parse(content, ++count);else {
      const next = this.parse(content, ++count);
      if (next) return new Content(match, ...next);else return new Content(match);
    }
  }

}
export class Optional extends Repeat {
  constructor(form, quantitier) {
    super(form, 0, 1, quantitier);
  }

}
export { Optional as ZeroOne };
export class OneMore extends Repeat {
  constructor(form, quantitier) {
    super(form, 1, Infinity, quantitier);
  }

}
export class ZeroMore extends Repeat {
  constructor(form, quantitier) {
    super(form, 0, Infinity, quantitier);
  }

}
export class Min extends Repeat {
  constructor(form, min, quantitier) {
    super(form, min, Infinity, quantitier);
  }

}
export class Max extends Repeat {
  constructor(form, max, quantitier) {
    super(form, 0, max, quantitier);
  }

}
export class Any extends Set {
  constructor(...forms) {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore Iterable<FormExp> can't be assigned to readonly any[]
      super(forms.length === 1 && forms[0][Symbol.iterator] ? forms[0] : forms);
    } catch (err) {
      if (err instanceof TypeError && err.message === "Constructor Set requires 'new'") {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore Element implicitly has an 'any' type because expression of type 'symbol' can't be used to index type 'FormExp | Iterable<FormExp>'.
        return Reflect.construct(Set, [forms.length === 1 && forms[0][Symbol.iterator] ? forms[0] : forms], new.target);
      }
    }
  }

  parse(content) {
    for (const form of this) {
      const match = FormExp.parse(form, content);
      if (match) return match;
    }

    throw new TypeError("Given content doesn't match with format");
  }

}
export class Content extends Array {
  constructor(...args) {
    super();
    if (Array.isArray(args[0]) && args.length === 1) args === args[0];
    super.push(...args);
  }

  toString() {
    return this.join('');
  }

  static form(...args) {
    return class extends this {
      static format = args[0].raw ? Form.new(...args) : new Form(...args);

      static parse(content) {
        if (!(this.format instanceof Form)) this.format = new Form(this.format);
        return this.parseTree(this.format.parse(content));
      }

    };
  }

}
export class Syntax {
  static parseTree(tree) {
    return tree;
  }

  static parse(content) {
    if (!(this.format instanceof Form)) this.format = new Form(this.format);
    return this.parseTree(this.format.parse(content));
  }

}
// eslint-disable-next-line no-debugger
debugger;
//# sourceMappingURL=parsorama.js.map