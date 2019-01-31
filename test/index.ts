import { expect } from "chai";
import getPseudoContent from "../src/index";

let testElement: HTMLDivElement;
let style: HTMLStyleElement;

beforeEach(() => {
  testElement = document.createElement("div");
  style = document.createElement("style");
  document.body.appendChild(testElement);
  document.body.appendChild(style);
});

afterEach(() => {
  document.body.removeChild(testElement);
  document.body.removeChild(style);
});

it("should be null when no content is set", () => {
  expect(getPseudoContent(testElement, "::before")).to.equal(null);
});

it("should be null when set to normal", () => {
  style.innerHTML = `div:before { content: normal; }`;
  expect(getPseudoContent(testElement, "::before")).to.equal(null);
});

it("should support a single string", () => {
  style.innerHTML = `div:before { content: 'foo'; }`;
  expect(getPseudoContent(testElement, "::before")).to.equal("foo");
});

it("should support multiple strings", () => {
  style.innerHTML = `div:before { content: 'foo ' 'bar' 'baz'; }`;
  expect(getPseudoContent(testElement, "::before")).to.equal("foo barbaz");
});

it("should support text from an attribute", () => {
  testElement.setAttribute("data-string", "foo");
  style.innerHTML = `div:before { content: attr(data-string); }`;
  expect(getPseudoContent(testElement, "::before")).to.equal("foo");
});

it("should keep the whole content in the correct order", () => {
  testElement.setAttribute("data-string", "foo");
  style.innerHTML = `div:before { content: attr(data-string) 'bar' counter(bar) " attr(data-string) a\\" "; }`;
  expect(getPseudoContent(testElement, "::before")).to.equal(
    'foobar attr(data-string) a" '
  );
});

it("should handle escaped characters correctliy", () => {
  style.innerHTML = `div:before { content: "'" '"' '\\\\' '\\A' 'b';}`;
  expect(getPseudoContent(testElement, "::before")).to.equal("'\"\\ b");
});

it("should handle white space correctly when applicable", () => {
  testElement.style.whiteSpace = "pre";
  testElement.setAttribute(
    "data-string",
    `a
b`
  );
  style.innerHTML = `div:before { content: attr(data-string) '\\A c';}`;
  expect(getPseudoContent(testElement, "::before")).to.equal(`a\nb\n\c`);
});

it("should ignore images", () => {
  style.innerHTML = `div:before { content: 'foo' url(//lorempixel.com/20/20); }`;
  expect(getPseudoContent(testElement, "::before")).to.equal("foo");
});

it("should ignore other elements when it isn't rendered", () => {
  expect(getPseudoContent(testElement, "::before")).to.equal(null);
});

it("should ignore other psuedo elements", () => {
  style.innerHTML = `div:before, div:after { content: 'foo';`;
  expect(getPseudoContent(testElement, "::before")).to.equal("foo");
});

it("should ignore counters", () => {
  style.innerHTML = `div:before { content: 'foo ' counter(bar) "baz" }`;
  expect(getPseudoContent(testElement, "::before")).to.equal("foo baz");
});

it("should ignore quotes", () => {
  style.innerHTML = `div:before { content: open-quote }`;
  expect(getPseudoContent(testElement, "::before")).to.equal(null);
});

it("should ignore other content", () => {
  style.innerHTML = `div:before { content: 'foo' url(//lorempixel.com/20/20); }`;
  testElement.innerHTML = "some <span> text </span>";
  expect(getPseudoContent(testElement, "::before")).to.equal("foo");
});

it("should return null when it has an non existing attr()", () => {
  style.innerHTML = `div:before { content: 'foo' attr('foo'); }`;
  expect(getPseudoContent(testElement, "::before")).to.equal(null);
});
