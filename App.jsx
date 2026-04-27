import { useState, useMemo } from 'react'

/* ─── Data ─────────────────────────────────────────────────────────────── */

const PRESET_ALLOYS = [
  { name: '40 to 1',                  tin: 2.44,  antimony: 0,    arsenic: 0,     copper: 0,    silver: 0, lead: 97.56,  hardness: 8  },
  { name: '30 to 1',                  tin: 3.23,  antimony: 0,    arsenic: 0,     copper: 0,    silver: 0, lead: 96.77,  hardness: 9  },
  { name: '25 to 1',                  tin: 3.85,  antimony: 0,    arsenic: 0,     copper: 0,    silver: 0, lead: 96.15,  hardness: 9  },
  { name: '20 to 1',                  tin: 4.76,  antimony: 0,    arsenic: 0,     copper: 0,    silver: 0, lead: 95.24,  hardness: 10 },
  { name: '16 to 1',                  tin: 5.88,  antimony: 0,    arsenic: 0,     copper: 0,    silver: 0, lead: 94.12,  hardness: 11 },
  { name: '10 to 1',                  tin: 9.09,  antimony: 0,    arsenic: 0,     copper: 0,    silver: 0, lead: 90.91,  hardness: 12 },
  { name: 'Pure Antimony',            tin: 0,     antimony: 100,  arsenic: 0,     copper: 0,    silver: 0, lead: 0,      hardness: 50 },
  { name: 'Chilled Shot',             tin: 0,     antimony: 2,    arsenic: 0.625, copper: 0,    silver: 0, lead: 97.375, hardness: 10 },
  { name: 'Magnum Shot (6 or 9)',     tin: 0,     antimony: 4,    arsenic: 1.25,  copper: 0,    silver: 0, lead: 94.75,  hardness: 13 },
  { name: 'Magnum Shot (7–8.5)',      tin: 0,     antimony: 6,    arsenic: 1.25,  copper: 0,    silver: 0, lead: 92.75,  hardness: 13 },
  { name: 'Antimonial Lead',          tin: 0,     antimony: 5,    arsenic: 0,     copper: 0,    silver: 0, lead: 95,     hardness: 13 },
  { name: 'Rotometals Super Hard',    tin: 0,     antimony: 30,   arsenic: 0,     copper: 0,    silver: 0, lead: 70,     hardness: 36 },
  { name: '40/60 Solder',            tin: 40,    antimony: 0,    arsenic: 0,     copper: 0,    silver: 0, lead: 60,     hardness: 15 },
  { name: '50/50 Solder',            tin: 50,    antimony: 0,    arsenic: 0,     copper: 0,    silver: 0, lead: 50,     hardness: 14 },
  { name: '60/40 Solder',            tin: 60,    antimony: 0,    arsenic: 0,     copper: 0,    silver: 0, lead: 40,     hardness: 16 },
  { name: '63/37 Solder',            tin: 63,    antimony: 0,    arsenic: 0,     copper: 0,    silver: 0, lead: 37,     hardness: 17 },
  { name: 'Pewter',                  tin: 92.5,  antimony: 6,    arsenic: 0,     copper: 1.5,  silver: 0, lead: 0,      hardness: 23 },
  { name: 'Lead Free 95/5 (Sb)',     tin: 95,    antimony: 5,    arsenic: 0,     copper: 0,    silver: 0, lead: 0,      hardness: 15 },
  { name: 'Pure Tin',                tin: 100,   antimony: 0,    arsenic: 0,     copper: 0,    silver: 0, lead: 0,      hardness: 7  },
  { name: 'Electrotype',             tin: 2.5,   antimony: 2.5,  arsenic: 0,     copper: 0,    silver: 0, lead: 95,     hardness: 11 },
  { name: 'Linotype',                tin: 4,     antimony: 12,   arsenic: 0,     copper: 0,    silver: 0, lead: 84,     hardness: 19 },
  { name: 'Stereotype',              tin: 6,     antimony: 14,   arsenic: 0,     copper: 0,    silver: 0, lead: 80,     hardness: 23 },
  { name: 'Monotype',                tin: 9,     antimony: 19,   arsenic: 0,     copper: 0,    silver: 0, lead: 72,     hardness: 26 },
  { name: 'Foundrytype',             tin: 15,    antimony: 23,   arsenic: 0,     copper: 0,    silver: 0, lead: 62,     hardness: 30 },
  { name: 'Pure Lead',               tin: 0,     antimony: 0,    arsenic: 0,     copper: 0,    silver: 0, lead: 100,    hardness: 5  },
  { name: 'Stick-On Wheel Weight',   tin: 0.25,  antimony: 0,    arsenic: 0,     copper: 0,    silver: 0, lead: 99.75,  hardness: 6  },
  { name: 'Range Lead (avg.)',       tin: 0.17,  antimony: 1,    arsenic: 0,     copper: 0,    silver: 0, lead: 98.83,  hardness: 10 },
  { name: 'Clip-On Wheel Weight',    tin: 0.5,   antimony: 3,    arsenic: 0.25,  copper: 0,    silver: 0, lead: 96.25,  hardness: 12 },
  { name: 'Isotope Lead (lg cores)', tin: 1,     antimony: 3,    arsenic: 0,     copper: 0,    silver: 0, lead: 96,     hardness: 11 },
  { name: 'Isotope Lead (ingots)',   tin: 2.5,   antimony: 2.5,  arsenic: 0,     copper: 0,    silver: 0, lead: 95,     hardness: 11 },
  { name: 'Lyman No. 2',            tin: 5,     antimony: 5,    arsenic: 0,     copper: 0,    silver: 0, lead: 90,     hardness: 15 },
  { name: 'Hardball Alloy',         tin: 2,     antimony: 6,    arsenic: 0,     copper: 0,    silver: 0, lead: 92,     hardness: 16 },
]

const ELEMENTS = [
  { key: 'tin',      label: 'Tin (Sn)',      color: '#60a5fa' },
  { key: 'antimony', label: 'Antimony (Sb)', color: '#f59e0b' },
  { key: 'arsenic',  label: 'Arsenic (As)',  color: '#a78bfa' },
  { key: 'copper',   label: 'Copper (Cu)',   color: '#f97316' },
  { key: 'silver',   label: 'Silver (Ag)',   color: '#94a3b8' },
  { key: 'lead',     label: 'Lead (Pb)',     color: '#6b7280' },
]

/* ─── Helpers ───────────────────────────────────────────────────────────── */

// BHN = 8.60 + (0.29 × %Sn) + (0.92 × %Sb)  — Rotometals formula
// percentages passed as plain numbers e.g. 5 = 5%
function calcHardness(tin, antimony) {
  return 8.60 + 0.29 * tin + 0.92 * antimony
}

function safeAlloy(idx) {
  const i = Number(idx)
  return PRESET_ALLOYS[i >= 0 && i < PRESET_ALLOYS.length ? i : 0]
}

/* ─── Sub-components ────────────────────────────────────────────────────── */

function HardnessBar({ brinell }) {
  const pct = Math.min((brinell / 50) * 100, 100)
  const color = brinell < 10 ? '#6b7280' : brinell < 16 ? '#60a5fa' : brinell < 26 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ height: 8, background: '#1f2937', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.4s ease' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3, fontSize: 10, color: '#4b5563' }}>
        <span>Soft (5)</span><span>Medium (16)</span><span>Hard (50)</span>
      </div>
    </div>
  )
}

function CompositionDonut({ composition }) {
  const radius = 52
  const circumference = 2 * Math.PI * radius
  let offset = 0
  const segments = ELEMENTS
    .map(el => ({ ...el, pct: Number(composition[el.key]) || 0 }))
    .filter(el => el.pct > 0)

  return (
    <svg width={130} height={130} viewBox="0 0 130 130" aria-label="Alloy composition chart">
      <circle cx={65} cy={65} r={radius} fill="none" stroke="#1f2937" strokeWidth={18} />
      {segments.map(seg => {
        const dash = (seg.pct / 100) * circumference
        const gap = circumference - dash
        const el = (
          <circle
            key={seg.key}
            cx={65} cy={65} r={radius}
            fill="none"
            stroke={seg.color}
            strokeWidth={18}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: '65px 65px', transition: 'all 0.4s ease' }}
          />
        )
        offset += dash
        return el
      })}
      <text x={65} y={61} textAnchor="middle" fill="#e5e7eb" fontSize={10} fontFamily="'Share Tech Mono', monospace">ALLOY</text>
      <text x={65} y={74} textAnchor="middle" fill="#9ca3af" fontSize={9} fontFamily="'Share Tech Mono', monospace">MIX</text>
    </svg>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────────── */

export default function App() {
  const [mode, setMode] = useState('preset')
  const [selectedIdx, setSelectedIdx] = useState(24) // Pure Lead
  const [boolWeight, setBoolWeight] = useState('200')
  const [lbsAvail, setLbsAvail]     = useState('10')

  const [mixEntries, setMixEntries] = useState([
    { alloyIdx: 24, lbs: '8', price: '' },
    { alloyIdx: 30, lbs: '1', price: '' },
    { alloyIdx: 31, lbs: '1', price: '' },
  ])

  /* Mix helpers */
  const updateMix = (i, field, val) =>
    setMixEntries(prev => prev.map((e, idx) => idx !== i ? e : { ...e, [field]: val }))
  const addMix    = () => setMixEntries(prev => [...prev, { alloyIdx: 24, lbs: '1', price: '' }])
  const removeMix = (i) => setMixEntries(prev => prev.filter((_, idx) => idx !== i))

  /* Derived composition */
  const composition = useMemo(() => {
    if (mode === 'preset') {
      const a = PRESET_ALLOYS[selectedIdx]
      return { tin: a.tin, antimony: a.antimony, arsenic: a.arsenic, copper: a.copper, silver: a.silver, lead: a.lead }
    }
    // mix
    const totalLbs = mixEntries.reduce((s, e) => s + (parseFloat(e.lbs) || 0), 0)
    if (totalLbs === 0) return { tin: 0, antimony: 0, arsenic: 0, copper: 0, silver: 0, lead: 0 }
    const comp = { tin: 0, antimony: 0, arsenic: 0, copper: 0, silver: 0, lead: 0 }
    mixEntries.forEach(e => {
      const a = safeAlloy(e.alloyIdx)
      const w = parseFloat(e.lbs) || 0
      ELEMENTS.forEach(el => { comp[el.key] += (a[el.key] * w) / totalLbs })
    })
    return comp
  }, [mode, selectedIdx, mixEntries])

  /* Derived hardness */
  const hardness = useMemo(() => {
    if (mode === 'preset') return PRESET_ALLOYS[selectedIdx].hardness
    return calcHardness(composition.tin, composition.antimony)
  }, [mode, selectedIdx, composition])

  /* Derived price (mix only) */
  const pricePerLb = useMemo(() => {
    if (mode === 'preset') return 0
    const totalLbs = mixEntries.reduce((s, e) => s + (parseFloat(e.lbs) || 0), 0)
    if (totalLbs === 0) return 0
    let cost = 0
    mixEntries.forEach(e => {
      const p = parseFloat(e.price)
      if (p > 0) cost += p * (parseFloat(e.lbs) || 0)
    })
    return cost / totalLbs
  }, [mode, mixEntries])

  /* Boolit maths */
  const boolGr    = Math.max(parseFloat(boolWeight) || 0, 1)
  const lbs       = Math.max(parseFloat(lbsAvail)   || 0, 0)
  const costPerBoolit = pricePerLb > 0 ? (pricePerLb / 7000) * boolGr : 0
  const boolitCount   = lbs > 0 && boolGr > 0 ? Math.floor((lbs * 7000) / boolGr) : 0

  /* Mix summary */
  const mixTotalLbs  = mixEntries.reduce((s, e) => s + (parseFloat(e.lbs)   || 0), 0)
  const mixTotalCost = mixEntries.reduce((s, e) => s + (parseFloat(e.lbs) || 0) * (parseFloat(e.price) || 0), 0)
  const mixHasBlankPrice = mixEntries.some(e => !(parseFloat(e.price) > 0))

  return (
    <div style={{ minHeight: '100dvh', background: '#0a0e14', color: '#e2e8f0', paddingBottom: 'env(safe-area-inset-bottom, 24px)' }}>
      <style>{`
        .tab { background: transparent; border: 1px solid #374151; color: #9ca3af; padding: 8px 20px; cursor: pointer; font-family: 'Share Tech Mono', monospace; font-size: 13px; letter-spacing: 1px; transition: all 0.18s; -webkit-tap-highlight-color: transparent; }
        .tab.on { background: #f59e0b; border-color: #f59e0b; color: #0a0e14; font-weight: 700; }
        .tab:not(.on):hover { border-color: #6b7280; color: #e2e8f0; }
        .inp { background: #111827; border: 1px solid #374151; color: #e2e8f0; padding: 8px 10px; font-family: 'Share Tech Mono', monospace; font-size: 14px; width: 100%; border-radius: 3px; transition: border 0.2s; outline: none; -webkit-appearance: none; }
        .inp:focus { border-color: #f59e0b; }
        select.inp { cursor: pointer; }
        .card { background: #111827; border: 1px solid #1f2937; border-radius: 4px; padding: 9px 12px; cursor: pointer; transition: border-color 0.15s; -webkit-tap-highlight-color: transparent; }
        .card:hover { border-color: #f59e0b55; }
        .card.on { border-color: #f59e0b; background: #1c1700; }
        .rbox { background: #0d1117; border: 1px solid #1f2937; border-radius: 4px; padding: 14px 16px; }
        .rval { font-family: 'Oswald', sans-serif; font-size: 28px; color: #f59e0b; letter-spacing: 1px; }
        .lbl { font-size: 10px; color: #4b5563; letter-spacing: 2px; margin-bottom: 4px; display: block; }
        .rmv { background: transparent; border: 1px solid #374151; color: #6b7280; padding: 3px 10px; cursor: pointer; font-family: 'Share Tech Mono', monospace; font-size: 11px; letter-spacing: 1px; border-radius: 3px; transition: all 0.15s; }
        .rmv:hover { border-color: #ef4444; color: #ef4444; }
        .addbtn { background: transparent; border: 1px dashed #374151; color: #6b7280; padding: 9px 16px; cursor: pointer; font-family: 'Share Tech Mono', monospace; font-size: 12px; letter-spacing: 1px; border-radius: 3px; width: 100%; transition: all 0.2s; margin-top: 4px; }
        .addbtn:hover { border-color: #60a5fa; color: #60a5fa; }
        .tip { background: #111827; border-left: 3px solid #374151; padding: 10px 14px; font-size: 11px; color: #6b7280; line-height: 1.7; }
        .tip strong { color: #9ca3af; }
        .pgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 6px; max-height: 340px; overflow-y: auto; padding-right: 2px; }
        .pgrid::-webkit-scrollbar { width: 3px; }
        .pgrid::-webkit-scrollbar-track { background: #111827; }
        .pgrid::-webkit-scrollbar-thumb { background: #374151; border-radius: 2px; }
        input[type=range] { accent-color: #f59e0b; }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.5; }
        @media (min-width: 768px) {
          .layout { display: grid; grid-template-columns: 1fr 320px; gap: 24px; }
        }
      `}</style>

      {/* Header */}
      <div style={{ background: '#0d1117', borderBottom: '1px solid #1f2937', padding: '18px 20px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: 3, color: '#f59e0b' }}>LEAD ALLOY</span>
          <span style={{ fontFamily: "'Oswald', sans-serif", fontSize: 28, fontWeight: 400, letterSpacing: 3, color: '#e2e8f0' }}>CALCULATOR</span>
        </div>
        <div style={{ color: '#374151', fontSize: 10, letterSpacing: 2, marginTop: 2 }}>CAST BULLET & ALLOY COMPOSITION TOOL</div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 16px', maxWidth: 1060, margin: '0 auto' }}>
        <div className="layout">

          {/* ── Left ── */}
          <div>
            {/* Tabs */}
            <div style={{ marginBottom: 18 }}>
              <span className="lbl">INPUT MODE</span>
              <div style={{ display: 'flex' }}>
                {[['preset', 'PRESET ALLOYS'], ['mix', 'MIX ALLOYS']].map(([val, label], i) => (
                  <button key={val} className={`tab${mode === val ? ' on' : ''}`}
                    style={{ borderRadius: i === 0 ? '3px 0 0 3px' : '0 3px 3px 0', borderLeft: i === 1 ? 'none' : undefined }}
                    onClick={() => setMode(val)}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Preset panel ── */}
            {mode === 'preset' && (
              <div>
                <span className="lbl" style={{ marginBottom: 8 }}>SELECT AN ALLOY</span>
                <div className="pgrid">
                  {PRESET_ALLOYS.map((a, i) => (
                    <div key={i} className={`card${selectedIdx === i ? ' on' : ''}`} onClick={() => setSelectedIdx(i)}>
                      <div style={{ fontSize: 12, fontFamily: "'Oswald', sans-serif", letterSpacing: 0.5, color: selectedIdx === i ? '#f59e0b' : '#d1d5db' }}>{a.name}</div>
                      <div style={{ fontSize: 10, color: '#4b5563', marginTop: 2 }}>BHN {a.hardness}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Mix panel ── */}
            {mode === 'mix' && (
              <div>
                <span className="lbl" style={{ marginBottom: 10 }}>MIX ALLOYS BY WEIGHT — ENTER YOUR ACTUAL PRICES</span>

                {mixEntries.map((entry, i) => {
                  const lineTotal = (parseFloat(entry.lbs) || 0) * (parseFloat(entry.price) || 0)
                  const noPrice   = !(parseFloat(entry.price) > 0)
                  return (
                    <div key={i} style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: 4, padding: '12px 14px', marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontSize: 10, color: '#374151', letterSpacing: 2 }}>ALLOY {i + 1}</span>
                        <button className="rmv" onClick={() => removeMix(i)}>✕ REMOVE</button>
                      </div>

                      {/* Alloy selector */}
                      <div style={{ marginBottom: 10 }}>
                        <span className="lbl">ALLOY NAME</span>
                        <select className="inp" value={entry.alloyIdx}
                          onChange={e => updateMix(i, 'alloyIdx', parseInt(e.target.value, 10))}>
                          {PRESET_ALLOYS.map((a, ai) => (
                            <option key={ai} value={ai}>{a.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Weight + Price */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                          <span className="lbl">WEIGHT (LBS)</span>
                          <input type="number" inputMode="decimal" min="0.1" step="0.5"
                            className="inp" value={entry.lbs}
                            onChange={e => updateMix(i, 'lbs', e.target.value)} />
                        </div>
                        <div>
                          <span className="lbl" style={{ color: '#f59e0b' }}>YOUR PRICE ($/LB)</span>
                          <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: '#f59e0b', fontSize: 13, pointerEvents: 'none' }}>$</span>
                            <input type="number" inputMode="decimal" min="0" step="0.01"
                              className="inp"
                              style={{ paddingLeft: 18, borderColor: noPrice ? '#78350f' : '#374151' }}
                              placeholder="0.00"
                              value={entry.price}
                              onChange={e => updateMix(i, 'price', e.target.value)} />
                          </div>
                        </div>
                      </div>

                      {/* Line subtotal */}
                      <div style={{ marginTop: 8, textAlign: 'right', fontSize: 11 }}>
                        {noPrice
                          ? <span style={{ color: '#78350f' }}>⚠ enter price</span>
                          : <span style={{ color: '#4b5563' }}>subtotal: <span style={{ color: '#9ca3af', fontFamily: "'Oswald', sans-serif", fontSize: 14 }}>${lineTotal.toFixed(2)}</span></span>
                        }
                      </div>
                    </div>
                  )
                })}

                <button className="addbtn" onClick={addMix}>+ ADD ALLOY TO MIX</button>

                {/* Mix totals */}
                <div style={{ marginTop: 12, background: '#0d1117', border: '1px solid #1f2937', borderRadius: 4, padding: '10px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 12 }}>
                      <span style={{ color: '#4b5563' }}>TOTAL WEIGHT: </span>
                      <span style={{ color: '#e2e8f0', fontFamily: "'Oswald', sans-serif", fontSize: 16 }}>{mixTotalLbs.toFixed(1)} lbs</span>
                    </div>
                    <div style={{ fontSize: 12, textAlign: 'right' }}>
                      <span style={{ color: '#4b5563' }}>TOTAL COST: </span>
                      {mixHasBlankPrice
                        ? <span style={{ color: '#f59e0b', fontSize: 11 }}>⚠ MISSING PRICES</span>
                        : <span style={{ color: '#f59e0b', fontFamily: "'Oswald', sans-serif", fontSize: 16 }}>${mixTotalCost.toFixed(2)}</span>
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Composition bars */}
            <div style={{ marginTop: 20, background: '#0d1117', border: '1px solid #1f2937', borderRadius: 4, padding: 14 }}>
              <span className="lbl" style={{ marginBottom: 10 }}>COMPOSITION BREAKDOWN</span>
              {ELEMENTS.map(el => {
                const pct = Number(composition[el.key]) || 0
                return pct > 0 ? (
                  <div key={el.key} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 12, color: el.color }}>{el.label}</span>
                      <span style={{ fontSize: 12, fontFamily: "'Oswald', sans-serif", color: el.color }}>{pct.toFixed(2)}%</span>
                    </div>
                    <div style={{ height: 5, background: '#1f2937', borderRadius: 3 }}>
                      <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: el.color, borderRadius: 3, transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                ) : null
              })}
            </div>

            {/* Notes */}
            <div className="tip" style={{ marginTop: 14 }}>
              <strong>HARDNESS FORMULA:</strong> BHN = 8.60 + (0.29 × %Sn) + (0.92 × %Sb) — Rotometals<br />
              <strong>HUNTING HP:</strong> ~2% Sn + 2% Sb optimal &nbsp;·&nbsp; <strong>BRITTLENESS:</strong> Keep Sb &lt; 6%<br />
              <strong>ARSENIC:</strong> Grain refiner — improves heat treating &amp; quench hardening<br />
              <strong>OPTIMAL BHN:</strong> CUP ÷ 1279.8 (Missouri Bullet — check your load data)
            </div>
          </div>

          {/* ── Right / Results ── */}
          <div style={{ marginTop: 24 }}>
            <span className="lbl" style={{ marginBottom: 10 }}>RESULTS</span>

            {/* Donut + legend */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 16 }}>
              <CompositionDonut composition={composition} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 }}>
                {ELEMENTS.filter(el => (Number(composition[el.key]) || 0) > 0).map(el => (
                  <div key={el.key} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#9ca3af' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: el.color }} />
                    {el.label.split(' ')[0]}
                  </div>
                ))}
              </div>
            </div>

            {/* Hardness */}
            <div className="rbox" style={{ marginBottom: 10 }}>
              <span className="lbl">{mode === 'preset' ? 'KNOWN HARDNESS' : 'EST. HARDNESS (FORMULA)'}</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span className="rval">{mode === 'preset' ? hardness : hardness.toFixed(1)}</span>
                <span style={{ color: '#6b7280', fontSize: 13 }}>Brinell (BHN)</span>
              </div>
              <HardnessBar brinell={hardness} />
            </div>

            {/* Blended $/lb (mix only, when prices entered) */}
            {pricePerLb > 0 && (
              <div className="rbox" style={{ marginBottom: 10 }}>
                <span className="lbl">BLENDED PRICE / LB</span>
                <span className="rval">${pricePerLb.toFixed(2)}</span>
                <span style={{ color: '#6b7280', fontSize: 13 }}> / lb</span>
              </div>
            )}

            {/* Boolit params */}
            <div style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: 4, padding: 14, marginBottom: 10 }}>
              <span className="lbl" style={{ marginBottom: 10 }}>BOOLIT PARAMETERS</span>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4 }}>Boolit Weight (grains)</label>
                <input type="range" min="50" max="600" step="5"
                  value={parseFloat(boolWeight) || 200}
                  onChange={e => setBoolWeight(e.target.value)}
                  style={{ width: '100%', marginBottom: 4 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 10, color: '#4b5563' }}>50 gr</span>
                  <span style={{ fontFamily: "'Oswald', sans-serif", color: '#f59e0b', fontSize: 17 }}>{parseFloat(boolWeight) || 200} gr</span>
                  <span style={{ fontSize: 10, color: '#4b5563' }}>600 gr</span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: 11, color: '#6b7280', display: 'block', marginBottom: 4 }}>Alloy Available (lbs)</label>
                <input type="number" inputMode="decimal" min="0" step="0.5"
                  className="inp" value={lbsAvail}
                  onChange={e => setLbsAvail(e.target.value)} />
              </div>
            </div>

            {/* Cost breakdown (mix + prices only) */}
            {pricePerLb > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                {[
                  ['COST / BOOLIT', `$${costPerBoolit.toFixed(4)}`],
                  ['COST / 20',    `$${(costPerBoolit * 20).toFixed(2)}`],
                  ['COST / 50',    `$${(costPerBoolit * 50).toFixed(2)}`],
                  ['COST / 100',   `$${(costPerBoolit * 100).toFixed(2)}`],
                  ['COST / 500',   `$${(costPerBoolit * 500).toFixed(2)}`],
                  ['COST / 1000',  `$${(costPerBoolit * 1000).toFixed(2)}`],
                ].map(([label, val]) => (
                  <div key={label} style={{ background: '#0d1117', border: '1px solid #1f2937', borderRadius: 4, padding: '10px 12px' }}>
                    <div style={{ fontSize: 9, color: '#4b5563', letterSpacing: 2 }}>{label}</div>
                    <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 19, color: '#e2e8f0', marginTop: 2 }}>{val}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Boolit count */}
            <div className="rbox">
              <span className="lbl">BOOLITS FROM {parseFloat(lbsAvail) || 0} LBS</span>
              <span className="rval">{boolitCount.toLocaleString()}</span>
              <span style={{ color: '#6b7280', fontSize: 13 }}> pcs</span>
            </div>
          </div>

        </div>{/* .layout */}
      </div>
    </div>
  )
}
