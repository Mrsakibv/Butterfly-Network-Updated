import React, { useEffect } from 'react';
import { Users, Crown, ShieldCheck, Wrench, MessageSquareHeart, ExternalLink } from 'lucide-react';
import { SERVER_CONFIG } from '../config/server';
import { motion } from 'motion/react';

interface StaffMember {
  name: string;
  role: string;
}

interface StaffGroup {
  title: string;
  description: string;
  icon: React.ElementType;
  accent: string;
  members: StaffMember[];
}

const STAFF_GROUPS: StaffGroup[] = [
  {
    title: 'Owners',
    description: 'Founders responsible for the vision and direction of the network.',
    icon: Crown,
    accent: 'from-amber-500/20 to-orange-500/10 border-amber-500/30',
    members: [
      { name: 'MrSakib', role: 'Founder & Owner' },
    ],
  },
  {
    title: 'Administrators',
    description: 'Oversee server operations, staff management, and major updates.',
    icon: ShieldCheck,
    accent: 'from-purple-500/20 to-indigo-500/10 border-purple-500/30',
    members: [
      { name: 'Admin_One', role: 'Head Administrator' },
      { name: 'Admin_Two', role: 'Administrator' },
    ],
  },
  {
    title: 'Developers',
    description: 'Build and maintain the custom plugins and features you play with.',
    icon: Wrench,
    accent: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30',
    members: [
      { name: 'Dev_Alpha', role: 'Lead Developer' },
      { name: 'Dev_Beta', role: 'Backend Developer' },
    ],
  },
  {
    title: 'Moderators & Helpers',
    description: 'On the front line, keeping chat friendly and helping new players.',
    icon: MessageSquareHeart,
    accent: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30',
    members: [
      { name: 'Mod_One', role: 'Senior Moderator' },
      { name: 'Mod_Two', role: 'Moderator' },
      { name: 'Helper_One', role: 'Helper' },
      { name: 'Helper_Two', role: 'Helper' },
    ],
  },
];

export const StaffPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Staff | Butterfly Network';
  }, []);

  const getInitials = (name: string) =>
    name
      .replace(/_/g, ' ')
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>Meet the Team</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white font-heading tracking-tight">
            Butterfly Network Staff
          </h1>

          <p className="text-slate-300 text-base sm:text-lg">
            The people behind the network — always working to keep Butterfly Network fair,
            fun, and running smoothly.
          </p>
        </div>

        {/* Staff groups */}
        <div className="space-y-8">
          {STAFF_GROUPS.map((group, idx) => {
            const Icon = group.icon;

            return (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="glass-panel rounded-3xl p-6 sm:p-8 border space-y-6"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${group.accent} border flex items-center justify-center shrink-0`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white font-heading">{group.title}</h2>
                    <p className="text-sm text-slate-400">{group.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.members.map((member) => (
                    <div
                      key={member.name}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-colors"
                    >
                      <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 font-bold text-sm shrink-0">
                        {getInitials(member.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-white text-sm truncate">{member.name}</p>
                        <p className="text-xs text-slate-400 truncate">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Apply CTA */}
        <div className="p-6 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-bold text-white text-base font-heading">Want to Join the Team?</h3>
            <p className="text-xs text-slate-400">
              We periodically open staff applications on our Discord server. Keep an eye out!
            </p>
          </div>

          <a
            href={SERVER_CONFIG.discordUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-purple-600 hover:bg-purple-500 shrink-0"
          >
            <span>Join Discord</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>
      </div>
    </div>
  );
};
