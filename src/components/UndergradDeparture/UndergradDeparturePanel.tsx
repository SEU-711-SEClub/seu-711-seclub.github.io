import React, { useMemo } from 'react';
import { BookOpenCheck, Building2, FileCheck, GraduationCap, Home } from 'lucide-react';
import MarkdownRenderer from '../MarkdownRenderer';
import { useMarkdownContent } from '../../hooks/useContent';

const GUIDE_FILE_PATH = 'undergrad/departure/guide.md';

const quickFacts = [
  {
    title: '系统入口',
    detail: '网上办事大厅 -> 学生离校 -> 本科生组，红色通常代表未完成，绿色代表已办结。',
    icon: Building2,
  },
  {
    title: '资格前置',
    detail: '先完成毕设答辩与档案袋归档，等待学院统一开通离校资格。',
    icon: FileCheck,
  },
  {
    title: '优先事项',
    detail: '组织关系和就业信息审核通常较慢，建议尽早处理，不要拖到最后。',
    icon: BookOpenCheck,
  },
  {
    title: '离宿收尾',
    detail: '宿舍退宿、水电结清、系统盖章都要确认完成，退宿后通常 3 天内搬离。',
    icon: Home,
  },
];

const stripFrontmatter = (content: string) =>
  content.replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*/, '').trim();

const UndergradDeparturePanel = () => {
  const { content, loading, error } = useMarkdownContent(GUIDE_FILE_PATH);

  const guideBody = useMemo(() => stripFrontmatter(content), [content]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary-500" />
          <p className="text-body text-neutral-600">加载离校指南中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-background-surface p-8 text-center shadow-sm">
        <p className="mb-4 text-body text-semantic-error">加载失败：{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-primary-500 px-6 py-3 text-white transition-colors hover:bg-primary-600"
        >
          重试
        </button>
      </div>
    );
  }

  if (!guideBody) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-background-surface p-8 text-center shadow-sm">
        <p className="text-body text-neutral-600">暂未整理离校指南内容。</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-neutral-200 bg-background-surface p-8 shadow-sm">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="min-w-0 flex-1">
            <p className="inline-flex items-center rounded-full bg-accent-50 px-4 py-2 text-caption font-semibold text-accent-dark">
              <GraduationCap size={14} className="mr-2" />
              毕业季 · 离校指南
            </p>
            <h2 className="mt-4 text-h2 font-bold text-primary-900">本科毕业离校指南</h2>
            <p className="mt-3 max-w-3xl text-body text-neutral-700 leading-relaxed">
              按本科生流程整理办事大厅入口、离校资格、学校行政手续、院办收尾、双证领取与档案转递，方便按环节逐项核对。
            </p>
            <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-small font-semibold text-amber-900">说明</p>
              <p className="mt-1 text-small leading-relaxed text-amber-800">
                以下内容均基于 2025 年时间线整理，具体安排、开放时间、材料要求与审核口径等待后续通知，并以后续学院、辅导员、教务老师和学校系统通知为准。
              </p>
            </div>
          </div>

          <div className="grid w-full grid-cols-1 gap-4 lg:w-96">
            {quickFacts.map(item => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-lg border border-neutral-200 bg-neutral-50 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-lg bg-primary-50 p-2 text-primary-700">
                      <Icon size={18} />
                    </div>
                    <div>
                      <p className="text-body font-semibold text-primary-900">{item.title}</p>
                      <p className="mt-1 text-small leading-relaxed text-neutral-700">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <article className="rounded-xl border border-neutral-200 bg-background-surface p-8 shadow-sm">
        <MarkdownRenderer content={guideBody} />
      </article>
    </div>
  );
};

export default UndergradDeparturePanel;
