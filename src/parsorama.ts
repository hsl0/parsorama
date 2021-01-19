export type FormExp = Form|RegExp|string|Repeat|Any|Syntax;

export class Form extends Array<FormExp> {
    constructor(...arr: FormExp[]|[FormExp[]]) {
        if(Array.isArray(arr[0]) && arr.length === 1) arr = arr[0];

        super();
        super.push(...arr);
    }
    static new(str: TemplateStringsArray, ...exp: FormExp[]): Form {
        const arr = [];

        for(let index = 0; index < str.raw.length; index++) {
            arr.push(str.raw[index]);
            if(index in exp) arr.push(exp[index]);
        }

        return new this(arr);
    }
}

export enum Quantitier {GREEDY, LAZY}

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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            super((forms.length === 1 && forms[0][Symbol.iterator])? forms[0] : forms);
        } catch(err) {
            if(err instanceof TypeError && err.message === "Constructor Set requires 'new'") {
                return Reflect.construct(Set, [(forms.length === 1 && forms[0][Symbol.iterator])? forms[0] : forms], new.target);
            }
        }
    }
}

export class Content extends Array {
    constructor(...args: unknown[]) {
        super();
        if(Array.isArray(args[0]) && args.length === 1) args === args[0];
        super.push(...args);
    }

    toString(): string {
        return this.join('');
    }

    static form(...args: [TemplateStringsArray, ...FormExp[]]|FormExp[]): Syntax {
        return class extends this {
            static format = (args[0] as TemplateStringsArray).raw? Form.new(...args as [TemplateStringsArray, ...FormExp[]]) : new Form(...args as FormExp[]);
        } as Syntax;
    }
}

export interface Syntax {
    new(...args: unknown[]);
    format: FormExp;
}

// eslint-disable-next-line no-debugger
debugger;