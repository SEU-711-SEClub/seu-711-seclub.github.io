import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, BookOpen, Calendar, TrendingUp } from 'lucide-react';
import { useContentIndex, getLatestAnnouncements } from '../hooks/useContent';
import useScrollToTop from '../hooks/useScrollToTop';

const Home = () => {
  useScrollToTop(); // 页面加载时滚动到顶部
  const { index, loading, error } = useContentIndex();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    if (index) {
      // 从experiences.categories.announcements中获取通知
      const latestAnnouncements = index.experiences?.categories?.announcements || [];
      const sorted = latestAnnouncements
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3);
      setAnnouncements(sorted);
    }
  }, [index]);

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <img
              src="/711club-logo.jpg"
              alt="711Club Logo"
              className="h-32 w-32 mx-auto rounded-lg shadow-lg"
            />
          </div>
          <h1 className="text-hero font-bold text-primary-900 mb-6 tracking-tight">
            711Club
          </h1>
          <p className="text-body-lg text-neutral-700 mb-8 max-w-3xl mx-auto">
            东南大学软件学院生涯交流群
          </p>
          <p className="text-body text-neutral-600 mb-12 max-w-2xl mx-auto">
            温暖互助 · 专业成长 · 资源共享
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/experiences"
              className="bg-accent-red text-white px-8 py-4 rounded-md font-semibold hover:bg-accent-dark transition-all duration-fast transform hover:-translate-y-0.5 hover:shadow-lg shadow-accent-red/30"
            >
              浏览内容中心
            </Link>
            <Link
              to="/undergrad?tab=requirements"
              className="bg-accent-red text-white px-8 py-4 rounded-md font-semibold hover:bg-accent-dark transition-all duration-fast transform hover:-translate-y-0.5 hover:shadow-lg shadow-accent-red/30"
            >
              浏览本科培养
            </Link>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-h2 font-bold text-center text-primary-900 mb-12">
            核心价值
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background-surface p-8 rounded-lg shadow-sm hover:shadow-lg transition-all duration-normal transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-primary-500" size={24} />
              </div>
              <h3 className="text-h3 font-semibold text-primary-900 mb-3">
                温暖互助
              </h3>
              <p className="text-body text-neutral-600">
                学长学姐倾囊相授，同学之间互帮互助，营造温馨的学习交流氛围。
              </p>
            </div>
            <div className="bg-background-surface p-8 rounded-lg shadow-sm hover:shadow-lg transition-all duration-normal transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="text-accent-orange" size={24} />
              </div>
              <h3 className="text-h3 font-semibold text-primary-900 mb-3">
                专业成长
              </h3>
              <p className="text-body text-neutral-600">
                提供技术交流平台，分享前沿技术趋势，助力每位成员的专业发展。
              </p>
            </div>
            <div className="bg-background-surface p-8 rounded-lg shadow-sm hover:shadow-lg transition-all duration-normal transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-semantic-info/10 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="text-semantic-info" size={24} />
              </div>
              <h3 className="text-h3 font-semibold text-primary-900 mb-3">
                资源共享
              </h3>
              <p className="text-body text-neutral-600">
                整合实习、竞赛、升学等优质资源，为成员的生涯发展提供全方位支持。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background-surface">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-h2 font-bold text-center text-primary-900 mb-12">
            最新动态
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200"></div>
              
              {announcements.map((announcement, index) => (
                <div key={index} className="relative flex items-start mb-8 last:mb-0">
                  {/* Timeline dot */}
                  <div className="absolute left-2 w-4 h-4 bg-primary-500 rounded-full border-4 border-background-surface"></div>
                  
                  {/* Content */}
                  <div className="ml-12 bg-background-surface p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-normal">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-h3 font-semibold text-primary-900">
                        {announcement.title}
                      </h3>
                      <span className="text-caption text-neutral-500">
                        {announcement.date}
                      </span>
                    </div>
                    <p className="text-body text-neutral-600 mb-3">
                      {announcement.excerpt}
                    </p>
                    {announcement.link ? (
                      announcement.link.startsWith('http') ? (
                        <a
                          href={announcement.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary-600 hover:text-primary-700 text-body font-medium transition-colors"
                        >
                          查看详情 →
                        </a>
                      ) : (
                        <Link
                          to={announcement.link}
                          className="text-primary-600 hover:text-primary-700 text-body font-medium transition-colors"
                        >
                          查看详情 →
                        </Link>
                      )
                    ) : (
                      <Link 
                        to={`/content/experiences/announcements/${announcement.file.split('/').pop()}`}
                        className="text-primary-600 hover:text-primary-700 text-body font-medium transition-colors"
                      >
                        查看详情 →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
              
              {announcements.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-body text-neutral-500">暂无最新动态</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
