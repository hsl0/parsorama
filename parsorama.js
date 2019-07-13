var parsorama = (function() {
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
    function Cursor(str, index, length) {
        this.source = str;
        this.code = str.slice(index);
        this.content = this.code.slice(length);
        this.start = index;
        this.end = null;
    }
    Cursor.prototype.endExp = function(end) {
        end = new RegExp(end);
        this.end = this.start + this.code.search(end) + end.source.length;
        this.code = this.source.slice(this.start, this.end);
        this.content = this.content.slice(0, this.content.search(end));
    };
    Cursor.prototype.startExp = function(start, handler) {
        start = new RegExp(start);
        if(this.content.search(start) > 0) return handler(new Cursor(this.content, this.content.search(start), start.source.length));
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
        var regex = new RegExp('(' + Object.values(tokens).join(')|(') + ')');
        var index = 1;
        for(var label in tokens) regex[index++] = label;
        return regex;
    }
    Parser.Cursor = Cursor;
    return {Parser, Transformer, tokenRegEx};
})();
