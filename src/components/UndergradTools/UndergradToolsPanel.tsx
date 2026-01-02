import React, { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useUndergradTools, type UndergradToolCategory } from '../../hooks/useUndergradTools';
import {
  buildCourseTagOptions,
  buildPlatformOptions,
  buildPricingTagOptions,
  toolMatchesFilters,
  type UndergradToolFilters,
} from '../../lib/undergradTools';
import ToolCard from './ToolCard';
import ToolsFilters from './ToolsFilters';

type Props = {
  enabled?: boolean;
};

const renderInlineLinks = (text: string) => {
  const nodes: React.ReactNode[] = [];
  const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null = null;

  while ((match = markdownLinkRegex.exec(text)) !== null) {
    const [full, label, url] = match;
    const start = match.index;

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    nodes.push(
      <a
        key={`${url}-${start}`}
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-primary-600 hover:text-primary-700 underline underline-offset-2 font-semibold"
      >
        {label}
      </a>
    );

    lastIndex = start + full.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : text;
};

const UndergradToolsPanel = ({ enabled = true }: Props) => {
  const { data, loading, error } = useUndergradTools(enabled);
  const [query, setQuery] = useState('');
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('all');
  const [selectedCourseTags, setSelectedCourseTags] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedPricingTags, setSelectedPricingTags] = useState<string[]>([]);
  const [aiOnly, setAiOnly] = useState(false);
  const [expandedToolIds, setExpandedToolIds] = useState<Set<string>>(new Set());

  const categories = data?.categories || [];

  const totalToolCount = useMemo(
    () => categories.reduce((sum, cat) => sum + (cat.tools?.length || 0), 0),
    [categories]
  );

  const courseTagOptions = useMemo(() => buildCourseTagOptions(categories), [categories]);
  const platformOptions = useMemo(() => buildPlatformOptions(categories), [categories]);
  const pricingTagOptions = useMemo(() => buildPricingTagOptions(categories), [categories]);

  const filters: UndergradToolFilters = useMemo(
    () => ({
      query,
      aiOnly,
      courseTags: selectedCourseTags,
      platforms: selectedPlatforms,
      pricingTags: selectedPricingTags,
    }),
    [query, aiOnly, selectedCourseTags, selectedPlatforms, selectedPricingTags]
  );

  const filteredCategories = useMemo(() => {
    const base = categories.filter(cat => selectedCategoryKey === 'all' || cat.key === selectedCategoryKey);
    return base
      .map(cat => ({
        ...cat,
        tools: (cat.tools || []).filter(tool => toolMatchesFilters(tool, filters)),
      }))
      .filter(cat => cat.tools.length > 0);
  }, [
    categories,
    selectedCategoryKey,
    filters,
  ]);

  const filteredToolCount = useMemo(
    () => filteredCategories.reduce((sum, cat) => sum + cat.tools.length, 0),
    [filteredCategories]
  );

  const toggleCourseTag = (tag: string) => {
    setSelectedCourseTags(prev =>
      prev.includes(tag) ? prev.filter(item => item !== tag) : [...prev, tag]
    );
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform) ? prev.filter(item => item !== platform) : [...prev, platform]
    );
  };

  const togglePricingTag = (tag: string) => {
    setSelectedPricingTags(prev =>
      prev.includes(tag) ? prev.filter(item => item !== tag) : [...prev, tag]
    );
  };

  const resetFilters = () => {
    setQuery('');
    setSelectedCategoryKey('all');
    setSelectedCourseTags([]);
    setSelectedPlatforms([]);
    setSelectedPricingTags([]);
    setAiOnly(false);
  };

  const toggleExpanded = (toolId: string) => {
    setExpandedToolIds(prev => {
      const next = new Set(prev);
      if (next.has(toolId)) next.delete(toolId);
      else next.add(toolId);
      return next;
    });
  };

  if (!enabled) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-body text-neutral-600">加载工具库...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-background-surface p-8 text-center shadow-sm">
        <p className="text-body text-semantic-error mb-4">加载失败：{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
        >
          重试
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-background-surface p-8 text-center shadow-sm">
        <p className="text-body text-neutral-600">暂无工具数据。</p>
      </div>
    );
  }

  const renderCategoryHeader = (category: UndergradToolCategory) => (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h3 className="text-h2 font-bold text-primary-900">{category.name}</h3>
        {category.description && (
          <p className="mt-1 text-body text-neutral-700 max-w-3xl">{category.description}</p>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {(category.courseTags || []).map(tag => (
          <span
            key={`${category.key}-${tag}`}
            className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-caption font-semibold text-primary-700"
          >
            {tag}
          </span>
        ))}
        <span className="text-caption text-neutral-500">{category.tools.length} 个工具</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-neutral-200 bg-background-surface p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            <p className="inline-flex items-center rounded-full bg-accent-50 px-4 py-2 text-caption text-accent-dark font-semibold">
              <Sparkles size={14} className="mr-2" />
              AI 赋能 · 提效工具库
            </p>
            <h2 className="text-h2 font-bold text-primary-900 mt-4">本科课程提效工具库</h2>
            <p className="text-body text-neutral-700 leading-relaxed mt-3 max-w-3xl">
              {data.intro ||
                '按任务与课程场景整理常用工具（含链接、优缺点与课程标签），帮助你更快完成汇报、作业、实验与项目。'}
            </p>
            {(data.cautions || []).length > 0 && (
              <div className="mt-5 rounded-lg bg-neutral-50 border border-neutral-200 p-4">
                <p className="text-small font-semibold text-neutral-800 mb-2">使用提示</p>
                <ul className="space-y-2">
                  {data.cautions?.map((item, index) => (
                    <li
                      key={`${index}-${item.slice(0, 24)}`}
                      className="text-small text-neutral-700 leading-relaxed"
                    >
                      {renderInlineLinks(item)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="w-full lg:w-80 grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-caption font-semibold text-neutral-600">分类</p>
              <p className="mt-2 text-2xl font-bold text-primary-900">{categories.length}</p>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-caption font-semibold text-neutral-600">工具</p>
              <p className="mt-2 text-2xl font-bold text-primary-900">{totalToolCount}</p>
            </div>
            <div className="col-span-2 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-caption font-semibold text-neutral-600">已筛选</p>
              <p className="mt-2 text-2xl font-bold text-primary-900">
                {filteredToolCount}{' '}
                <span className="text-small font-semibold text-neutral-600">
                  / {totalToolCount}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <ToolsFilters
        query={query}
        onQueryChange={setQuery}
        aiOnly={aiOnly}
        onToggleAiOnly={() => setAiOnly(prev => !prev)}
        onResetFilters={resetFilters}
        courseTagOptions={courseTagOptions}
        selectedCourseTags={selectedCourseTags}
        onToggleCourseTag={toggleCourseTag}
        categoryOptions={categories.map(category => ({ key: category.key, name: category.name }))}
        selectedCategoryKey={selectedCategoryKey}
        onSelectCategory={setSelectedCategoryKey}
        platformOptions={platformOptions}
        selectedPlatforms={selectedPlatforms}
        onTogglePlatform={togglePlatform}
        pricingTagOptions={pricingTagOptions}
        selectedPricingTags={selectedPricingTags}
        onTogglePricingTag={togglePricingTag}
      />

      {filteredCategories.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-background-surface p-10 text-center shadow-sm">
          <p className="text-body text-neutral-600">没有找到匹配的工具，试试清空筛选或更换关键词。</p>
        </div>
      ) : (
        <div className="space-y-10">
          {filteredCategories.map(category => (
            <section key={category.key} className="space-y-6">
              {renderCategoryHeader(category)}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {category.tools.map(tool => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    expanded={expandedToolIds.has(tool.id)}
                    onToggleExpanded={() => toggleExpanded(tool.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default UndergradToolsPanel;
