(function() {
    function Parameter(key, def) {
        this.key = key || null;
        this.default = def || null;
    }
    Parameter.prototype.toString = function() {
        return '{{{' + this.key + (this.default ? '|' + this.default : '') + '}}}';
    };
    Parameter.tokens = new Map([
        ['|', function(c) {
            var stack = c.parent.stack;
            stack.push(c.take());
            if (!stack.current.key) stack.current.key = stack.done();
            stack.begin();
            c.find(Parameter.tokens);
        }],
        ['}}}', function(c) {
            var stack = c.parent.stack;
            stack.push(c.take());
            if (stack.current.key) stack.current.default = stack.done();
            else stack.current.key = stack.done();
            c.find(c.parent.parent.tokens);
        }]
    ]);
    return new parsorama.Parser({
        Parameter
    }, new Map([
        ['{{{', function(c) {
            var stack = c.parent.stack;
            stack.push(c.take());
            stack.push(new Parameter());
            stack.begin();
            c.find(Parameter.tokens);
        }]
    ]), function(c) {
        c.find(c.parent.tokens);
    }));
})();
