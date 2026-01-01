import React from 'react';
import { CheckCircle2, ExternalLink, Layers, Sparkles, Tag, XCircle } from 'lucide-react';
import type { UndergradTool } from '../../hooks/useUndergradTools';

type Props = {
  tool: UndergradTool;
  expanded: boolean;
  onToggleExpanded: () => void;
};

const ToolCard = ({ tool, expanded, onToggleExpanded }: Props) => {
  const hasAi = (tool.ai?.highlights || []).length > 0;
  const courseTags = tool.courseTags || [];
  const useCases = tool.useCases || [];
  const platforms = tool.platforms || [];

  const renderTagChips = (items: string[]) => (
    <>
      {items.map(item => (
        <span
          key={item}
          className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-caption font-medium text-neutral-700"
        >
          {item}
        </span>
      ))}
    </>
  );

  return (
    <div className="group flex flex-col rounded-xl border border-neutral-200 bg-background-surface shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-h3 font-semibold text-primary-900 group-hover:text-primary-600 transition-colors">
              {tool.name}
            </h4>
            {tool.subtitle && (
              <p className="mt-1 text-small text-neutral-600 leading-relaxed">{tool.subtitle}</p>
            )}
          </div>
          {hasAi && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-50 px-3 py-1 text-caption font-semibold text-accent-dark">
              <Sparkles size={12} />
              AI 用法
            </span>
          )}
        </div>

        <p className="mt-4 text-body text-neutral-700 leading-relaxed line-clamp-3">{tool.description}</p>

        {tool.links?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tool.links.map(link => (
              <a
                key={`${tool.id}-${link.url}`}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-small font-semibold text-primary-700 transition-colors hover:bg-primary-50"
              >
                <ExternalLink size={14} />
                {link.label}
              </a>
            ))}
          </div>
        )}

        {(tool.pricing || platforms.length > 0) && (
          <div className="mt-4 grid grid-cols-[auto,1fr] gap-x-3 gap-y-2 items-start">
            {tool.pricing && (
              <>
                <span className="text-caption font-semibold text-neutral-600">费用</span>
                <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-caption font-semibold text-primary-700">
                  {tool.pricing}
                </span>
              </>
            )}
            {platforms.length > 0 && (
              <>
                <span className="text-caption font-semibold text-neutral-600">平台</span>
                <div className="flex flex-wrap gap-2">{renderTagChips(platforms)}</div>
              </>
            )}
          </div>
        )}

        {(useCases.length > 0 || courseTags.length > 0) && (
          <div className="mt-4 grid grid-cols-[auto,1fr] gap-x-3 gap-y-2 items-start">
            {useCases.length > 0 && (
              <>
                <span className="inline-flex items-center gap-1 text-caption font-semibold text-neutral-600">
                  <Layers size={12} />
                  场景
                </span>
                <div className="flex flex-wrap gap-2">{renderTagChips(useCases)}</div>
              </>
            )}
            {courseTags.length > 0 && (
              <>
                <span className="inline-flex items-center gap-1 text-caption font-semibold text-neutral-600">
                  <Tag size={12} />
                  课程
                </span>
                <div className="flex flex-wrap gap-2">{renderTagChips(courseTags)}</div>
              </>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={onToggleExpanded}
          className="mt-5 inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-background-surface px-4 py-2 text-small font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
          aria-expanded={expanded}
        >
          {expanded ? '收起详情' : '查看优缺点'}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-neutral-200 bg-neutral-50 p-6 space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h5 className="mb-2 inline-flex items-center gap-2 text-body font-semibold text-primary-900">
                <CheckCircle2 size={18} className="text-semantic-success" />
                优势
              </h5>
              <ul className="space-y-2">
                {tool.pros.map(item => (
                  <li key={item} className="flex gap-2 text-small text-neutral-700">
                    <span className="mt-0.5">
                      <CheckCircle2 size={16} className="text-semantic-success" />
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="mb-2 inline-flex items-center gap-2 text-body font-semibold text-primary-900">
                <XCircle size={18} className="text-semantic-error" />
                局限
              </h5>
              <ul className="space-y-2">
                {tool.cons.map(item => (
                  <li key={item} className="flex gap-2 text-small text-neutral-700">
                    <span className="mt-0.5">
                      <XCircle size={16} className="text-semantic-error" />
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {hasAi && (
            <div>
              <h5 className="mb-2 inline-flex items-center gap-2 text-body font-semibold text-primary-900">
                <Sparkles size={18} className="text-accent-orange" />
                AI 用法
              </h5>
              <ul className="space-y-2">
                {(tool.ai?.highlights || []).map(item => (
                  <li key={item} className="flex gap-2 text-small text-neutral-700">
                    <span className="mt-0.5">
                      <Sparkles size={16} className="text-accent-orange" />
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(tool.alternatives?.length || 0) > 0 && (
            <div>
              <h5 className="mb-2 text-body font-semibold text-primary-900">替代方案</h5>
              <div className="flex flex-wrap gap-2">
                {tool.alternatives?.map(item => (
                  <span
                    key={item}
                    className="inline-flex items-center rounded-full bg-white px-3 py-1 text-caption font-medium text-neutral-700 border border-neutral-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ToolCard;

