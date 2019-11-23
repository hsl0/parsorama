var parsorama = (function() {
    /**
     * 정규표현식 이스케이프
     * @param {!string} s
     */
    function escapeRegExp(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    function Parser(nodes, tokens, parser) {
        this.nodes = nodes || {}; // 요소
        this.tokens = new Map(tokens); // 토큰
        this.parse = function(str) {
            var cursor = new Cursor(str, this);
            return parser(cursor) || cursor.done();
        };
    }
    Parser.prototype.addTransformer = function(name, transformer) {
        this[name] = transformer.transform.bind(transformer);
        this[name].transformer = transformer;
        return this;
    };
    /** 
     * 토큰을 읽어들이는 커서
     * @class
     * @param {!string} text - 문자열
     * @param {Parser} parent
     */
    function Cursor(text, parent) {
        this.text = text;
        this.parent = parent || null;
        this.index = 0;
        this.stack = new ScopeStack();
    }
    Cursor.prototype.preview = function(length) {
        if(length <= 0) throw new RangeError("length must be 1 or more");
        if(this.index + length > this.text.length) return null;
        return this.text.substr(this.index, length || 1);
    };
    Cursor.prototype.next = function(length) {
        if(length === undefined) length = 1;
        if(length <= 0) return;
        if(this.index + length > this.text.length) return null;
        var text = this.preview(length);
        this.index += length;
        return text;
    };
    Cursor.prototype.find = function(tokens, arg) {
        if(!(tokens instanceof Map)) throw new TypeError("tokens argument must be a Map object");
        var regex = "";
        for(var token of tokens.keys()) {
            regex += escapeRegExp(token) + "|";
        }
        var capture = this.text.slice(this.index).match(new RegExp(regex.slice(0, -1)));
        if(capture) {
            capture = new Captured(this, this.index + capture.index, capture[0]);
            tokens.get(capture.token)(capture, arg);
            capture.done();
        }
        return this;
    };
    Cursor.prototype.home = function() {
        this.index = 0;
        return this;
    };
    Cursor.prototype.done = function() {
        while(this.stack.depth > 1) this.stack.push(this.stack.done());
        return this.stack.done();
    }
    function Captured(parent, index, token) {
        this.parent = parent;
        this.index = index;
        this.token = token;
    }
    Captured.prototype.take = function() {
        return this.parent.text.slice(this.parent.index, this.index);
    };
    Captured.prototype.done = function() {
        return this.parent.index = this.index + this.token.length;
    }
    Captured.prototype.find = function(tokens, arg) {
        this.done();
        this.parent.find(tokens, arg);
        return this;
    }
    function ScopeStack() {
        var stack = [];
        var current = null;
        this.begin = function() {
            current = new Content();
            stack.push(current);
            return current;
        };
        this.done = function() {
            current = stack[stack.length - 1] || null;
            return stack.pop();
        };
        this.push = function(node) {
            return current.push(node);
        };
        this.begin();
        Object.defineProperties(this, {
            depth: {
                get: function() {
                    return stack.length;
                }
            },
            current: {
                get: function() {
                    var parent = stack[stack.length - 2];
                    return parent[parent.length - 1];
                }
            }
        });
    }
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
    Parser.Cursor = Cursor;
    return {Parser, Transformer};
})();