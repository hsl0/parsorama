"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var parsorama_1 = require("../parsorama");
var Parameter = (function () {
    var _a;
    var defaultValue = parsorama_1.Content.form(templateObject_1 || (templateObject_1 = __makeTemplateObject([".*"], [".*"])));
    var defaultExp = parsorama_1.Content.form(templateObject_2 || (templateObject_2 = __makeTemplateObject(["|s*", ""], ["\\|\\s*", ""])), defaultValue);
    var paramName = parsorama_1.Content.form(templateObject_3 || (templateObject_3 = __makeTemplateObject([".*"], [".*"])));
    return _a = /** @class */ (function () {
            function Parameter(name, def) {
                if (typeof name !== 'string')
                    throw new TypeError('올바른 변수명이 지정되지 않았습니다');
                this.name = name;
                this.default = (def === undefined) ? null : new parsorama_1.Content(def);
            }
            Parameter.prototype.toString = function () {
                return "{{{" + this.name + (this.default ? "|" + this.default : '') + "}}}";
            };
            return Parameter;
        }()),
        _a.format = parsorama_1.Form.new(templateObject_4 || (templateObject_4 = __makeTemplateObject(["{{{s*", "s*", "(?:s*|s*.*)*s*}}}"], ["{{{\\s*", "\\s*", "(?:\\s*\\|\\s*.*)*\\s*}}}"])), paramName, new parsorama_1.Optional(defaultExp, parsorama_1.Quantitier.LAZY)),
        _a;
})();
var Template = (function () {
    var _a;
    var paramName = parsorama_1.Content.form(templateObject_5 || (templateObject_5 = __makeTemplateObject([".*"], [".*"])));
    var paramValue = parsorama_1.Content.form(templateObject_6 || (templateObject_6 = __makeTemplateObject([".*"], [".*"])));
    var paramExp = parsorama_1.Content.form(templateObject_7 || (templateObject_7 = __makeTemplateObject(["s*|s*(", "s*=s*)?", ""], ["\\s*|\\s*(", "\\s*=\\s*)?", ""])), paramName, paramValue);
    var templateName = parsorama_1.Content.form(templateObject_8 || (templateObject_8 = __makeTemplateObject([".*"], [".*"])));
    var TemplateParams = /** @class */ (function () {
        function TemplateParams() {
            var _this = this;
            var params = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                params[_i] = arguments[_i];
            }
            this.dirty = false;
            this[Symbol.toStringTag] = 'Params';
            if (params.length === 1 && Array.isArray(params[0]) && !(params[0] instanceof parsorama_1.Content))
                params = params[0];
            var named = [];
            this.raw = [];
            this.unnamed = [];
            this.registry = {};
            params.forEach(function (value) {
                if (typeof value === 'string') {
                    var val = new parsorama_1.Content(value);
                    _this.raw.push(val);
                    _this.unnamed.push(val);
                    _this.registry[_this.unnamed.length - 1] = val;
                }
                else if (value instanceof parsorama_1.Content) {
                    _this.raw.push(value);
                    _this.unnamed.push(value);
                    _this.registry[_this.unnamed.length - 1] = value;
                }
                else if (Array.isArray(value)) {
                    _this.raw.push(value);
                    named.push(value);
                }
                else if (typeof value === 'object')
                    for (var key in value) {
                        var val = value[key];
                        if (!(val instanceof parsorama_1.Content))
                            val = new parsorama_1.Content(val);
                        _this.raw.push([key, val]);
                        named.push([key, val]);
                    }
                else
                    throw new TypeError('파라미터에 잘못된 값이 입력되었습니다');
            });
            named.forEach(function (_a) {
                var _b = __read(_a, 2), key = _b[0], value = _b[1];
                _this.registry[key] = value;
            });
        }
        TemplateParams.prototype.clear = function () {
            this.raw = [];
            this.unnamed = [];
            this.registry = {};
        };
        TemplateParams.prototype.delete = function (key) {
            var removed = false;
            for (var index = 0; index < this.raw.length; index++) {
                var value = this.raw[index];
                if (value instanceof parsorama_1.Content) {
                    var i = this.unnamed.indexOf(value);
                    if (key == i) {
                        this.raw.splice(index, 1);
                        this.unnamed.splice(i, 1);
                        delete this.registry[key];
                        removed = true;
                    }
                }
                else if (Array.isArray(value)) {
                    if (key == value[0]) {
                        this.raw.splice(index, 1);
                        delete this.registry[key];
                        removed = true;
                    }
                }
            }
            return removed;
        };
        TemplateParams.prototype.forEach = function (callbackfn, thisArg) {
            var e_1, _a;
            try {
                for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                    callbackfn.call(thisArg, value, key, this);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        TemplateParams.prototype.get = function (key) {
            return this.registry[key];
        };
        TemplateParams.prototype.getAll = function (target) {
            var e_2, _a;
            var res = [];
            try {
                for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                    if (key == target)
                        res.push(value);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return res;
        };
        TemplateParams.prototype.has = function (key) {
            return key in this.registry || key in this.unnamed;
        };
        TemplateParams.prototype.set = function (key, value) {
            if (!this.dirty) {
                for (var index = 0; index < this.raw.length; index++) {
                    var value_1 = this.raw[index];
                    if (!(value_1 instanceof parsorama_1.Content) && Array.isArray(value_1)) {
                        if (key == value_1[0]) {
                            this.raw.splice(index, 1);
                            delete this.registry[key];
                        }
                    }
                }
            }
            this.raw.push([key, value]);
            this.registry[key] = value;
            return this;
        };
        TemplateParams.prototype.push = function (value) {
            this.raw.push(value);
            var index = this.unnamed.push(value);
            if (!this.dirty) {
                var key = index;
                for (var index_1 = 0; index_1 < this.raw.length; index_1++) {
                    var value_2 = this.raw[index_1];
                    if (value_2 instanceof parsorama_1.Content) {
                        var i = this.unnamed.indexOf(value_2);
                        if (key == i) {
                            this.raw.splice(index_1, 1);
                            this.unnamed.splice(i, 1);
                            delete this.registry[key];
                        }
                    }
                    else if (Array.isArray(value_2)) {
                        if (key == value_2[0]) {
                            this.raw.splice(index_1, 1);
                            delete this.registry[key];
                        }
                    }
                }
            }
            this.registry[index] = value;
            return index;
        };
        Object.defineProperty(TemplateParams.prototype, "size", {
            get: function () {
                return this.raw.length;
            },
            enumerable: false,
            configurable: true
        });
        ;
        TemplateParams.prototype[Symbol.iterator] = function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [5 /*yield**/, __values(this.entries())];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        };
        TemplateParams.prototype.entries = function () {
            var _a, _b, value, e_3_1;
            var e_3, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 7, 8, 9]);
                        _a = __values(this.raw), _b = _a.next();
                        _d.label = 1;
                    case 1:
                        if (!!_b.done) return [3 /*break*/, 6];
                        value = _b.value;
                        if (!(value instanceof parsorama_1.Content)) return [3 /*break*/, 3];
                        return [4 /*yield*/, [this.raw.indexOf(value), value]];
                    case 2:
                        _d.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        if (!Array.isArray(value)) return [3 /*break*/, 5];
                        return [4 /*yield*/, __spread(value)];
                    case 4:
                        _d.sent();
                        _d.label = 5;
                    case 5:
                        _b = _a.next();
                        return [3 /*break*/, 1];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_3_1 = _d.sent();
                        e_3 = { error: e_3_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_3) throw e_3.error; }
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        };
        TemplateParams.prototype.keys = function () {
            var _a, _b, value, e_4_1;
            var e_4, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 7, 8, 9]);
                        _a = __values(this.raw), _b = _a.next();
                        _d.label = 1;
                    case 1:
                        if (!!_b.done) return [3 /*break*/, 6];
                        value = _b.value;
                        if (!(value instanceof parsorama_1.Content)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.raw.indexOf(value)];
                    case 2:
                        _d.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        if (!Array.isArray(value)) return [3 /*break*/, 5];
                        return [4 /*yield*/, value[0]];
                    case 4:
                        _d.sent();
                        _d.label = 5;
                    case 5:
                        _b = _a.next();
                        return [3 /*break*/, 1];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_4_1 = _d.sent();
                        e_4 = { error: e_4_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_4) throw e_4.error; }
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        };
        TemplateParams.prototype.values = function () {
            var _a, _b, value, e_5_1;
            var e_5, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 7, 8, 9]);
                        _a = __values(this.raw), _b = _a.next();
                        _d.label = 1;
                    case 1:
                        if (!!_b.done) return [3 /*break*/, 6];
                        value = _b.value;
                        if (!(value instanceof parsorama_1.Content)) return [3 /*break*/, 3];
                        return [4 /*yield*/, value];
                    case 2:
                        _d.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        if (!Array.isArray(value)) return [3 /*break*/, 5];
                        return [4 /*yield*/, value[1]];
                    case 4:
                        _d.sent();
                        _d.label = 5;
                    case 5:
                        _b = _a.next();
                        return [3 /*break*/, 1];
                    case 6: return [3 /*break*/, 9];
                    case 7:
                        e_5_1 = _d.sent();
                        e_5 = { error: e_5_1 };
                        return [3 /*break*/, 9];
                    case 8:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_5) throw e_5.error; }
                        return [7 /*endfinally*/];
                    case 9: return [2 /*return*/];
                }
            });
        };
        TemplateParams.prototype.export = function () {
            return Object.assign({}, this.registry);
        };
        TemplateParams.prototype.toString = function () {
            var e_6, _a;
            var content = '';
            try {
                for (var _b = __values(this.raw), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var value = _c.value;
                    var key = (value instanceof parsorama_1.Content) ? null : value[0];
                    value = value[1];
                    content += "|" + (key ? key + "=" : '') + value;
                }
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_6) throw e_6.error; }
            }
            return content;
        };
        return TemplateParams;
    }());
    return _a = /** @class */ (function () {
            function Template(name) {
                var params = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    params[_i - 1] = arguments[_i];
                }
                if (typeof name !== 'string')
                    throw new TypeError('올바른 이름이 지정되지 않았습니다');
                this.name = name;
                this.params = new (TemplateParams.bind.apply(TemplateParams, __spread([void 0], params)))();
            }
            Template.prototype.toString = function () {
                return "{{" + this.name + this.params + "}}";
            };
            return Template;
        }()),
        _a.format = parsorama_1.Form.new(templateObject_9 || (templateObject_9 = __makeTemplateObject(["{{s*", "", "s*}}"], ["{{\\s*", "", "\\s*}}"])), templateName, new parsorama_1.ZeroMore(paramExp, parsorama_1.Quantitier.LAZY)),
        _a;
})();
debugger;
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9;
//# sourceMappingURL=mwparam.js.map