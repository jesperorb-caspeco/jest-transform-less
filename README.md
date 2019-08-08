# jest-transform-less

A Jest transformer which enables importing LESS into Jest's `jsdom`. Based on [`jest-transform-css`](https://github.com/dferber90/jest-transform-css)

> ⚠️ **This package is experimental.**
> ⚠️ **Not working with `@imports`-right now**

## Setup

### Installation

```bash
yarn add jest-transform-less --dev
```

### Adding `transform`

Open `jest.config.js` or `package.json` and modify the `transform`-property:

```json
"transform": {
  "^.+\\.js$": "babel-jest",
  "^.+\\.less$": "jest-transform-less"
}
```
