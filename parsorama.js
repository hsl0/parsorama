/**
 * @global
 * @namespace
 */
var parsorama = (function() {
    /**
     * 토큰 모음
     * @typedef {Map<string, function(Captured)>} Tokens
     */
    /**
     * 정규표현식 이스케이프
     * @function
     * @param {!string} s - 이스케이프할 문자열
     */
    function escapeRegExp(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    /**
     * 문법 파서
     * @class
     * @param {Object<function>} [nodes] - 문법을 구성하는 요소 생성자 모음
     * @param {Tokens} [tokens] - 문법을 구성하는 토큰 모음
     * @param {function} [parser] - 문법 파서 함수 
     * @property {Object<function>} nodes - 문법을 구성하는 요소 생성자 모음
     * @property {Tokens} tokens - 문법을 구성하는 토큰 모음
     * @property {function} parser - 문법 파서 함수 
     */
    function Parser(nodes, tokens) {
        this.nodes = nodes || {}; // 요소
        this.tokens = new Map(tokens); // 토큰
    }
    Parser.prototype.parse = function(str) {
        var cursor = new Cursor(str, this);
        cursor.find(this.tokens);
        return cursor.done();
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
     * @param {Parser} [parent] - 커서를 생성한 파서
     * @property {string} text - 읽어들일 문자열
     * @property {Parser} parent - 커서의 상위 파서 객체
     * @property {number} index - 커서의 현재 위치. 명령을 수행할 때 해당 위치부터 작업을 수행합니다. (정수, 0 <= x < text.length)
     * @property {ScopeStack} stack - 읽어들인 결과물의 임시 저장소
     */
    function Cursor(text, parent) {
        this.text = text;
        this.parent = parent || null;
        this.index = 0;
        this.stack = new ScopeStack();
    }
    /**
     * 다음 내용을 index에 영향을 주지 않고 미리 가져옵니다.
     * @method
     * @param {number} [length = 1] - 읽어들일 문자열의 길이 (자연수, x < text.length - index)
     * @throws {RangeError} length가 1보다 작으면 에러가 발생합니다.
     * @returns {(string|null)} 더 이상 읽어들일 내용이 없으면 null이 출력됩니다.
     */
    Cursor.prototype.preview = function(length) {
        if(length === undefined) length = 1;
        if(length <= 0) throw new RangeError("length must be 1 or more but " + length + " isn't");
        if(this.index >= this.text.length) return null;
        return this.text.substr(this.index, length || 1);
    };
    /**
     * index의 위치를 이동하면서 다음 내용을 가져옵니다.
     * @method
     * @param {number} [length = 1] - 읽어들일 문자열의 길이 (자연수, x < text.length - index)
     * @throws {RangeError} length가 1보다 작으면 에러가 발생합니다.
     * @returns {(string|null)} 더 이상 읽어들일 내용이 없으면 null이 출력됩니다.
     */
    Cursor.prototype.next = function(length) {
        if(length === undefined) length = 1;
        if(this.index >= this.text.length) return null;
        var text = this.preview(length);
        this.index += length;
        return text;
    };
    /**
     * 현재 위치부터 끝까지 내용에서 토큰 찾기
     * @method
     * @param {!Tokens} tokens - 찾을 토큰과 토큰을 찾을 때 실행되는 함수
     * @param {*} [arg] - 함수에 넘겨줄 매개변수
     * @throws {TypeError} tokens 파라미터가 Map이 될 수 없는 경우 에러가 발생합니다.
     * @returns {Cursor} 메소드 체이닝 가능
     */
    Cursor.prototype.find = function(tokens, arg) {
        if(tokens === undefined || tokens === null) tokens = this.parent.tokens;
        if(!(tokens instanceof Map)) throw new TypeError("tokens argument must be a Map object"); // tokens 파라미터 검증

        // 토큰을 찾을 정규표현식 생성
        var regex = "";
        for(var token of tokens.keys()) {
            regex += escapeRegExp(token) + "|";
        }

        var capture = this.text.slice(this.index).match(new RegExp(regex.slice(0, -1))); // 토큰을 찾고 저장
        if(capture) { // 토큰을 찾을 때
            capture = new Captured(this, this.index + capture.index, capture[0]); // Captured 객체로 가공
            tokens.get(capture.token).call(this.stack.current, capture, arg); // 핸들러 실행
            capture.done(); // 핸들링 종료 및 카운트
        }
        return this; // 메소드 체이닝
    };
    /**
     * 커서를 처음 위치로
     * @method
     * @returns {Cursor} 메소드 체이닝 가능
     */
    Cursor.prototype.home = function() {
        this.index = 0;
        return this;
    };
    /**
     * 커서를 지정된 위치로 이동
     * @method
     * @param {!number} index - 커서를 이동할 절대적 위치 (정수, 0 <= x < text.length)
     * @throws {TypeError} 위치값이 정수가 아니면 에러가 발생합니다.
     * @throws {RangeError} 위치값이 음수이거나 내용의 길이보다 길면 에러가 발생합니다.
     * @returns {Cursor} 메소드 체이닝 가능
     */
    Cursor.prototype.go = function(index) {
        if(!Number.isInteger(index)) throw new TypeError('index ' + index + ' is not integer');
        if(index < 0) throw new RangeError('index ' + index + ' is not positive number');
        if(index >= this.text.length) throw new RangeError('index ' + index + ' is too big');
        this.index = index;
        return this;
    };
    /**
     * 커서를 지정된 범위만큼 이동
     * @method
     * @param {!number} index - 커서를 이동할 상대적 위치 (정수, -index <= x < text.length - index)
     * @throws {TypeError} 위치값이 정수가 아니면 에러가 발생합니다.
     * @throws {RangeError} 이동할 위치가 음수이거나 내용의 길이보다 길면 에러가 발생합니다.
     * @returns {index}
     */
    Cursor.prototype.move = function(index) {
        if(!Number.isInteger(index)) throw new TypeError('index ' + index + ' is not integer');
        if(index < -this.index) throw new RangeError('index ' + index + ' is too short');
        if(index >= this.text.length - this.index) throw new RangeError('index ' + index + ' is too big');
        this.index += index;
        return this.index;
    };
    /**
     * 작업을 끝내고 스택 저장소를 정리하기
     * @method
     * @returns {Content} 최상위 트리가 반환됩니다.
     */
    Cursor.prototype.done = function() {
        while(this.stack.depth > 1) this.stack.push(this.stack.done()); // 하위 계층을 상위 계층에 넣는다.
        return this.stack.done();
    };
    /**
     * 토큰 핸들러를 위한 커서 조작기
     * @class
     * @param {Cursor} parent - 토큰을 감지한 커서
     * @param {number} index - 토큰의 위치
     * @param {string} token - 감지된 토큰
     * @property {Cursor} parent - 조작할 커서
     * @property {number} index - 토큰의 위치
     * @property {string} token - 현재 토큰
     */
    function Captured(parent, index, token) {
        this.parent = parent;
        this.index = index;
        this.token = token;
    }
    /**
     * 커서 앞의 읽히지 않은 내용을 긁어온다.
     * @method
     * @returns {string}
     */
    Captured.prototype.take = function() {
        return this.parent.text.slice(this.parent.index, this.index);
    };
    /**
     * 요소 처리를 시작하기 위해 중간 내용을 저장하고, 저장소 계층 공간을 만든다.
     * @method
     * @param {function} node - 요소
     * @param {Tokens} tokens - 요소에서 사용하는 토큰
     * @returns {Captured} 메소드 체이닝 지원
     */
    Captured.prototype.begin = function(node, tokens) {
        var stack = this.parent.stack; // 스택 저장소
        stack.push(this.take()); // 중간 내용 정리
        stack.push(new node()); // 저장할 요소 생성
        stack.begin(); // 계층 시작
        this.find(tokens || node.tokens); // 다음 토큰 검색
        return this; // 메소드 체이닝
    };
    /**
     * 토큰 핸들링 작업을 종료하고 토큰 위치를 커서 위치에 카운팅한다.
     * @method
     * @returns {number} 현재 커서 위치
     */
    Captured.prototype.done = function() {
        return this.parent.index = this.index + this.token.length;
    };
    /**
     * 토큰 핸들링 작업을 종료하고 다음 토큰을 찾는다.
     * @method
     * @param {!Tokens} tokens - 찾을 토큰과 토큰을 찾을 때 실행되는 함수
     * @param {*} [arg] - 함수에 넘겨줄 매개변수
     * @throws {TypeError} tokens 파라미터가 Map이 될 수 없는 경우 에러가 발생합니다.
     * @returns {Cursor} 메소드 체이닝 가능
     */
    Captured.prototype.find = function(tokens, arg) {
        this.done();
        this.parent.find(tokens, arg);
        return this;
    };
    /**
     * 작업 내용을 임시로 저장하는 스택 저장소
     * @class
     * @property {number} depth - 계층 수 (자연수, 0 <= x)
     * @property {object} current - 현재 작업중인 요소 
     */
    function ScopeStack() {
        this[ScopeStack.STACK] = [];
        this.begin();
    }
    /**
     * 실제 스택 저장소 위치
     * @static
     */
    ScopeStack.STACK = Symbol('stack');
    /**
     * 새로운 스택 계층 시작. 토큰을 찾고 요소의 내용을 별도로 저장할 때 사용한다.
     * @method
     * @returns {Content} 새로운 계층
     */
    ScopeStack.prototype.begin = function() {
        var work = new Content();
        this[ScopeStack.STACK].push(work);
        return work;
    };
    /**
     * 스택 계층을 완성하고 내용을 반환한다.
     * @method
     * @returns {Content} 종료한 계층
     */
    ScopeStack.prototype.done = function() {
        return this[ScopeStack.STACK].pop();
    };
    /**
     * 현재 계층에 내용을 추가한다.
     * @method
     * @param {!(Content|object)} node - 추가할 내용 (텍스트, 요소)
     * @returns {number} 현재 계층의 내용 수
     */
    ScopeStack.prototype.push = function(node) {
        var stack = this[ScopeStack.STACK];
        return stack[stack.length - 1].push(node);
    };
    Object.defineProperties(ScopeStack.prototype, {
        depth: {
            get: function() {
                return this[ScopeStack.STACK].length;
            }
        },
        current: {
            get: function() {
                var stack = this[ScopeStack.STACK];
                var parent = stack[stack.length - 2]; // 상위 계층에서
                return parent[parent.length - 1]; // 마지막 요소
            }
        }
    });
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
    /**
     * 내용 트리
     * @class {Array}
     * 
     */
    function Content() {
        Array.apply(this);
    }
    Content.prototype = Object.create(Array.prototype);
    Content.prototype.constructor = Content;
    /**
     * 문자열로 변환
     * @method
     * @returns {string}
     */
    Content.prototype.toString = function() {
        return this.join('');
    };
    return {Parser, Cursor, Transformer, escapeRegExp};
})();
