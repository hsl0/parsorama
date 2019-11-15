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
     * @param {number} index - 시작 위치
     * @param {object} token - {이름: "토큰"}, start/end 필수
     * @param {?Cursor} parent - 상위 커서
     */
    function Cursor(text, parent) {
        this.parent = parent || null;
        this.text = text;
    }
    Cursor.prototype.index = 0;
    Cursor.prototype.preview = function(length) {
        return this.text.substr(index, length);
    };
    Cursor.prototype.next = function(length) {
        this.index += length;
        return this.preview(length);
    };
    Cursor.prototype.find = function(tokens, handler) {
        if(typeof tokens === 'string') tokens = new Map([[tokens, handler]]);
        var regex = "";
        for(var token of tokens.keys()) {
            regex += token + "|";
        }
        var capture = this.text.slice(this.index).match(new RegExp(regex.slice(0, 1)));
        this.index = ++capture.index;
        capture = new Captured(match[0], this);
        tokens.get(capture.token)(capture.cursor);
    };
    function Captured(token, parent) {
        this.token = token;
        this.parent = parent;
        this.cursor = new Cursor(parent.text.slice(parent.index), parent);
    }
    Captured.prototype.index = 0;
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