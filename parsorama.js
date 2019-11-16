var parsorama = (function() {
    /**
     * 정규표현식 이스케이프
     * @param {!string} s
     */
    function escapeRegExp(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    function Parser(nodes) {
        this.nodes = nodes || {}; // 요소
        this.tokens = {}; // 토큰
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
    /** 
     * 토큰을 읽어들이는 커서
     * @class
     * @param {!string} text - 문자열
     */
    function Cursor(text) {
        this.text = text;
        this.index = 0;
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
    }
    function Captured(parent, index, token) {
        this.parent = parent;
        this.index = index;
        this.token = token;
    }
    Captured.prototype.take = function() {
        return this.parent.text.slice(this.parent.index, this.index);
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
    /**
     * 토큰들의 정규표현식 생성
     * @param {object} tokens - {이름: "토큰"}
     */
    function tokenRegEx(tokens) {
        var regex = new RegExp('(' + Object.values(tokens).map(escapeRegExp).join(')|(') + ')');
        var index = 1;
        for(var label in tokens) regex[index++] = label;
        return regex;
    }
    Parser.Cursor = Cursor;
    return {Parser, Transformer, tokenRegEx};
})();