import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Info, ClipboardList, Timer, ArrowRight, Target, ChevronRight } from 'lucide-react';
import {
  useContentIndex,
  useUndergradSummary,
  useUndergradTimeline,
} from '../hooks/useContent';
import useScrollToTop from '../hooks/useScrollToTop';

type TabKey = 'requirements' | 'projects';

const Undergrad = () => {
  useScrollToTop();
  const [activeTab, setActiveTab] = useState<TabKey>('requirements');
  const location = useLocation();
  const { index, loading: indexLoading, error: indexError } = useContentIndex();
  const {
    data: summary,
    loading: summaryLoading,
    error: summaryError,
  } = useUndergradSummary();
  const {
    data: timeline,
    loading: timelineLoading,
    error: timelineError,
  } = useUndergradTimeline();
  const [activeTimelineCategory, setActiveTimelineCategory] = useState<string>('');

  useEffect(() => {
    if (timeline?.categories?.length && !activeTimelineCategory) {
      setActiveTimelineCategory(timeline.categories[0].name);
    }
  }, [timeline, activeTimelineCategory]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab === 'projects' || tab === 'requirements') {
      setActiveTab(tab as TabKey);
    }
  }, [location.search]);

  const requirements = index?.undergrad?.requirements || [];

  const timelineAxis = timeline?.axis || [];
  const intervals = timeline?.intervals || [];
  const highlightBrackets = (text?: string) =>
    (text || '').replace(/《([^》]+)》/g, '<span class="text-red-600 font-bold">《$1》</span>');

  const filteredAxis = useMemo(
    () =>
      timelineAxis.filter(
        axis => !axis.categories || axis.categories.includes(activeTimelineCategory || '')
      ),
    [timelineAxis, activeTimelineCategory]
  );

  const applicableIntervals = useMemo(
    () =>
      intervals.filter(
        interval => !interval.categories || interval.categories.includes(activeTimelineCategory || '')
      ),
    [intervals, activeTimelineCategory]
  );

  const intervalMap = useMemo(() => {
    const map: Record<string, typeof applicableIntervals[number]> = {};
    applicableIntervals.forEach(int => {
      map[int.id] = int;
      map[`${int.startId}__${int.endId}`] = int;
    });
    return map;
  }, [applicableIntervals]);

  const currentTimelineCategory = useMemo(
    () => timeline?.categories?.find(cat => cat.name === activeTimelineCategory),
    [timeline, activeTimelineCategory]
  );

  const uniqueModules = useMemo(() => {
    const map = new Map<string, (typeof summary.modules)[number]>();
    summary?.modules?.forEach(m => {
      if (!map.has(m.key)) {
        map.set(m.key, m);
      }
    });
    return Array.from(map.values());
  }, [summary?.modules]);

  const renderRequirements = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {uniqueModules.map(module => {
          const kpi = summary?.kpi?.find(item => item.key === module.key);
          const requirementMeta = requirements.find(req => req.file.endsWith(module.file));
          return (
            <div
              key={module.key}
              className="group rounded-lg border border-neutral-200 bg-background-surface p-5 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="mb-3">
                <h3 className="text-h3 font-semibold text-primary-900 group-hover:text-primary-600">
                  {module.title}
                </h3>
              </div>
              {kpi && (
                <p className="text-small text-neutral-600 mb-2">
                  目标 {kpi.comparison === 'lte' ? '≤' : kpi.comparison === 'eq' ? '=' : '≥'} {kpi.target}
                  {kpi.unit || ''}
                </p>
              )}
              {module.tags && module.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {module.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-caption text-neutral-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-small text-neutral-600 line-clamp-3 mb-4">
                {requirementMeta?.excerpt || '点击查看详细要求与认定方式。'}
              </p>
              <Link
                to={`/content/undergrad/requirements/${module.file}`}
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
              >
                查看详情
                <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderTimeline = () => (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        {timeline?.categories?.map(category => (
          <button
            key={category.name}
            onClick={() => setActiveTimelineCategory(category.name)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTimelineCategory === category.name
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-neutral-100 text-neutral-700 hover:bg-primary-50 hover:text-primary-700'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="relative pl-6">
        <div className="absolute left-2 top-0 h-full w-px bg-neutral-200" />
        {filteredAxis.map(axisDef => {
          const nextAxis = filteredAxis[filteredAxis.findIndex(a => a.id === axisDef.id) + 1];
          const interval = nextAxis ? intervalMap[`${axisDef.id}__${nextAxis.id}`] : undefined;
          const range =
            interval && currentTimelineCategory?.ranges
              ? currentTimelineCategory.ranges.find(r => r.intervalId === interval.id)
              : undefined;

          return (
            <div key={axisDef.id} className="relative mb-8 last:mb-0">
              <div className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-2 border-primary-500 bg-white" />
              <div className="rounded-lg border border-neutral-200 bg-background-surface p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 border border-primary-100">
                    <Timer size={16} className="text-primary-600" />
                    <span className="text-caption font-semibold text-primary-700">{axisDef.date}</span>
                  </div>
                  <span className="text-body font-semibold text-primary-900">{axisDef.label}</span>
                </div>
                {axisDef.note && (
                  <p
                    className="text-small text-neutral-600 mb-2"
                    dangerouslySetInnerHTML={{ __html: highlightBrackets(axisDef.note) }}
                  />
                )}
                {axisDef.link && (
                  <a
                    href={axisDef.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 text-small mb-2"
                  >
                    查看官方链接
                    <ChevronRight size={14} className="ml-1" />
                  </a>
                )}
              </div>

              {/* 区间任务块 */}
              {interval && (
                <div className="ml-4 border-l border-dashed border-neutral-200 pl-4 mt-4">
                  <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-caption font-semibold text-primary-700">
                        {axisDef.date} ~ {nextAxis?.date}
                      </span>
                      <span className="text-caption text-neutral-500">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: highlightBrackets(interval.note || '阶段任务'),
                          }}
                        />
                      </span>
                    </div>
                    {range ? (
                      <>
                        {range.title && (
                          <h4 className="text-body font-semibold text-primary-900 mb-1">
                            {range.title}
                          </h4>
                        )}
                        <p
                          className="text-small text-neutral-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: highlightBrackets(range.detail) }}
                        />
                        {range.image && (
                          <div className="mt-3">
                            <img
                              src={range.image.src}
                              alt={range.image.alt}
                              style={{
                                maxWidth: range.image.width ? `${range.image.width}px` : '360px',
                                height: range.image.height ? `${range.image.height}px` : 'auto',
                              }}
                              className="rounded border border-neutral-200 shadow-sm"
                            />
                          </div>
                        )}
                        {range.links && range.links.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {range.links.map(link => (
                              <a
                                key={link.url}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center text-primary-600 hover:text-primary-700 text-small"
                              >
                                {link.label}
                                <ChevronRight size={14} className="ml-1" />
                              </a>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-small text-neutral-500">此阶段内容待补充。</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  if (indexLoading || summaryLoading || timelineLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-body text-neutral-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (indexError || summaryError || timelineError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-body text-error mb-3">
            加载失败：{indexError || summaryError || timelineError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <p className="inline-flex items-center rounded-full bg-primary-50 px-4 py-2 text-caption text-primary-700 font-semibold">
            <Info size={14} className="mr-2" />
            本科培养 · 毕业要求 & 毕业设计
          </p>
          <h1 className="text-h1 font-bold text-primary-900 mt-4 mb-3">本科培养导航</h1>
          <p className="text-body-lg text-neutral-700 max-w-3xl mx-auto">
            可视化查看毕业要求达成情况，按分类切换毕业设计时间轴。
          </p>
        </header>

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {[
            { key: 'requirements', label: '毕业要求概览', icon: ClipboardList },
            { key: 'projects', label: '毕业设计时间轴', icon: Target },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`inline-flex items-center gap-2 rounded-lg px-5 py-3 text-body font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'bg-background-surface text-neutral-700 border border-neutral-200 hover:bg-primary-50 hover:text-primary-700'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <section className="mb-10">
          {activeTab === 'requirements' ? renderRequirements() : renderTimeline()}
        </section>
      </div>
    </div>
  );
};

export default Undergrad;
