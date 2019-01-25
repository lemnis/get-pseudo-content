"use strict";
/**
 * very limited implementation of the CSS Level 2 specification,
 * could create a better version if a TextNode can be connected to a
 * ComputedAccessibleNode, e.g.
 * <style>div:before { content: 'foo'; }</style><div>foo</div>
 */
exports.__esModule = true;
var contentList = {
    unquotedString: { regex: '([a-zA-Z]+)' },
    attribute: { regex: 'attr\\((.+?)\\)' }
};
var innerRegex = Object.keys(contentList)
    .map(function (key) { return contentList[key].regex; })
    .join('|');
var regex = new RegExp("(?:^|\\s)(?:" + innerRegex + ")(?:$|\\s)", 'g');
var stringRegex = /(?:^|\s)"((?:[^\\"]+|\\.)*)"/g;
function default_1(node, pseudo) {
    var rawContent = window.getComputedStyle(node, pseudo).content;
    // with 'normal' the psuedo element is not generated.
    // 'none' computes to 'normal' within psuedo elements.
    if (!rawContent || rawContent === 'normal' || rawContent === 'none')
        return null;
    var result = [];
    var match;
    // push quoted strings
    while ((match = stringRegex.exec(rawContent)) !== null) {
        result.push(match[1]);
    }
    var rest = rawContent.replace(stringRegex, '').trim();
    while ((match = regex.exec(rest)) !== null) {
        var previousLength = 0;
        for (var key in contentList) {
            var index = ++previousLength;
            if (match[index]) {
                switch (key) {
                    case 'unquotedString':
                        result.push(match[index]);
                        break;
                    case 'attribute':
                        result.push(node.getAttribute(match[index]));
                        break;
                }
            }
        }
    }
    return result.join('') || null;
}
exports["default"] = default_1;
