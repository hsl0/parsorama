export type FormExp = Form | RegExp | string | Repeat | Any | Syntax;

class InternalError extends Error {
  constructor(...arr) {
    super(...arr);
    this.name = 'ParsoramaInternalError';
  }
}

module FormExp {
    export function parse(part, content) {
       if(part instanceof Repeat) return part.parse(content);
        
        if(part instanceof Any) return part.parse(content);
        
        if(part instanceof Syntax) return part.parse(content);
        
        part = new RegExp(`^${part}`);
        return (content.match(part as RegExp) as string[])[0];
    }
}

export class Form extends Array <FormExp> {
    constructor(...arr: FormExp[] | [FormExp[]]) {
        if (Array.isArray(arr[0]) && arr.length === 1) arr = arr[0];

        super();
        super.push(...arr as FormExp[]);
    }

    toRegExp(): void/*RegExp*/ {
        let regex = '';
        for (let part of this) {
            if (typeof part === 'string') regex += part;
            else if (part instanceof RegExp) {
                part = String(part).match(/^\/(.*)\/(\w*)$/);
                regex += `(${part[1]})`;
            } else if (part instanceof Form) {
                part = String(part.toRegExp()).match(/^\/(.*)\/(\w*)$/);
                regex += `(${part[1]})`;
            }
        }
    }
    parse(content: string): Content {
        if(typeof content !== 'string') throw new TypeError('Content is not string');

        const tree = new Content();

        for(const part of this) {
            const match = FormExp.parse(part, content)
            tree.push(match);
            content = content.slice(match.length);
        }

        return tree;
    }

    static new(str: TemplateStringsArray, ...exp: FormExp[]): Form {
        const arr = [];

        for (let index = 0; index < str.raw.length; index++) {
            arr.push(str.raw[index]);
            if (index in exp) arr.push(exp[index]);
        }

        return new this(arr);
    }
}

export enum Quantitier {
    GREEDY,
    LAZY
}

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
    
    parse(content: string, count? = 0) {
        if(count >= this.max) return content;
        
        const match: Content | string = FormExp.parse(this.content, content);
        
        if(count < this.min) throw new TypeError("Given content doesn't match with format");
        
        content = content.slice(match.toString().length);
        
        if(typeof match === 'string') return match + this.parse(content, ++count);
        else new Content(match, ...this.parse(content, ++count));
    }
}
export class Optional extends Repeat {
    constructor(form: FormExp, quantitier: Quantitier) {
        super(form, 0, 1, quantitier);
    }
}
export {
    Optional as ZeroOne
};
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
    constructor(...forms: FormExp[] | [Iterable<FormExp>]) {
        try {
            // @ts-expect-error Iterable<FormExp> can't be assigned to readonly any[]
            super((forms.length === 1 && forms[0][Symbol.iterator]) ? forms[0] : forms);
        } catch (err) {
            if (err instanceof TypeError && err.message === "Constructor Set requires 'new'") {
                return Reflect.construct(Set, [(forms.length === 1 && forms[0][Symbol.iterator]) ? forms[0] : forms], new.target);
            }
        }
    }
    
    parse(content: string) {
        for(const form of this) {
            const match = FormExp.parse(form, content);
            if(match) return match;
        }
        throw new TypeError("Given content doesn't match with format")
    }
}

export class Content extends Array {
    constructor(...args: unknown[]) {
        super();
        if (Array.isArray(args[0]) && args.length === 1) args === args[0];
        super.push(...args);
    }

    toString(): string {
        return this.join('');
    }

    static form(...args: [TemplateStringsArray, ...FormExp[]] | FormExp[]): Syntax {
        return class extends this {
            static format = (args[0] as TemplateStringsArray).raw ? Form.new(...args as[TemplateStringsArray, ...FormExp[]]) : new Form(...args as FormExp[]);
        } as Syntax;
    }
}

export abstract class Syntax {
    static format: FormExp;

    static parseTree: (tree: Content) => Syntax;
    static parse(content: string): Syntax {
        if(!(this.format instanceof Form)) this.format = new Form(this.format);
        return this.parseTree((this.format as Form).parse(content));
    }
}

// eslint-disable-next-line no-debugger
debugger;