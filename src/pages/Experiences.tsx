import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  User,
  Tag,
  ArrowRight,
  BookOpen,
  Lightbulb,
  Target,
  Briefcase,
  Globe,
  Layers,
  Megaphone,
  GraduationCap,
  Rocket,
  ClipboardList,
} from 'lucide-react';
import { useContentIndex, getFilteredExperiences } from '../hooks/useContent';
import useScrollToTop from '../hooks/useScrollToTop';

type ExperienceCategory =
  | '全部'
  | '保研'
  | '就业'
  | '留学'
  | '实习'
  | '考研'
  | '技术栈'
  | '通知';

const highlightIcons = {
  lightbulb: Lightbulb,
  target: Target,
  briefcase: Briefcase,
  globe: Globe,
  layers: Layers,
  megaphone: Megaphone,
  cap: GraduationCap,
  rocket: Rocket,
  clipboard: ClipboardList,
  calendar: Calendar,
} as const;

type HighlightIconKey = keyof typeof highlightIcons;

type HighlightPoint = {
  icon: HighlightIconKey;
  title: string;
  description: string;
};

type HighlightContent = {
  title: string;
  description: string;
  chips?: string[];
  points?: HighlightPoint[];
  notice?: string;
  image?: {
    src: string;
    alt: string;
    caption?: string;
  };
};

const categoryHighlights: Record<ExperienceCategory, HighlightContent> = {
  全部: {
    title: '找到与你最契合的经验方向',
    description:
      '快速浏览各类经验内容，按兴趣切换分类，帮助你制定明确的成长路径。我们会持续补充社团成员的真实分享。',
    chips: ['精选内容', '持续更新'],
    points: [
      {
        icon: 'lightbulb',
        title: '按目标筛选',
        description:
          '通过上方分类快速定位适合自己的内容，涵盖保研、考研、就业、留学等不同阶段。',
      },
      {
        icon: 'rocket',
        title: '沉淀成长轨迹',
        description:
          '鼓励大家持续分享经验，帮助更多同学形成可复制、可迭代的成长路径。',
      },
    ],
    notice: 'Tip: 若你有新的经验想分享，滚动至页面底部即可找到「提交经验分享」入口。',
  },
  保研: {
    title: '保研关键信息整理',
    description: '覆盖夏令营、预推免到正式推免的完整流程，帮助你把握每个关键节点。',
    chips: ['推免时间线', '材料准备'],
    points: [
      {
        icon: 'cap',
        title: '锁定目标院校',
        description:
          '关注意向院校的夏令营与预推免通知，提前在官网或信息群获取报名时间。',
      },
      {
        icon: 'clipboard',
        title: '材料打磨清单',
        description:
          '成绩单、成绩排名证明、科研总结与推荐信等材料建议随时更新统一版本。',
      },
      {
        icon: 'lightbulb',
        title: '面试与笔试准备',
        description:
          '整理往年面试提问与专业课笔试机试题目，提前练习自我介绍与科研思路表达。',
      },
    ],
    notice: '别忘了关注学院开放盖章时间与材料上交时间，提前准备，避免临近截止日期手忙脚乱。',
  },
  就业: {
    title: '求职准备指南',
    description: '涵盖互联网、制造、金融等热门行业的求职经验，帮助你在投递前制定清晰策略。',
    chips: ['秋招/春招', '面试强化'],
    points: [
      {
        icon: 'briefcase',
        title: '构建岗位清单',
        description:
          '整理目标公司与岗位，关注网申、测评、笔试与内推渠道的开放时间。',
      },
      {
        icon: 'target',
        title: '面试真题复盘',
        description:
          '结合笔经面经积累高频问题，准备结构化故事与STAR法则的案例。',
      },
      {
        icon: 'clipboard',
        title: '跟踪投递节奏',
        description:
          '使用表格或工具记录投递状态，确保及时回复HR邮件和跟进面试反馈。',
      },
    ],
    notice: '社团会定期发布招聘资讯与交流活动，详细安排请留意「通知」分类。',
  },
  留学: {
    title: '留学申请全流程',
    description: '从选校定位、语言备考到套磁、文书撰写，帮助你系统推进每一步。',
    chips: ['选校定位', '语言成绩'],
    points: [
      {
        icon: 'globe',
        title: '明确目标项目',
        description:
          '根据学术背景与兴趣选择国家和项目，提前了解研究方向与导师。',
      },
      {
        icon: 'clipboard',
        title: '准备核心材料',
        description:
          '成绩单、推荐信、简历和个人陈述需同步打磨，建议提前锁定推荐人。',
      },
      {
        icon: 'target',
        title: '丰富科研/实习经历',
        description:
          '结合目标项目需求提升科研或实习经历，突出跨文化与团队协作能力。',
      },
    ],
    notice: '请密切关注各院校官网的截止日期与材料要求，部分专业有滚动录取机制。',
  },
  实习: {
    title: '实习进阶路径',
    description: '从寻找机会到转正答辩，整理不同阶段的经验与踩坑提示。',
    chips: ['提前批', '转正攻略'],
    points: [
      {
        icon: 'briefcase',
        title: '匹配长期方向',
        description:
          '结合未来就业或研究方向筛选实习岗位，关注提前批与日常批信息。',
      },
      {
        icon: 'rocket',
        title: '夯实面试表现',
        description:
          '掌握笔试/面试高频题型，总结项目亮点和最佳实践，提升表达效率。',
      },
      {
        icon: 'layers',
        title: '沉淀成果输出',
        description:
          '记录每个阶段的任务和产出，及时向导师汇报并争取项目落地证据。',
      },
    ],
    notice: '建议保留周报、复盘文档等过程资料，在转正或求职阶段方便提炼亮点。',
  },
  考研: {
    title: '考研全年规划',
    description: '结合初试与复试的节奏，提供阶段性目标和备考策略参考。',
    chips: ['全年规划', '复试准备'],
    points: [
      {
        icon: 'clipboard',
        title: '制定复习节奏',
        description:
          '按照公共课与专业课区分复习阶段，预留冲刺期进行模拟和查缺补漏。',
      },
      {
        icon: 'lightbulb',
        title: '积累答题技巧',
        description:
          '通过真题与错题本总结高频考点，形成适合自己的解题模板。',
      },
      {
        icon: 'target',
        title: '复试材料准备',
        description:
          '提早准备简历、科研展示与英文自我介绍，关注目标院校复试规则。',
      },
    ],
    notice: '关注各院校招生简章、历年调剂信息，及时调整目标与策略。',
  },
  技术栈: {
    title: '技术沉淀与实践',
    description: '记录社团项目、技术分享与路线总结，帮助大家构建进阶路径。',
    chips: ['项目沉淀', '实战经验'],
    points: [
      {
        icon: 'layers',
        title: '模块化梳理',
        description:
          '对项目进行体系化拆解，从架构、模块到测试总结可复用的经验。',
      },
      {
        icon: 'rocket',
        title: '驱动持续迭代',
        description:
          '结合版本迭代记录问题与优化方案，帮助团队快速复现成功实践。',
      },
      {
        icon: 'lightbulb',
        title: '拓展学习路径',
        description:
          '汇总推荐的课程、文档与工具链，为不同基础的同学提供学习路线。',
      },
    ],
    notice: '欢迎提交你的技术笔记或项目复盘，让更多同学参与到技术共建中来。',
  },
  通知: {
    title: '最新活动与公告',
    description: '集中发布社团活动、讲座、报名提醒等时间敏感信息。',
    chips: ['活动预告', '报名提醒'],
    points: [
      {
        icon: 'megaphone',
        title: '及时掌握动态',
        description:
          '关注社团官方发布渠道，避免错过分享会、比赛或外部合作机会。',
      },
      {
        icon: 'calendar',
        title: '标记关键节点',
        description:
          '将活动报名、DDL 等重要时间加入个人日程，安排好准备与出席计划。',
      },
      {
        icon: 'clipboard',
        title: '提前准备资料',
        description:
          '部分活动需要简历、作品集或作品展示，建议提前准备统一版本。',
      },
    ],
    notice: '如遇报名或提交问题，可在社团群内联系活动负责人协助处理。',
  },
};

const Experiences = () => {
  useScrollToTop(); // 页面加载时滚动到顶部
  const [activeCategory, setActiveCategory] = useState<ExperienceCategory>('全部');
  const { index, loading, error } = useContentIndex();

  const categories: ExperienceCategory[] = ['全部', '保研', '就业', '留学', '实习', '考研', '技术栈', '通知'];

  const filteredExperiences = index?.experiences?.all 
    ? getFilteredExperiences(index.experiences.all, activeCategory)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-body text-neutral-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-body text-error mb-4">加载内容时出错: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  // 计算统计数据
  const categoryStats = index?.experiences?.categories || {};
  const stats = {
    '保研': categoryStats['保研']?.length || 0,
    '就业': categoryStats['就业']?.length || 0,
    '实习': categoryStats['实习']?.length || 0,
    '留学': categoryStats['留学']?.length || 0,
    '考研': categoryStats['考研']?.length || 0,
    '技术栈': categoryStats['技术栈']?.length || 0,
    '通知': categoryStats['announcements']?.length || 0,
  };

  const activeHighlight = categoryHighlights[activeCategory];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-h1 font-bold text-primary-900 mb-6">
            内容中心
          </h1>
          <p className="text-body-lg text-neutral-700 max-w-3xl mx-auto">
            经验分享、通知公告，一站式获取所有重要信息
          </p>
        </div>

        {/* Category Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-fast ${
                  activeCategory === category
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-background-surface text-neutral-700 hover:bg-primary-50 hover:text-primary-600 shadow-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {activeHighlight && (
          <section className="mb-10">
            <div className="rounded-xl border border-neutral-200 bg-background-surface p-6 shadow-sm md:p-8">
              {activeHighlight.chips && activeHighlight.chips.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {activeHighlight.chips.map((chip) => (
                    <span
                      key={chip}
                      className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-caption font-medium text-primary-700"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              )}
              <div>
                <h2 className="mb-3 text-h2 font-bold text-primary-900">
                  {activeHighlight.title}
                </h2>
                <p className="text-body leading-relaxed text-neutral-600">
                  {activeHighlight.description}
                </p>
              </div>
              {activeHighlight.points && activeHighlight.points.length > 0 && (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {activeHighlight.points.map((point) => {
                    const IconComponent = highlightIcons[point.icon];
                    return (
                      <div
                        key={point.title}
                        className="flex items-start gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4"
                      >
                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                          <IconComponent size={18} />
                        </span>
                        <div>
                          <h3 className="mb-1 text-body font-semibold text-primary-900">
                            {point.title}
                          </h3>
                          <p className="text-small leading-relaxed text-neutral-600">
                            {point.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {activeHighlight.image && (
                <figure className="mt-6 overflow-hidden rounded-lg border border-neutral-200">
                  {activeHighlight.image.caption && (
                    <figcaption className="px-4 py-3 text-small text-neutral-600 bg-neutral-50">
                      {activeHighlight.image.caption}
                    </figcaption>
                  )}
                  <img
                    src={activeHighlight.image.src}
                    alt={activeHighlight.image.alt}
                    className="h-auto w-full object-cover"
                  />
                </figure>
              )}
              {activeHighlight.notice && (
                <div className="mt-6 rounded-lg border border-primary-100 bg-primary-50 px-4 py-3 text-small text-primary-700">
                  {activeHighlight.notice}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Experience Cards */}
        {filteredExperiences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExperiences.map((experience, index) => (
              <div
                key={index}
                className="group bg-background-surface rounded-lg shadow-sm hover:shadow-lg transition-all duration-normal transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-primary-100 text-primary-600 text-caption px-3 py-1 rounded-full">
                      {experience.category}
                    </span>
                    <span className="text-caption text-neutral-500">
                      {experience.year}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-h3 font-semibold text-primary-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {experience.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-body text-neutral-600 mb-4 line-clamp-3">
                    {experience.excerpt}
                  </p>

                  {/* Tags */}
                  {experience.tags && experience.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {experience.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="inline-flex items-center bg-neutral-100 text-neutral-700 text-caption px-2 py-1 rounded"
                        >
                          <Tag size={12} className="mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between text-caption text-neutral-500">
                    <div className="flex items-center space-x-1">
                      <User size={14} />
                      <span>{experience.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>{experience.date}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-200">
                  <Link 
                    to={experience.category === 'announcements' 
                      ? `/content/experiences/announcements/${experience.file.split('/').pop()}`
                      : `/content/experiences/${experience.category}/${experience.file.split('/').pop()}`
                    }
                    className="flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  >
                    阅读全文
                    <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-body text-neutral-500">
              {activeCategory === '全部' ? '暂无经验分享内容' : `暂无${activeCategory}类经验分享`}
            </p>
          </div>
        )}

        {/* Load More */}
        {filteredExperiences.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-primary-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors duration-fast">
              加载更多经验
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-16 bg-background-surface rounded-lg p-8">
          <h2 className="text-h2 font-bold text-primary-900 text-center mb-8">
            分享统计
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-500 mb-1">{stats['保研']}</div>
              <div className="text-small text-neutral-600">保研经验</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-orange mb-1">{stats['就业']}</div>
              <div className="text-small text-neutral-600">就业经验</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-semantic-info mb-1">{stats['实习']}</div>
              <div className="text-small text-neutral-600">实习经验</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-semantic-success mb-1">{stats['留学']}</div>
              <div className="text-small text-neutral-600">留学经验</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-semantic-warning mb-1">{stats['考研']}</div>
              <div className="text-small text-neutral-600">考研经验</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">{stats['技术栈']}</div>
              <div className="text-small text-neutral-600">技术分享</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-semantic-error mb-1">{stats['通知']}</div>
              <div className="text-small text-neutral-600">通知公告</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-primary-50 rounded-lg p-8">
            <h3 className="text-h2 font-bold text-primary-900 mb-4">
              分享你的经验
            </h3>
            <p className="text-body text-neutral-600 mb-6 max-w-2xl mx-auto">
              你的经验可能正是其他同学需要的宝贵资源。分享你的经历，帮助更多的学弟学妹成长。
            </p>
            <button 
              onClick={() => window.open('https://github.com/SEU-711-SEClub/seu-711-seclub.github.io', '_blank')}
              className="bg-accent-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-dark transition-colors duration-fast"
            >
              提交经验分享
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Experiences;
