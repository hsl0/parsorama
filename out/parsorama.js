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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Content = exports.Any = exports.Max = exports.Min = exports.ZeroMore = exports.OneMore = exports.ZeroOne = exports.Optional = exports.Repeat = exports.Quantitier = exports.Form = void 0;
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
        _super.prototype.push.apply(_this, __spread(arr));
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
var Quantitier;
(function (Quantitier) {
    Quantitier[Quantitier["GREEDY"] = 0] = "GREEDY";
    Quantitier[Quantitier["LAZY"] = 1] = "LAZY";
})(Quantitier = exports.Quantitier || (exports.Quantitier = {}));
;
var Repeat = /** @class */ (function () {
    function Repeat(form, min, max, quantitier) {
        this.content = form;
        this.min = min || 0;
        this.max = max || min;
        this.quantitier = quantitier;
    }
    return Repeat;
}());
exports.Repeat = Repeat;
var Optional = /** @class */ (function (_super) {
    __extends(Optional, _super);
    function Optional(form, quantitier) {
        return _super.call(this, form, 0, 1, quantitier) || this;
    }
    return Optional;
}(Repeat));
exports.Optional = Optional;
exports.ZeroOne = Optional;
var OneMore = /** @class */ (function (_super) {
    __extends(OneMore, _super);
    function OneMore(form, quantitier) {
        return _super.call(this, form, 1, Infinity, quantitier) || this;
    }
    return OneMore;
}(Repeat));
exports.OneMore = OneMore;
var ZeroMore = /** @class */ (function (_super) {
    __extends(ZeroMore, _super);
    function ZeroMore(form, quantitier) {
        return _super.call(this, form, 0, Infinity, quantitier) || this;
    }
    return ZeroMore;
}(Repeat));
exports.ZeroMore = ZeroMore;
var Min = /** @class */ (function (_super) {
    __extends(Min, _super);
    function Min(form, min, quantitier) {
        return _super.call(this, form, min, Infinity, quantitier) || this;
    }
    return Min;
}(Repeat));
exports.Min = Min;
var Max = /** @class */ (function (_super) {
    __extends(Max, _super);
    function Max(form, max, quantitier) {
        return _super.call(this, form, 0, max, quantitier) || this;
    }
    return Max;
}(Repeat));
exports.Max = Max;
var Any = /** @class */ (function (_super) {
    __extends(Any, _super);
    function Any() {
        var _newTarget = this.constructor;
        var forms = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            forms[_i] = arguments[_i];
        }
        var _this = this;
        try {
            // @ts-ignore
            _this = _super.call(this, (forms.length === 1 && forms[0][Symbol.iterator]) ? forms[0] : forms) || this;
        }
        catch (err) {
            if (err instanceof TypeError && err.message === "Constructor Set requires 'new'") {
                return Reflect.construct(Set, [(forms.length === 1 && forms[0][Symbol.iterator]) ? forms[0] : forms], _newTarget);
            }
        }
        return _this;
    }
    return Any;
}(Set));
exports.Any = Any;
var Content = /** @class */ (function (_super) {
    __extends(Content, _super);
    function Content() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _this = _super.call(this) || this;
        if (Array.isArray(args[0]) && args.length === 1)
            args === args[0];
        _super.prototype.push.apply(_this, __spread(args));
        return _this;
    }
    Content.prototype.toString = function () {
        return this.join('');
    };
    Content.form = function () {
        var _a;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return _a = /** @class */ (function (_super) {
                __extends(class_1, _super);
                function class_1() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return class_1;
            }(this)),
            _a.format = args[0].raw ? Form.new.apply(Form, __spread(args)) : new (Form.bind.apply(Form, __spread([void 0], args)))(),
            _a;
    };
    return Content;
}(Array));
exports.Content = Content;
//# sourceMappingURL=parsorama.js.map