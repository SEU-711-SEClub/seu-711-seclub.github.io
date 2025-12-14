import fs from 'fs';
import path from 'path';

// 解析frontmatter的函数
function parseFrontmatter(content) {
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    return { data: {}, content: content };
  }
  
  const frontmatterText = frontmatterMatch[1];
  const markdownContent = content.substring(frontmatterMatch[0].length).trim();
  
  const data = {};
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
        data[key] = value.split(',').map(tag => tag.trim()).filter(tag => tag);
      } else {
        data[key] = value;
      }
    }
  });
  
  return { data, content: markdownContent };
}

// 定义内容目录路径
const contentDir = path.join(process.cwd(), 'public', 'content');

// 经验分享的子分类（包括announcements）
const experienceSubcategories = ['保研', '就业', '留学', '实习', '考研', '技术栈', 'announcements'];

// 生成内容索引
function generateContentIndex() {
  const index = {
    announcements: [],
    experiences: {
      categories: {},
      all: []
    },
    undergrad: {
      requirements: []
    },
    lastUpdated: new Date().toISOString()
  };

  // 处理经验分享（包括announcements作为子分类）
  const experiencesDir = path.join(contentDir, 'experiences');
  if (fs.existsSync(experiencesDir)) {
    for (const subcategory of experienceSubcategories) {
      const subcategoryDir = path.join(experiencesDir, subcategory);
      if (fs.existsSync(subcategoryDir)) {
        const experienceFiles = fs.readdirSync(subcategoryDir)
          .filter(file => file.endsWith('.md'))
          .sort((a, b) => {
            // 按修改时间排序
            const statA = fs.statSync(path.join(subcategoryDir, a));
            const statB = fs.statSync(path.join(subcategoryDir, b));
            return statB.mtimeMs - statA.mtimeMs;
          });

        index.experiences.categories[subcategory] = [];

        for (const file of experienceFiles) {
          const filePath = path.join(subcategoryDir, file);
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const { data: frontMatter, content } = parseFrontmatter(fileContent);
          
          // 提取前150个字符作为摘要
          const excerpt = content
            .replace(/#+\s+/g, '') // 移除标题标记
            .replace(/\*\*/g, '') // 移除粗体标记
            .replace(/\*/g, '') // 移除斜体标记
            .replace(/`/g, '') // 移除代码标记
            .replace(/\[(.+?)\]\(.+?\)/g, '$1') // 移除链接，保留文本
            .trim()
            .substring(0, 150) + '...';

          const experience = {
            title: frontMatter.title || file.replace('.md', ''),
            author: frontMatter.author || '匿名',
            year: frontMatter.year || '未知',
            date: frontMatter.date || '2024-01-01',
            excerpt: frontMatter.excerpt || excerpt,
            tags: frontMatter.tags || [],
            category: subcategory,
            link: frontMatter.link || '',
            file: `experiences/${subcategory}/${file}`
          };

          index.experiences.categories[subcategory].push(experience);
          index.experiences.all.push(experience);
        }
      }
    }
  }

  // 处理本科培养 - 毕业要求（markdown 可编辑）
  const undergradRequirementsDir = path.join(contentDir, 'undergrad', 'requirements');
  if (fs.existsSync(undergradRequirementsDir)) {
    const requirementFiles = fs.readdirSync(undergradRequirementsDir)
      .filter(file => file.endsWith('.md'))
      .sort((a, b) => {
        const statA = fs.statSync(path.join(undergradRequirementsDir, a));
        const statB = fs.statSync(path.join(undergradRequirementsDir, b));
        return statB.mtimeMs - statA.mtimeMs;
      });

    for (const file of requirementFiles) {
      const filePath = path.join(undergradRequirementsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data: frontMatter, content } = parseFrontmatter(fileContent);

      const excerpt = content
        .replace(/#+\s+/g, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/`/g, '')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')
        .trim()
        .substring(0, 150) + '...';

      const requirement = {
        title: frontMatter.title || file.replace('.md', ''),
        author: frontMatter.author || '匿名',
        year: frontMatter.year || (frontMatter.date ? frontMatter.date.slice(0, 4) : '未知'),
        date: frontMatter.date || '2025-01-01',
        excerpt: frontMatter.excerpt || excerpt,
        tags: frontMatter.tags || [],
        category: frontMatter.category || '毕业要求',
        file: `undergrad/requirements/${file}`
      };

      index.undergrad.requirements.push(requirement);
    }
  }

  // 将索引写入JSON文件
  const indexPath = path.join(contentDir, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), 'utf-8');
  
  console.log('内容索引生成完成！');
  console.log(`- 经验分享总数: ${index.experiences.all.length}`);
  experienceSubcategories.forEach(cat => {
    console.log(`  - ${cat}: ${index.experiences.categories[cat]?.length || 0}篇`);
  });
  console.log(`- 本科毕业要求: ${index.undergrad.requirements.length}篇`);
}

// 执行生成
generateContentIndex();
