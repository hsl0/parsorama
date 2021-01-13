import {Form, Optional} from '../parsorama';

console.log(Form, typeof Form);

let defaultValue = Form.new`.*`;
let defaultExp = Form.new`\|\s${defaultValue}`;
let paramName = Form.new`.*`;
let parameter = Form.new`{{{\s${paramName}\s${new Optional(defaultExp)}\s}}}`;

console.log(parameter, parameter[1] instanceof Form);
