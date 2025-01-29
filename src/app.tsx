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
        <br />
        <Link to="/excelset">ExcelSet</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Count />} />
        <Route path="/markdown" element={<Markdown />} />
        <Route path="/sqlite" element={<Sqlite />} />
        <Route path="/exceloutput" element={<ExcelOutput />} />
        <Route path="/excelset" element={<ExcelSet />} />
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
    workbook: ExcelJS.Workbook,
    format: "xlsx" | "csv"
  ) => {
    e.preventDefault();

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

  const workbook = new ExcelJS.Workbook();
  workbook.addWorksheet("sheet1");
  const worksheet = workbook.getWorksheet("sheet1");

  worksheet.columns = [
    { header: "ID", key: "id", width: 7 },
    { header: "作成日時", key: "createdAt", width: 17 },
    { header: "名前", key: "name", width: 10 }
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

  // すべての行を走査
  worksheet.eachRow((row, rowNumber) => {
    // すべてのセルを走査
    row.eachCell((cell, colNumber) => {
      // セルの枠線を設定
      cell.border = {
        top: { style: 'thin', color: { argb: '000000' } },
        left: { style: 'thin', color: { argb: '000000' } },
        bottom: { style: 'thin', color: { argb: '000000' } },
        right: { style: 'thin', color: { argb: '000000' } },
      };
    });
    // 行の設定を適用
    row.commit();
  });

  return (
    <>
      <header>
        <h1>データ出力</h1>
      </header>
      <>
        <button onClick={(e) => handlerClickDownloadButton(e, workbook, "xlsx")}>
          Excel形式
        </button>
        <button onClick={(e) => handlerClickDownloadButton(e, workbook, "csv")}>
          CSV形式
        </button>
      </>
    </>
  );
}
  
// インターフェース
interface IData {
  title: string;
  date: string;
  time: string;
  userName: string;
};
// 初期データ
const initialData: IData = {
  title: '',
  date: '',
  time: '',
  userName: '',
};

function ExcelSet() {
  const handlerClickDownloadButton = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    const workbook = new ExcelJS.Workbook();
    workbook.addWorksheet("sheet1");
    const worksheet = workbook.getWorksheet("sheet1");

    // セル位置指定
    const cellTitle = worksheet.getCell("A2");
    const cellDateTime = worksheet.getCell("B3");
    const cellUserName = worksheet.getCell("C4");

    // セル値上書き
    cellTitle.value = data.title;
    cellDateTime.value = data.date + " " + data.time;
    cellUserName.value = data.userName;

    // セル枠線
    cellTitle.border = {
      top: {style: "thin", color: {argb: "000000"}},
      right: {style: "thin", color: {argb: "000000"}},
      bottom: {style: "thin", color: {argb: "000000"}},
      left: {style: "thin", color: {argb: "000000"}},
    };
    cellDateTime.border = {
      top: {style: "thin", color: {argb: "000000"}},
      right: {style: "thin", color: {argb: "000000"}},
      bottom: {style: "thin", color: {argb: "000000"}},
      left: {style: "thin", color: {argb: "000000"}},
    };
    cellUserName.border = {
      top: {style: "thin", color: {argb: "000000"}},
      right: {style: "thin", color: {argb: "000000"}},
      bottom: {style: "thin", color: {argb: "000000"}},
      left: {style: "thin", color: {argb: "000000"}},
    };

    const uint8Array = await workbook.xlsx.writeBuffer();
    const blob = new Blob([uint8Array], { type: "application/octet-binary" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "setData.xlsx";
    a.click();
    a.remove();
  };
  
  // データ
  const [data, setData] = useState<IData>(initialData);
  
  // onChange で取得
  const onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setData({ ...data, title: value });
  }
  const onChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setData({ ...data, date: value });
  }
  const onChangeTime = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setData({ ...data, time: value });
  }
  const onChangeUserName = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setData({ ...data, userName: value });
  }

  return (
    <>
      <header>
        <h1>データ出力</h1>
      </header>
      <>
        <div><label>工事名：<input type="text" name="title" value={data.title} onChange={onChangeTitle} /></label></div>
        <div><label>日時：<input type="date" name="date" value={data.date} onChange={onChangeDate} />
          <input type="time" name="time" value={data.time} onChange={onChangeTime} /></label></div>
        <div><label>名前：<input type="text" name="userName" value={data.userName} onChange={onChangeUserName} /></label></div>
        <button onClick={(e) => handlerClickDownloadButton(e)}>
          Excel出力
        </button>
      </>
    </>
  );
}
