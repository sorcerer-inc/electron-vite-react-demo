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

```bash
npm i remark-math rehype-katex

import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'

remarkPlugins={[remarkMath]} rehypePlugins={[rehypeHighlight, rehypeKatex]}
```

## sqlite

```bash
npm i better-sqlite3
npm i -D @types/better-sqlite3
```

```ts
const dbPath = path.resolve(__dirname, "../../db/test.db");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

function getData() {
  const rows = db.prepare("SELECT * FROM test").all();
  return rows;
}

ipcMain.handle("getData", async () => {
  return getData();
});
```

## IPC 通信

セキュリティのため、main process と renderer process が直接通信しない。
だから、IPC 経由で通信する。

やり方:

1.  main.ts

```ts
ipcMain.handle("getData", async () => {
  return getData();
});
```

2. preload.ts

```ts
contextBridge.exposeInMainWorld("api", {
  getData: async () => ipcRenderer.invoke("getData"),
});
```

3. renderer process: react compoent

```tsx
const dbData = await window.api.getData();
```
