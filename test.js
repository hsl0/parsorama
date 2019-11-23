try {
var cursor = new parsorama.Parser.Cursor("{{{aa|bb}}}", 0, {
    start: "{{{",
    end: "}}}"
});
cursor.findToken({
    default: "|"
}, {
    default: function(c) {
        c.startExp("}}}", function() {
            c.endExp();
        });
    }
});
console.log(cursor);
} catch(e) {
    console.error(e);
}