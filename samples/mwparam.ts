import {FormExp, Form, Optional, Quantitier, Content, Syntax, ZeroMore} from '../parsorama';

const Parameter: Syntax = (() => {
    const defaultValue = Content.form`.*`;
    const defaultExp = Content.form`\|\s*${defaultValue}`;
    const paramName = Content.form`.*`;

    return class Parameter {
        static format: FormExp = Form.new`{{{\s*${paramName}\s*${new Optional(defaultExp, Quantitier.LAZY)}(?:\s*\|\s*.*)*\s*}}}`;

        name: string;
        default?: Content;

        constructor(name: string, def?: Content|string) {
            if(typeof name !== 'string') throw new TypeError('올바른 변수명이 지정되지 않았습니다');

            this.name = name;
            this.default = (def === undefined)? null : new Content(def);
        }
        
        toString() {
            return `{{{${this.name}${this.default? `|${this.default}` : ''}}}}`;
        }
    }
})();
type Parameter = typeof Parameter;

const Template: Syntax = (() => {
    const paramName = Content.form`.*`;
    const paramValue = Content.form`.*`;
    const paramExp = Content.form`\s*|\s*(${paramName}\s*=\s*)?${paramValue}`;
    const templateName = Content.form`.*`;

    type Params = Array<{
        [key: string]: string|Content
    }|string|Content>;

    class TemplateParams implements Map<string|number, Content> {
        protected raw: Array<[string|number, Content]|Content>;
        protected unnamed: Content[];
        protected registry: {[key: string]: Content};
        dirty: boolean = false;

        constructor(...params: Params|[Params]) {
            if(params.length === 1 && Array.isArray(params[0]) && !(params[0] instanceof Content)) params = params[0];

            const named = [];

            this.raw = [];
            this.unnamed = [];
            this.registry = {};
            
            (params as Params).forEach(value => {
                if(typeof value === 'string') {
                    const val = new Content(value);
                    this.raw.push(val);
                    this.unnamed.push(val);
                    this.registry[this.unnamed.length - 1] = val;
                } else if(value instanceof Content) {
                    this.raw.push(value);
                    this.unnamed.push(value);
                    this.registry[this.unnamed.length - 1] = value;
                } else if(Array.isArray(value)) {
                    this.raw.push(value);
                    named.push(value);
                } else if(typeof value === 'object') for(const key in value) {
                    let val = value[key];
                    if(!(val instanceof Content)) val = new Content(val);
                    this.raw.push([key, val]);
                    named.push([key, val]);
                } else throw new TypeError('파라미터에 잘못된 값이 입력되었습니다');
            });

            named.forEach(([key, value]) => {
                this.registry[key] = value;
            });
        }

        clear(): void {
            this.raw = [];
            this.unnamed = [];
            this.registry = {};
        }
        delete(key: string|number): boolean {
            let removed = false;

            for(let index = 0; index < this.raw.length; index++) {
                const value = this.raw[index];
                if(value instanceof Content) {
                    const i = this.unnamed.indexOf(value);
                    if(key == i) {
                        this.raw.splice(index, 1);
                        this.unnamed.splice(i, 1);
                        delete this.registry[key];
                        removed = true;
                    }
                } else if(Array.isArray(value)) {
                    if(key == value[0]) {
                        this.raw.splice(index, 1);
                        delete this.registry[key];
                        removed = true;
                    }
                }
            }

            return removed;
        }
        forEach(callbackfn: (value: Content, key: string|number, context: this) => void, thisArg?: any): void {
            for(const [key, value] of this) callbackfn.call(thisArg, value, key, this);
        }
        get(key: string|number): Content {
            return this.registry[key];
        }
        getAll(target: string|number): Content[] {
            const res = [];

            for(const [key, value] of this) if(key == target) res.push(value);

            return res;
        }
        has(key: string|number): boolean {
            return key in this.registry || key in this.unnamed;
        }
        set(key: string|number, value: Content): this {
            if(!this.dirty) {
                for(let index = 0; index < this.raw.length; index++) {
                    const value = this.raw[index];
                    if(!(value instanceof Content) && Array.isArray(value)) {
                        if(key == value[0]) {
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
        push(value: Content): number {
            this.raw.push(value);
            const index = this.unnamed.push(value);

            if(!this.dirty) {
                const key = index;
                for(let index = 0; index < this.raw.length; index++) {
                    const value = this.raw[index];
                    if(value instanceof Content) {
                        const i = this.unnamed.indexOf(value);
                        if(key == i) {
                            this.raw.splice(index, 1);
                            this.unnamed.splice(i, 1);
                            delete this.registry[key];
                        }
                    } else if(Array.isArray(value)) {
                        if(key == value[0]) {
                            this.raw.splice(index, 1);
                            delete this.registry[key];
                        }
                    }
                }
            }

            this.registry[index] = value;

            return index;
        }
        get size(): number {
            return this.raw.length;
        };
        *[Symbol.iterator](): IterableIterator<[string|number, Content]> {
            yield* this.entries();
        }
        *entries(): IterableIterator<[string|number, Content]> {
            for(const value of this.raw) {
                if(value instanceof Content) yield [this.raw.indexOf(value), value];
                else if(Array.isArray(value)) yield [...value];
            }
        }
        *keys(): IterableIterator<string|number> {
            for(const value of this.raw) {
                if(value instanceof Content) yield this.raw.indexOf(value);
                else if(Array.isArray(value)) yield value[0];
            }
        }
        *values(): IterableIterator<Content> {
            for(const value of this.raw) {
                if(value instanceof Content) yield value;
                else if(Array.isArray(value)) yield value[1];
            }
        }
        export(): {[key: string]: Content} {
            return Object.assign({}, this.registry);
        }
        toString() {
            let content = '';
            for(let value of this.raw) {
                const key = (value instanceof Content)? null : value[0];
                value = value[1];
                content += `|${key? `${key}=` : ''}${value}`;
            }
            return content;
        }
        [Symbol.toStringTag]: string = 'Params';
    }

    return class Template {
        static format: FormExp = Form.new`{{\s*${templateName}${new ZeroMore(paramExp, Quantitier.LAZY)}\s*}}`;

        name: string;
        params: TemplateParams;

        constructor(name: string, ...params: Params|[Params]) {
            if(typeof name !== 'string') throw new TypeError('올바른 이름이 지정되지 않았습니다');

            this.name = name;
            this.params = new TemplateParams(...params);
        }
        
        toString() {
            return `{{${this.name}${this.params}}}`;
        }
    }
})();
type Template = typeof Template;

debugger;