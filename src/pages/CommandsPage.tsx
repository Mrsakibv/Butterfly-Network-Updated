import React, { useEffect, useState } from 'react';
import { Terminal, Copy, Check, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface CommandEntry {
  command: string;
  description: string;
  permission?: string;
}

interface CommandCategory {
  title: string;
  description: string;
  commands: CommandEntry[];
}

const COMMAND_CATEGORIES: CommandCategory[] = [
  {
    title: 'General Commands',
    description: 'Available to every player on the network.',
    commands: [
      { command: '/spawn', description: 'Teleport back to the network spawn hub.' },
      { command: '/home', description: 'Teleport to your set home location.' },
      { command: '/sethome', description: 'Set your current location as home.' },
      { command: '/tpa <player>', description: 'Send a teleport request to another player.' },
      { command: '/msg <player> <message>', description: 'Send a private message to another player.' },
      { command: '/rules', description: 'View the server rules in-game.' },
      { command: '/discord', description: 'Get an invite link to our Discord server.' },
    ],
  },
  {
    title: 'Economy & Trading',
    description: 'Manage your balance and trade with other players.',
    commands: [
      { command: '/balance', description: 'Check your current in-game balance.' },
      { command: '/pay <player> <amount>', description: 'Send gold to another player.' },
      { command: '/auction', description: 'Open the player auction house.' },
      { command: '/shop', description: 'Open the server item shop.' },
    ],
  },
  {
    title: 'Rank & Store',
    description: 'Commands unlocked with a purchased rank or item.',
    commands: [
      { command: '/kit vip', description: 'Claim your VIP starter kit.', permission: 'VIP+' },
      { command: '/fly', description: 'Toggle creative-style flight.', permission: 'VIP+' },
      { command: '/heal', description: 'Restore your health and hunger.', permission: 'Master+' },
      { command: '/nick <name>', description: 'Set a custom nickname above your head.', permission: 'VIP+' },
      { command: '/crate key', description: 'Check your available crate keys.', permission: 'All Players' },
    ],
  },
  {
    title: 'Staff Commands',
    description: 'Restricted to Butterfly Network staff members.',
    commands: [
      { command: '/vanish', description: 'Toggle invisibility for staff moderation.', permission: 'Staff' },
      { command: '/freeze <player>', description: 'Freeze a player suspected of misconduct.', permission: 'Staff' },
      { command: '/ban <player> <reason>', description: 'Ban a player from the network.', permission: 'Admin' },
      { command: '/mute <player> <duration>', description: 'Temporarily mute a player in chat.', permission: 'Mod+' },
    ],
  },
];

export const CommandsPage: React.FC = () => {
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'Commands | Butterfly Network';
  }, []);

  const handleCopy = (command: string) => {
    navigator.clipboard.writeText(command.split(' ')[0]).then(() => {
      setCopied(command);
      setTimeout(() => setCopied(null), 1500);
    });
  };

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            <span>Server Commands</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white font-heading tracking-tight">
            Butterfly Network Commands
          </h1>

          <p className="text-slate-300 text-base sm:text-lg">
            A quick reference for all in-game commands available across the network — from
            everyday utilities to rank-exclusive perks.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {COMMAND_CATEGORIES.map((category, idx) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="glass-panel rounded-3xl p-6 sm:p-8 border space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-white font-heading">{category.title}</h2>
                <p className="text-sm text-slate-400 mt-1">{category.description}</p>
              </div>

              <div className="grid gap-3">
                {category.commands.map((cmd) => (
                  <div
                    key={cmd.command}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/30 transition-colors"
                  >
                    <button
                      onClick={() => handleCopy(cmd.command)}
                      className="inline-flex items-center gap-2 shrink-0 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 font-mono text-sm text-purple-300 hover:bg-purple-500/20 transition-colors"
                      title="Copy command"
                    >
                      {copied === cmd.command ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 opacity-60" />
                      )}
                      <span>{cmd.command}</span>
                    </button>

                    <p className="text-sm text-slate-300 flex-1">{cmd.description}</p>

                    {cmd.permission && (
                      <span className="shrink-0 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20 w-fit">
                        {cmd.permission}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <div className="p-6 rounded-2xl bg-purple-950/30 border border-purple-500/30 flex items-center gap-3 justify-center text-center">
          <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
          <p className="text-xs sm:text-sm text-slate-400">
            Some commands may vary slightly between game modes. Type <span className="font-mono text-purple-300">/help</span> in-game for a full list.
          </p>
        </div>
      </div>
    </div>
  );
};
