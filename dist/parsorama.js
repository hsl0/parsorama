export class Form extends Array {
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
export var Quantitier;
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
export class Content extends Array {
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
// eslint-disable-next-line no-debugger
debugger;
//# sourceMappingURL=parsorama.js.map