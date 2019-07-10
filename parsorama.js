var parsorama = {};
parsorama.Parser = function Parser(nodes) {
    this.nodes = nodes || {};
    this.tokens = {};
    for(var node in nodes) this.tokens[node] = nodes[node].tokens.start;
};
parsorama.Parser.prototype.parse = function(str) {
    var content = new parsorama.Content();
    var regex = parsorama.tokenRegEx(this.tokens);
    var rest = str;
    var index = 0;
    var current = regex.match(str);
    for(index in current) {
        new nodes[regex[index]].parse(new parsorama.Parser.Pointer(str, current.index));
    }
};
parsorama.Parser.prototype.addTransformer = function(name, transformer) {
    this[name] = transformer.transform.bind(transformer);
    this[name].transformer = transformer;
    return this;
};
parsorama.Parser.Pointer = function Pointer(str, index, length) {
    this.source = str;
    this.code = str.slice(index);
    this.content = this.code.slice(length);
    this.start = index;
    this.end = null;
};
parsorama.Parser.Pointer.prototype.endExp = function(end) {
    end = new RegExp(end);
    this.end = this.start + this.code.search(end) + end.source.length;
    this.code = this.source.slice(this.start, this.end);
    this.content = this.content.slice(0, this.content.search(end));
};
parsorama.Parser.Pointer.prototype.startExp = function(start, handler) {
    start = new RegExp(start);
    if(this.content.search(start) > 0) return handler(new parsorama.Parser.Pointer(this.content, this.content.search(start), start.source.length));
};
parsorama.Transformer = function Transformer() {
    this.handlers = {};
};
parsorama.Transformer.prototype.addHandler = function(node, handler) {
    if(!this.handlers[node]) this.handlers[node] = [];
    this.handlers[node].push(handler);
    return this;
};
parsorama.Transformer.prototype.transform = function() {

};
parsorama.Content = function Content() {
    Array.apply(this);
};
parsorama.Content.prototype = Object.create(Array.prototype);
parsorama.Content.prototype.constructor = parsorama.Content;
parsorama.Content.prototype.toString = function() {
    return this.join('');
};
parsorama.tokenRegEx = function(tokens) {
    var regex = new RegExp('(' + Object.values(tokens).join(')|(') + ')');
    var index = 1;
    for(var label in tokens) regex[index++] = label;
    return regex;
};
