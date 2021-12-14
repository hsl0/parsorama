"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ZeroOne = exports.ZeroMore = exports.Syntax = exports.Repeat = exports.Quantitier = exports.Optional = exports.OneMore = exports.Min = exports.Max = exports.FormExp = exports.Form = exports.Content = exports.Any = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const FormExp = {
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
exports.FormExp = FormExp;

class Form extends Array {
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

exports.Form = Form;
let Quantitier;
exports.Quantitier = Quantitier;

(function (Quantitier) {
  Quantitier[Quantitier["GREEDY"] = 0] = "GREEDY";
  Quantitier[Quantitier["LAZY"] = 1] = "LAZY";
})(Quantitier || (exports.Quantitier = Quantitier = {}));

class Repeat {
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

exports.Repeat = Repeat;

class Optional extends Repeat {
  constructor(form, quantitier) {
    super(form, 0, 1, quantitier);
  }

}

exports.ZeroOne = exports.Optional = Optional;

class OneMore extends Repeat {
  constructor(form, quantitier) {
    super(form, 1, Infinity, quantitier);
  }

}

exports.OneMore = OneMore;

class ZeroMore extends Repeat {
  constructor(form, quantitier) {
    super(form, 0, Infinity, quantitier);
  }

}

exports.ZeroMore = ZeroMore;

class Min extends Repeat {
  constructor(form, min, quantitier) {
    super(form, min, Infinity, quantitier);
  }

}

exports.Min = Min;

class Max extends Repeat {
  constructor(form, max, quantitier) {
    super(form, 0, max, quantitier);
  }

}

exports.Max = Max;

class Any extends Set {
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

exports.Any = Any;

class Content extends Array {
  constructor(...args) {
    super();
    if (Array.isArray(args[0]) && args.length === 1) args === args[0];
    super.push(...args);
  }

  toString() {
    return this.join('');
  }

  static form(...args) {
    var _class, _temp;

    return _temp = _class = class extends this {
      static parse(content) {
        if (!(this.format instanceof Form)) this.format = new Form(this.format);
        return this.parseTree(this.format.parse(content));
      }

    }, _defineProperty(_class, "format", args[0].raw ? Form.new(...args) : new Form(...args)), _temp;
  }

}

exports.Content = Content;

class Syntax {
  static parseTree(tree) {
    return tree;
  }

  static parse(content) {
    if (!(this.format instanceof Form)) this.format = new Form(this.format);
    return this.parseTree(this.format.parse(content));
  }

}

exports.Syntax = Syntax;
// eslint-disable-next-line no-debugger
debugger;
//# sourceMappingURL=parsorama.js.map