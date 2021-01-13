"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Any = exports.Optional = exports.Repeat = exports.Form = void 0;
var Form = /** @class */ (function (_super) {
    __extends(Form, _super);
    function Form() {
        var arr = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arr[_i] = arguments[_i];
        }
        var _this = this;
        if (Array.isArray(arr[0]) && arr.length === 1)
            arr = arr[0];
        _this = _super.call(this) || this;
        _this.push.apply(_this, arr);
        return _this;
    }
    Form.new = function (str) {
        var exp = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            exp[_i - 1] = arguments[_i];
        }
        var arr = [];
        for (var index = 0; index < str.raw.length; index++) {
            arr.push(str.raw[index]);
            if (index in exp)
                arr.push(exp[index]);
        }
        return new this(arr);
    };
    return Form;
}(Array));
exports.Form = Form;
var Repeat = /** @class */ (function () {
    function Repeat(form, start, end) {
        this.content = form;
        this.start = start;
        this.end = end || start;
    }
    return Repeat;
}());
exports.Repeat = Repeat;
var Optional = /** @class */ (function (_super) {
    __extends(Optional, _super);
    function Optional(form) {
        return _super.call(this, form, 0, 1) || this;
    }
    return Optional;
}(Repeat));
exports.Optional = Optional;
var Any = /** @class */ (function (_super) {
    __extends(Any, _super);
    function Any() {
        var forms = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            forms[_i] = arguments[_i];
        }
        // @ts-ignore
        return _super.call(this, (forms.length === 1 && forms[0][Symbol.iterator]) ? forms[0] : forms) || this;
    }
    return Any;
}(Set));
exports.Any = Any;
debugger;
//# sourceMappingURL=parsorama.js.map