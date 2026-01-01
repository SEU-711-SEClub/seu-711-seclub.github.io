import type { UndergradTool, UndergradToolCategory } from '../hooks/useUndergradTools';

const COURSE_TAG_PRIORITY = [
  '所有课程',
  '课程汇报/答辩',
  '软件工程/专业课',
  '编程课/实验',
  '课程设计/大作业',
  '实验报告',
  '科研训练/论文写作',
  '数据分析/AI课程',
  '毕业设计',
  '团队协作',
] as const;

const PLATFORM_PRIORITY = [
  'Web',
  'Windows',
  'macOS',
  'Linux',
  'Mobile',
  'Desktop',
  'Cross-platform',
  'IDE 插件',
  'VS Code',
  'CLI',
  'Markdown',
  'Docs',
] as const;

const PRICING_TAG_PRIORITY = ['免费可用', '开源', '含付费项', '教育/校授权'] as const;

type PriorityList = readonly string[];

const sortByPriorityThenLocale = (items: string[], priority: PriorityList) => {
  const priorityIndex = new Map<string, number>();
  priority.forEach((value, index) => priorityIndex.set(value, index));

  return [...items].sort((a, b) => {
    const pa = priorityIndex.get(a) ?? 999;
    const pb = priorityIndex.get(b) ?? 999;
    if (pa !== pb) return pa - pb;
    return a.localeCompare(b, 'zh-Hans-CN');
  });
};

const normalizeText = (value: string) => value.trim().toLowerCase();

export const expandPlatforms = (platforms: string[]) => {
  const set = new Set(platforms);
  if (set.has('Cross-platform') || set.has('Desktop')) {
    set.add('Windows');
    set.add('macOS');
    set.add('Linux');
  }
  return Array.from(set);
};

export const getPricingTags = (pricing?: string) => {
  const raw = (pricing || '').trim();
  if (!raw) return [];

  const tags = new Set<string>();
  if (raw.includes('免费') || raw.includes('开源')) tags.add('免费可用');
  if (raw.includes('开源')) tags.add('开源');
  if (raw.includes('付费') || raw.includes('订阅') || raw.includes('会员')) tags.add('含付费项');
  if (raw.includes('教育') || raw.includes('校授权')) tags.add('教育/校授权');
  return Array.from(tags);
};

export const buildCourseTagOptions = (categories: UndergradToolCategory[]) => {
  const tags = new Set<string>();
  categories.forEach(category => {
    (category.courseTags || []).forEach(tag => tags.add(tag));
    (category.tools || []).forEach(tool => (tool.courseTags || []).forEach(tag => tags.add(tag)));
  });
  return sortByPriorityThenLocale(Array.from(tags), COURSE_TAG_PRIORITY);
};

export const buildPlatformOptions = (categories: UndergradToolCategory[]) => {
  const platforms = new Set<string>();
  categories.forEach(category => {
    (category.tools || []).forEach(tool => {
      expandPlatforms(tool.platforms || []).forEach(platform => platforms.add(platform));
    });
  });
  return sortByPriorityThenLocale(Array.from(platforms), PLATFORM_PRIORITY);
};

export const buildPricingTagOptions = (categories: UndergradToolCategory[]) => {
  const tags = new Set<string>();
  categories.forEach(category => {
    (category.tools || []).forEach(tool => getPricingTags(tool.pricing).forEach(tag => tags.add(tag)));
  });
  return sortByPriorityThenLocale(Array.from(tags), PRICING_TAG_PRIORITY);
};

export type UndergradToolFilters = {
  query: string;
  aiOnly: boolean;
  courseTags: string[];
  platforms: string[];
  pricingTags: string[];
};

export const toolMatchesFilters = (tool: UndergradTool, filters: UndergradToolFilters) => {
  if (filters.aiOnly && (tool.ai?.highlights || []).length === 0) return false;

  if (filters.courseTags.length > 0) {
    const tags = tool.courseTags || [];
    const hasUniversal = tags.includes('所有课程');
    const matchesAny = hasUniversal || filters.courseTags.some(selected => tags.includes(selected));
    if (!matchesAny) return false;
  }

  if (filters.platforms.length > 0) {
    const platforms = new Set(expandPlatforms(tool.platforms || []));
    const matchesAny = filters.platforms.some(platform => platforms.has(platform));
    if (!matchesAny) return false;
  }

  if (filters.pricingTags.length > 0) {
    const pricingTags = getPricingTags(tool.pricing);
    const matchesAll = filters.pricingTags.every(tag => pricingTags.includes(tag));
    if (!matchesAll) return false;
  }

  const normalizedQuery = normalizeText(filters.query);
  if (normalizedQuery) {
    const haystack = normalizeText(
      [
        tool.name,
        tool.subtitle,
        tool.description,
        tool.pricing,
        ...(tool.platforms || []),
        ...(tool.useCases || []),
        ...(tool.courseTags || []),
        ...(tool.pros || []),
        ...(tool.cons || []),
        ...(tool.ai?.highlights || []),
        ...(tool.alternatives || []),
      ]
        .filter(Boolean)
        .join(' ')
    );
    if (!haystack.includes(normalizedQuery)) return false;
  }

  return true;
};

