# get-pseudo-content

[![npm][npm]][npm-url]
[![dev dependencies][dev-deps]][dev-deps-url]
[![browserstack][browserstack]][browserstack-url]

---

Returns a string as rendered from the content attribute of a pseudo element.

# Installation

```bash
npm install --save-dev get-pseudo-content
```

# Example

```js
import getPseudoContent from "get-pseudo-content";

getPseudoContent(document.body, "::before");
```

## Supports

* string
* `attr()`

## Differences in raw output between browser

| | Blink | Webkit | Gecko | Trident
--- | --- | --- | --- | ---
encloses single strings | yes | no | yes | yes
combines multiple strings | yes | yes | no | no
returns line breaks as `\a` | yes | yes | yes | no
returns line breaks as new lines<br/>even when rendered on a single line | no | no | no | yes
renders `attr()` as actual string | yes | yes | no | no
escapes `"` | yes | yes | yes | no

> ## 🐛 Edge: Failing to escape `"`
>
> When a double quote is preceded with a space, this library is unable return the correct value. Related bug report: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/20351981/

[npm]: https://img.shields.io/npm/v/get-pseudo-content.svg
[npm-url]: https://npmjs.com/package/get-pseudo-content

[dev-deps]: https://david-dm.org/lemnis/get-pseudo-content/dev-status.svg
[dev-deps-url]: https://david-dm.org/lemnis/get-pseudo-content?type=dev

[browserstack]: https://www.browserstack.com/automate/badge.svg?badge_key=WTFGYWhUQkNFYnRUWmE1dkhzQjlkU0JvcjFUUzRUaUxmU3VPVDNXdzBzaz0tLThWRmhtQW9RN0V2cFM4bnZhai90Wnc9PQ==--c546a56f3c70cbcef6ce69a5b9809eea20ced274
[browserstack-url]: https://www.browserstack.com/automate/public-build/WTFGYWhUQkNFYnRUWmE1dkhzQjlkU0JvcjFUUzRUaUxmU3VPVDNXdzBzaz0tLThWRmhtQW9RN0V2cFM4bnZhai90Wnc9PQ==--c546a56f3c70cbcef6ce69a5b9809eea20ced274
