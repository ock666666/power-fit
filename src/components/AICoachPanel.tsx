import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

interface Message {
  role: 'user' | 'bot';
  content: string;
}

const QUICK_PROMPTS = [
  { label: '📋 生成计划', prompt: 'plan' },
  { label: '🔧 动作纠错', prompt: 'correct' },
  { label: '🥗 饮食建议', prompt: 'diet' },
  { label: '💡 今日推荐', prompt: 'recommend' },
];

const SYSTEM_PROMPTS: Record<string, string> = {
  plan: '你是健身教练，根据用户的训练目标、每周训练天数和可用器械，为其生成一份为期一周的训练计划。用中文回答，格式：每天的训练重点和具体动作。',
  correct: '你是健身教练，请分析用户描述的动作问题并给出简洁的3条纠正建议。用中文回答。',
  diet: '你是营养师，根据用户的训练目标提供饮食建议。用中文回答，简洁实用。',
  recommend: '你是健身教练，根据用户信息推荐今天的训练内容和饮食。用中文回答。',
};

export default function AICoachPanel({ onClose }: { onClose: () => void }) {
  const { apiKey, setApiKey } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: '你好！我是AI健身教练，有什么可以帮你的？' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(!apiKey);
  const [keyInput, setKeyInput] = useState(apiKey);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string, promptType?: string) => {
    if (!apiKey) { setShowSettings(true); return; }
    const userMsg: Message = { role: 'user', content };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const systemPrompt = promptType ? SYSTEM_PROMPTS[promptType] || '' : '你是专业的健身教练和营养师，用中文回答用户的所有健身相关问题。简洁、实用、鼓励。';
      // Keep last 10 messages for context, plus the current user message
      const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
      const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content },
          ],
          max_tokens: 600,
        }),
      });
      const data = await resp.json();
      const reply = data.choices?.[0]?.message?.content || '抱歉，我暂时无法回答，请稍后重试。';
      setMessages((m) => [...m, { role: 'bot', content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: 'bot', content: '网络错误，请检查API Key后重试。' }]);
    }
    setLoading(false);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex flex-col bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
        <span className="font-heading font-semibold">AI教练</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowSettings(!showSettings)} className="text-sm text-foreground/40 hover:text-foreground">⚙️</button>
          <button onClick={onClose} className="text-xl text-foreground/40 hover:text-foreground">✕</button>
        </div>
      </div>

      {/* Settings */}
      {showSettings && (
        <div className="mx-4 mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <input type="password" value={keyInput} onChange={(e) => setKeyInput(e.target.value)}
            placeholder="输入 DeepSeek API Key"
            className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm outline-none focus:border-accent/40 mb-2" />
          <p className="text-[10px] text-foreground/30 mb-2">免费获取 → platform.deepseek.com</p>
          <button onClick={() => { setApiKey(keyInput); setShowSettings(false); }}
            className="liquid-glass rounded-lg px-4 py-2 text-xs font-medium w-full">
            保存
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
              m.role === 'user'
                ? 'bg-accent/10 border border-accent/20 text-foreground'
                : 'bg-white/[0.02] border border-white/5 text-foreground/80'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-2.5">
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="text-sm text-foreground/40"
              >
                ●●●
              </motion.span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-4 py-2 flex flex-wrap gap-1.5">
        {QUICK_PROMPTS.map((q) => (
          <button key={q.prompt} onClick={() => sendMessage(q.label, q.prompt)}
            className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-foreground/50 hover:text-foreground hover:border-white/20 transition-colors">
            {q.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/5 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && input.trim()) sendMessage(input.trim()); }}
          placeholder="输入你的问题..."
          className="flex-1 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm outline-none focus:border-accent/40"
        />
        <button onClick={() => input.trim() && sendMessage(input.trim())}
          disabled={!input.trim() || loading}
          className="liquid-glass rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-20">
          发送
        </button>
      </div>
    </motion.div>
  );
}
