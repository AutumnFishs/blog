# 前端

## 业务

1. 如何实现预览 PDF 文件

- 浏览器自带的 PDF 预览
  实现思路:在页面嵌入 iframe 标签，src 指向 pdf 文件地址  
   弊端：因为是直接通过文件链接打开的，所以文件下载不可控，用户可以随意下载
  有些浏览器插件不支持
  ::: info
  ```HTML
  <iframe src="url" frameborder="0"></iframe>
  ```
  :::
- 使用第三方插件 pdfjs-dist
  实现思路：是将 pdf 文件转成 canvas，然后渲染到页面上
  使用起来相对麻烦些，但是可以控制 pdf 的各种操作，比如下载、缩放、旋转、翻页等
  实现的时候需要考虑的一个问题，就是 pdf 文件过大，canvas 渲染的时候会卡顿，需要做分页处理,或者监听元素是否进入可视区域，再进行渲染
  ::: info

  ```tsx
  import * as pdfjsLib from "pdfjs-dist";
  import { memo, useEffect, useRef, useState } from "react";
  import pdfFile from "../assets/炭黑尾气用于精煤干燥新技术的探讨与应用_庞秀英.pdf";

  const loadAllPages = async (pdfDoc: pdfjsLib.PDFDocumentProxy) => {
    const pages = [];

    // 获取文档中的总页数
    const numPages = pdfDoc.numPages;

    // 遍历文档中的每一页
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      pages.push(page);
    }
    return pages;
  };

  const Page = memo(
    ({
      page,
      boxSize,
    }: {
      page: pdfjsLib.PDFPageProxy;
      boxSize: { width: number; height: number };
    }) => {
      const pageRef = useRef<HTMLDivElement>(null);
      if (page) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (pageRef.current) {
          pageRef.current.innerHTML = "";
          pageRef.current.appendChild(canvas);
        }
        const viewport = page.getViewport({ scale: 1 });
        const scale = boxSize.width / viewport.width;
        if (canvas && context && viewport) {
          canvas.width = Math.floor(viewport.width) * scale;
          canvas.height = Math.floor(viewport.height) * scale;
          canvas.style.width = Math.floor(viewport.width) * scale + "px"; // 设置canvas的宽度
          canvas.style.height = Math.floor(viewport.height) * scale + "px"; // 设置canvas的高度
          page.render({
            canvasContext: context,
            viewport: page.getViewport({ scale }),
          });
        }
      }
      return <div id="page" ref={pageRef}></div>;
    }
  );
  const PdfPreview = () => {
    useEffect(() => {
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://unpkg.com/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs";
      pdfjsLib.getDocument(pdfFile).promise.then(async (pdfDoc) => {
        const pages = await loadAllPages(pdfDoc);
        setPages(pages);
      });
    }, []);

    const [pages, setPages] = useState<pdfjsLib.PDFPageProxy[]>([]);
    // 获取容器
    const containerRef = useRef<HTMLDivElement>(null);

    const [boxSize, setBoxSize] = useState({ width: 0, height: 0 });
    // 监听页面尺寸变化，重新渲染pdf
    useEffect(() => {
      const resizeObserver = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.target.id === "pdfContainer") {
            setBoxSize({
              width: entry.contentRect.width,
              height: entry.contentRect.height,
            });
          }
        });
      });
      if (containerRef.current) resizeObserver.observe(containerRef.current);
    }, []);
    return (
      <div id="pdfContainer" ref={containerRef}>
        {pages.length
          ? pages.map((page, index) => {
              return <Page key={index} page={page} boxSize={boxSize} />;
            })
          : "正在加载"}
      </div>
    );
  };

  export default PdfPreview;
  ```

  :::
  ::: info 效果
  <iframe src="https://autumnfishs.github.io/react-comp/"  style="width: 100%;height: 400px"></iframe>
  :::
