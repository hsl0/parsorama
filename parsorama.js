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
    function Cursor(str, index, length, parent, ltag) {
        this.parent = parent || null;
        this.source = str;
        this.code = str.slice(index);
        this.content = this.code.slice(length);
        this.start = index;
        this.end = null;
        this.current = 0;
        this[symbols.LOOP] = {};
        this.break = function() {
            if(!ltag) return false;
            this.parent[symbols.LOOP][ltag] = false;
            return true;
        }
    }
    Cursor.prototype.endExp = function(end) {
        end = new RegExp(escapeRegExp(end));
        if(this.content.search(end) != -1) {
            this.end = this.start + this.code.search(end) + end.source.length;
            this.code = this.source.slice(this.start, this.end);
            this.content = this.content.slice(0, this.content.search(end));
        }
    };
    Cursor.prototype.startExp = function(start, handler, arg, ltag) {
        var regex = new RegExp(escapeRegExp(start));
        var index = this.content.search(start);
        var child, value;
        if(index != -1) {
            this.current += index;
            child = new Cursor(this.content, this.current, start.length && regex.source.length, this, ltag);
            value = handler(child, arg);
            this.current += child.code.length;
            return value;
        }
    };
    Cursor.prototype.repeatExp = function(start, handler, until) {
        var length = this.content.length;
        var ltag = Symbol('ExpressionLoop');
        var value;
        this[symbols.LOOP][ltag] = true;
        for(var index = 0; (until? index <= until : true) && this.current < length && this[symbols.LOOP] === ltag; index++) {
            value = this.startExp(start, handler, value, ltag);
        }
        return value;
    };
    Cursor.prototype.move = function(index) {
        this.current += index;
        return this;
    };
    Cursor.prototype.jump = function(index) {
        this.current = index;
        return this;
    };
    Cursor.prototype.return = function() {
        this.current = 0;
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
