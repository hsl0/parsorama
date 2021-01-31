"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Content = exports.Any = exports.Max = exports.Min = exports.ZeroMore = exports.OneMore = exports.ZeroOne = exports.Optional = exports.Repeat = exports.Quantitier = exports.Form = void 0;
class Form extends Array {
    constructor(...arr) {
        if (Array.isArray(arr[0]) && arr.length === 1)
            arr = arr[0];
        super();
        super.push(...arr);
    }
    parse(content) {
        if (typeof content !== 'string')
            throw new TypeError('Content is not string');
        const tree = new Content();
        for (let part of this) {
            if (typeof part === 'string')
                part = new RegExp(`^${part}`);
            else if (part instanceof RegExp) {
                const body = String(part).match(/^\/(.*)\/(\w*)$/);
                part = new RegExp(`^${body[1]}`);
            }
            else
                throw new TypeError('Wrong form expression included');
            const match = content.match(part)[0];
            tree.push(match);
            content = content.slice(match.length);
        }
        return tree;
    }
    static new(str, ...exp) {
        const arr = [];
        for (let index = 0; index < str.raw.length; index++) {
            arr.push(str.raw[index]);
            if (index in exp)
                arr.push(exp[index]);
        }
        return new this(arr);
    }
}
exports.Form = Form;
var Quantitier;
(function (Quantitier) {
    Quantitier[Quantitier["GREEDY"] = 0] = "GREEDY";
    Quantitier[Quantitier["LAZY"] = 1] = "LAZY";
})(Quantitier = exports.Quantitier || (exports.Quantitier = {}));
class Repeat {
    constructor(form, min, max, quantitier) {
        this.content = form;
        this.min = min || 0;
        this.max = max || min;
        this.quantitier = quantitier;
    }
}
exports.Repeat = Repeat;
class Optional extends Repeat {
    constructor(form, quantitier) {
        super(form, 0, 1, quantitier);
    }
}
exports.Optional = Optional;
exports.ZeroOne = Optional;
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
            // @ts-expect-error Iterable<FormExp> can't be assigned to readonly any[]
            super((forms.length === 1 && forms[0][Symbol.iterator]) ? forms[0] : forms);
        }
        catch (err) {
            if (err instanceof TypeError && err.message === "Constructor Set requires 'new'") {
                return Reflect.construct(Set, [(forms.length === 1 && forms[0][Symbol.iterator]) ? forms[0] : forms], new.target);
            }
        }
    }
}
exports.Any = Any;
class Content extends Array {
    constructor(...args) {
        super();
        if (Array.isArray(args[0]) && args.length === 1)
            args === args[0];
        super.push(...args);
    }
    toString() {
        return this.join('');
    }
    static form(...args) {
        var _a;
        return _a = class extends this {
            },
            _a.format = args[0].raw ? Form.new(...args) : new Form(...args),
            _a;
    }
}
exports.Content = Content;
// eslint-disable-next-line no-debugger
debugger;
//# sourceMappingURL=parsorama.js.map