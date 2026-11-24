'use client';
import { useEffect, useRef, useState } from 'react';

const TARGET = new Date('2026-12-27T13:00:00+05:00').getTime();
const MAPS = 'https://maps.app.goo.gl/PKBped6Xq9HMjRsD8';
const EMBED = 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d28802.571910190676!2d69.0284711!3d25.527666!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x394eadc2373195ef%3A0x8c82526de0734406!2sHatul%20Banquet%20Mirpurkhas!5e0!3m2!1sen!2s!4v1795536273525!5m2!1sen!2s';
const pad = (n) => String(n).padStart(2, '0');

function Calendar() {
  const cells = [null, null, ...Array.from({ length: 31 }, (_, i) => i + 1)]; // 1 Dec 2026 is a Tuesday
  return (
    <div className="cal rv rz">
      <div className="calh"><b>December 2026</b><small>Rajab 1448 AH</small></div>
      <div className="cg">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <i key={i}>{d}</i>)}
        {cells.map((d, i) => (
          <span key={i} className={d === 27 ? 'me' : i % 7 === 0 ? 'sun' : ''}>
            {d}
            {d === 27 && <svg viewBox="0 0 60 60" aria-hidden="true"><path pathLength="1" d="M30 4C45 3 57 14 56 30 55 46 42 57 28 56 13 55 4 43 5 29 6 14 20 5 38 6" /></svg>}
          </span>
        ))}
      </div>
      <p className="calf">Sunday, 27 December 2026</p>
    </div>
  );
}

export default function Home() {
  const [phase, setPhase] = useState('idle'); // idle | playing | done
  const [gone, setGone] = useState(false);
  const [hero, setHero] = useState(0); // 1 = background opens, 2 = text shows
  const [muted, setMuted] = useState(false);
  const [stars, setStars] = useState([]);
  const [t, setT] = useState({ d: 0, h: '00', m: '00', s: '00' });
  const vid = useRef(null), ac = useRef(null), timer = useRef(null), finished = useRef(false);
  const H = hero >= 2 ? ' in' : '';

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const tick = () => {
      const s = Math.max(0, Math.floor((TARGET - Date.now()) / 1000));
      setT({ d: Math.floor(s / 86400), h: pad(Math.floor((s % 86400) / 3600)), m: pad(Math.floor((s % 3600) / 60)), s: pad(s % 60) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => { clearInterval(id); clearInterval(timer.current); };
  }, []);

  useEffect(() => {
    if (phase !== 'done') return;
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.15 });
    document.querySelectorAll('.rv').forEach((el) => { if (!el.closest('#hero')) io.observe(el); });
    return () => io.disconnect();
  }, [phase]);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    setPhase('done');
    document.body.style.overflow = '';
    setTimeout(() => setGone(true), 1500);
    setTimeout(() => setHero(1), 600);
    setTimeout(() => setHero(2), 2900);
    setStars(Array.from({ length: 14 }, () => ({ l: Math.random() * 100, f: 8 + Math.random() * 12, d: 9 + Math.random() * 10, y: Math.random() * 10 })));
  };

  const startMusic = () => {
    try {
      const a = new (window.AudioContext || window.webkitAudioContext)(); ac.current = a;
      const master = a.createGain(); master.gain.value = 0; master.connect(a.destination);
      master.gain.linearRampToValueAtTime(0.5, a.currentTime + 3);
      const rev = a.createDelay(); rev.delayTime.value = 0.32;
      const fb = a.createGain(); fb.gain.value = 0.4; rev.connect(fb); fb.connect(rev); rev.connect(master);
      const chords = [[146.8, 220, 261.6, 329.6], [130.8, 196, 261.6, 329.6], [116.5, 174.6, 233.1, 293.7], [110, 164.8, 220, 277.2]];
      const scale = [293.7, 329.6, 349.2, 440, 493.9, 587.3, 659.3];
      const tone = (f, at, d, g, type) => {
        const o = a.createOscillator(), n = a.createGain();
        o.type = type; o.frequency.value = f;
        n.gain.setValueAtTime(0, at); n.gain.linearRampToValueAtTime(g, at + 0.05 + d * 0.15); n.gain.exponentialRampToValueAtTime(0.0001, at + d);
        o.connect(n); n.connect(master); n.connect(rev); o.start(at); o.stop(at + d + 0.1);
      };
      let bar = 0;
      const sched = () => {
        const at = a.currentTime + 0.1;
        chords[bar % 4].forEach((f) => { tone(f, at, 7.5, 0.05, 'sine'); tone(f * 2.003, at, 7.5, 0.02, 'triangle'); });
        for (let i = 0; i < 8; i++) if (Math.random() < 0.78) tone(scale[Math.floor(Math.random() * scale.length)], at + i * 0.9 + 0.2, 2.4, 0.06, 'sine');
        bar++;
      };
      sched(); timer.current = setInterval(sched, 7200);
    } catch (e) {}
  };

  const enter = () => {
    setPhase('playing'); startMusic();
    const p = vid.current && vid.current.play();
    if (p && p.catch) p.catch(finish);
    setTimeout(finish, 9500);
  };
  const toggleMute = () => {
    if (!ac.current) return;
    if (muted) ac.current.resume(); else ac.current.suspend();
    setMuted(!muted);
  };

  return (
    <>
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true"><symbol id="kh" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="22" y="22" width="56" height="56" /><rect x="22" y="22" width="56" height="56" transform="rotate(45 50 50)" /><circle cx="50" cy="50" r="15" /><circle cx="50" cy="50" r="4" fill="currentColor" /></symbol></svg>

      {!gone && (
        <div id="intro" className={phase === 'done' ? 'out' : ''}>
          <video ref={vid} src="/palace.mp4" poster="/poster.jpg" muted playsInline preload="auto" onEnded={finish}
            onTimeUpdate={(e) => { const v = e.currentTarget; if (v.duration && v.currentTime > v.duration - 0.9) finish(); }} />
          <button id="enter" type="button" className={phase !== 'idle' ? 'gone' : ''} onClick={enter}>Tap to Enter</button>
        </div>
      )}
      {phase === 'done' && <button id="mute" type="button" style={{ display: 'block' }} aria-label={muted ? 'Unmute music' : 'Mute music'} onClick={toggleMute}>{muted ? '🔇' : '🔊'}</button>}
      {stars.map((s, i) => <div key={i} className="star" style={{ left: s.l + 'vw', fontSize: s.f, animationDuration: s.d + 's', animationDelay: s.y + 's' }}>✦</div>)}

      <section id="hero" className={(hero >= 1 ? 'go' : '') + (hero >= 2 ? ' txt' : '')}>
        <div className="hbg" />
        <svg className={'khatam rv rz' + H} aria-hidden="true"><use href="#kh" /></svg>
        <div className={'bism rv' + H}>بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ</div>
        <p className={'inv sal rv' + H} style={{ '--d': '.15s' }}>Assalamu Alaikum Wa Rahmatullahi Wa Barakatuh</p>
        <div className={'host rv' + H} style={{ '--d': '.3s' }}>Mr. &amp; Mrs. Imtiaz Wahla</div>
        <p className={'inv rv' + H} style={{ '--d': '.45s' }}>joyfully invite you to the Walima and Nikah of their beloved children</p>
        <div className={'couple rv rl' + H} style={{ '--d': '.6s' }}><div className="occ">Walima</div><h1 className="gold">Sajid Ur Rehman</h1><div className="weds">weds</div><h1 className="gold">Sadia Ashfaque</h1></div>
        <div className="orn"><svg className="khatam" style={{ width: 30, height: 30, margin: '0 auto', animationDuration: '12s' }} aria-hidden="true"><use href="#kh" /></svg></div>
        <div className={'couple rv rr' + H} style={{ '--d': '.75s' }}><div className="occ">Nikah</div><h1 className="gold">Samrah Imtiaz</h1><div className="weds">weds</div><h1 className="gold">Mohammad Sumair</h1></div>
        <p className={'inv rv' + H} style={{ '--d': '.9s' }}>Sunday, 27 December 2026<br />Rajab 1448 AH</p>
        <div className="hint">Scroll ↓</div>
      </section>

      <section>
        <svg className="khatam rv rz" aria-hidden="true"><use href="#kh" /></svg>
        <p className="ayah rv" dir="rtl" lang="ar">وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً</p>
        <p className="tr rv">“And among His signs is that He created for you mates from among yourselves, that you may find tranquility in them, and He placed between you affection and mercy.”</p>
        <p className="ref rv">Surah Ar-Rum, 30:21</p>
      </section>

      <section>
        <h2 className="rv">Yaum-e-Mubarak</h2>
        <p className="sub rv">The blessed day, In Sha Allah</p>
        <Calendar />
      </section>

      <section>
        <h2 className="rv">Counting the Blessed Moments</h2>
        <p className="sub rv">Until the Nikah and Walima, In Sha Allah</p>
        <div className="cd rv"><div><b>{t.d}</b><small>Days</small></div><div><b>{t.h}</b><small>Hours</small></div><div><b>{t.m}</b><small>Minutes</small></div><div><b>{t.s}</b><small>Seconds</small></div></div>
      </section>

      <section>
        <h2 className="rv">Blessed Gatherings</h2>
        <p className="sub rv">Sunday, 27 December 2026, Rajab 1448 AH</p>
        <div className="ev rv rl"><div className="ar">نکاح</div><h3>Nikah</h3><div className="t">1:00 PM</div><p className="who">Mohammad Sumair &amp; Samrah Imtiaz</p><p className="d">The sacred solemnisation, with Khutbah and Ijab-o-Qubool</p></div>
        <div className="ev rv rr"><div className="ar">ولیمہ</div><h3>Walima Lunch</h3><div className="t">1:30 PM</div><p className="who">Sajid Ur Rehman &amp; Sadia Ashfaque</p><p className="d">A blessed Sunnah feast shared with both families</p></div>
        <div className="ev rv rl"><div className="ar">رخصتی</div><h3>Rukhsati</h3><div className="t">2:30 PM</div><p className="who">Samrah Imtiaz</p><p className="d">The bride’s farewell, with duas from her loved ones</p></div>
      </section>

      <section>
        <h2 className="rv">Venue</h2>
        <div className="ev rv"><h3>Hatul Banquet</h3><p>Mirpurkhas, Sindh, Pakistan</p>
          <iframe className="map" src={EMBED} title="Map of Hatul Banquet, Mirpurkhas" loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
          <a className="btn" target="_blank" rel="noopener noreferrer" href={MAPS}>Get Directions</a></div>
      </section>

      <section>
        <h2 className="rv">A Humble Request</h2>
        <p className="sub rv">Please keep the newlywed couples in your duas</p>
        <div className="ev rv rz"><p className="ayah" dir="rtl" lang="ar">بَارَكَ اللَّهُ لَكَ وَبَارَكَ عَلَيْكَ وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ</p><p className="tr">“May Allah bless you, shower His blessings upon you, and unite you both in goodness.”</p><p className="ref">The Dua for the Newlywed, Sunan Abi Dawud</p></div>
      </section>

      <footer>Your presence will be a blessing<br />Jazakumullahu Khairan<br /><small style={{ fontSize: '.9rem', opacity: 0.8 }}>The Wahla Family</small></footer>
    </>
  );
}
