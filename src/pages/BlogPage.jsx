import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

export const BlogPage = () => {
  const posts = [
    {
      id: 1,
      title: 'How to optimize Minecraft Paper & Purpur for 100+ players',
      category: 'Game Optimization',
      date: 'November 10, 2026',
      readTime: '4 min read',
      excerpt: 'Fine-tune your Aikar flags, entity tracking ranges, and chunk generation settings to maintain a solid 20.0 TPS.'
    },
    {
      id: 2,
      title: 'Expanding our Noida Edge Datacenter with AMD EPYC 7C13 nodes',
      category: 'Infrastructure',
      date: 'November 04, 2026',
      readTime: '3 min read',
      excerpt: 'We have added 512GB DDR4 ECC nodes to our Delhi-NCR hub, reducing peak evening latencies across North India.'
    },
    {
      id: 3,
      title: 'Understanding DDoS protection on UDP game ports',
      category: 'Security',
      date: 'October 28, 2026',
      readTime: '6 min read',
      excerpt: 'How BGP Flowspec and automated traffic scrubbing shields your community from spoofed reflection attacks.'
    }
  ];

  return (
    <div className="py-16 relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-left">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#C5F36A]">
            NEWS &amp; INSIGHTS
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mt-1">
            ZEROX CLOUD Blog
          </h1>
          <p className="mt-2 text-sm text-neutral-300">
            Guides, performance benchmarks, and infrastructure announcements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-[#0c140f]/5 border border-white/15 p-6 rounded-3xl backdrop-blur-2xl transition duration-300 flex flex-col justify-between shadow-xl"
            >
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white/10 text-[#C5F36A]">
                  {post.category}
                </span>
                <h3 className="text-base font-bold text-white mt-3 leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-neutral-500">
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3" /> {post.date}
                </span>
                <span className="text-white hover:text-[#C5F36A] font-bold flex items-center gap-1 cursor-pointer">
                  Read &rarr;
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

