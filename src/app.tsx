import { use, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github.css";

const root = createRoot(document.body);
root.render(<App />);

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <br />
        <Link to="/about">About</Link>
        <br />
        <Link to="/markdown">Markdown</Link>
        <br />
        <Link to="/sqlite">SQLite</Link>
        <br />
        <Link to="/savePdf">savePdf</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Count />} />
        <Route path="/markdown" element={<Markdown />} />
        <Route path="/sqlite" element={<Sqlite />} />
        <Route path="/savePdf" element={<SavePdf />} />
      </Routes>
    </Router>
  );
}

function Home() {
  return <h1>Home</h1>;
}

function Count() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount((c) => c + 1)}>Increment</button>
      <br />
      <button onClick={() => setCount((c) => c - 1)}>Decrement</button>
    </>
  );
}

function Markdown() {
  const markdown = `
  ## Hello This is a markdown component
  there are **bold** and *italic* text
  - List item 1
  - List item 2
  \`\`\`javascript
  console.log('Hello World');
  function test() {
    return 'test';
  }
  \`\`\`
  $E = mc^2$
  `;

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeHighlight, rehypeKatex]}>
      {markdown}
    </ReactMarkdown>
  );
}

function SavePdf() {
  const handleGeneratePdf = async() => {
    await window.api.savePdf();
  }
  const fraction = `
  1-2. 現状地盤
  ||第１層(表層地盤)|第２層(改良深さの地盤)|
  |:-|:------------|:-------------------|
  |土質名|ローム|粘土|
  |平均N値|$N_1= 3.0$|$N_2= 3.0$|
  |粘着力|$c_1= 10.0$ $kN/m^2$|$c_2= 15.0$ $kN/m^2$|
  |内部摩擦角|$\\phi_1= 0$ $^\\circ $|$\\phi_2= 15.0$ $^\\circ$|
  |単位体積重量|$\\text{γ}_{t1}= 14.0$ $kN/m^3$|$\\text{γ}_{t2} = 16.0$ $kN/m^3$|
  |層厚*1|$D_1= 1.58$ $m$|
  |水位*1($W_L$)| $GL$-  $3.80 m$||  

  2-2. 地盤の支持力度  
    地盤支持力式
      $q_a = \\frac{2}{3}(α\\cdot c\\cdot N_c + β\\cdot B\\cdot N_\\text{γ} + \\text{γ}_2\\cdot D_f\\cdot N_q)$  
    支持力係数  
      $N_c=(N_q-1)\\cdot \\cot\\varPhi$  (2.2)  
      $N_γ=(N_q-1)\\cdot \\tan(1.4\\varPhi)$  (2.3)  
      $N_q=\\tan^2(\\frac{π}{4} + \\frac{\\varPhi}{2})e^{π\\tan\\varPhi}$ (2.4)  
      敷鉄板下部での荷重作用幅$B'=B/η=2.11m$

  `;
  return (
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]} 
        >
      {fraction}
      </ReactMarkdown>
      <button onClick={handleGeneratePdf}>PDFを生成</button>
  </div>
  )
}

function Sqlite() {
  const [data, setData] = useState([]);
  const handleClick = async () => {
    const dbData = await window.api.getData();
    setData(dbData);
  };

  return (
    <>
      <h1>SQLite</h1>
      <button onClick={handleClick}>Get Data</button>
      <ul>
        {data.map((row) => (
          <li key={row.id}>
            {row.id} - {row.name}
          </li>
        ))}
      </ul>
    </>
  );
}
