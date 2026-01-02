import React from 'react';
import { Filter, RotateCcw, Search, Sparkles, Tag } from 'lucide-react';

type CategoryOption = {
  key: string;
  name: string;
};

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  aiOnly: boolean;
  onToggleAiOnly: () => void;
  onResetFilters: () => void;

  courseTagOptions: string[];
  selectedCourseTags: string[];
  onToggleCourseTag: (tag: string) => void;

  categoryOptions: CategoryOption[];
  selectedCategoryKey: string;
  onSelectCategory: (key: string) => void;

  platformOptions: string[];
  selectedPlatforms: string[];
  onTogglePlatform: (platform: string) => void;

  pricingTagOptions: string[];
  selectedPricingTags: string[];
  onTogglePricingTag: (tag: string) => void;
};

const chipClassName = (selected: boolean) =>
  `inline-flex items-center rounded-full px-4 py-2 text-small font-semibold transition-colors ${
    selected
      ? 'bg-primary-500 text-white shadow-sm'
      : 'bg-neutral-100 text-neutral-700 hover:bg-primary-50 hover:text-primary-700'
  }`;

const categoryClassName = (selected: boolean) =>
  `rounded-lg px-4 py-2 text-small font-semibold transition-colors ${
    selected
      ? 'bg-primary-500 text-white shadow-sm'
      : 'bg-neutral-100 text-neutral-700 hover:bg-primary-50 hover:text-primary-700'
  }`;

const ToolsFilters = ({
  query,
  onQueryChange,
  aiOnly,
  onToggleAiOnly,
  onResetFilters,
  courseTagOptions,
  selectedCourseTags,
  onToggleCourseTag,
  categoryOptions,
  selectedCategoryKey,
  onSelectCategory,
  platformOptions,
  selectedPlatforms,
  onTogglePlatform,
  pricingTagOptions,
  selectedPricingTags,
  onTogglePricingTag,
}: Props) => {
  return (
    <div className="rounded-xl border border-neutral-200 bg-background-surface p-6 shadow-sm space-y-6">
      <div className="flex items-center gap-2 text-primary-900 font-semibold">
        <Filter size={18} />
        筛选
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full lg:flex-1">
            <label className="block text-caption font-semibold text-neutral-700 mb-2">搜索</label>
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
              />
              <input
                value={query}
                onChange={event => onQueryChange(event.target.value)}
                placeholder="按工具名 / 场景 / 优缺点搜索..."
                className="w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-3 py-2 text-body text-neutral-800 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <button
              type="button"
              onClick={onToggleAiOnly}
              title="只显示包含「AI 用法」说明的工具"
              className={`inline-flex items-center rounded-lg px-4 py-2 text-small font-semibold transition-colors ${
                aiOnly
                  ? 'bg-accent-red text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-accent-50 hover:text-accent-dark'
              }`}
            >
              <Sparkles size={16} className="mr-2" />
              含 AI 用法
            </button>

            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center rounded-lg border border-neutral-200 bg-background-surface px-4 py-2 text-small font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              <RotateCcw size={16} className="mr-2" />
              清空筛选
            </button>
          </div>
        </div>

        <div>
          <label className="block text-caption font-semibold text-neutral-700 mb-2">课程标签</label>
          <div className="flex flex-wrap gap-2">
            {courseTagOptions.map(tag => {
              const selected = selectedCourseTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onToggleCourseTag(tag)}
                  className={chipClassName(selected)}
                >
                  <Tag size={14} className="mr-2" />
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-caption font-semibold text-neutral-700 mb-2">分类</label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onSelectCategory('all')}
              className={categoryClassName(selectedCategoryKey === 'all')}
            >
              全部
            </button>
            {categoryOptions.map(cat => (
              <button
                key={cat.key}
                type="button"
                onClick={() => onSelectCategory(cat.key)}
                className={categoryClassName(selectedCategoryKey === cat.key)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-caption font-semibold text-neutral-700 mb-2">适用平台</label>
          <div className="flex flex-wrap gap-2">
            {platformOptions.map(platform => {
              const selected = selectedPlatforms.includes(platform);
              return (
                <button
                  key={platform}
                  type="button"
                  onClick={() => onTogglePlatform(platform)}
                  className={chipClassName(selected)}
                >
                  {platform}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-caption font-semibold text-neutral-700 mb-2">费用</label>
          <div className="flex flex-wrap gap-2">
            {pricingTagOptions.map(tag => {
              const selected = selectedPricingTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onTogglePricingTag(tag)}
                  className={chipClassName(selected)}
                  title={tag === '含付费项' ? '包含订阅/会员/付费等信息' : undefined}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsFilters;

