import {FormExp, Form, Optional, Quantitier, Tree} from '../parsorama';

console.log(Form, typeof Form);

{
    let defaultValue = Form.new`.*`;
    let defaultExp = Form.new`\|\s${defaultValue}`;
    let paramName = Form.new`.*`;
    let parameter = Form.new`{{{\s${paramName}\s${new Optional(defaultExp, Quantitier.LAZY)}\s}}}`;

    class Parameter {
        static form: FormExp = parameter;

        static parse(tree: Tree) {
            tree.get(paramName)
        }
    }
}



debugger;