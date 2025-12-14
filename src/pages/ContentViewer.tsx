import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { useMarkdownContent } from '../hooks/useContent';
import MarkdownRenderer from '../components/MarkdownRenderer';
import useScrollToTop from '../hooks/useScrollToTop';

const ContentViewer = () => {
  useScrollToTop(); // 页面加载时滚动到顶部
  const { type, category, subcategory, filename } = useParams();
  
  // 构造正确的文件路径
  const filePath = [type, category, subcategory, filename].filter(Boolean).join('/');
  
  console.log('=== ContentViewer Debug ===');
  console.log('URL参数:', { type, category, subcategory, filename });
  console.log('构造的文件路径:', filePath);
  
  const { content, loading, error } = useMarkdownContent(filePath);
  const [metadata, setMetadata] = useState(null);
  const [processedContent, setProcessedContent] = useState('');

  useEffect(() => {
    if (content) {
      try {
        console.log('=== ContentViewer Debug ===');
        console.log('完整内容前200字符:', content.substring(0, 200));
        console.log('文件名:', filename);
        console.log('分类:', category);
        console.log('类型:', type);
        
        // 使用正则表达式解析frontmatter
        const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
        let frontmatter: Record<string, any> = {};
        let markdownContent = content;
        
        console.log('Frontmatter匹配结果:', frontmatterMatch);
        
        if (frontmatterMatch) {
          const frontmatterText = frontmatterMatch[1];
          markdownContent = content.substring(frontmatterMatch[0].length).trim();
          
          console.log('Frontmatter文本:', frontmatterText);
          
          // 解析YAML格式的frontmatter
          const lines = frontmatterText.split('\n');
          lines.forEach(line => {
            const trimmedLine = line.trim();
            const match = trimmedLine.match(/^(\w+):\s*(.+)$/);
            if (match) {
              const key = match[1];
              let value = match[2].trim();
              
              // 移除引号
              if ((value.startsWith('"') && value.endsWith('"')) || 
                  (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
              }
              
              // 处理数组类型的tags
              if (key === 'tags') {
                if (value.startsWith('[') && value.endsWith(']')) {
                  value = value.slice(1, -1);
                }
                frontmatter[key] = value.split(',').map(tag => tag.trim()).filter(tag => tag);
              } else {
                frontmatter[key] = value;
              }
              
              console.log(`解析到 ${key}: ${value}`);
            }
          });
        } else {
          console.log('未找到frontmatter，使用默认处理');
        }
        
        console.log('最终frontmatter对象:', frontmatter);
        console.log('处理后的markdownContent前100字符:', markdownContent.substring(0, 100));
        
        // 设置元数据
        const finalMetadata = {
          title: frontmatter.title || filename?.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          category: frontmatter.category || frontmatter.type || category || '未分类',
          author: frontmatter.author || '711Club成员',
          date: frontmatter.date || '2025-11-02',
          tags: frontmatter.tags || []
        };
        
        console.log('最终元数据:', finalMetadata);
        setMetadata(finalMetadata);
        
        // 只传递正文内容给MarkdownRenderer
        setProcessedContent(markdownContent);
      } catch (err) {
        console.error('解析markdown内容失败:', err);
        // 如果解析失败，使用原始内容
        setProcessedContent(content);
        setMetadata({
          title: filename?.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          category: category || '未分类',
          author: '711Club成员',
          date: '2025-11-02',
          tags: []
        });
      }
    }
  }, [content, filename, category]);

  const backPath = type === 'experiences' ? '/experiences' : type === 'undergrad' ? '/undergrad' : '/activities';
  const backLabel = type === 'experiences' ? '经验分享' : type === 'undergrad' ? '本科培养' : '活动中心';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-body text-neutral-600">加载内容中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-body text-error mb-4">加载内容时出错: {error}</p>
          <Link 
            to={backPath}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            返回列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* 返回按钮 */}
        <div className="mb-8">
          <Link
            to={backPath}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            返回{backLabel}
          </Link>
        </div>

        {/* 文章头部 */}
        <header className="mb-8">
          <div className="bg-background-surface rounded-lg p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="bg-primary-100 text-primary-600 text-caption px-3 py-1 rounded-full">
                {metadata?.category}
              </span>
              <span className="text-caption text-neutral-500">
                {metadata?.date}
              </span>
            </div>
            
            <h1 className="text-h1 font-bold text-primary-900 mb-4">
              {metadata?.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-neutral-600">
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                <span className="text-body">{metadata?.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span className="text-body">{metadata?.date}</span>
              </div>
            </div>
            
            {metadata?.tags && metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {metadata.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center bg-neutral-100 text-neutral-700 text-caption px-2 py-1 rounded"
                  >
                    <Tag size={12} className="mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* 文章内容 */}
        <article className="bg-background-surface rounded-lg p-8 shadow-sm">
          <MarkdownRenderer content={processedContent} />
        </article>

        {/* 底部导航 */}
        <footer className="mt-12 text-center">
          <Link
            to={backPath}
            className="bg-primary-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            返回{backLabel}
          </Link>
        </footer>
      </div>
    </div>
  );
};

export default ContentViewer;
