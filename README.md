# electron + vite + typescript + react

## 実行

```bash
npm i
npm run start
```

## install 方法

### install electron,vite,typescript

```bash
npx create-electron-app@latest my-app --template=vite-typescript

```

### install react, react-router-dom

```bash
npm i react react-dom
npm i -D @types/react @types/react-dom
npm i react-router-dom
```

## install markdown

```bash
npm i react-markdown
npm i rehype-highlight
npm i highlight.js
```

```js
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

return <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{markdown}</ReactMarkdown>;
```
