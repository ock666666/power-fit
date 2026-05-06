import { useState } from 'react';
import { motion } from 'framer-motion';
import Modal from './Modal';
import type { Exercise } from '../data/exercises';

interface Props {
  exercise: Exercise | null;
  onClose: () => void;
}

function getBilibiliEmbedUrl(url: string): string {
  if (!url) return '';
  // Already an embed/player URL
  if (url.includes('player.bilibili.com')) return url;
  // Extract BV or AV id from the URL
  const match = url.match(/(BV[a-zA-Z0-9]+)|(av\d+)/i);
  if (match) {
    const id = match[0];
    const prefix = id.toLowerCase().startsWith('av') ? 'aid' : 'bvid';
    return `https://player.bilibili.com/player.html?${prefix}=${id}`;
  }
  return url;
}

export default function ExerciseModal({ exercise, onClose }: Props) {
  const [pcInput, setPcInput] = useState('');
  const [pcResult, setPcResult] = useState('');
  const [pcLoading, setPcLoading] = useState(false);

  if (!exercise) return null;

  const handlePostureCheck = async () => {
    if (!pcInput.trim()) return;
    setPcLoading(true);
    const apiKey = localStorage.getItem('deepseek_api_key') || '';
    try {
      const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: `你是健身教练，分析"${exercise.name}"的动作问题。用简洁中文回答，3条以内建议。` },
            { role: 'user', content: pcInput },
          ],
          max_tokens: 300,
        }),
      });
      const data = await resp.json();
      setPcResult(data.choices?.[0]?.message?.content || '分析失败，请重试');
    } catch {
      setPcResult('网络错误，请检查 API Key 后重试');
    }
    setPcLoading(false);
  };

  return (
    <Modal open={!!exercise} onClose={onClose} maxWidth="max-w-xl">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-4xl">{exercise.emoji}</span>
        <div>
          <h2 className="text-xl font-heading font-semibold">{exercise.name}</h2>
          <span className={`text-xs px-2 py-0.5 rounded ${
            exercise.difficulty === '初级' ? 'bg-green-500/10 text-green-400' :
            exercise.difficulty === '中级' ? 'bg-yellow-500/10 text-yellow-400' :
            'bg-red-500/10 text-red-400'
          }`}>{exercise.difficulty}</span>
        </div>
      </div>

      <p className="text-sm text-foreground/60 mb-4">{exercise.desc}</p>
      <p className="text-sm font-semibold text-accent mb-4">{exercise.sets}</p>

      {/* Video */}
      {exercise.videoUrl && (
        <div className="mb-4 rounded-xl overflow-hidden bg-black/40 aspect-video">
          <iframe
            src={getBilibiliEmbedUrl(exercise.videoUrl)}
            className="w-full h-full"
            allowFullScreen
            allow="autoplay; encrypted-media"
          />
        </div>
      )}

      {/* Steps */}
      <h4 className="text-sm font-semibold mb-2 text-foreground/80">执行步骤</h4>
      <ol className="list-decimal list-inside space-y-1.5 mb-6 text-sm text-foreground/60">
        {exercise.steps.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>

      {/* Posture Correction */}
      <div className="border-t border-white/5 pt-4">
        <h4 className="text-sm font-semibold mb-2">🤖 姿势纠错</h4>
        <div className="flex gap-2">
          <input
            value={pcInput}
            onChange={(e) => setPcInput(e.target.value)}
            placeholder="描述你的问题，比如膝盖疼..."
            className="flex-1 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-foreground placeholder:text-foreground/20 outline-none focus:border-accent/40"
          />
          <button
            onClick={handlePostureCheck}
            disabled={pcLoading || !pcInput.trim()}
            className="liquid-glass rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-30"
          >
            {pcLoading ? '分析中...' : '分析'}
          </button>
        </div>
        {pcResult && (
          <motion.div
            className="mt-3 rounded-lg bg-white/[0.02] border border-white/5 p-3 text-sm text-foreground/70"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {pcResult}
          </motion.div>
        )}
      </div>
    </Modal>
  );
}
