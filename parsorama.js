var parsorama = (function() {
    var symbols = {
        LOOP: Symbol('loop')
    };
    function escapeRegExp(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    function Parser(nodes) {
        this.nodes = nodes || {};
        this.tokens = {};
        for(var node in nodes) this.tokens[node] = nodes[node].tokens.start;
    }
    Parser.prototype.parse = function(str) {
        var content = new Content();
        var regex = tokenRegEx(this.tokens);
        var rest = str;
        var index = 0;
        var current = regex.match(str);
        for(index in current) {
            new nodes[regex[index]].parse(new Cursor(str, current.index));
        }
    };
    Parser.prototype.addTransformer = function(name, transformer) {
        this[name] = transformer.transform.bind(transformer);
        this[name].transformer = transformer;
        return this;
    };
    function Cursor(text, index, token, parent, ltag) {
        this.parent = parent || null;
        this.source = text;
        this.expression = text.slice(index);
        this.startToken = token;
        this.endToken = null;
        this.content = this.expression.slice(this.startToken.length);
        this.expStart = index;
        this.expEnd = null;
        this.contentStart = this.expStart + this.startToken.length;
        this.contentEnd = null;
        this.index = 0;
        this[symbols.LOOP] = {};
        this.break = function() {
            if(!ltag) return false;
            this.parent[symbols.LOOP][ltag] = false;
            return true;
        }
    }
    Cursor.prototype.endExp = function(end) {
        var endToken = end;
        end = new RegExp(escapeRegExp(end));
        if(this.content.search(end) != -1) {
            this.endToken = endToken;
            this.expEnd = this.expStart + this.startToken.length + this.index + this.expression.slice(this.startToken.length + this.index).search(end) + this.endToken.length;
            this.expression = this.source.slice(this.expStart, this.expEnd);
            this.contentEnd = this.expEnd - this.endToken.length;
            this.content = this.content.slice(0, this.index + this.content.slice(this.index).search(end));
            this.index = this.content.length;
        }
    };
    Cursor.prototype.startExp = function(start, handler, arg, ltag) {
        var regex = new RegExp(escapeRegExp(start));
        var index = this.content.search(start);
        var child, value;
        if(index != -1) {
            this.index += index;
            child = new Cursor(this.content, this.index, start, this, ltag);
            value = handler(child, arg);
            this.index = child.expEnd;
            return value;
        }
    };
    Cursor.prototype.repeatExp = function(start, handler, until) {
        var length = this.content.length;
        var ltag = Symbol('ExpressionLoop');
        var value;
        this[symbols.LOOP][ltag] = true;
        for(var index = 0; (until? index <= until : true) && this.index < length && this[symbols.LOOP][ltag]; index++) {
            value = this.startExp(start, handler, value, ltag);
        }
        return value;
    };
    Cursor.prototype.move = function(index) {
        this.index += index;
        return this;
    };
    Cursor.prototype.jump = function(index) {
        this.index = index;
        return this;
    };
    Cursor.prototype.home = function() {
        this.index = 0;
        return this;
    };
    function Transformer() {
        this.handlers = {};
    }
    Transformer.prototype.addHandler = function(node, handler) {
        if(!this.handlers[node]) this.handlers[node] = [];
        this.handlers[node].push(handler);
        return this;
    };
    Transformer.prototype.transform = function() {
        
    };
    function Content() {
        Array.apply(this);
    }
    Content.prototype = Object.create(Array.prototype);
    Content.prototype.constructor = Content;
    Content.prototype.toString = function() {
        return this.join('');
    };
    function tokenRegEx(tokens) {
        var regex = new RegExp('(' + Object.values(tokens).map(escapeRegExp).join(')|(') + ')');
        var index = 1;
        for(var label in tokens) regex[index++] = label;
        return regex;
    }
    Parser.Cursor = Cursor;
    return {Parser, Transformer, tokenRegEx};
})();
debugger;