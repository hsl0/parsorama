export type FormExp = Form|RegExp|string|Repeat|Any;

export class Form extends Array<FormExp> {
    constructor(...arr: FormExp[]|[FormExp[]]) {
        if(Array.isArray(arr[0]) && arr.length === 1) arr = arr[0];

        super();
        this.push(...arr);
    }
    static new(str: TemplateStringsArray, ...exp: FormExp[]) {
        const arr = [];

        for(let index: number = 0; index < str.raw.length; index++) {
            arr.push(str.raw[index]);
            if(index in exp) arr.push(exp[index]);
        }

        return new this(arr);
    }
}

export enum Quantitier {GREEDY, LAZY};

export class Repeat {
    min: number;
    max: number;
    content: FormExp;
    quantitier: Quantitier;

    constructor(form: FormExp, min: number, max: number, quantitier: Quantitier) {
        this.content = form;
        this.min = min || 0;
        this.max = max || min;
        this.quantitier = quantitier;
    }
}
export class Optional extends Repeat {
    constructor(form: FormExp, quantitier: Quantitier) {
        super(form, 0, 1, quantitier);
    }
}
export {Optional as ZeroOne};
export class OneMore extends Repeat {
    constructor(form: FormExp, quantitier: Quantitier) {
        super(form, 1, Infinity, quantitier);
    }
}
export class ZeroMore extends Repeat {
    constructor(form: FormExp, quantitier: Quantitier) {
        super(form, 0, Infinity, quantitier);
    }
}
export class Min extends Repeat {
    constructor(form: FormExp, min: number, quantitier: Quantitier) {
        super(form, min, Infinity, quantitier);
    }
}
export class Max extends Repeat {
    constructor(form: FormExp, max: number, quantitier: Quantitier) {
        super(form, 0, max, quantitier);
    }
}

export class Any extends Set {
    constructor(...forms: FormExp[]|[Iterable<FormExp>]) {
        try {
            // @ts-ignore
            super((forms.length === 1 && forms[0][Symbol.iterator])? forms[0] : forms);
        } catch(err) {
            if(err instanceof TypeError && err.message === "Constructor Set requires 'new'") {
                return Reflect.construct(Set, [(forms.length === 1 && forms[0][Symbol.iterator])? forms[0] : forms], new.target);
            }
        }
    }
}

export interface Tree extends Array<any> {
    get(syntax: any): any;
}