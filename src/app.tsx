import { use, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import "highlight.js/styles/github.css";
import ExcelJS from "exceljs";

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
        <Link to="/exceloutput">ExcelOutput</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Count />} />
        <Route path="/markdown" element={<Markdown />} />
        <Route path="/sqlite" element={<Sqlite />} />
        <Route path="/exceloutput" element={<ExcelOutput />} />
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
    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeHighlight, rehypeKatex]}>
      {markdown}
    </ReactMarkdown>
  );
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

function ExcelOutput() {
  const handlerClickDownloadButton = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    format: "xlsx" | "csv"
  ) => {
    e.preventDefault();

    const workbook = new ExcelJS.Workbook();
    workbook.addWorksheet("sheet1");
    const worksheet = workbook.getWorksheet("sheet1");

    worksheet.columns = [
      { header: "ID", key: "id" },
      { header: "作成日時", key: "createdAt" },
      { header: "名前", key: "name" }
    ];

    worksheet.addRows([
      {
        id: "f001",
        createdAt: 1629902208,
        name: "りんご"
      },
      {
        id: "f002",
        createdAt: 1629902245,
        name: "ぶとう"
      },
      {
        id: "f003",
        createdAt: 1629902265,
        name: "ばなな"
      }
    ]);

    const uint8Array =
      format === "xlsx"
        ? await workbook.xlsx.writeBuffer() //xlsxの場合
        : await workbook.csv.writeBuffer(); //csvの場合
    const blob = new Blob([uint8Array], { type: "application/octet-binary" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sampleData." + format; //フォーマットによってファイル拡張子を変えている
    a.click();
    a.remove();
  };
  return (
    <>
      <header>
        <h1>データ出力</h1>
      </header>
      <>
        <button onClick={(e) => handlerClickDownloadButton(e, "xlsx")}>
          Excel形式
        </button>
        <button onClick={(e) => handlerClickDownloadButton(e, "csv")}>
          CSV形式
        </button>
      </>
    </>
  );
}
