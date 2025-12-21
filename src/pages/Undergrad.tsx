import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Info, ClipboardList, Timer, ArrowRight, Target, ChevronRight, ZoomIn, X } from 'lucide-react';
import {
  useContentIndex,
  useUndergradSummary,
  useUndergradTimeline,
} from '../hooks/useContent';
import useScrollToTop from '../hooks/useScrollToTop';
import { RichText } from '../lib/richText';

type TabKey = 'requirements' | 'projects';

type TimelineImage = {
  src: string;
  alt: string;
  scale?: number;
};

const splitRequirementExcerpt = (excerpt?: string) => {
  const raw = (excerpt || '').trim();
  if (!raw) return { requirement: '', pathway: '' };

  const stripBullet = (line: string) => line.replace(/^-\s+/, '');
  const isHeader = (line: string, header: string) =>
    new RegExp(`^${header}[:：]?$`).test(line.trim());

  const lines = raw
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
  if (lines.length === 0) return { requirement: '', pathway: '' };

  const requirementHeaderIndex = lines.findIndex(line => isHeader(line, '毕业要求'));
  const pathwayHeaderIndex = lines.findIndex(line => isHeader(line, '达成途径'));

  if (requirementHeaderIndex !== -1) {
    const requirementStart = requirementHeaderIndex + 1;
    const requirementEnd =
      pathwayHeaderIndex !== -1 && pathwayHeaderIndex > requirementHeaderIndex
        ? pathwayHeaderIndex
        : lines.length;

    const requirement = lines
      .slice(requirementStart, requirementEnd)
      .filter(line => !isHeader(line, '毕业要求') && !isHeader(line, '达成途径'))
      .map(stripBullet)
      .join(' ')
      .trim();

    const pathway =
      pathwayHeaderIndex !== -1
        ? lines
            .slice(pathwayHeaderIndex + 1)
            .filter(line => !isHeader(line, '毕业要求') && !isHeader(line, '达成途径'))
            .map(stripBullet)
            .join(' ')
            .trim()
        : '';

    return { requirement, pathway };
  }

  const requirement = stripBullet(lines[0]);
  const pathway = lines
    .slice(1)
    .map(stripBullet)
    .join(' ');

  return { requirement, pathway };
};

const ScaledImage = ({
  image,
  className = '',
  thumbnailMaxWidth = 200,
  thumbnailMaxHeight = 120,
}: {
  image: TimelineImage;
  className?: string;
  thumbnailMaxWidth?: number;
  thumbnailMaxHeight?: number;
}) => {
  const [naturalSize, setNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const scale = typeof image.scale === 'number' ? image.scale : 0.3;

  const thumbnailStyle = useMemo(() => {
    const base: React.CSSProperties = {
      maxWidth: thumbnailMaxWidth,
      maxHeight: thumbnailMaxHeight,
    };

    if (!naturalSize) {
      return { ...base, width: `${Math.round(scale * 100)}%` };
    }

    const targetWidth = naturalSize.width * scale;
    const targetHeight = naturalSize.height * scale;
    const clampFactor = Math.min(
      1,
      thumbnailMaxWidth / targetWidth,
      thumbnailMaxHeight / targetHeight
    );
    return { ...base, width: Math.round(targetWidth * clampFactor) };
  }, [naturalSize, scale, thumbnailMaxWidth, thumbnailMaxHeight]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`group relative block focus:outline-none ${className}`.trim()}
        aria-label="放大查看图片"
        title="点击放大"
      >
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          onLoad={event => {
            const width = event.currentTarget.naturalWidth;
            const height = event.currentTarget.naturalHeight;
            if (width && height && (naturalSize?.width !== width || naturalSize?.height !== height)) {
              setNaturalSize({ width, height });
            }
          }}
          style={thumbnailStyle}
          className="block h-auto w-auto max-w-full rounded border border-neutral-200 bg-white shadow-sm cursor-zoom-in"
        />
        <span className="pointer-events-none absolute inset-0 rounded bg-neutral-950/0 transition-colors group-hover:bg-neutral-950/5" />
        <span className="pointer-events-none absolute bottom-2 right-2 inline-flex items-center gap-1 rounded bg-white/90 px-2 py-1 text-[10px] font-medium text-neutral-700 opacity-0 shadow-sm transition-opacity group-hover:opacity-100">
          <ZoomIn size={12} />
          放大
        </span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-neutral-950/70 p-4"
          onClick={() => setIsOpen(false)}
        >
          <button
            type="button"
            onClick={event => {
              event.stopPropagation();
              setIsOpen(false);
            }}
            className="absolute right-4 top-4 inline-flex items-center justify-center rounded bg-white/90 p-2 text-neutral-800 shadow hover:bg-white"
            aria-label="关闭"
          >
            <X size={18} />
          </button>
          <div className="flex h-full w-full items-center justify-center">
            <img
              src={image.src}
              alt={image.alt}
              className="max-h-[90vh] max-w-[90vw] rounded-lg bg-white shadow-2xl"
              onClick={event => event.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

const TimelineImageRow = ({ images }: { images: TimelineImage[] }) => (
  <div className="flex items-start justify-end gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
    {images.map((image, index) => (
      <ScaledImage
        key={`${image.src}-${index}`}
        image={image}
        className="flex-shrink-0"
        thumbnailMaxWidth={160}
        thumbnailMaxHeight={110}
      />
    ))}
  </div>
);

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
          const { requirement, pathway } = splitRequirementExcerpt(requirementMeta?.excerpt);
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
              <div className="space-y-3 mb-4">
                <div className="flex gap-3">
                  <span className="mt-0.5 w-16 shrink-0 text-caption font-semibold text-neutral-500">
                    毕业要求
                  </span>
                  <div className="min-w-0 flex-1 text-small text-neutral-700 line-clamp-2">
                    <RichText text={requirement || '点击查看详细要求与认定方式。'} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="mt-0.5 w-16 shrink-0 text-caption font-semibold text-neutral-500">
                    达成途径
                  </span>
                  <div className="min-w-0 flex-1 text-small text-neutral-600 line-clamp-2">
                    <RichText text={pathway || '点击查看详细要求与认定方式。'} />
                  </div>
                </div>
              </div>
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
      <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
        <ul className="list-disc pl-5 text-caption text-neutral-700 leading-relaxed space-y-1">
          <li>
            {'毕设入口：'}
            <a
              href="https://bysj.seu.edu.cn/"
              target="_blank"
              rel="noreferrer"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              毕设官网
            </a>
            {'（需校内网或'}
            <a
              href="https://nic.seu.edu.cn/fwzn/xywfw/VPNFW/VPNfwjj.htm"
              target="_blank"
              rel="noreferrer"
              className="text-primary-600 hover:text-primary-700 underline"
            >
              VPN
            </a>
            {'）。'}
          </li>
          <li>
            {'下方'}
            <span className="text-red-600 font-semibold">红色字体</span>
            {'代表需要提交的文件或任务，下方'}
            <span className="text-blue-600 font-semibold">蓝色字体</span>
            {'代表右侧有可供放大的图片查看。'}
          </li>
          <li>
            {'可能下方与实际会略有出入，具体'}
            <span className="text-amber-600 font-semibold">以教务吕老师通知为准</span>。
          </li>
          <li>
            {'以下内容仅关注普通毕设，依托卓越科研训练成果开展毕业设计（论文）需自行查看教务通知；由于软件工程专业默认全部属于卓工班，故以下所有内容均只针对卓工班要求，可能不适用于其他专业。'}
          </li>
          <li>
            {'若非实际必须线下到外校毕设，尽可能直接挂靠本校毕设，流程、提交材料等会简单很多。'}
          </li>
          <li>
            {'当前时间轴针对'}
            <span className="text-primary-700 font-semibold">2026 届</span>
            {'，若无大改，后续届次仅需调整具体日期。'}
          </li>
        </ul>
      </div>

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
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 border border-primary-100">
                        <Timer size={16} className="text-primary-600" />
                        <span className="text-caption font-semibold text-primary-700">
                          {axisDef.date}
                        </span>
                      </div>
                      <span className="text-body font-semibold text-primary-900">{axisDef.label}</span>
                    </div>
                    {axisDef.note && (
                      <p className="text-small text-neutral-600 mb-2 whitespace-pre-line">
                        <RichText text={axisDef.note} />
                      </p>
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
                  {(() => {
                    const axisImages = axisDef.images?.length
                      ? axisDef.images
                      : Array.isArray(axisDef.image)
                        ? axisDef.image
                        : axisDef.image
                          ? [axisDef.image]
                          : [];

                    if (axisImages.length === 0) return null;

                    return (
                      <div className="ml-auto self-start w-[160px] sm:w-[200px] md:w-[240px]">
                        <TimelineImageRow images={axisImages} />
                      </div>
                    );
                  })()}
                </div>
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
                        <span className="whitespace-pre-line">
                          <RichText text={interval.note || '阶段任务'} />
                        </span>
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
                          className="text-small text-neutral-700 leading-relaxed whitespace-pre-line"
                        >
                          <RichText text={range.detail} />
                        </p>
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
