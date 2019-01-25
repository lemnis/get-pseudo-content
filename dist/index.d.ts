/**
 * very limited implementation of the CSS Level 2 specification,
 * could create a better version if a TextNode can be connected to a
 * ComputedAccessibleNode, e.g.
 * <style>div:before { content: 'foo'; }</style><div>foo</div>
 */
export default function (node: Element, pseudo: "::before" | "::after"): string | null;
