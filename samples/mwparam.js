(function() {
    /**
     * 파라미터
     * {{{(키)|(기본값)}}}
     * @class
     * @param {(string|Content)} [key] - 키 
     * @param {(string|Content)} [def] - 기본값
     * @property {(string|Content)} key - 키
     * @property {(string|Content)} [def] - 기본값
     */
    function Parameter(key, def) {
        this.key = key || null;
        this.default = def || null;
    }
    /**
     * 문자열로 변환
     * @method
     * @returns {string}
     */
    Parameter.prototype.toString = function() {
        return '{{{' + this.key + (this.default ? '|' + this.default : '') + '}}}';
    };
    /**
     * 파라미터 문법에 사용되는 토큰
     */
    Parameter.tokens = new Map([
        ['|', function(c) {
            var stack = c.parent.stack; // 스택 저장소
            stack.push(c.take()); // 본문 수집
            if(!this.key) this.key = stack.done(); // 키가 없으면 기존 계층 종료 및 키에 저장
            stack.begin(); // 새 계층 시작
            c.find(Parameter.tokens); // 다음 토큰 검색
        }],
        ['}}}', function(c) {
            var stack = c.parent.stack; // 스택 저장소
            stack.push(c.take()); // 본문 수집
            if (this.key) this.default = stack.done(); // 키가 있으면 기본값으로 저장
            else this.key = stack.done(); // 키가 없으면 키로 저장
            c.find(); // 다른 요소 토큰 검색
        }]
    ]);
    return new parsorama.Parser({Parameter}, new Map([
        ['{{{', function(c) {
            c.begin(Parameter);
        }]
    ]));
})();
