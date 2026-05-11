/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Palette, 
  Cloud, 
  Volume2, 
  VolumeX,
  Ghost,
  Orbit,
  Sparkle,
  Info
} from 'lucide-react';

/**
 * 高级音频引擎：支持多种合成器类型与谐和音阶
 */
class AudioEngine {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  // 宫调式五声音阶 (C4 - C6)
  private pentatonicScale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  // 播放星空音符 (带有长混响感)
  playHarmonicNote(index?: number) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;

    const freq = index !== undefined 
      ? this.pentatonicScale[index % this.pentatonicScale.length]
      : this.pentatonicScale[Math.floor(Math.random() * this.pentatonicScale.length)];

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(500, this.ctx.currentTime + 1.0);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.0);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 2.0);
  }

  playPop() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  playBoing(freq = 150) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  playPoof() {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  startAmbience() {
    if (!this.ctx) this.init();
    if (!this.ctx || this.noiseNode) return;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const source = this.ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, this.ctx.currentTime);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    source.start();
    this.noiseNode = source;
  }

  stopAmbience() {
    if (this.noiseNode) {
      this.noiseNode.stop();
      this.noiseNode = null;
    }
  }
}

const audio = new AudioEngine();

type ModuleType = 'jelly' | 'music' | 'kaleidoscope' | 'gravity' | 'clouds';

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleType>('jelly');
  const [isSoundOn, setIsSoundOn] = useState(false);
  const [showHelp, setShowHelp] = useState(true);

  const toggleSound = () => {
    if (!isSoundOn) {
      audio.init();
      audio.startAmbience();
    } else {
      audio.stopAmbience();
    }
    setIsSoundOn(!isSoundOn);
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowHelp(false), 5000);
    return () => clearTimeout(timer);
  }, [activeModule]);

  return (
    <div className="fixed inset-0 bg-[#FDFCF0] text-[#4A4E69] font-sans overflow-hidden flex flex-col select-none touch-none">
      {/* 动态背景光晕 */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.15, 1],
            rotate: [0, 10, 0],
            x: [0, 30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-25%] left-[-25%] w-[70%] h-[70%] bg-[#A8DADC] rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.25, 1],
            x: [0, -50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-25%] right-[-25%] w-[70%] h-[70%] bg-[#FFB7B2] rounded-full blur-[120px]" 
        />
      </div>

      {/* 顶部状态栏 */}
      <header className="relative z-30 p-6 flex justify-between items-center bg-white/10 backdrop-blur-[2px]">
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 180 }}
            className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center cursor-pointer"
          >
            <Sparkle className="text-[#98C1D9]" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#4A4E69]">CalmKids</h1>
            <p className="text-[10px] uppercase font-black opacity-30 mt-[-2px] tracking-widest">舒缓情绪实验室 v2.0</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => setShowHelp(!showHelp)}
            className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#98C1D9] shadow-sm hover:bg-[#FDFCF0] transition-colors"
          >
            <Info size={20} />
          </button>
          <button 
            onClick={toggleSound}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${isSoundOn ? 'bg-[#98C1D9] text-white animate-pulse' : 'bg-white text-[#98C1D9]'}`}
          >
            {isSoundOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
        </div>
      </header>

      {/* 核心展示区 */}
      <main className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeModule === 'jelly' && <JellyModule key="jelly" />}
          {activeModule === 'music' && <MusicModule key="music" />}
          {activeModule === 'kaleidoscope' && <KaleidoscopeModule key="kaleidoscope" />}
          {activeModule === 'gravity' && <GravityModule key="gravity" />}
          {activeModule === 'clouds' && <CloudModule key="clouds" />}
        </AnimatePresence>

        {/* 浮动帮助提示 */}
        <AnimatePresence>
          {showHelp && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40"
            >
              <div className="bg-[#4A4E69] text-white px-8 py-3 rounded-full text-sm font-bold shadow-2xl flex items-center gap-3">
                <div className="w-2 h-2 bg-[#FFB7B2] rounded-full animate-ping" />
                {getHelpText(activeModule)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 底部导航栏 */}
      <nav className="relative z-30 p-8 flex justify-center gap-4 sm:gap-6 bg-white/60 backdrop-blur-xl rounded-t-[4rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-white">
        <NavBtn id="jelly" active={activeModule === 'jelly'} onClick={() => setActiveModule('jelly')} icon={<Ghost size={28} />} label="果冻怪" color="#B2E2F2" />
        <NavBtn id="music" active={activeModule === 'music'} onClick={() => setActiveModule('music')} icon={<Music size={28} />} label="钢琴星空" color="#FFD1DC" />
        <NavBtn id="kaleidoscope" active={activeModule === 'kaleidoscope'} onClick={() => setActiveModule('kaleidoscope')} icon={<Palette size={28} />} label="万花筒" color="#E2F0CB" />
        <NavBtn id="gravity" active={activeModule === 'gravity'} onClick={() => setActiveModule('gravity')} icon={<Orbit size={28} />} label="重力球" color="#FFB7B2" />
        <NavBtn id="clouds" active={activeModule === 'clouds'} onClick={() => setActiveModule('clouds')} icon={<Cloud size={28} />} label="吹云朵" color="#D8E2DC" />
      </nav>
    </div>
  );
}

function getHelpText(module: ModuleType) {
  switch(module) {
    case 'jelly': return "拽拽它，或者按 [空格] 让它弹一弹";
    case 'music': return "点击屏幕或按 [A-Z]，点亮你的星座";
    case 'kaleidoscope': return "随手画一划，按 [C] 或双击清屏";
    case 'gravity': return "使用 [方向键] 或倾斜手机控制引力";
    case 'clouds': return "点击乌云让它散开，狂点会有惊喜";
  }
}

function NavBtn({ id, active, onClick, icon, label, color }: { id: string, active: boolean, onClick: () => void, icon: any, label: string, color: string }) {
  return (
    <button 
      id={`nav-${id}`}
      onClick={onClick}
      className={`flex flex-col items-center gap-3 transition-all transform hover:scale-110 active:scale-90`}
    >
      <div 
        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[2rem] flex items-center justify-center transition-all duration-500 ${active ? 'shadow-[0_15px_30px_rgba(0,0,0,0.1)] scale-110' : 'opacity-40 grayscale-[0.5]'}`}
        style={{ backgroundColor: active ? color : '#FFFFFF' }}
      >
        <div className={active ? 'text-[#4A4E69]' : 'text-gray-400'}>{icon}</div>
      </div>
      <span className={`text-[11px] font-black uppercase tracking-widest transition-opacity duration-300 ${active ? 'opacity-100 mt-1' : 'opacity-0'}`}>
        {label}
      </span>
    </button>
  );
}

// --- 模块 1: 物理果冻怪 (加强版) ---
function JellyModule() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const points = useRef<any[]>([]);
  const isDragging = useRef<any>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const color = useRef('#A8DADC');

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf: number;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const numPoints = 18;
    const radius = 110;
    
    points.current = [];
    for(let i=0; i<numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      points.current.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        ox: cx + Math.cos(angle) * radius,
        oy: cy + Math.sin(angle) * radius,
      });
    }
    const centerPoint = { x: cx, y: cy, ox: cx, oy: cy };
    points.current.push(centerPoint);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const gravity = 0.25;
      const friction = 0.97;

      points.current.forEach(p => {
        const vx = (p.x - p.ox) * friction;
        const vy = (p.y - p.oy) * friction;
        p.ox = p.x;
        p.oy = p.y;
        p.x += vx;
        p.y += vy + gravity;
      });

      // 强力 Verlets 约束
      for(let iter=0; iter<6; iter++) {
        points.current.forEach((p, i) => {
          if(i === points.current.length - 1) return;
          const cp = points.current[points.current.length - 1]; 
          const dx = p.x - cp.x;
          const dy = p.y - cp.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          const diff = (radius - dist) * 0.15;
          p.x += (dx / dist) * diff;
          p.y += (dy / dist) * diff;
          cp.x -= (dx / dist) * diff * 0.1;
          cp.y -= (dy / dist) * diff * 0.1;

          const next = points.current[(i + 1) % (points.current.length - 1)];
          const ldx = p.x - next.x;
          const ldy = p.y - next.y;
          const ldist = Math.sqrt(ldx*ldx + ldy*ldy);
          const targetLDist = (Math.PI * 2 * radius) / (points.current.length - 1);
          const ldiff = (targetLDist - ldist) * 0.4;
          p.x += (ldx / ldist) * ldiff * 0.5;
          p.y += (ldy / ldist) * ldiff * 0.5;
          next.x -= (ldx / ldist) * ldiff * 0.5;
          next.y -= (ldy / ldist) * ldiff * 0.5;
        });
        
        // 底部弹性碰撞
        points.current.forEach(p => {
          if(p.y > canvas.height - 150) {
            const vy = p.y - p.oy;
            p.y = canvas.height - 150;
            p.oy = p.y + vy * 0.5;
          }
          if(p.x < 100) p.x = 100;
          if(p.x > canvas.width - 100) p.x = canvas.width - 100;
        });
      }

      // 绘制流体果冻主体
      ctx.save(); // 保存当前绘图状态
      ctx.beginPath();
      ctx.moveTo(points.current[0].x, points.current[0].y);
      for(let i=0; i<points.current.length - 1; i++) {
        const p1 = points.current[i];
        const p2 = points.current[(i + 1) % (points.current.length - 1)];
        const xc = (p1.x + p2.x) / 2;
        const yc = (p1.y + p2.y) / 2;
        ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
      }
      ctx.closePath();
      
      // 优化颜色表现
      ctx.shadowBlur = 40;
      ctx.shadowColor = color.current + '88'; // 稍微增加阴影不透明度
      ctx.fillStyle = color.current;
      ctx.fill();
      
      // 描边不需要透明度
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 14;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.restore(); // 恢复状态，确保 alpha 不会溢出到眼睛部分

      // 交互式眼睛 (追踪鼠标)
      const cp = points.current[points.current.length-1];
      const angle = Math.atan2(mousePos.current.y - cp.y, mousePos.current.x - cp.x);
      const eyeOffset = 8;
      
      const drawEye = (ox: number) => {
        ctx.save();
        ctx.fillStyle = 'white';
        ctx.beginPath();
        const ex = cp.x + ox;
        const ey = cp.y - 12;
        ctx.arc(ex, ey, 16, 0, Math.PI*2);
        ctx.fill();
        ctx.fillStyle = '#4A4E69';
        ctx.beginPath();
        ctx.arc(ex + Math.cos(angle) * eyeOffset, ey + Math.sin(angle) * eyeOffset, 8, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
      };
      
      drawEye(-35);
      drawEye(35);

      // 腮红
      ctx.save();
      ctx.fillStyle = '#FFB7B2';
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(cp.x - 60, cp.y + 10, 10, 0, Math.PI*2);
      ctx.arc(cp.x + 60, cp.y + 10, 10, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();

      raf = requestAnimationFrame(draw);
    };
    draw();

    const handleJump = (e: any) => {
      if(e.code === 'Space') {
        points.current.forEach(p => { p.y -= 70; p.x += (Math.random()-0.5)*120; });
        color.current = ['#FFD1DC', '#B2E2F2', '#E2F0CB', '#FFB7B2', '#A8DADC'][Math.floor(Math.random()*5)];
        audio.playBoing(180);
      }
    };

    const handleDown = (e: any) => {
      const x = e.clientX || e.touches?.[0].clientX;
      const y = e.clientY || e.touches?.[0].clientY;
      const cp = points.current[points.current.length-1];
      if(Math.hypot(cp.x - x, cp.y - y) < 180) {
        isDragging.current = { offset: { x: cp.x - x, y: cp.y - y } };
        audio.playBoing(300);
      }
    };

    const handleMove = (e: any) => {
      const x = e.clientX || e.touches?.[0].clientX;
      const y = e.clientY || e.touches?.[0].clientY;
      mousePos.current = { x, y };
      if(isDragging.current) {
        const cp = points.current[points.current.length-1];
        cp.x = x + isDragging.current.offset.x;
        cp.y = y + isDragging.current.offset.y;
        cp.ox = cp.x;
        cp.oy = cp.y;
      }
    };

    window.addEventListener('keydown', handleJump);
    canvas.addEventListener('mousedown', handleDown);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', () => isDragging.current = null);
    canvas.addEventListener('touchstart', handleDown);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', () => isDragging.current = null);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleJump);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  );
}

// --- 模块 2: 钢琴星空 (重塑版) ---
function MusicModule() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stars = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf: number;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      // 深度星空感与星云背景
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0B132B');
      gradient.addColorStop(1, '#1C2541');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制流动的星系微粒 (Nebula)
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for(let i=0; i<3; i++) {
        ctx.beginPath();
        const time = Date.now() * 0.0005 + i;
        ctx.fillStyle = `hsla(${200 + i * 20}, 40%, 30%, 0.1)`;
        ctx.arc(
          canvas.width/2 + Math.cos(time) * 100, 
          canvas.height/2 + Math.sin(time * 0.8) * 100, 
          300 + Math.sin(time) * 50, 
          0, Math.PI*2
        );
        ctx.fill();
      }
      ctx.restore();

      // 绘制星座连线 (更加灵动)
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([5, 5]); // 使用虚线
      for (let i = 0; i < stars.current.length; i++) {
        for (let j = i + 1; j < stars.current.length; j++) {
          const s1 = stars.current[i];
          const s2 = stars.current[j];
          const dist = Math.hypot(s1.x - s2.x, s1.y - s2.y);
          if (dist < 180) {
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
          }
        }
      }
      ctx.stroke();
      ctx.restore();

      // 绘制星星与涟漪
      stars.current.forEach((s, i) => {
        s.y += s.vy;
        s.x += s.vx;
        s.vy += 0.015; // 稍微减弱重力，让星星漂浮感更强
        s.opacity *= 0.996;
        
        // 拖尾效果 (类似流星)
        ctx.beginPath();
        ctx.strokeStyle = s.color;
        ctx.globalAlpha = s.opacity * 0.3;
        ctx.lineWidth = s.size * 0.5;
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 10, s.y - s.vy * 10);
        ctx.stroke();

        // 涟漪光晕
        ctx.save();
        ctx.beginPath();
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 12);
        grad.addColorStop(0, s.color + '66');
        grad.addColorStop(0.5, s.color + '22');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.arc(s.x, s.y, s.size * 15, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();

        // 核心亮点
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = s.opacity;
        ctx.shadowBlur = 15;
        ctx.shadowColor = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI*2);
        ctx.fill();
        ctx.restore();

        if(s.y > canvas.height + 150 || s.opacity < 0.03) stars.current.splice(i, 1);
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    const addStarAt = (x: number, y: number, noteIdx?: number) => {
      audio.playHarmonicNote(noteIdx);
      const color = ['#FFD1DC', '#B2E2F2', '#E2F0CB', '#FFB7B2', '#FFFFFF'][Math.floor(Math.random()*5)];
      stars.current.push({
        x, y,
        vx: (Math.random() - 0.5) * 2,
        vy: -1 - Math.random() * 2,
        size: 1.5 + Math.random() * 3,
        color,
        opacity: 1
      });
    };

    const handleDown = (e: any) => {
      const x = e.clientX || e.touches?.[0].clientX;
      const y = e.clientY || e.touches?.[0].clientY;
      addStarAt(x, y);
    };

    const handleKey = (e: any) => {
      if(e.code.startsWith('Key')) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        addStarAt(x, y, e.code.charCodeAt(3));
      }
    };

    window.addEventListener('mousedown', handleDown);
    window.addEventListener('touchstart', handleDown);
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('touchstart', handleDown);
      window.removeEventListener('keydown', handleKey);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#0B132B]">
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  );
}

// --- 模块 3: 万花筒涂鸦 (加强版) ---
function KaleidoscopeModule() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const hue = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();

    const drawLineSymmetric = (x1: number, y1: number, x2: number, y2: number) => {
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const sectors = 10;
      const angle = (Math.PI * 2) / sectors;

      ctx.save();
      ctx.translate(cx, cy);
      
      for (let i = 0; i < sectors; i++) {
        ctx.rotate(angle);
        const draw = (mx: number, my: number) => {
          ctx.beginPath();
          ctx.moveTo(x1 - cx, (y1 - cy) * mx);
          ctx.lineTo(x2 - cx, (y2 - cy) * mx);
          ctx.strokeStyle = `hsla(${hue.current}, 80%, 75%, 0.8)`;
          ctx.lineWidth = 6 + Math.sin(Date.now() / 100) * 4;
          ctx.shadowBlur = 15;
          ctx.shadowColor = `hsla(${hue.current}, 80%, 75%, 0.5)`;
          ctx.stroke();
        };
        draw(1, 1);
        draw(1, -1);
      }
      ctx.restore();
    };

    let lastX = 0, lastY = 0;

    const handleMove = (e: any) => {
      if (!isDrawing.current) return;
      const x = e.clientX || e.touches?.[0].clientX;
      const y = e.clientY || e.touches?.[0].clientY;
      hue.current = (hue.current + 2) % 360;
      drawLineSymmetric(lastX, lastY, x, y);
      lastX = x;
      lastY = y;
    };

    const handleDown = (e: any) => {
      isDrawing.current = true;
      lastX = e.clientX || e.touches?.[0].clientX;
      lastY = e.clientY || e.touches?.[0].clientY;
      audio.playHarmonicNote();
    };

    const handleKey = (e: any) => {
      if(e.key === 'c' || e.key === 'C') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        audio.playPoof();
      }
    };

    canvas.addEventListener('mousedown', handleDown);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', () => isDrawing.current = false);
    canvas.addEventListener('touchstart', handleDown);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', () => isDrawing.current = false);
    window.addEventListener('keydown', handleKey);
    canvas.addEventListener('dblclick', () => ctx.clearRect(0, 0, canvas.width, canvas.height));

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#FDFCF0]">
      <canvas ref={canvasRef} className="w-full h-full cursor-pencil" />
    </motion.div>
  );
}

// --- 模块 4: 重力重力球 (加强版) ---
function GravityModule() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const balls = useRef<any[]>([]);
  const gravity = useRef({ x: 0, y: 0.8 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let raf: number;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();

    balls.current = [];
    const colors = ['#FFD1DC', '#B2E2F2', '#E2F0CB', '#FFB7B2', '#A8DADC'];
    for(let i=0; i<100; i++) {
      balls.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        r: 12 + Math.random() * 12,
        color: colors[i % colors.length]
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      balls.current.forEach((b, i) => {
        b.vx += gravity.current.x * 0.6;
        b.vy += gravity.current.y * 0.6;
        b.vx *= 0.99;
        b.vy *= 0.99;
        b.x += b.vx;
        b.y += b.vy;

        // 边界弹性
        if(b.x < b.r) { b.x = b.r; b.vx *= -0.6; if(Math.abs(b.vx) > 2) audio.playPop(); }
        if(b.x > canvas.width - b.r) { b.x = canvas.width - b.r; b.vx *= -0.6; if(Math.abs(b.vx) > 2) audio.playPop(); }
        if(b.y < b.r) { b.y = b.r; b.vy *= -0.6; if(Math.abs(b.vy) > 2) audio.playPop(); }
        if(b.y > canvas.height - b.r) { b.y = canvas.height - b.r; b.vy *= -0.6; if(Math.abs(b.vy) > 2) audio.playPop(); }

        // 球体碰撞 (简化)
        for(let j=i+1; j<balls.current.length; j++){
          const b2 = balls.current[j];
          const dx = b2.x - b.x;
          const dy = b2.y - b.y;
          const dist = Math.hypot(dx, dy);
          const minDist = b.r + b2.r;
          if(dist < minDist){
            const angle = Math.atan2(dy, dx);
            const tx = b.x + Math.cos(angle) * minDist;
            const ty = b.y + Math.sin(angle) * minDist;
            const ax = (tx - b2.x) * 0.5;
            const ay = (ty - b2.y) * 0.5;
            b.vx -= ax; b.vy -= ay;
            b2.vx += ax; b2.vy += ay;
          }
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI*2);
        ctx.shadowBlur = 10;
        ctx.shadowColor = b.color + '44';
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.stroke();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    const handleKey = (e: any) => {
      if(e.key === 'ArrowUp') gravity.current = { x: 0, y: -0.8 };
      if(e.key === 'ArrowDown') gravity.current = { x: 0, y: 0.8 };
      if(e.key === 'ArrowLeft') gravity.current = { x: -0.8, y: 0 };
      if(e.key === 'ArrowRight') gravity.current = { x: 0.8, y: 0 };
    };

    const handleOrientation = (e: any) => {
      if (e.beta && e.gamma) {
        gravity.current.x = (e.gamma / 25);
        gravity.current.y = (e.beta / 25);
      }
    };

    window.addEventListener('keydown', handleKey);
    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('deviceorientation', handleOrientation);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
      <canvas ref={canvasRef} className="w-full h-full" />
    </motion.div>
  );
}

// --- 模块 5: 云朵消消气 (加强版) ---
function CloudModule() {
  const [clouds, setClouds] = useState<any[]>([]);
  const [hearts, setHearts] = useState<any[]>([]);

  useEffect(() => {
    const spawnTimer = setInterval(() => {
      setClouds(prev => {
        if(prev.length > 6) return prev;
        return [...prev, {
          id: Math.random(),
          x: -150,
          y: Math.random() * (window.innerHeight - 350) + 100,
          scale: 0.8 + Math.random() * 0.5,
          speed: 1.2 + Math.random() * 1.5,
          hits: 0
        }];
      });
    }, 1800);
    return () => clearInterval(spawnTimer);
  }, []);

  useEffect(() => {
    let raf: number;
    const move = () => {
      setClouds(prev => prev.map(c => ({...c, x: c.x + c.speed})).filter(c => c.x < window.innerWidth + 200));
      setHearts(prev => prev.map(h => ({
        ...h, 
        y: h.y + h.vy, 
        x: h.x + h.vx, 
        opacity: h.opacity - 0.015,
        rotate: h.rotate + h.vr
      })).filter(h => h.opacity > 0));
      raf = requestAnimationFrame(move);
    };
    move();
    return () => cancelAnimationFrame(raf);
  }, []);

  const blastCloud = (id: number, x: number, y: number) => {
    audio.playPoof();
    setClouds(prev => prev.map(c => c.id === id ? {...c, hits: c.hits + 1} : c));
    
    // 烟雾效果
    const newHearts = [];
    for(let i=0; i<6; i++){
      newHearts.push({
        id: Math.random(),
        x, y,
        vx: (Math.random() - 0.5) * 6,
        vy: -2 - Math.random() * 5,
        vr: (Math.random() - 0.5) * 10,
        rotate: 0,
        opacity: 1,
        symbol: ['❤️', '🌈', '🍭', '✨', '☁️'][Math.floor(Math.random()*5)]
      });
    }
    setHearts(prev => [...prev, ...newHearts]);

    // 检查是否摧毁
    setClouds(prev => {
      const target = prev.find(c => c.id === id);
      if(target && target.hits >= 2) return prev.filter(c => c.id !== id);
      return prev;
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
      {clouds.map(c => (
        <motion.div 
          key={c.id}
          whileTap={{ scale: 0.8 }}
          onClick={() => blastCloud(c.id, c.x, c.y)}
          className="absolute cursor-pointer select-none"
          style={{ x: c.x, y: c.y, scale: c.scale }}
        >
          <div className={`relative w-36 h-20 bg-gray-300 rounded-full transition-all duration-300 ${c.hits > 0 ? 'bg-white opacity-60' : 'bg-gray-400'}`}>
            <div className="absolute top-[-25px] left-1/4 w-24 h-24 bg-inherit rounded-full shadow-inner" />
            <div className="absolute top-[-40px] left-1/2 w-20 h-20 bg-inherit rounded-full shadow-inner" />
            <div className="absolute top-[-10px] right-1/4 w-24 h-24 bg-inherit rounded-full shadow-inner" />
            {/* 表情 */}
            <div className="absolute inset-0 flex items-center justify-center pt-2">
              <div className="flex gap-4">
                <div className="w-2 h-2 bg-gray-500/40 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-500/40 rounded-full animate-bounce" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {hearts.map(h => (
        <div 
          key={h.id}
          className="absolute text-3xl pointer-events-none select-none"
          style={{ left: h.x, top: h.y, opacity: h.opacity, transform: `rotate(${h.rotate}deg)` }}
        >
          {h.symbol}
        </div>
      ))}
    </motion.div>
  );
}
