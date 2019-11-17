var parsorama = (function() {
    function Parser(nodes, tokens, parser) {
        this.nodes = nodes || {}; // 요소
        this.tokens = new Map(tokens); // 토큰
        this.parser = function(str) {
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
        return this.text.substr(this.index, length);
    };
    Cursor.prototype.next = function(length) {
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
            regex += token + "|";
        }
        var capture = this.text.slice(this.index).match(new RegExp(regex.slice(0, 1)));
        capture = new Captured(this, capture.index, capture[0]);
        tokens.get(capture.token)(capture, arg);
        this.index = capture.index + capture.token.length - 1;
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
    function ScopeStack() {
        var stack = [];
        Object.defineProperties(this, {
            depth: {
                get: function() {
                    return stack.length;
                }
            },
            current: {
                get: function() {
                    return stack[stack.length - 1];
                }
            }
        });
        this.begin = function() {
            var content = new Content();
            stack.push(content);
            return content;
        }
        this.done = function() {
            return stack.pop();
        }
    }
    ScopeStack.prototype.push = function(node) {
        return this.current.push(node);
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
    Parser.Cursor = Cursor;
    return {Parser, Transformer};
})();