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
    function Cursor(text, index, token, parent) {
        this.parent = parent || null;
        this.source = text;
        this.expression = text.slice(index);
        this.startToken = token.start || null;
        this.endToken = token.end || null;
        this.content = this.expression.slice(this.startToken.length);
        this.expStart = index;
        this.expEnd = null;
        this.contentStart = this.expStart + this.startToken.length;
        this.contentEnd = null;
        this.index = 0;
    }
    /**
     * 범위 종료
     */
    Cursor.prototype.endExp = function() {
        var end = new RegExp(escapeRegExp(this.endToken));
        if(this.content.search(end) != -1) {
            this.expEnd = this.expStart + this.startToken.length + this.index + this.expression.slice(this.startToken.length + this.index).search(end) + this.endToken.length;
            this.expression = this.source.slice(this.expStart, this.expEnd);
            this.contentEnd = this.expEnd - this.endToken.length;
            this.content = this.content.slice(0, this.index + this.content.slice(this.index).search(end));
            this.index = this.content.length;
        }
    };
    /**
     * 새로운 하위 범위 시작
     * @param {{start: string, end: string}} token - 시작/끝 토큰
     * @param {function} handler - 범위 조작 함수
     * @param {*} arg - handler에 넘겨줄 기타 데이터
     */
    Cursor.prototype.startExp = function(token, handler, arg) {
        var index = this.content.search(token.start);
        var child, value;
        if(index != -1) {
            this.index += index;
            child = new Cursor(this.content, this.index, token, this);
            value = handler(child, arg);
            this.index = child.expEnd;
            return value;
        }
    };
    /**
     * 토큰 찾기
     * @param {object} tokens - {이름: "토큰"}
     * @param {object} handlers - {이름: 핸들러()}
     * @param {*} arg - 하위 범위에 넘겨줄 기타 데이터
     */
    Cursor.prototype.findToken = function(tokens, handlers, arg) {
        tokens = tokenRegEx(tokens);
        var text = this.content.slice(this.index);
        var broken = false;
        var token;
        setTimeout(function(){
            broken = true;
            throw new Error("Timeout");
        }, 10000);
        while(true) {
            token = text.match(tokens).findIndex(function(value, index, arr) {
                if(index) return value === arr[0];
            });
            if(broken || token === -1) break;
            token = tokens[token];
            arg = handlers[token]({
                startExp: function startExp(end, handler, arg) {
                    return this.context.startExp({
                        start: token,
                        end: end
                    }, handler, arg);
                },
                endExp: this.endExp.bind(this),
                exit: function exit() {
                    broken = true;
                    return broken;
                },
                context: this
            }, arg);
            text = this.content.slice(this.index);
        }
        return arg;
    };
    /**
     * 커서 위치 상대적 이동
     * @param {number} index - 이동할 위치 수
     */
    Cursor.prototype.move = function(index) {
        this.index += index;
        return this;
    };
    /**
     * 커서 위치 절대적 이동
     * @param {number} index - 이동할 위치 번호
     */
    Cursor.prototype.jump = function(index) {
        this.index = index;
        return this;
    };
    /**
     * 커서 처음 위치로
     */
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