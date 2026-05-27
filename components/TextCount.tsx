'use client';

import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface CountResult {
  total: number;
  english: number;
  chinese: number;
  digits: number;
  whitespace: number;
  otherSymbols: number;
  symbol: number;
  englishWords: number;
  lines: number;
  paragraphs: number;
  bytes: number;
  uniqueChars: number;
  nonWhitespace: number;
}

const STORAGE_KEY = 'textCount.input.v1';
const SAMPLE_TEXT = `Hello World! 你好，世界！\n\n示例文本包含：English words、数字 12345、符号 @#￥% 😊。`;
const FAQ_ITEMS = [
  {
    question: '统计规则是什么？',
    answer:
      '英文仅统计 A–Z / a–z；中文仅统计汉字（Unicode Han）；其余字符（含数字、空白、标点、emoji）均计入符号。',
  },
  {
    question: '为什么数字和空白也算符号？',
    answer:
      '为了保证“英文/中文不含符号”的需求，数字、空白与标点统一归为符号，便于整体统计与比对。',
  },
  {
    question: '文本会上传到服务器吗？',
    answer:
      '不会。所有统计都在浏览器本地完成，输入内容仅保存在本地存储。',
  },
  {
    question: '如何导出统计结果？',
    answer: '点击“复制统计结果”即可将概要复制到剪贴板。',
  },
];

const isEnglishLetter = (char: string) => /[A-Za-z]/.test(char);
const isChineseHan = (char: string) => /\p{Script=Han}/u.test(char);
const isDigit = (char: string) => /\d/.test(char);
const isWhitespace = (char: string) => /\s/.test(char);

const buildCounts = (text: string): CountResult => {
  let total = 0;
  let english = 0;
  let chinese = 0;
  let digits = 0;
  let whitespace = 0;
  let otherSymbols = 0;
  const unique = new Set<string>();

  for (const char of text) {
    total += 1;
    unique.add(char);
    if (isEnglishLetter(char)) {
      english += 1;
      continue;
    }
    if (isChineseHan(char)) {
      chinese += 1;
      continue;
    }
    if (isDigit(char)) {
      digits += 1;
      continue;
    }
    if (isWhitespace(char)) {
      whitespace += 1;
      continue;
    }
    otherSymbols += 1;
  }

  const symbol = digits + whitespace + otherSymbols;
  const nonWhitespace = total - whitespace;
  const englishWords = text.match(/[A-Za-z]+/g)?.length ?? 0;
  const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
  const paragraphs = text.trim() ? text.trim().split(/\n\s*\n/).length : 0;
  const bytes =
    typeof TextEncoder !== 'undefined'
      ? new TextEncoder().encode(text).length
      : total;

  return {
    total,
    english,
    chinese,
    digits,
    whitespace,
    otherSymbols,
    symbol,
    englishWords,
    lines,
    paragraphs,
    bytes,
    uniqueChars: unique.size,
    nonWhitespace,
  };
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat('zh-CN').format(value);

const StatCard = ({
  title,
  value,
  accent,
  description,
}: {
  title: string;
  value: number;
  accent?: string;
  description?: string;
}) => {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-sm">
      <div className="text-sm text-slate-400">{title}</div>
      <div className={`mt-2 text-3xl font-semibold ${accent ?? ''}`}>
        {formatNumber(value)}
      </div>
      {description ? (
        <div className="mt-1 text-xs text-slate-500">{description}</div>
      ) : null}
    </div>
  );
};

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-slate-100">
        {typeof value === 'number' ? formatNumber(value) : value}
      </span>
    </div>
  );
};

const ProgressRow = ({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) => {
  const percentage = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span>
          {formatNumber(value)} · {percentage}%
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-800">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const TextCount = () => {
  const [text, setText] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const deferredText = useDeferredValue(text);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        setText(saved);
      }
    } catch (error) {
      console.warn('Unable to read localStorage', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, text);
    } catch (error) {
      console.warn('Unable to write localStorage', error);
    }
  }, [text]);

  useEffect(() => {
    if (!status) return;
    const timer = window.setTimeout(() => setStatus(null), 2200);
    return () => window.clearTimeout(timer);
  }, [status]);

  const counts = useMemo(() => buildCounts(deferredText), [deferredText]);

  const summaryText = useMemo(() => {
    return [
      `总字符：${counts.total}`,
      `英文：${counts.english}`,
      `中文：${counts.chinese}`,
      `符号：${counts.symbol}`,
      `数字：${counts.digits}`,
      `空白：${counts.whitespace}`,
      `其他符号：${counts.otherSymbols}`,
      `英文单词：${counts.englishWords}`,
      `行数：${counts.lines}`,
      `段落数：${counts.paragraphs}`,
      `UTF-8 字节：${counts.bytes}`,
    ].join('\n');
  }, [counts]);

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setStatus('统计结果已复制到剪贴板');
    } catch (error) {
      console.error(error);
      setStatus('复制失败，请检查浏览器权限');
    }
  };

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      if (!clipText) {
        setStatus('剪贴板为空');
        return;
      }
      setText((prev) => (prev ? `${prev}\n${clipText}` : clipText));
      setStatus('已粘贴剪贴板内容');
    } catch (error) {
      console.error(error);
      setStatus('无法读取剪贴板');
    }
  };

  const handleSample = () => {
    setText(SAMPLE_TEXT);
    setStatus('已填充示例文本');
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-blue-300">字符统计工具</h1>
            <p className="mt-2 text-sm text-slate-400">
              实时统计中文、英文、符号、数字与空白，并给出结构化信息
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCopySummary}
              className="rounded-md border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-blue-500/60 hover:text-blue-200"
            >
              复制统计结果
            </button>
            <button
              type="button"
              onClick={handleSample}
              className="rounded-md bg-blue-500/90 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
            >
              试用示例文本
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[2.1fr_1fr]">
          <section className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">输入文本</h2>
                <p className="text-xs text-slate-500">
                  内容仅在本地浏览器处理，自动保存输入进度
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handlePaste}
                  className="rounded-md border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-500"
                >
                  粘贴
                </button>
                <button
                  type="button"
                  onClick={() => setText('')}
                  disabled={!text}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    text
                      ? 'bg-slate-700 text-slate-100 hover:bg-slate-600'
                      : 'cursor-not-allowed bg-slate-800 text-slate-500'
                  }`}
                >
                  清空
                </button>
              </div>
            </div>

            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="在这里输入或粘贴文本..."
              className="min-h-[360px] w-full resize-y rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm leading-relaxed text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span>
                已输入 <span className="font-semibold text-slate-200">{formatNumber(counts.total)}</span>{' '}
                个字符
              </span>
              <span>{text !== deferredText ? '统计更新中…' : '统计已更新'}</span>
            </div>
            {status ? (
              <div className="rounded-md border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs text-blue-200">
                {status}
              </div>
            ) : null}
          </section>

          <section className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard title="总字符" value={counts.total} accent="text-blue-300" />
              <StatCard title="英文" value={counts.english} accent="text-emerald-300" />
              <StatCard title="中文" value={counts.chinese} accent="text-amber-300" />
              <StatCard
                title="符号"
                value={counts.symbol}
                accent="text-rose-300"
                description="含数字、空白与其他符号"
              />
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <h3 className="text-sm font-semibold text-slate-200">字符占比</h3>
              <div className="mt-3 space-y-3">
                <ProgressRow
                  label="英文"
                  value={counts.english}
                  total={counts.total}
                  color="bg-emerald-400"
                />
                <ProgressRow
                  label="中文"
                  value={counts.chinese}
                  total={counts.total}
                  color="bg-amber-400"
                />
                <ProgressRow
                  label="符号"
                  value={counts.symbol}
                  total={counts.total}
                  color="bg-rose-400"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-base font-semibold text-slate-200">细分统计</h3>
            <div className="mt-4 space-y-3">
              <DetailRow label="数字" value={counts.digits} />
              <DetailRow label="空白字符" value={counts.whitespace} />
              <DetailRow label="其他符号" value={counts.otherSymbols} />
              <DetailRow label="去除空白后字符" value={counts.nonWhitespace} />
              <DetailRow label="唯一字符数" value={counts.uniqueChars} />
              <DetailRow label="UTF-8 字节" value={counts.bytes} />
            </div>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
            <h3 className="text-base font-semibold text-slate-200">文本结构</h3>
            <div className="mt-4 space-y-3">
              <DetailRow label="英文单词" value={counts.englishWords} />
              <DetailRow label="行数" value={counts.lines} />
              <DetailRow label="段落数" value={counts.paragraphs} />
              <DetailRow label="平均每行字符" value={counts.lines ? Math.round(counts.total / counts.lines) : 0} />
            </div>
          </section>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-sm text-slate-400">
            <h3 className="text-base font-semibold text-slate-200">统计规则</h3>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>英文：仅统计 A–Z / a–z。</li>
              <li>中文：仅统计汉字（Unicode Han）。</li>
              <li>数字与空白会计入“符号”统计。</li>
              <li>符号包含标点、特殊字符、emoji 等非英文/中文字符。</li>
              <li>所有统计都在本地完成，不会上传文本内容。</li>
            </ul>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-sm text-slate-400">
            <h3 className="text-base font-semibold text-slate-200">常见问题</h3>
            <Accordion type="single" collapsible className="mt-2">
              {FAQ_ITEMS.map((item) => (
                <AccordionItem key={item.question} value={item.question}>
                  <AccordionTrigger className="text-left text-slate-200">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-400">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>
      </main>
    </div>
  );
};
