/**
 * very limited implementation of the CSS Level 2 specification,
 * could create a better version if a TextNode can be connected to a
 * ComputedAccessibleNode, e.g.
 * <style>div:before { content: 'foo'; }</style><div>foo</div>
 */

const contentList: {
  [name: string]: { regex: string };
} = {
  quotedString: { regex: '"(.+)"' },
  unquotedString: { regex: "([a-zA-Z]+)" },
  attribute: { regex: "attr\\((.+?)\\)" }
};

const contentListKeys = Object.keys(contentList);
const innerRegex = contentListKeys.map(key => contentList[key].regex).join("|");
const regex = new RegExp(`(?:^|\\s)(?:${innerRegex})(?:$|\\s)`);
const split = /(?:^|\s)((?:".+?"(?!\\))|\S+)/;

function unescapeCharacters(string: string, preserveNewlines: boolean) {
  string = string.replace(/\\\"/g, '"');
  string = string.replace(/\\\\/g, "\\");
  string = string.replace(/\\a /g, preserveNewlines ? "\n" : "");
  return string;
}

export default function(
  node: Element,
  pseudo: "::before" | "::after"
): string | null {
  const { content, whiteSpace } = window.getComputedStyle(node, pseudo);
  const preserveNewlines =
    whiteSpace === "pre" ||
    whiteSpace == "pre-line" ||
    whiteSpace == "pre-wrap";

  // with 'normal' the psuedo element is not generated.
  // 'none' computes to 'normal' within psuedo elements.
  if (!content || content === "normal" || content === "none") return null;

  const result: string[] = [];

  // reverse string because of no support for negative lookbehind
  const reversedContent = content
    .split("")
    .reverse()
    .join("");

  let splittedContent = reversedContent.split(split);
  splittedContent.reverse().forEach(subContent => {
    if (subContent) {
      // unrevert string
      subContent = subContent
        .split("")
        .reverse()
        .join("");
      let match = regex.exec(subContent);
      if (match) {
        for (let index = 1; index < match.length; index++) {
          if (match[index]) {
            switch (contentListKeys[index - 1]) {
              case "quotedString":
                match[index] = unescapeCharacters(
                  match[index],
                  preserveNewlines
                );
              case "unquotedString":
                result.push(match[index]);
                break;
              case "attribute":
                if (node.hasAttribute(match[index]))
                  result.push(node.getAttribute(match[index])!);
                break;
            }
          }
        }
      }
    }
  });

  return result.join("") || null;
}
