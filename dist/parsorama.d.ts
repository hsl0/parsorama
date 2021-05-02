export declare type FormExp = Form | RegExp | string | Repeat | Any | SyntaxConstructor;
export declare const FormExp: {
    parse(part: FormExp, content: string): string | Syntax | null;
};
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
    parse(content: string, count?: number): string | Content | null;
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
    parse(content: string): Syntax;
}
export declare class Content extends Array {
    constructor(...args: unknown[]);
    toString(): string;
    static form(...args: [TemplateStringsArray, ...FormExp[]] | FormExp[]): SyntaxConstructor;
}
export declare abstract class Syntax {
    static format: FormExp;
    static parseTree(tree: Content): Syntax;
    static parse(content: string): Syntax;
}
interface SyntaxConstructor {
    new (...args: unknown[]): Syntax;
    format: FormExp;
    parseTree(tree: Content): Syntax;
    parse(content: string): Syntax;
}
