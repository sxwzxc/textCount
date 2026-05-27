# 字符统计工具

这是一个轻量级的字符统计页面，所有计算都在浏览器本地完成，用于快速获取文本长度与结构信息。

## 功能亮点

- 实时统计：总字符、英文、中文、符号
- 细分统计：数字、空白、其他符号、唯一字符数
- 结构统计：英文单词、行数、段落数
- UTF-8 字节估算
- 本地自动保存 + 一键复制统计结果

## 入门

运行开发服务器：

```bash
npm run dev
# 或者
yarn dev
# 或者
pnpm dev
# 或者
bun dev
```

用浏览器打开 [http://localhost:3000](http://localhost:3000) 查看结果。

您可以通过修改 `app/page.tsx` 开始编辑页面。编辑文件时，页面会自动更新。

该项目使用 [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) 自动优化和加载 Inter，这是一种自定义的 Google 字体。

## 统计规则

- 英文：仅统计 A–Z / a–z
- 中文：仅统计汉字（Unicode Han）
- 符号：除英文与中文外的所有字符（含数字、空白、标点、emoji 等）

## 了解更多

- [Next.js 文档](https://nextjs.org/docs) - 了解 Next.js 的功能和 API。
- [学习 Next.js](https://nextjs.org/learn) - 一个互动的 Next.js 教程。
