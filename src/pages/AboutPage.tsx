import React, { useEffect } from 'react';
import { SERVER_CONFIG } from '../config/server';
import { Info, Rocket, Users2, Target, HeartHandshake, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const STORY_POINTS = [
  {
    icon: Rocket,
    title: 'How We Started',
    text: `${SERVER_CONFIG.serverName} began as a small passion project among friends who wanted a fair, lag-free place to enjoy Minecraft together. It has since grown into a full community network.`,
  },
  {
    icon: Target,
    title: 'Our Mission',
    text: 'To provide a high-performance, non-pay-to-win Minecraft experience where every player — new or veteran — feels welcome and has a fair shot at fun.',
  },
  {
    icon: Users2,
    title: 'Our Community',
    text: 'Thousands of players across Java and Bedrock editions, active daily on our Discord, in-game events, and community-built worlds.',
  },
  {
    icon: HeartHandshake,
    title: 'Our Promise',
    text: 'Transparent moderation, active development, and a store that never sells gameplay advantages — only cosmetics and quality-of-life perks.',
  },
];

export const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = 'About | Butterfly Network';
  }, []);

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
            <Info className="w-3.5 h-3.5 text-purple-400" />
            <span>About Us</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white font-heading tracking-tight">
            About {SERVER_CONFIG.serverName}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg">
            {SERVER_CONFIG.tagline}
          </p>
        </div>

        {/* Story grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {STORY_POINTS.map((point, idx) => {
            const Icon = point.icon;

            return (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="glass-panel rounded-2xl p-6 border space-y-3"
              >
                <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-purple-300" />
                </div>
                <h3 className="text-lg font-bold text-white">{point.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{point.text}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { label: 'Supported Version', value: SERVER_CONFIG.version },
            { label: 'Editions', value: 'Java + Bedrock' },
            { label: 'Uptime Goal', value: '99.9%' },
            { label: 'Founded', value: `${SERVER_CONFIG.copyrightYear}` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/5"
            >
              <div className="text-lg font-extrabold text-white">{stat.value}</div>
              <div className="text-[11px] text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Closing note */}
        <div className="p-6 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex items-center gap-3 justify-center text-center">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <p className="text-xs sm:text-sm text-slate-400">
            Thanks for being part of the journey. See you in-game!
          </p>
        </div>
      </div>
    </div>
  );
};
