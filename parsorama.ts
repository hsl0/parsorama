type FormExp = Form|RegExp|string|Repeat|Any;

export class Form extends Array {
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
export class Repeat {
    start: number;
    end: number;
    content: FormExp;

    constructor(form: FormExp, start: number, end: number) {
        this.content = form;
        this.start = start;
        this.end = end || start;
    }
}
export class Optional extends Repeat {
    constructor(form: FormExp) {
        super(form, 0, 1);
    }
}
export class Any extends Set {
    constructor(...forms: FormExp[]|[Iterable<FormExp>]) {
        // @ts-ignore
        super((forms.length === 1 && forms[0][Symbol.iterator])? forms[0] : forms);
    }
}
debugger;