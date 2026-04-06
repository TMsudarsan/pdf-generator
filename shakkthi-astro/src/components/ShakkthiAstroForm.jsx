/**
 * ShakkthiAstroForm.jsx
 *
 * HOW TO USE IN YOUR REACT PROJECT
 * ─────────────────────────────────────────────────────────────
 * 1. Copy ShakkthiAstroForm.jsx  →  src/components/
 *    Copy ShakkthiAstroForm.css  →  src/components/
 *
 * 2. Install html2pdf.js:
 *      npm install html2pdf.js
 *
 * 3. Tailwind must already be configured in your project.
 *    If not, run:  npm install -D tailwindcss postcss autoprefixer
 *                  npx tailwindcss init -p
 *    Then add to tailwind.config.js → content:
 *      ["./src/**\/*.{js,jsx,ts,tsx}"]
 *
 * 4. Import and render:
 *      import ShakkthiAstroForm from './components/ShakkthiAstroForm';
 *      export default function App() { return <ShakkthiAstroForm />; }
 * ─────────────────────────────────────────────────────────────
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import './ShakkthiAstroForm.css';
import { flushSync } from 'react-dom';

/* ═══════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════ */
const todayStr = () => {
  const n = new Date();
  return [
    String(n.getDate()).padStart(2, '0'),
    String(n.getMonth() + 1).padStart(2, '0'),
    n.getFullYear(),
  ].join('.');
};

const initForm = () => ({
  date: todayStr(),
  loc: 'West Mambalam / Chennai',
  name: '', dob: '', pob: '', rasi: '', star: '', lagnam: '', dasa: '',
  lc1: '', lc2: '', lc3: '',
  ac1: '', ac2: '', ac3: '',
  ...Object.fromEntries([...Array(16)].map((_, i) => [`ld${i + 1}`, ''])),
  ...Object.fromEntries([...Array(16)].map((_, i) => [`ad${i + 1}`, ''])),
  ...Object.fromEntries([...Array(4)].map((_, i) => [`ln${i + 1}`, ''])),
  ...Object.fromEntries([...Array(4)].map((_, i) => [`an${i + 1}`, ''])),
  gem1: '', gem2: '', gem3: '',
  weight: '', metal: '',
  worship: '', mattra: '',
});

/* ═══════════════════════════════════════════════
   SMALL REUSABLE COMPONENTS
═══════════════════════════════════════════════ */

/** Text input used inside the screen form */
const FInput = ({ fid, val, onChange, im = 'text', ph = '', ac = 'off' }) => (
  <input
    id={fid}
    value={val}
    onChange={(e) => onChange(fid, e.target.value)}
    inputMode={im}
    placeholder={ph}
    autoComplete={ac}
    style={{
      width: '100%',
      fontSize: 'clamp(12px,2.8vw,14px)',
      color: '#1e293b',
      padding: '4px 4px',
    }}
  />
);

/** Numeric grid cell (dates / numbers sections) */
const GCell = ({ fid, val, onChange }) => (
  <td
    style={{
      border: '1.5px solid #1a3a6e',
      width: '12.5%',
      textAlign: 'center',
      padding: '3px 2px',
    }}
  >
    <input
      value={val}
      onChange={(e) => onChange(fid, e.target.value)}
      inputMode="numeric"
      style={{
        width: '100%',
        textAlign: 'center',
        fontSize: 'clamp(12px,2.5vw,13px)',
        color: '#1e293b',
        borderBottom: '1.5px solid #c8d4f0',
        padding: '2px 0',
      }}
    />
  </td>
);

/** Animated toggle pill button */
const Toggle = ({ label, icon, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold',
      'transition-all duration-200 border-2 select-none cursor-pointer',
      active
        ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/30'
        : 'bg-slate-600 border-slate-500 text-slate-300',
    ].join(' ')}
  >
    <span className="text-sm">{icon}</span>
    <span className="hidden sm:inline">{label}</span>
    {/* pill track */}
    <span
      className={[
        'relative w-8 h-4 rounded-full ml-1 transition-all duration-200',
        active ? 'bg-emerald-300' : 'bg-slate-500',
      ].join(' ')}
    >
      {/* pill thumb */}
      <span
        className={[
          'absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all duration-200',
          active ? 'left-4' : 'left-0.5',
        ].join(' ')}
      />
    </span>
  </button>
);

/* ═══════════════════════════════════════════════
   INLINE STYLE TOKENS  (screen form tables)
   Using JS objects so clamp() values work fine.
═══════════════════════════════════════════════ */
const S = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    border: '2.5px solid #1a3a6e',
    borderTop: 'none',
  },
  tdBase: {
    border: '1.5px solid #1a3a6e',
    verticalAlign: 'middle',
    padding: 0,
  },
  lbl: {
    border: '1.5px solid #1a3a6e',
    width: '44%',
    background: '#f0f5ff',
    padding: '8px 10px',
    fontWeight: 700,
    color: '#1a3a6e',
    fontSize: 'clamp(10px,2.3vw,12px)',
    lineHeight: 1.45,
    verticalAlign: 'middle',
  },
  val: {
    border: '1.5px solid #1a3a6e',
    padding: '4px 8px',
    verticalAlign: 'middle',
  },
  secHd: {
    border: '1.5px solid #1a3a6e',
    background: '#1a3a6e',
    color: '#fff',
    fontWeight: 700,
    textAlign: 'center',
    fontSize: 'clamp(10px,2.4vw,12.5px)',
    padding: '6px 10px',
  },
  halfHd: {
    border: '1.5px solid #1a3a6e',
    background: '#eef2ff',
    color: '#1a3a6e',
    fontWeight: 700,
    textAlign: 'center',
    fontSize: 'clamp(9.5px,2.2vw,11.5px)',
    padding: '6px 8px',
    lineHeight: 1.4,
  },
  lineRow: {
    border: '1.5px solid #1a3a6e',
    padding: '5px 10px',
    fontSize: 'clamp(10px,2.3vw,12px)',
    fontWeight: 600,
    color: '#1a3a6e',
  },
};

const TOAST_BG = {
  success: '#059669',
  error: '#dc2626',
  warn: '#d97706',
  info: '#1a3a6e',
};

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function ShakkthiAstroForm() {
  const [form, setForm] = useState(initForm);
  const [showHdr, setShowHdr] = useState(true);
  const [showFtr, setShowFtr] = useState(true);
  const [toast, setToast] = useState({ show: false, msg: '', type: 'info' });
  const [busy, setBusy] = useState({ pdf: false, wa: false });

  const pdfRef = useRef(null);
  const toastTid = useRef(null);

  /** update a single form field */
  const set = useCallback((k, v) => setForm((f) => ({ ...f, [k]: v })), []);

  /** show a timed notification */
  const notify = useCallback((msg, type = 'info', ms = 3200) => {
    clearTimeout(toastTid.current);
    setToast({ show: true, msg, type });
    toastTid.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), ms);
  }, []);

  /* ── lazy-load html2pdf from npm ────────── */
  useEffect(() => {
    // html2pdf.js is already available via npm install html2pdf.js
    // Nothing extra needed — imported dynamically below
  }, []);

  /* ── PDF layer visibility helpers ─────── */
  const revealPDF = () => {
    const el = pdfRef.current;
    if (!el) return;

    el.style.left = '0';
    el.style.visibility = 'visible';  // 🔥 instead of opacity
    el.style.position = 'fixed';
    el.style.top = '0';
    el.style.zIndex = '9999';
  };

  const hidePDF = () => {
    const el = pdfRef.current;
    if (!el) return;

    el.style.left = '-9999px';
    el.style.visibility = 'hidden';
  };
  /* ── html2pdf options ────────────────── */
  const PDF_OPT = {
    margin: [6, 6, 6, 6],
    image: { type: 'jpeg', quality: 1 }, // increase quality
    html2canvas: {
      scale: 3, // higher = better color clarity
      useCORS: true,
      letterRendering: true,
      logging: false,
      allowTaint: true,
      windowWidth: 1200,
      windowHeight: 1600,
      backgroundColor: "#ffffff", // ✅ IMPORTANT (prevents black bg)

      // ✅ FORCE COLORS
      onclone: (doc) => {
        const el = doc.getElementById('pdf-layer');

        if (el) {
          el.style.visibility = 'visible';
          el.style.display = 'block'; // 🔥 IMPORTANT
          el.style.opacity = '1';

          // Force text rendering
          el.querySelectorAll('*').forEach((node) => {
            node.style.color = node.style.color || '#000';
          });
        }
      }
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
  };
  /* ── Download PDF ───────────────────── */
const dlPDF = async () => {
  try {
    notify('⏳ Generating PDF...', 'info');
    setBusy((b) => ({ ...b, pdf: true }));

    // Wait for UI render
    await new Promise((r) => setTimeout(r, 500));

    const element = pdfRef.current;

    if (!element) {
      throw new Error("PDF element not found");
    }

    const html2pdf = (await import("html2pdf.js")).default;

    const opt = {
      margin: 5,
      filename: `Astro_${Date.now()}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    };

    await html2pdf().set(opt).from(element).save();

    notify("✅ PDF Downloaded", "success");
  } catch (err) {
    console.error(err);
    notify("❌ PDF Failed: " + err.message, "error");
  } finally {
    setBusy((b) => ({ ...b, pdf: false }));
  }
};
  /* ── Print ──────────────────────────── */
  const doPrint = () => {
    revealPDF();
    window.print();
    setTimeout(hidePDF, 1500);
  };

  /* ── WhatsApp share ──────────────────── */
  const doWA = async () => {
    notify('⏳ PDF தயாரிக்கப்படுகிறது...', 'info');
    setBusy((b) => ({ ...b, wa: true }));
    revealPDF();
    await new Promise((r) => setTimeout(r, 1000));
const nm = (form.name.trim() || 'Jathagam').replace(/\s+/g, '_');
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const blob = await html2pdf()
        .set(PDF_OPT)
        .from(pdfRef.current)
        .outputPdf('blob');
      hidePDF();
      const file = new File([blob], `Shakkthi_Astro_${nm}.pdf`, { type: 'application/pdf' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Shakkthi Astro – ஜாதகம்' });
        notify('✅ பகிர்வு வெற்றி!', 'success');
      } else {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = file.name;
        a.click();
        setTimeout(() => window.open('https://web.whatsapp.com', '_blank'), 1200);
        notify('📥 PDF பதிவிறக்கம் → WhatsApp-ல் இணைக்கவும்', 'info', 5000);
      }
    } catch (e) {
      hidePDF();
      if (e.name !== 'AbortError') notify('❌ பிழை: ' + e.message, 'error', 5000);
    } finally {
      setBusy((b) => ({ ...b, wa: false }));
    }
  };
  const getDOB = () => {
  if (!form.dobDate && !form.dobTime) return '';
  return `${form.dobDate || ''} ${form.dobTime || ''}`;
};

  /* ══════════════════════════════════════════════
     JSX
  ══════════════════════════════════════════════ */
  return (
    <>
      {/* ── STICKY NAVBAR ── */}
      <nav
        className="no-print sticky top-0 z-50 shadow-xl"
        style={{
          background: 'linear-gradient(135deg,#0f2347,#1a3a6e)',
          borderBottom: '2px solid #2a5298',
        }}
      >
        {/* Row 1 — title + action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
          <div>
            <p className="text-white font-bold text-sm sm:text-base tracking-wide leading-tight">
              ✦ Shakkthi Astro Centre
            </p>
            <p className="text-blue-300 text-[10px] sm:text-xs leading-tight">
              ஜாதகம் படிவம் – Jathagam Form
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* PDF */}
            <button
              type="button"
              onClick={dlPDF}
              disabled={busy.pdf}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg font-bold
                text-xs sm:text-sm bg-amber-400 text-slate-900 shadow-lg
                disabled:opacity-50 active:scale-95 transition-transform cursor-pointer whitespace-nowrap"
            >
              {busy.pdf ? '⏳ தயாரிக்கிறது...' : '⬇ PDF'}
            </button>

            {/* Print */}
            <button
              type="button"
              onClick={doPrint}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg font-bold
                text-xs sm:text-sm text-white border-2 border-white/30 bg-white/10
                active:scale-95 transition-transform cursor-pointer whitespace-nowrap"
            >
              🖨 Print
            </button>

            {/* WhatsApp */}
            <button
              type="button"
              onClick={doWA}
              disabled={busy.wa}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg font-bold
                text-xs sm:text-sm bg-[#25D366] text-white shadow-lg
                disabled:opacity-50 active:scale-95 transition-transform cursor-pointer whitespace-nowrap"
            >
              {busy.wa ? '⏳...' : '💬 WhatsApp'}
            </button>
          </div>
        </div>

        {/* Row 2 — PDF header/footer toggles */}
        <div className="flex flex-wrap items-center gap-2 px-3 pb-2.5">
          <span className="text-slate-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            PDF Options:
          </span>

          <Toggle
            label="Header"
            icon="🏷️"
            active={showHdr}
            onClick={() => setShowHdr((v) => !v)}
          />
          <Toggle
            label="Footer"
            icon="📄"
            active={showFtr}
            onClick={() => setShowFtr((v) => !v)}
          />

          <span className="text-slate-500 text-[10px] hidden sm:inline">
            {showHdr && showFtr
              ? '✦ Header & Footer visible in PDF'
              : !showHdr && !showFtr
                ? '✦ No Header / Footer in PDF'
                : !showHdr
                  ? '✦ Footer only in PDF'
                  : '✦ Header only in PDF'}
          </span>
        </div>
      </nav>

      {/* ── MAIN FORM AREA ── */}
      <main className="no-print w-full max-w-3xl mx-auto mt-5 px-2 pb-14 bg-slate-300 min-h-screen">

        {/* White sheet */}
        <div className="w-full bg-white rounded overflow-hidden shadow-2xl">

          {/* ── FORM HEADER ── */}
          <div
            style={{
              textAlign: 'center',
              border: '2.5px solid #1a3a6e',
              borderBottom: 'none',
              padding: '10px 8px 8px',
            }}
          >
            <p style={{ fontSize: 'clamp(15px,4.5vw,22px)', fontWeight: 700, color: '#1a3a6e', letterSpacing: '.5px', margin: 0 }}>
              ✦ SHAKKTHI ASTRO CENTRE ✦
            </p>
            <p style={{ fontSize: 'clamp(10px,2.5vw,13px)', color: '#64748b', marginTop: 3, marginBottom: 0 }}>
              ஜோசியம் &amp; ஆன்மீக ஆலோசனை மையம்
            </p>
            <p style={{ fontSize: 'clamp(9px,2vw,11.5px)', color: '#94a3b8', marginTop: 2, marginBottom: 0 }}>
              West Mambalam, Chennai
            </p>
          </div>

          {/* ── DATE & LOCATION ── */}
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '2.5px solid #1a3a6e', borderTop: 'none' }}>
            <tbody>
              <tr>
                {[
                  ['date', 'தேதி – Date:', 'dd.mm.yyyy', 'numeric'],
                  ['loc', 'இடம் – Location:', 'Chennai', 'text'],
                ].map(([fid, lbl, ph, im]) => (
                  <td
                    key={fid}
                    style={{
                      ...S.tdBase,
                      width: '50%',
                      padding: '6px 10px',
                      fontWeight: 700,
                      color: '#1a3a6e',
                      fontSize: 'clamp(10px,2.3vw,12px)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {lbl}
                    <input
                      value={form[fid]}
                      onChange={(e) => set(fid, e.target.value)}
                      inputMode={im}
                      placeholder={ph}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#1e293b',
                        fontSize: 'clamp(11px,2.5vw,13px)',
                        marginLeft: 4,
                        width: 'clamp(80px,16vw,160px)',
                        padding: '2px 2px',
                      }}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          {/* ── PERSONAL DETAILS ── */}
          <table style={S.table}>
          <tbody>
  {[
    { fid: 'name', ta: 'பெயர்', en: 'Name' },
    { fid: 'dob', ta: 'பிறந்த தேதி – நேரம்', en: 'Date & Time of Birth' },
    { fid: 'pob', ta: 'பிறந்த இடம்', en: 'Place of Birth' },
    { fid: 'rasi', ta: 'ராசி', en: 'Rasi' },
    { fid: 'star', ta: 'நட்சத்திரம் & பாதம்', en: 'Star & Padam' },
    { fid: 'lagnam', ta: 'லக்னம்', en: 'Ascendant' },
    { fid: 'dasa', ta: 'நடப்பு தசா', en: 'Current Dasa' },
  ].map(({ fid, ta, en }) => (
    <tr key={fid}>
      <td style={S.lbl}>
        {ta}
        <small style={{
          display: 'block',
          fontWeight: 400,
          color: '#94a3b8',
          fontSize: 'clamp(9px,1.9vw,10.5px)',
          marginTop: 1
        }}>
          {en}
        </small>
      </td>

      <td style={S.val}>
        {fid === 'dob' ? (
         <div className="flex flex-col sm:flex-row gap-2">

  {/* DATE FIELD */}
  <div className="relative w-full">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
      📅
    </span>
    <input
      type="date"
      value={form.dobDate || ''}
      onChange={(e) => set('dobDate', e.target.value)}
      className="w-full pl-9 pr-2 py-2 text-sm rounded-lg border border-slate-300 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 focus:border-blue-500 transition-all"
    />
  </div>

  {/* TIME FIELD */}
  <div className="relative w-full">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
      ⏰
    </span>
    <input
      type="time"
      value={form.dobTime || ''}
      onChange={(e) => set('dobTime', e.target.value)}
      className="w-full pl-9 pr-2 py-2 text-sm rounded-lg border border-slate-300 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 focus:border-blue-500 transition-all"
    />
  </div>

</div>
        ) : (
          <FInput fid={fid} val={form[fid]} onChange={set} />
        )}
      </td>
    </tr>
  ))}
</tbody>
          </table>

          {/* ── COLOURS ── */}
          <table style={S.table}>
            <tbody>
              <tr>
                <td style={{ ...S.halfHd, width: '50%' }}>அதிர்ஷ்ட நிறம்<br />Lucky Colours</td>
                <td style={{ ...S.halfHd, width: '50%' }}>ஆகாத நிறம்<br />Avoid Colours</td>
              </tr>
              {[1, 2, 3].map((n) => (
                <tr key={n}>
                  <td style={S.lineRow}>
                    {n}.&nbsp;
                    <input
                      value={form[`lc${n}`]}
                      onChange={(e) => set(`lc${n}`, e.target.value)}
                      style={{ border: 'none', background: 'transparent', color: '#1e293b', fontSize: 'clamp(12px,2.8vw,14px)', width: 'calc(100% - 20px)' }}
                    />
                  </td>
                  <td style={S.lineRow}>
                    {n}.&nbsp;
                    <input
                      value={form[`ac${n}`]}
                      onChange={(e) => set(`ac${n}`, e.target.value)}
                      style={{ border: 'none', background: 'transparent', color: '#1e293b', fontSize: 'clamp(12px,2.8vw,14px)', width: 'calc(100% - 20px)' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── LUCKY DATES ── */}
          <table style={S.table}>
            <tbody>
              <tr>
                <td colSpan={4} style={S.halfHd}>அதிர்ஷ்ட நாட்கள் – Lucky Dates</td>
                <td colSpan={4} style={S.halfHd}>ஆகாத நாட்கள் – Avoid Dates</td>
              </tr>
              {[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]].map((row) => (
                <tr key={row[0]}>
                  {row.map((n) => <GCell key={`ld${n}`} fid={`ld${n}`} val={form[`ld${n}`]} onChange={set} />)}
                  {row.map((n) => <GCell key={`ad${n}`} fid={`ad${n}`} val={form[`ad${n}`]} onChange={set} />)}
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── LUCKY NUMBERS ── */}
          <table style={S.table}>
            <tbody>
              <tr>
                <td colSpan={4} style={S.halfHd}>அதிர்ஷ்ட எண் – Lucky Numbers</td>
                <td colSpan={4} style={S.halfHd}>ஆகாத எண் – Avoid Numbers</td>
              </tr>
              {[[1, 2, 3, 4]].map((row) => (
                <tr key={row[0]}>
                  {row.map((n) => <GCell key={`ln${n}`} fid={`ln${n}`} val={form[`ln${n}`]} onChange={set} />)}
                  {row.map((n) => <GCell key={`an${n}`} fid={`an${n}`} val={form[`an${n}`]} onChange={set} />)}
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── LUCKY GEMS ── */}
          <table style={S.table}>
            <tbody>
              <tr>
                <td colSpan={2} style={S.secHd}>அதிர்ஷ்ட ரத்தினங்கள் – Lucky Gems</td>
              </tr>
              {[1, 2, 3].map((n) => (
                <tr key={n}>
                  <td colSpan={2} style={S.lineRow}>
                    {n}.&nbsp;
                    <input
                      value={form[`gem${n}`]}
                      onChange={(e) => set(`gem${n}`, e.target.value)}
                      style={{ border: 'none', background: 'transparent', color: '#1e293b', fontSize: 'clamp(12px,2.8vw,14px)', width: 'calc(100% - 20px)' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── WEIGHT / METAL ── */}
          <table style={S.table}>
            <tbody>
              <tr>
                <td style={{ ...S.halfHd, width: '50%' }}>எடை – Weight</td>
                <td style={{ ...S.halfHd, width: '50%' }}>உலோகம் – Metal</td>
              </tr>
              <tr>
                <td style={{ ...S.val, height: 38 }}>
                  <FInput fid="weight" val={form.weight} onChange={set} im="decimal" ph="கிராம் / grams" />
                </td>
                <td style={S.val}>
                  <FInput fid="metal" val={form.metal} onChange={set} />
                </td>
              </tr>
            </tbody>
          </table>

          {/* ── WORSHIP ── */}
          <table style={S.table}>
            <tbody>
              <tr><td style={S.secHd}>வழிபாட்டு முறை – Worship</td></tr>
              <tr>
                <td style={{ ...S.tdBase, padding: '6px 10px' }}>
                  <textarea
                    rows={3}
                    value={form.worship}
                    onChange={(e) => set('worship', e.target.value)}
                    style={{ width: '100%', color: '#1e293b', fontSize: 'clamp(12px,2.8vw,14px)', lineHeight: 1.6, minHeight: 54 }}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {/* ── OTHER PREDICTIONS ── */}
          <table style={S.table}>
            <tbody>
              <tr><td style={S.secHd}>மற்ற பலன்கள் – Other Predictions</td></tr>
              <tr>
                <td style={{ ...S.tdBase, padding: '6px 10px' }}>
                  <textarea
                    rows={5}
                    value={form.mattra}
                    onChange={(e) => set('mattra', e.target.value)}
                    style={{ width: '100%', color: '#1e293b', fontSize: 'clamp(12px,2.8vw,14px)', lineHeight: 1.6, minHeight: 80 }}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {/* ── SHEET FOOTER ── */}
          <div
            style={{
              border: '2.5px solid #1a3a6e',
              borderTop: 'none',
              textAlign: 'center',
              padding: '6px 8px',
              fontSize: 'clamp(9px,2vw,11px)',
              color: '#64748b',
            }}
          >
            Shakkthi Astro Centre &nbsp;|&nbsp; West Mambalam, Chennai &nbsp;|&nbsp; ஆன்மீக ஆலோசனை மையம்
          </div>
        </div>

        {/* PDF toggle status badges */}
        <div className="mt-4 flex items-center justify-center gap-2 text-slate-500 text-xs pb-2">
          <span>PDF includes:</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${showHdr ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-400 line-through'}`}>
            Header
          </span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${showFtr ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-400 line-through'}`}>
            Footer
          </span>
        </div>
      </main>

      {/* ── TOAST ── */}
      {toast.show && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: TOAST_BG[toast.type] || '#1a3a6e',
            color: '#fff',
            padding: '10px 24px',
            borderRadius: 99,
            fontSize: 13,
            zIndex: 9999,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 20px rgba(0,0,0,.3)',
            pointerEvents: 'none',
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* ═══════════════════════════════════════════
          HIDDEN PDF LAYER
          • Lives in the real DOM at all times
          • Styled via ShakkthiAstroForm.css  (NOT Tailwind)
            so html2pdf can read the styles reliably
          • revealPDF() makes it visible off-screen
            just before capture, then hidePDF() hides it
      ═══════════════════════════════════════════ */}
      <div id="pdf-layer" ref={pdfRef}>

        {/* Conditional Header */}
        {showHdr && (
          <div className="p-hdr">
            <div className="p-hdr-name">✦ SHAKKTHI ASTRO CENTRE ✦</div>
            <div className="p-hdr-sub">ஜோசியம் &amp; ஆன்மீக ஆலோசனை மையம்</div>
            <div className="p-hdr-addr">West Mambalam, Chennai</div>
          </div>
        )}

        {/* Main data table */}
        <table className={showHdr ? 'p-main' : 'p-main-no-hdr'}>
          <tbody>
            {/* Date / Location */}
            <tr>
              <td className="p-meta-lbl">
                தேதி – Date:{' '}
                <span style={{ fontWeight: 400, color: '#1e293b' }}>{form.date}</span>
              </td>
              <td className="p-meta-val">இடம் – Location: {form.loc}</td>
            </tr>

            {/* Personal rows */}
            {[
              ['பெயர் – Name', form.name],
              ['பிறந்த தேதி – நேரம் / Date & Time of Birth', getDOB()],
              ['பிறந்த இடம் / Place of Birth', form.pob],
              ['ராசி – Rasi', form.rasi],
              ['நட்சத்திரம் & பாதம் / Star & Padam', form.star],
              ['லக்னம் – Ascendant', form.lagnam],
              ['நடப்பு தசா – Current Dasa', form.dasa],
            ].map(([lbl, val]) => (
              <tr key={lbl}>
                <td className="p-lbl">{lbl}</td>
                <td className="p-val">{val}</td>
              </tr>
            ))}

            {/* Colours */}
            <tr>
              <td className="p-hhd" style={{ width: '50%' }}>அதிர்ஷ்ட நிறம் – Lucky Colours</td>
              <td className="p-hhd" style={{ width: '50%' }}>ஆகாத நிறம் – Avoid Colours</td>
            </tr>
            {[1, 2, 3].map((n) => (
              <tr key={n}>
                <td className="p-nr">{n}. {form[`lc${n}`]}</td>
                <td className="p-nr">{n}. {form[`ac${n}`]}</td>
              </tr>
            ))}

            {/* Dates */}
            <tr>
              <td className="p-hhd" colSpan={4}>அதிர்ஷ்ட நாட்கள் – Lucky Dates</td>
              <td className="p-hhd" colSpan={4}>ஆகாத நாட்கள் – Avoid Dates</td>
            </tr>
            {[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]].map((row) => (
              <tr key={row[0]}>
                {row.map((n) => <td key={`ld${n}`} className="p-gr">{form[`ld${n}`]}</td>)}
                {row.map((n) => <td key={`ad${n}`} className="p-gr">{form[`ad${n}`]}</td>)}
              </tr>
            ))}

            {/* Numbers */}
            <tr>
              <td className="p-hhd" colSpan={4}>அதிர்ஷ்ட எண் – Lucky Numbers</td>
              <td className="p-hhd" colSpan={4}>ஆகாத எண் – Avoid Numbers</td>
            </tr>
            {[[1, 2, 3, 4], [5, 6, 7, 8]].map((row) => (
              <tr key={row[0]}>
                {row.map((n) => <td key={`ln${n}`} className="p-gr">{form[`ln${n}`]}</td>)}
                {row.map((n) => <td key={`an${n}`} className="p-gr">{form[`an${n}`]}</td>)}
              </tr>
            ))}

            {/* Gems */}
            <tr>
              <td className="p-shd" colSpan={8}>அதிர்ஷ்ட ரத்தினங்கள் – Lucky Gems</td>
            </tr>
            {[1, 2, 3].map((n) => (
              <tr key={n}>
                <td className="p-nr" colSpan={8}>{n}. {form[`gem${n}`]}</td>
              </tr>
            ))}

            {/* Weight / Metal */}
            <tr>
              <td className="p-hhd" colSpan={4}>எடை – Weight</td>
              <td className="p-hhd" colSpan={4}>உலோகம் – Metal</td>
            </tr>
            <tr>
              <td colSpan={4} style={{ padding: '4px 7px', fontSize: 9, height: 20, color: '#1e293b' }}>
                {form.weight}
              </td>
              <td colSpan={4} style={{ padding: '4px 7px', fontSize: 9, color: '#1e293b' }}>
                {form.metal}
              </td>
            </tr>

            {/* Worship */}
            <tr>
              <td className="p-shd" colSpan={8}>வழிபாட்டு முறை – Worship</td>
            </tr>
            <tr>
              <td
                colSpan={8}
                style={{ padding: '5px 7px', minHeight: 28, fontSize: 9, whiteSpace: 'pre-wrap', verticalAlign: 'top', color: '#1e293b' }}
              >
                {form.worship}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Other Predictions */}
        <div className="p-bot">
          <div className="p-bot-title">மற்ற பலன்கள் – Other Predictions :-</div>
          <div className="p-bot-val">{form.mattra}</div>
        </div>

        {/* Conditional Footer */}
        {showFtr && (
          <div className="p-ftr">
            Shakkthi Astro Centre &nbsp;|&nbsp; West Mambalam, Chennai &nbsp;|&nbsp; ஆன்மீக ஆலோசனை மையம்
          </div>
        )}
      </div>
    </>
  );
}
