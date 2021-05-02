"use strict";

var _parsorama = require("./parsorama.js");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const Parameter = (() => {
  var _class, _temp;

  const defaultValue = _parsorama.Content.form`.*`;
  const defaultExp = _parsorama.Content.form`\|\s*${defaultValue}`;
  const paramName = _parsorama.Content.form`.*`;
  return _temp = _class = class Parameter extends _parsorama.Syntax {
    constructor(name, def) {
      if (typeof name !== 'string') {
        throw new TypeError('올바른 변수명이 지정되지 않았습니다');
      }

      super();
      this.name = name;
      this.default = def === undefined ? null : new _parsorama.Content(def);
    }

    toString() {
      return `{{{${this.name}${this.default ? `|${this.default}` : ''}}}}`;
    }

  }, _defineProperty(_class, "format", _parsorama.Form.new`{{{\s*${paramName}\s*${new _parsorama.Optional(defaultExp, _parsorama.Quantitier.LAZY)}(?:\s*\|\s*.*)*\s*}}}`), _temp;
})();

const Template = (() => {
  var _class2, _temp2;

  let _Symbol$iterator, _Symbol$toStringTag;

  const paramName = _parsorama.Content.form`.*`;
  const paramValue = _parsorama.Content.form`.*`;
  const templateName = _parsorama.Content.form`.*`;
  _Symbol$iterator = Symbol.iterator;
  _Symbol$toStringTag = Symbol.toStringTag;

  class TemplateParams extends _parsorama.Syntax {
    constructor(...params) {
      super();

      _defineProperty(this, "dirty", false);

      _defineProperty(this, _Symbol$toStringTag, 'Params');

      if (params.length === 1 && Array.isArray(params[0]) && !(params[0] instanceof _parsorama.Content)) params = params[0];
      const named = [];
      this.raw = [];
      this.unnamed = [];
      this.registry = {};
      params.forEach(value => {
        if (typeof value === 'string') {
          const val = new _parsorama.Content(value);
          this.raw.push(val);
          this.unnamed.push(val);
          this.registry[this.unnamed.length - 1] = val;
        } else if (value instanceof _parsorama.Content) {
          this.raw.push(value);
          this.unnamed.push(value);
          this.registry[this.unnamed.length - 1] = value;
        } else if (Array.isArray(value)) {
          value = value.map(value => {
            if (typeof value === 'string') return new _parsorama.Content(value);else return value;
          });
          this.raw.push(...value);
          named.push(...value);
        } else if (typeof value === 'object') {
          for (const key in value) {
            let val = value[key];
            if (!(val instanceof _parsorama.Content)) val = new _parsorama.Content(val);
            this.raw.push([key, val]);
            named.push([key, val]);
          }
        } else throw new TypeError('파라미터에 잘못된 값이 입력되었습니다');
      });
      named.forEach(([key, value]) => {
        if (typeof value === 'string') value = new _parsorama.Content(value);
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

        if (value instanceof _parsorama.Content) {
          const i = this.unnamed.indexOf(value);

          if (key == i) {
            this.raw.splice(index, 1);
            this.unnamed.splice(i, 1);
            delete this.registry[key];
            removed = true;
          }
        } else if (Array.isArray(value)) {
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
      for (const [key, value] of this) callbackfn.call(thisArg, value, key, this);
    }

    get(key) {
      return this.registry[key];
    }

    getAll(target) {
      const res = [];

      for (const [key, value] of this) if (key == target) res.push(value);

      return res;
    }

    has(key) {
      return key in this.registry || key in this.unnamed;
    }

    set(key, value, clean = !this.dirty) {
      if (clean) {
        for (let index = 0; index < this.raw.length; index++) {
          const value = this.raw[index];

          if (!(value instanceof _parsorama.Content) && Array.isArray(value)) {
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

          if (value instanceof _parsorama.Content) {
            const i = this.unnamed.indexOf(value);

            if (key == i) {
              this.raw.splice(index, 1);
              this.unnamed.splice(i, 1);
              delete this.registry[key];
            }
          } else if (Array.isArray(value)) {
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

    *[_Symbol$iterator]() {
      yield* this.entries();
    }

    *entries() {
      for (const value of this.raw) {
        if (value instanceof _parsorama.Content) yield [this.raw.indexOf(value), value];else if (Array.isArray(value)) yield [...value];
      }
    }

    *keys() {
      for (const value of this.raw) {
        if (value instanceof _parsorama.Content) yield this.raw.indexOf(value);else if (Array.isArray(value)) yield value[0];
      }
    }

    *values() {
      for (const value of this.raw) {
        if (value instanceof _parsorama.Content) yield value;else if (Array.isArray(value)) yield value[1];
      }
    }

    export() {
      return { ...this.registry
      };
    }

    exportUnnamed() {
      return [...this.unnamed];
    }

    exportRaw() {
      return this.raw.map(value => {
        if (value instanceof _parsorama.Content) return value;
        if (Array.isArray(value)) return [...value];
      });
    }

    toString() {
      let content = '';

      for (let value of this.raw) {
        const key = value instanceof _parsorama.Content ? null : value[0];
        value = value[1];
        content += `|${key ? `${key}=` : ''}${value}`;
      }

      return content;
    }

  }

  _defineProperty(TemplateParams, "format", _parsorama.Form.new`\s*|\s*(${paramName}\s*=\s*)?${paramValue}`);

  return _temp2 = _class2 = class Template {
    constructor(name, ...params) {
      if (typeof name !== 'string') throw new TypeError('올바른 이름이 지정되지 않았습니다');
      this.name = name;
      this.params = new TemplateParams(...params);
    }

    toString() {
      return `{{${this.name}${this.params}}}`;
    }

  }, _defineProperty(_class2, "format", _parsorama.Form.new`{{\s*${templateName}${new _parsorama.ZeroMore(TemplateParams, _parsorama.Quantitier.LAZY)}\s*}}`), _temp2;
})();

// eslint-disable-next-line no-debugger
debugger;
//# sourceMappingURL=mwparam.js.map