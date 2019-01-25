"use strict";
/**
 * very limited implementation of the CSS Level 2 specification,
 * could create a better version if a TextNode can be connected to a
 * ComputedAccessibleNode, e.g.
 * <style>div:before { content: 'foo'; }</style><div>foo</div>
 */
Object.defineProperty(exports, "__esModule", { value: true });
var contentList = {
    quotedString: { regex: '"(.+)"' },
    unquotedString: { regex: "([a-zA-Z]+)" },
    attribute: { regex: "attr\\((.+?)\\)" }
};
var contentListKeys = Object.keys(contentList);
var innerRegex = contentListKeys.map(function (key) { return contentList[key].regex; }).join("|");
var regex = new RegExp("(?:^|\\s)(?:" + innerRegex + ")(?:$|\\s)");
var split = /(?:^|\s)((?:".+?"(?!\\))|\S+)/;
function unescapeCharacters(string, preserveNewlines) {
    string = string.replace(/\\\"/g, '"');
    string = string.replace(/\\\\/g, "\\");
    string = string.replace(/\\a /g, preserveNewlines ? "\n" : "");
    return string;
}
function default_1(node, pseudo) {
    var _a = window.getComputedStyle(node, pseudo), content = _a.content, whiteSpace = _a.whiteSpace;
    var preserveNewlines = whiteSpace === "pre" ||
        whiteSpace == "pre-line" ||
        whiteSpace == "pre-wrap";
    // with 'normal' the psuedo element is not generated.
    // 'none' computes to 'normal' within psuedo elements.
    if (!content || content === "normal" || content === "none")
        return null;
    var result = [];
    // reverse string because of no support for negative lookbehind
    var reversedContent = content
        .split("")
        .reverse()
        .join("");
    var splittedContent = reversedContent.split(split);
    splittedContent.reverse().forEach(function (subContent) {
        if (subContent) {
            // unrevert string
            subContent = subContent
                .split("")
                .reverse()
                .join("");
            var match = regex.exec(subContent);
            if (match) {
                for (var index = 1; index < match.length; index++) {
                    if (match[index]) {
                        switch (contentListKeys[index - 1]) {
                            case "quotedString":
                                match[index] = unescapeCharacters(match[index], preserveNewlines);
                            case "unquotedString":
                                result.push(match[index]);
                                break;
                            case "attribute":
                                if (node.hasAttribute(match[index]))
                                    result.push(node.getAttribute(match[index]));
                                break;
                        }
                    }
                }
            }
        }
    });
    return result.join("") || null;
}
exports.default = default_1;
