import React, { useEffect, useState } from 'react';
import { SERVER_CONFIG } from '../config/server';
import {
  Mail,
  MessageSquare,
  Send,
  ExternalLink,
  Disc as DiscordIcon,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'motion/react';

const CONTACT_METHODS = [
  {
    icon: DiscordIcon,
    title: 'Discord Support',
    description: 'Fastest way to reach our team — open a ticket in our Discord server.',
    action: 'Join Discord',
    href: SERVER_CONFIG.discordUrl,
    external: true,
  },
  {
    icon: Mail,
    title: 'Business Email',
    description: 'For partnerships, press, or anything that needs a written record.',
    action: 'Send Email',
    href: 'mailto:contact@butterflynetwork.gg',
    external: false,
  },
];

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = 'Contact | Butterfly Network';
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(`[Website] Message from ${name || 'a player'}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

    window.location.href = `mailto:contact@butterflynetwork.gg?subject=${subject}&body=${body}`;

    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            <span>Get in Touch</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white font-heading tracking-tight">
            Contact {SERVER_CONFIG.serverName}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg">
            Have a question, report, or partnership idea? We'd love to hear from you.
          </p>
        </div>

        {/* Contact methods */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {CONTACT_METHODS.map((method, idx) => {
            const Icon = method.icon;

            return (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="glass-panel rounded-2xl p-6 border space-y-4 flex flex-col"
              >
                <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-purple-300" />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{method.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{method.description}</p>
                </div>

                <a
                  href={method.href}
                  target={method.external ? '_blank' : undefined}
                  rel={method.external ? 'noreferrer' : undefined}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-purple-600 hover:bg-purple-500 transition-colors"
                >
                  <span>{method.action}</span>
                  {method.external && <ExternalLink className="w-3.5 h-3.5 opacity-70" />}
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* Contact form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="glass-panel rounded-3xl p-6 sm:p-8 border space-y-6"
        >
          <div>
            <h2 className="text-2xl font-bold text-white font-heading">Send Us a Message</h2>
            <p className="text-sm text-slate-400 mt-1">
              This opens your email client with a pre-filled message — nothing is sent automatically.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Steve"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">Your Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="steve@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Message</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what's on your mind..."
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400/50 resize-none"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/40 shadow-lg shadow-purple-950/50 transition-all active:scale-95"
            >
              {sent ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Opening Email...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
