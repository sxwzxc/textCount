'use client';

import React, { useMemo, useState } from 'react';

interface CountResult {
  total: number;
  english: number;
  chinese: number;
  symbol: number;
}

const isEnglishLetter = (char: string) => /[A-Za-z]/.test(char);
const isChineseHan = (char: string) => /\p{Script=Han}/u.test(char);

const buildCounts = (text: string): CountResult => {
  let total = 0;
  let english = 0;
  let chinese = 0;
  let symbol = 0;

  for (const char of text) {
    total += 1;
    if (isEnglishLetter(char)) {
      english += 1;
      continue;
    }
    if (isChineseHan(char)) {
      chinese += 1;
      continue;
    }
    symbol += 1;
  }

  return { total, english, chinese, symbol };
};

const StatCard = ({
  title,
  value,
  accent,
}: {
  title: string;
  value: number;
  accent?: string;
}) => {
  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
      <div className="text-sm text-gray-400">{title}</div>
      <div className={`mt-2 text-3xl font-semibold ${accent ?? ''}`}>
        {value}
      </div>
    </div>
  );
};

export const TextCount = () => {
  const [text, setText] = useState('');

  const counts = useMemo(() => buildCounts(text), [text]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-gray-100">
      <header className="border-b border-gray-700 p-6 text-center">
        <h1 className="text-3xl font-bold text-blue-400">字符统计</h1>
        <p className="mt-2 text-sm text-gray-400">
          输入文本，实时统计英文、中文与符号数量
        </p>
      </header>

      <main className="flex-1 p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">输入文本</h2>
              <button
                type="button"
                onClick={() => setText('')}
                disabled={!text}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  text
                    ? 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                    : 'cursor-not-allowed bg-gray-800 text-gray-500'
                }`}
              >
                清空
              </button>
            </div>
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="在这里输入或粘贴文本..."
              className="min-h-[320px] w-full resize-y rounded-lg border border-gray-700 bg-gray-800 p-4 text-sm leading-relaxed text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <div className="text-sm text-gray-400">
              已输入 <span className="font-medium text-gray-200">{counts.total}</span>{' '}
              个字符
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">统计结果</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <StatCard title="总字符" value={counts.total} accent="text-blue-400" />
              <StatCard title="英文" value={counts.english} accent="text-emerald-400" />
              <StatCard title="中文" value={counts.chinese} accent="text-amber-400" />
              <StatCard title="符号" value={counts.symbol} accent="text-rose-400" />
            </div>

            <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 text-sm text-gray-300">
              <h3 className="text-sm font-semibold text-gray-200">统计规则</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-gray-400">
                <li>英文：仅统计 A–Z / a–z。</li>
                <li>中文：仅统计汉字（Unicode Han）。</li>
                <li>
                  符号：除英文与中文外的所有字符（含数字、空白、标点、特殊字符与
                  emoji）。
                </li>
                <li>总字符：等于 英文 + 中文 + 符号。</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
