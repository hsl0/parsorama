export declare type FormExp = Form | RegExp | string | Repeat | Any | Syntax;
export declare class Form extends Array<FormExp> {
    constructor(...arr: FormExp[] | [FormExp[]]);
    parse(content: string): Content;
    static new(str: TemplateStringsArray, ...exp: FormExp[]): Form;
}
export declare enum Quantitier {
    GREEDY = 0,
    LAZY = 1
}
export declare class Repeat {
    min: number;
    max: number;
    content: FormExp;
    quantitier: Quantitier;
    constructor(form: FormExp, min: number, max: number, quantitier: Quantitier);
}
export declare class Optional extends Repeat {
    constructor(form: FormExp, quantitier: Quantitier);
}
export { Optional as ZeroOne };
export declare class OneMore extends Repeat {
    constructor(form: FormExp, quantitier: Quantitier);
}
export declare class ZeroMore extends Repeat {
    constructor(form: FormExp, quantitier: Quantitier);
}
export declare class Min extends Repeat {
    constructor(form: FormExp, min: number, quantitier: Quantitier);
}
export declare class Max extends Repeat {
    constructor(form: FormExp, max: number, quantitier: Quantitier);
}
export declare class Any extends Set {
    constructor(...forms: FormExp[] | [Iterable<FormExp>]);
}
export declare class Content extends Array {
    constructor(...args: unknown[]);
    toString(): string;
    static form(...args: [TemplateStringsArray, ...FormExp[]] | FormExp[]): Syntax;
}
export interface Syntax {
    new (...args: unknown[]): any;
    format: FormExp;
}
