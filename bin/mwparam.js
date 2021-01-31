"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parsorama_1 = require("./parsorama");
const Parameter = (() => {
    var _a;
    const defaultValue = parsorama_1.Content.form `.*`;
    const defaultExp = parsorama_1.Content.form `\|\s*${defaultValue}`;
    const paramName = parsorama_1.Content.form `.*`;
    return _a = class Parameter {
            constructor(name, def) {
                if (typeof name !== 'string')
                    throw new TypeError('올바른 변수명이 지정되지 않았습니다');
                this.name = name;
                this.default = (def === undefined) ? null : new parsorama_1.Content(def);
            }
            toString() {
                return `{{{${this.name}${this.default ? `|${this.default}` : ''}}}}`;
            }
        },
        _a.format = parsorama_1.Form.new `{{{\s*${paramName}\s*${new parsorama_1.Optional(defaultExp, parsorama_1.Quantitier.LAZY)}(?:\s*\|\s*.*)*\s*}}}`,
        _a;
})();
const Template = (() => {
    var _a;
    const paramName = parsorama_1.Content.form `.*`;
    const paramValue = parsorama_1.Content.form `.*`;
    const templateName = parsorama_1.Content.form `.*`;
    class TemplateParams {
        constructor(...params) {
            this.dirty = false;
            this[Symbol.toStringTag] = 'Params';
            if (params.length === 1 && Array.isArray(params[0]) && !(params[0] instanceof parsorama_1.Content))
                params = params[0];
            const named = [];
            this.raw = [];
            this.unnamed = [];
            this.registry = {};
            params.forEach(value => {
                if (typeof value === 'string') {
                    const val = new parsorama_1.Content(value);
                    this.raw.push(val);
                    this.unnamed.push(val);
                    this.registry[this.unnamed.length - 1] = val;
                }
                else if (value instanceof parsorama_1.Content) {
                    this.raw.push(value);
                    this.unnamed.push(value);
                    this.registry[this.unnamed.length - 1] = value;
                }
                else if (Array.isArray(value)) {
                    this.raw.push(value);
                    named.push(value);
                }
                else if (typeof value === 'object')
                    for (const key in value) {
                        let val = value[key];
                        if (!(val instanceof parsorama_1.Content))
                            val = new parsorama_1.Content(val);
                        this.raw.push([key, val]);
                        named.push([key, val]);
                    }
                else
                    throw new TypeError('파라미터에 잘못된 값이 입력되었습니다');
            });
            named.forEach(([key, value]) => {
                this.registry[key] = value;
            });
        }
        clear() {
            this.raw = [];
            this.unnamed = [];
            this.registry = {};
        }
        delete(key) {
            let removed = false;
            for (let index = 0; index < this.raw.length; index++) {
                const value = this.raw[index];
                if (value instanceof parsorama_1.Content) {
                    const i = this.unnamed.indexOf(value);
                    if (key == i) {
                        this.raw.splice(index, 1);
                        this.unnamed.splice(i, 1);
                        delete this.registry[key];
                        removed = true;
                    }
                }
                else if (Array.isArray(value)) {
                    if (key == value[0]) {
                        this.raw.splice(index, 1);
                        delete this.registry[key];
                        removed = true;
                    }
                }
            }
            return removed;
        }
        forEach(callbackfn, thisArg) {
            for (const [key, value] of this)
                callbackfn.call(thisArg, value, key, this);
        }
        get(key) {
            return this.registry[key];
        }
        getAll(target) {
            const res = [];
            for (const [key, value] of this)
                if (key == target)
                    res.push(value);
            return res;
        }
        has(key) {
            return key in this.registry || key in this.unnamed;
        }
        set(key, value, clean = !this.dirty) {
            if (clean) {
                for (let index = 0; index < this.raw.length; index++) {
                    const value = this.raw[index];
                    if (!(value instanceof parsorama_1.Content) && Array.isArray(value)) {
                        if (key == value[0]) {
                            this.raw.splice(index, 1);
                            delete this.registry[key];
                        }
                    }
                }
            }
            this.raw.push([key, value]);
            this.registry[key] = value;
            return this;
        }
        push(value, clean = !this.dirty) {
            this.raw.push(value);
            const index = this.unnamed.push(value);
            if (clean) {
                const key = index;
                for (let index = 0; index < this.raw.length; index++) {
                    const value = this.raw[index];
                    if (value instanceof parsorama_1.Content) {
                        const i = this.unnamed.indexOf(value);
                        if (key == i) {
                            this.raw.splice(index, 1);
                            this.unnamed.splice(i, 1);
                            delete this.registry[key];
                        }
                    }
                    else if (Array.isArray(value)) {
                        if (key == value[0]) {
                            this.raw.splice(index, 1);
                            delete this.registry[key];
                        }
                    }
                }
            }
            this.registry[index] = value;
            return index;
        }
        get size() {
            return this.raw.length;
        }
        *[Symbol.iterator]() {
            yield* this.entries();
        }
        *entries() {
            for (const value of this.raw) {
                if (value instanceof parsorama_1.Content)
                    yield [this.raw.indexOf(value), value];
                else if (Array.isArray(value))
                    yield [...value];
            }
        }
        *keys() {
            for (const value of this.raw) {
                if (value instanceof parsorama_1.Content)
                    yield this.raw.indexOf(value);
                else if (Array.isArray(value))
                    yield value[0];
            }
        }
        *values() {
            for (const value of this.raw) {
                if (value instanceof parsorama_1.Content)
                    yield value;
                else if (Array.isArray(value))
                    yield value[1];
            }
        }
        export() {
            return { ...this.registry };
        }
        exportUnnamed() {
            return [...this.unnamed];
        }
        exportRaw() {
            return this.raw.map(value => {
                if (value instanceof parsorama_1.Content)
                    return value;
                else if (Array.isArray(value))
                    return [...value];
            });
        }
        toString() {
            let content = '';
            for (let value of this.raw) {
                const key = (value instanceof parsorama_1.Content) ? null : value[0];
                value = value[1];
                content += `|${key ? `${key}=` : ''}${value}`;
            }
            return content;
        }
    }
    TemplateParams.format = parsorama_1.Form.new `\s*|\s*(${paramName}\s*=\s*)?${paramValue}`;
    return _a = class Template {
            constructor(name, ...params) {
                if (typeof name !== 'string')
                    throw new TypeError('올바른 이름이 지정되지 않았습니다');
                this.name = name;
                this.params = new TemplateParams(...params);
            }
            toString() {
                return `{{${this.name}${this.params}}}`;
            }
        },
        _a.format = parsorama_1.Form.new `{{\s*${templateName}${new parsorama_1.ZeroMore(TemplateParams, parsorama_1.Quantitier.LAZY)}\s*}}`,
        _a;
})();
// eslint-disable-next-line no-debugger
debugger;
//# sourceMappingURL=mwparam.js.map