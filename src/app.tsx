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
import ExcelJS from "exceljs";

const root = createRoot(document.body);
root.render(<App />);

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link>
        <br/>
        <Link to="/about">About</Link>
        <br/>
        <Link to="/markdown">Markdown</Link>
        <br/>
        <Link to="/sqlite">SQLite</Link>
        <br/>
        <Link to="/savePdf">savePdf</Link>
        <br/>
        <Link to="/exceloutput">ExcelOutput</Link>
        <br/>
        <Link to="/excelset">ExcelSet</Link>
        <br/>
        <Link to="/exceledit">ExcelEdit</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<Count />} />
        <Route path="/markdown" element={<Markdown />} />
        <Route path="/sqlite" element={<Sqlite />} />
        <Route path="/savePdf" element={<SavePdf />} />
        <Route path="/exceloutput" element={<ExcelOutput />} />
        <Route path="/excelset" element={<ExcelSet />} />
        <Route path="/exceledit" element={<ExcelEdit />} />
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
    { id: "f001", createdAt: 1629902208, name: "りんご" },
    { id: "f002", createdAt: 1629902245, name: "ぶとう" },
    { id: "f003", createdAt: 1629902265, name: "ばなな" }
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

function ExcelEdit() {
  const handlerOnClick = async (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    console.log("ExcelEdit. onClick", {data});

    let workbook = new ExcelJS.Workbook();
    let worksheet = workbook.worksheets[0];
    try {
      // テンプレート読み込み
      console.log("ExcelEdit. readTemplateBuffer");
      await workbook.xlsx.load(await window.api.readTemplateBuffer());

      // シート指定
      if (workbook.worksheets.length == 0) {
        throw new Error("ExcelEdit. テンプレートExcelにシートが見つかりません");
      }
      worksheet = workbook.worksheets[0]; // 1シート目
      console.log("ExcelEdit. getWorksheet", worksheet.name);

      console.log("ExcelEdit. editing...");
      // セル位置指定
      const cellTitle = worksheet.getCell("B4");
      const cellDate = worksheet.getCell("H4");
      const cellUserName = worksheet.getCell("H5");

      // セル値上書き
      cellTitle.value = data.title;
      cellDate.value = data.date;
      cellUserName.value = data.userName;
    } catch (error) {
      console.log("ExcelEdit. error:", error);
      return;
    }

    // ダウンロード出力
    const uint8Array = await workbook.xlsx.writeBuffer();
    const blob = new Blob([uint8Array], { type: "application/octet-binary" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "csm議事録.xlsx";
    a.click();
    a.remove();
  };

  // インターフェース
  interface IData {
    title: string;
    date: string;
    userName: string;
  };

  // 初期データ
  const initialData: IData = {
    title: '',
    date: '',
    userName: '',
  };

  const [data, setData] = useState<IData>(initialData);

  const handlerOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    switch (name) {
      case "title":
        setData({ ...data, title: value });
        break;
      case "date":
        setData({ ...data, date: value });
        break;
      case "userName":
        setData({ ...data, userName: value });
        break;
    }
  };

  return (
      <>
        <header>
          <h1>データ出力</h1>
        </header>
        <>
          <div>
            <label>工事名：<input type="text" name="title" value={data.title} onChange={handlerOnChange} /></label>
          </div>
          <div>
            <label>日時：<input type="date" name="date" value={data.date} onChange={handlerOnChange} /></label>
          </div>
          <div>
            <label>名前：<input type="text" name="userName" value={data.userName} onChange={handlerOnChange} /></label>
          </div>
          <div>
            <button onClick={(e) => handlerOnClick(e)}>Excel出力</button>
          </div>
        </>
      </>
  );
}
