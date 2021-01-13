"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var parsorama_1 = require("../parsorama");
console.log(parsorama_1.Form, typeof parsorama_1.Form);
var defaultValue = parsorama_1.Form.new(templateObject_1 || (templateObject_1 = __makeTemplateObject([".*"], [".*"])));
var defaultExp = parsorama_1.Form.new(templateObject_2 || (templateObject_2 = __makeTemplateObject(["|s", ""], ["\\|\\s", ""])), defaultValue);
var paramName = parsorama_1.Form.new(templateObject_3 || (templateObject_3 = __makeTemplateObject([".*"], [".*"])));
var parameter = parsorama_1.Form.new(templateObject_4 || (templateObject_4 = __makeTemplateObject(["{{{s", "s", "s}}}"], ["{{{\\s", "\\s", "\\s}}}"])), paramName, new parsorama_1.Optional(defaultExp));
console.log(parameter, parameter[1] instanceof parsorama_1.Form);
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
//# sourceMappingURL=mwparam.js.map