import { useState, useEffect, useRef } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const DEV_PASSWORD = "diogo";
const GOOGLE_SHEETS_WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbz_IYB7bXCJKCotcwkbKxLhm8f9BBge_ZpO_tLczmYgt8oFhjA9ImpaORzmhJzLP74LKA/exec"; // paste your Apps Script URL here

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ path, size = 20, strokeWidth = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={path} />
  </svg>
);
const I = {
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  briefcase: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",
  dollar: "M12 1v22 M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  target: "M22 12h-4m-2 0a6 6 0 1 1-12 0 6 6 0 0 1 12 0z M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z",
  chevR: "M9 18l6-6-6-6",
  chevL: "M15 18l-6-6 6-6",
  check: "M20 6L9 17l-5-5",
  alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  eyeOff: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24 M1 1l22 22",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  trending: "M23 6l-9.5 9.5-5-5L1 18",
  lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4",
  x: "M18 6L6 18 M6 6l12 12",
  arrow: "M5 12h14 M12 5l7 7-7 7",
  archive: "M21 8v13H3V8 M1 3h22v5H1z M10 12h4",
  trash: "M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  plus: "M12 5v14 M5 12h14",
  print: "M6 9V2h12v7 M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2 M6 14h12v8H6z",
  refresh: "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
};

// ─── COUNTRIES ────────────────────────────────────────────────────────────────
const COUNTRIES = [
  { code:"PT", dial:"+351", flag:"🇵🇹", name:"Portugal" },
  { code:"BR", dial:"+55",  flag:"🇧🇷", name:"Brazil" },
  { code:"ES", dial:"+34",  flag:"🇪🇸", name:"Spain" },
  { code:"FR", dial:"+33",  flag:"🇫🇷", name:"France" },
  { code:"DE", dial:"+49",  flag:"🇩🇪", name:"Germany" },
  { code:"IT", dial:"+39",  flag:"🇮🇹", name:"Italy" },
  { code:"GB", dial:"+44",  flag:"🇬🇧", name:"United Kingdom" },
  { code:"US", dial:"+1",   flag:"🇺🇸", name:"United States" },
  { code:"CA", dial:"+1",   flag:"🇨🇦", name:"Canada" },
  { code:"NL", dial:"+31",  flag:"🇳🇱", name:"Netherlands" },
  { code:"BE", dial:"+32",  flag:"🇧🇪", name:"Belgium" },
  { code:"CH", dial:"+41",  flag:"🇨🇭", name:"Switzerland" },
  { code:"AO", dial:"+244", flag:"🇦🇴", name:"Angola" },
  { code:"MZ", dial:"+258", flag:"🇲🇿", name:"Mozambique" },
  { code:"ZA", dial:"+27",  flag:"🇿🇦", name:"South Africa" },
  { code:"NG", dial:"+234", flag:"🇳🇬", name:"Nigeria" },
  { code:"AE", dial:"+971", flag:"🇦🇪", name:"UAE" },
  { code:"AU", dial:"+61",  flag:"🇦🇺", name:"Australia" },
  { code:"MX", dial:"+52",  flag:"🇲🇽", name:"Mexico" },
  { code:"SG", dial:"+65",  flag:"🇸🇬", name:"Singapore" },
  { code:"JP", dial:"+81",  flag:"🇯🇵", name:"Japan" },
  { code:"IN", dial:"+91",  flag:"🇮🇳", name:"India" },
];

// ─── SCORING ──────────────────────────────────────────────────────────────────
function calculateScore(data) {
  let financial = 0, operational = 0, strategic = 0, risk = 0;
  const flags = [], strengths = [];
  const budget = parseFloat(data.budget)||0;
  if (budget>=5000000){financial+=35;strengths.push("Substantial capital allocation signals strong project commitment");}
  else if(budget>=1000000){financial+=25;strengths.push("Solid budget foundation for project execution");}
  else if(budget>=250000){financial+=15;}
  else{financial+=5;flags.push("Budget below threshold for complex project delivery");}
  if(data.financingType==="confirmed"){financial+=30;strengths.push("Confirmed financing eliminates funding uncertainty");}
  else if(data.financingType==="preapproved"){financial+=20;}
  else if(data.financingType==="inProgress"){financial+=10;flags.push("Financing still in progress — execution risk elevated");}
  else{flags.push("No financing secured; high capital risk");}
  const cont=parseFloat(data.contingency)||0;
  if(cont>=15){financial+=35;strengths.push("Robust contingency reserve demonstrates fiscal prudence");}
  else if(cont>=10){financial+=20;}
  else if(cont>=5){financial+=10;flags.push("Contingency below recommended 10-15% threshold");}
  else{flags.push("Inadequate contingency — significant cost overrun exposure");}
  financial=Math.min(100,financial);
  const ts=parseInt(data.teamSize)||0;
  if(ts>=10){operational+=30;strengths.push("Large, capable team structure in place");}
  else if(ts>=5){operational+=20;}
  else if(ts>=2){operational+=10;}
  else{flags.push("Insufficient team size for project scale");}
  if(data.priorExperience==="extensive"){operational+=40;strengths.push("Extensive prior experience reduces delivery risk substantially");}
  else if(data.priorExperience==="some"){operational+=25;}
  else if(data.priorExperience==="limited"){operational+=10;flags.push("Limited experience may require additional oversight");}
  else{flags.push("No prior experience — significant operational risk");}
  if(data.softwareReady==="yes"){operational+=30;strengths.push("Production-ready software stack accelerates deployment");}
  else if(data.softwareReady==="partial"){operational+=15;flags.push("Partial software readiness may delay go-live");}
  else{flags.push("Software infrastructure not in place");}
  operational=Math.min(100,operational);
  if(data.marketFit==="strong"){strategic+=40;strengths.push("Strong market-product fit with clear demand signals");}
  else if(data.marketFit==="moderate"){strategic+=25;}
  else if(data.marketFit==="weak"){strategic+=10;flags.push("Weak market fit raises viability concerns");}
  else{flags.push("Market fit unvalidated — strategic risk high");}
  if(data.competitiveAdv==="strong"){strategic+=35;strengths.push("Distinct competitive advantage creates defensible market position");}
  else if(data.competitiveAdv==="moderate"){strategic+=20;}
  else{strategic+=5;flags.push("Weak competitive differentiation in target market");}
  if(data.regulatoryClarity==="clear"){strategic+=25;strengths.push("Regulatory pathway is clear, reducing compliance delays");}
  else if(data.regulatoryClarity==="uncertain"){strategic+=10;flags.push("Regulatory uncertainty may impede market entry");}
  else{flags.push("Regulatory barriers unresolved — legal risk elevated");}
  strategic=Math.min(100,strategic);
  const tl=parseInt(data.timeline)||0;
  if(tl>=12&&tl<=36){risk+=40;}
  else if(tl>36){risk+=20;flags.push("Extended timeline increases delivery and market risk");}
  else{risk+=10;flags.push("Compressed timeline raises execution pressure");}
  if(data.externalDependencies==="none"){risk+=35;strengths.push("Minimal external dependencies support autonomous execution");}
  else if(data.externalDependencies==="few"){risk+=20;}
  else{risk+=5;flags.push("High external dependency count amplifies schedule risk");}
  if(data.stakeholderBuyIn==="strong"){risk+=25;strengths.push("Strong stakeholder alignment ensures organizational support");}
  else if(data.stakeholderBuyIn==="moderate"){risk+=15;}
  else{flags.push("Weak stakeholder buy-in may obstruct decision-making");}
  risk=Math.min(100,risk);
  const composite=(financial*.35)+(operational*.25)+(strategic*.25)+(risk*.15);
  let classification,color;
  if(composite>=80){classification="High Priority Lead";color="emerald";}
  else if(composite>=60){classification="Viable – Needs Review";color="blue";}
  else if(composite>=40){classification="Conditional";color="amber";}
  else{classification="Low Priority";color="red";}
  return{composite:Math.round(composite),financial:Math.round(financial),operational:Math.round(operational),strategic:Math.round(strategic),risk:Math.round(risk),classification,color,flags:flags.slice(0,6),strengths:strengths.slice(0,5)};
}

// ─── GOOGLE SHEETS ────────────────────────────────────────────────────────────
async function syncToSheets(entry) {
  if (!GOOGLE_SHEETS_WEBHOOK_URL) return;
  try {
    await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method:"POST", mode:"no-cors",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({
        id:entry.id, date:entry.date,
        clientName:entry.clientName, clientPhone:entry.clientPhone,
        projectName:entry.projectName, projectType:entry.projectType,
        score:entry.score, classification:entry.classification,
        financial:entry.result?.financial, operational:entry.result?.operational,
        strategic:entry.result?.strategic, risk:entry.result?.risk,
        budget:entry.data?.budget, financingType:entry.data?.financingType,
        contingency:entry.data?.contingency, teamSize:entry.data?.teamSize,
        priorExperience:entry.data?.priorExperience, marketFit:entry.data?.marketFit,
        timeline:entry.data?.timeline, urgency:entry.data?.urgency,
        strategicObjective:entry.data?.strategicObjective,
        flags:(entry.result?.flags||[]).join(" | "),
        strengths:(entry.result?.strengths||[]).join(" | "),
      }),
    });
  } catch(e){console.warn("Sheets sync failed",e);}
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
  :root{--lm:#E4F577;--lml:#EEFA95;--lmp:#F5FCC0;--lmd:#B8CC2A;--tx:#1C1C1C;--mt:#666;--br:#E8E8E8;--dv:#0F1117;--dvs:#1A1D26;--dvb:#2A2D3A;--dva:#E4F577;}
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'DM Sans',sans-serif;background:#F9F9F9;color:var(--tx);min-height:100vh;}
  .sh{min-height:100vh;background:#F9F9F9;display:flex;flex-direction:column;}
  .hd{padding:14px 36px;border-bottom:2px solid var(--lm);display:flex;align-items:center;gap:13px;background:#fff;position:sticky;top:0;z-index:100;box-shadow:0 1px 6px rgba(0,0,0,.06);}
  .lg{width:38px;height:38px;background:var(--lm);border-radius:9px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0;font-family:'Playfair Display',serif;}
  .ht h1{font-family:'Playfair Display',serif;font-size:16px;}
  .ht p{font-size:10px;color:var(--mt);letter-spacing:2px;text-transform:uppercase;margin-top:1px;}
  .nv{margin-left:auto;display:flex;gap:3px;background:#F3F3F3;border-radius:9px;padding:3px;}
  .nt{padding:6px 14px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;border:none;transition:all .2s;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:5px;color:var(--mt);background:transparent;}
  .nt.on{background:#fff;color:var(--tx);box-shadow:0 1px 4px rgba(0,0,0,.09);}
  .nt.dev{color:#7AAA10;}
  .nt.dev.on{background:#1C1C1C;color:var(--lm);}
  .ct{flex:1;display:flex;align-items:flex-start;justify-content:center;padding:32px 18px 56px;}
  .wp{width:100%;max-width:740px;}
  .pb{display:flex;align-items:center;margin-bottom:28px;}
  .ps{display:flex;align-items:center;flex:1;}
  .pc{width:29px;height:29px;border-radius:50%;border:2px solid #D8D8D8;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:#AAA;flex-shrink:0;transition:all .3s;background:#fff;}
  .pc.ac{border-color:var(--lmd);color:var(--tx);background:var(--lm);box-shadow:0 0 0 3px rgba(228,245,119,.3);}
  .pc.dn{border-color:var(--lmd);background:var(--lm);color:var(--tx);}
  .pl{flex:1;height:2px;background:#EEE;margin:0 4px;transition:background .3s;}
  .pl.dn{background:var(--lmd);}
  .cd{background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 14px rgba(0,0,0,.06),0 0 0 1px #EEE;}
  .ch{background:var(--lm);padding:30px 38px 26px;border-bottom:2px solid var(--lmd);position:relative;overflow:hidden;}
  .ch::before{content:'';position:absolute;top:-50px;right:-50px;width:180px;height:180px;background:rgba(255,255,255,.22);border-radius:50%;}
  .ch::after{content:'';position:absolute;bottom:-28px;left:-10px;width:110px;height:110px;background:rgba(255,255,255,.1);border-radius:50%;}
  .sl{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#4A5A00;margin-bottom:7px;font-weight:600;position:relative;}
  .ch h2{font-family:'Playfair Display',serif;font-size:24px;color:var(--tx);line-height:1.2;position:relative;}
  .ch p{color:rgba(28,28,28,.55);margin-top:6px;font-size:13px;line-height:1.6;position:relative;}
  .cb{padding:34px 38px;background:#fff;}
  .fg{margin-bottom:24px;}
  .fl{display:block;font-size:13px;font-weight:600;color:var(--tx);margin-bottom:6px;}
  .fs{font-size:12px;color:var(--mt);margin-bottom:8px;display:block;}
  .fi{width:100%;padding:11px 14px;border:1.5px solid #E0E0E0;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;color:var(--tx);background:#FAFAFA;transition:all .2s;outline:none;appearance:none;}
  .fi:focus{border-color:var(--lmd);background:#fff;box-shadow:0 0 0 3px rgba(228,245,119,.3);}
  .pr{display:flex;gap:8px;}
  .cs{flex-shrink:0;padding:11px 10px;border:1.5px solid #E0E0E0;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;color:var(--tx);background:#FAFAFA;outline:none;cursor:pointer;appearance:none;min-width:140px;transition:all .2s;}
  .cs:focus{border-color:var(--lmd);background:#fff;box-shadow:0 0 0 3px rgba(228,245,119,.3);}
  .rg{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
  .rg.c1{grid-template-columns:1fr;}.rg.c3{grid-template-columns:1fr 1fr 1fr;}
  .rc{border:1.5px solid #E0E0E0;border-radius:8px;padding:12px 14px;cursor:pointer;transition:all .2s;background:#FAFAFA;display:flex;align-items:flex-start;gap:9px;user-select:none;}
  .rc:hover{border-color:var(--lmd);background:var(--lmp);}
  .rc.sl2{border-color:var(--lmd);background:var(--lmp);box-shadow:0 0 0 3px rgba(228,245,119,.3);}
  .rd{width:16px;height:16px;border-radius:50%;border:2px solid #CCC;flex-shrink:0;margin-top:2px;display:flex;align-items:center;justify-content:center;transition:all .2s;}
  .rc.sl2 .rd{border-color:var(--lmd);background:var(--lm);}
  .ri{width:5px;height:5px;background:#4A5A00;border-radius:50%;opacity:0;transition:opacity .2s;}
  .rc.sl2 .ri{opacity:1;}
  .rt strong{display:block;font-size:13px;font-weight:600;color:var(--tx);}
  .rt span{font-size:11px;color:var(--mt);line-height:1.4;margin-top:2px;display:block;}
  .br2{display:flex;justify-content:space-between;align-items:center;margin-top:28px;padding-top:22px;border-top:1px solid #F0F0F0;}
  .bp{display:flex;align-items:center;gap:7px;padding:11px 20px;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:all .2s;}
  .bpr{background:var(--lm);color:var(--tx);border:2px solid var(--lmd);box-shadow:0 2px 6px rgba(184,204,42,.18);}
  .bpr:hover{transform:translateY(-1px);background:var(--lml);}
  .bpr:disabled{opacity:.4;cursor:not-allowed;transform:none;}
  .bsc{background:transparent;color:var(--mt);border:1.5px solid #E0E0E0;}
  .bsc:hover{border-color:#BBB;color:var(--tx);background:#F7F7F7;}
  .bgh{background:transparent;color:#CCC;border:none;padding:7px;cursor:pointer;border-radius:7px;display:flex;align-items:center;transition:all .2s;}
  .bgh:hover{color:#999;background:#F5F5F5;}
  .ibg{display:inline-flex;align-items:center;gap:7px;background:var(--lmp);border:1.5px solid var(--lmd);border-radius:100px;padding:5px 13px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#4A5A00;font-weight:600;margin-bottom:20px;}
  .ifs{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin:24px 0;}
  .ifc{background:#FAFAFA;border:1.5px solid #EEE;border-radius:10px;padding:15px;}
  .ifc:hover{border-color:var(--lmd);}
  .fic{width:32px;height:32px;background:var(--lm);border-radius:7px;display:flex;align-items:center;justify-content:center;color:#4A5A00;margin-bottom:9px;}
  .ifc h4{font-size:12px;font-weight:600;color:var(--tx);margin-bottom:3px;}
  .ifc p{font-size:11px;color:var(--mt);line-height:1.5;}
  .disc{background:var(--lmp);border:1.5px solid var(--lmd);border-radius:9px;padding:12px 15px;display:flex;gap:10px;align-items:flex-start;}
  .disc p{font-size:12px;color:#4A5A00;line-height:1.5;}
  .rtg{display:flex;gap:3px;background:rgba(0,0,0,.07);border-radius:8px;padding:3px;margin-left:auto;}
  .tb{padding:5px 13px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;border:none;transition:all .2s;font-family:'DM Sans',sans-serif;display:flex;align-items:center;gap:5px;}
  .tb.on{background:#1C1C1C;color:var(--lm);}
  .tb.off{background:transparent;color:rgba(28,28,28,.4);}
  .gs{text-align:center;padding:28px 0 22px;border-bottom:2px solid var(--lm);margin-bottom:26px;}
  .cb2{display:inline-flex;align-items:center;gap:6px;padding:6px 16px;border-radius:100px;font-size:12px;font-weight:700;letter-spacing:.5px;}
  .em{background:#ECFDF5;color:#065F46;border:1.5px solid #A7F3D0;}
  .bl{background:#EFF6FF;color:#1E40AF;border:1.5px solid #BFDBFE;}
  .am{background:#FFFBEB;color:#92400E;border:1.5px solid #FDE68A;}
  .rd2{background:#FEF2F2;color:#991B1B;border:1.5px solid #FECACA;}
  .sn{font-family:'Playfair Display',serif;font-size:48px;font-weight:700;line-height:1;margin-bottom:5px;}
  .cem{color:#059669;}.cbl{color:#2563EB;}.cam{color:#D97706;}.crd{color:#DC2626;}
  .sr2{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:22px;}
  .pn{border-radius:10px;padding:16px;}
  .ps2{background:var(--lmp);border:1.5px solid var(--lmd);}
  .pr2{background:#FFFBEB;border:1.5px solid #FDE68A;}
  .pn h3{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:11px;}
  .ps2 h3{color:#4A5A00;}.pr2 h3{color:#92400E;}
  .pi{display:flex;gap:8px;align-items:flex-start;margin-bottom:8px;font-size:12px;line-height:1.5;}
  .ps2 .pi{color:#3A4A00;}.pr2 .pi{color:#78350F;}
  .pd{width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:6px;}
  .ps2 .pd{background:#7AAA10;}.pr2 .pd{background:#D97706;}
  .ab{display:flex;align-items:center;gap:10px;padding:14px 18px;background:#F9F9F9;border:1.5px solid #EEE;border-radius:11px;margin-bottom:18px;}
  .ab p{font-size:12px;color:var(--mt);flex:1;}
  .ibn{background:#1C1C1C;border:2px solid var(--lm);border-radius:10px;padding:14px 20px;display:flex;align-items:center;gap:10px;margin-bottom:20px;}
  .ibn p{font-size:12px;color:rgba(255,255,255,.6);line-height:1.5;}
  .ibn strong{color:var(--lm);display:block;font-size:13px;margin-bottom:2px;}
  .sb{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px;}
  .bc{background:#FAFAFA;border:1.5px solid #EEE;border-radius:10px;padding:14px;}
  .bh{display:flex;justify-content:space-between;align-items:center;margin-bottom:9px;}
  .bh span{font-size:10px;font-weight:600;color:var(--mt);text-transform:uppercase;letter-spacing:1px;}
  .bh strong{font-size:19px;font-family:'Playfair Display',serif;font-weight:700;}
  .bt{height:5px;background:#EEE;border-radius:3px;overflow:hidden;margin-bottom:4px;}
  .bf{height:100%;border-radius:3px;transition:width 1s ease;}
  .bw{font-size:10px;color:var(--mt);}
  .fs2{background:#FEF2F2;border:1.5px solid #FECACA;border-radius:10px;padding:16px;margin-bottom:20px;}
  .fs2 h3{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#991B1B;margin-bottom:11px;display:flex;align-items:center;gap:6px;}
  .fi2{display:flex;gap:8px;align-items:flex-start;margin-bottom:8px;font-size:12px;color:#7F1D1D;line-height:1.5;}
  .ar{margin-top:24px;padding-top:22px;border-top:2px solid var(--lm);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;}
  .sv{display:flex;align-items:center;gap:7px;background:#ECFDF5;border:1.5px solid #A7F3D0;border-radius:8px;padding:9px 14px;font-size:13px;color:#065F46;font-weight:600;}
  .ae{text-align:center;padding:50px 20px;}
  .ae .bi{width:60px;height:60px;background:var(--lmp);border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;color:#7AAA10;}
  .ae h3{font-family:'Playfair Display',serif;font-size:20px;margin-bottom:7px;}
  .ae p{font-size:13px;color:var(--mt);max-width:320px;margin:0 auto;}
  .al{display:flex;flex-direction:column;gap:10px;}
  .ai{background:#fff;border:1.5px solid #EEE;border-radius:12px;padding:16px 18px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:all .2s;}
  .ai:hover{border-color:var(--lmd);box-shadow:0 2px 10px rgba(0,0,0,.05);}
  .asc{width:50px;height:50px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
  .asn{font-family:'Playfair Display',serif;font-size:19px;font-weight:700;}
  .bge{background:#ECFDF5;}.bgb{background:#EFF6FF;}.bga{background:#FFFBEB;}.bgr{background:#FEF2F2;}
  .am2{flex:1;min-width:0;}
  .am2 h4{font-size:14px;font-weight:600;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
  .am2 p{font-size:11px;color:var(--mt);}
  .bb{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--mt);cursor:pointer;background:none;border:none;font-family:'DM Sans',sans-serif;padding:6px 0;transition:color .2s;margin-bottom:18px;}
  .bb:hover{color:var(--tx);}
  .csp{background:#F8F8F8;border:1.5px solid #E8E8E8;border-radius:10px;padding:14px 18px;display:flex;align-items:center;gap:14px;margin-bottom:18px;}
  .cav{width:38px;height:38px;background:var(--lm);border-radius:9px;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:var(--tx);flex-shrink:0;}
  .cin h4{font-size:14px;font-weight:600;}
  .cin p{font-size:12px;color:var(--mt);margin-top:2px;display:flex;align-items:center;gap:4px;}
  /* DEV */
  .dsh{min-height:100vh;background:var(--dv);display:flex;flex-direction:column;}
  .dhd{background:var(--dvs);border-bottom:1px solid var(--dvb);padding:14px 32px;display:flex;align-items:center;gap:14px;position:sticky;top:0;z-index:100;}
  .dlg{width:36px;height:36px;background:var(--dva);border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:13px;font-weight:700;color:var(--tx);}
  .dtt{font-size:14px;font-weight:600;color:#fff;}
  .dts{font-size:10px;color:#555;letter-spacing:2px;text-transform:uppercase;margin-top:1px;}
  .dbg{background:#1E2430;border:1px solid var(--dvb);border-radius:6px;padding:4px 10px;font-size:10px;color:#7AAA10;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-left:8px;}
  .dcn{flex:1;padding:28px 32px 60px;max-width:1200px;width:100%;margin:0 auto;}
  .dst{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:28px;}
  .dsi{background:var(--dvs);border:1px solid var(--dvb);border-radius:12px;padding:18px 20px;}
  .dsv{font-family:'Playfair Display',serif;font-size:30px;font-weight:700;color:#fff;line-height:1;}
  .dsl{font-size:11px;color:#555;margin-top:5px;letter-spacing:1px;text-transform:uppercase;}
  .dss{font-size:12px;color:#7AAA10;margin-top:3px;font-weight:600;}
  .dcd{background:var(--dvs);border:1px solid var(--dvb);border-radius:14px;overflow:hidden;margin-bottom:20px;}
  .dch{padding:16px 22px;border-bottom:1px solid var(--dvb);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;}
  .dct{font-size:12px;font-weight:700;color:#fff;letter-spacing:1px;text-transform:uppercase;display:flex;align-items:center;gap:8px;}
  .dtb{width:100%;border-collapse:collapse;}
  .dtb th{font-size:10px;font-weight:700;color:#555;letter-spacing:1.5px;text-transform:uppercase;padding:11px 18px;text-align:left;border-bottom:1px solid var(--dvb);background:rgba(0,0,0,.2);}
  .dtb td{padding:12px 18px;border-bottom:1px solid rgba(42,45,58,.5);font-size:13px;color:#CCC;vertical-align:middle;}
  .dtb tr:last-child td{border-bottom:none;}
  .dtb tr:hover td{background:rgba(228,245,119,.03);cursor:pointer;}
  .sp{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:9px;font-family:'Playfair Display',serif;font-size:15px;font-weight:700;}
  .spe{background:rgba(5,150,105,.15);color:#34D399;}.spb{background:rgba(37,99,235,.15);color:#60A5FA;}.spa{background:rgba(217,119,6,.15);color:#FBD862;}.spr{background:rgba(220,38,38,.15);color:#F87171;}
  .dfb{display:flex;gap:9px;align-items:center;flex-wrap:wrap;}
  .dfbt{padding:5px 13px;border-radius:6px;font-size:11px;font-weight:600;cursor:pointer;border:1px solid var(--dvb);transition:all .2s;font-family:'DM Sans',sans-serif;background:transparent;color:#666;}
  .dfbt.on{background:var(--dva);color:var(--tx);border-color:var(--dva);}
  .dsr{background:rgba(0,0,0,.3);border:1px solid var(--dvb);border-radius:7px;padding:6px 12px;font-family:'DM Sans',sans-serif;font-size:12px;color:#CCC;outline:none;width:220px;}
  .dsr::placeholder{color:#444;}.dsr:focus{border-color:#555;}
  .ddp{background:var(--dvs);border:1px solid var(--dvb);border-radius:14px;padding:24px;margin-bottom:20px;}
  .ddg{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
  .dfr{display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(42,45,58,.5);font-size:12px;}
  .dfr:last-child{border-bottom:none;}
  .dfk{color:#555;}.dfv{color:#CCC;font-weight:600;text-transform:capitalize;text-align:right;}
  .dbs{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
  .dbi{background:rgba(0,0,0,.2);border-radius:9px;padding:12px;}
  .dbl{font-size:10px;color:#555;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;display:flex;justify-content:space-between;}
  .dbv{font-size:16px;font-family:'Playfair Display',serif;font-weight:700;color:#fff;}
  .dbt{height:4px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden;margin-top:8px;}
  .dbf{height:100%;border-radius:2px;transition:width 1s ease;}
  .dse{font-size:10px;font-weight:700;color:#555;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:12px;}
  .dfl{display:flex;align-items:flex-start;gap:8px;font-size:12px;color:#F87171;line-height:1.5;margin-bottom:5px;}
  .dsl2{display:flex;align-items:flex-start;gap:8px;font-size:12px;color:#34D399;line-height:1.5;margin-bottom:5px;}
  .db2{display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:7px;font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;cursor:pointer;border:none;transition:all .2s;}
  .dbp{background:var(--dva);color:var(--tx);}.dbp:hover{opacity:.85;}
  .dbg2{background:transparent;color:#666;border:1px solid var(--dvb);}.dbg2:hover{border-color:#555;color:#CCC;}
  .dbd{background:transparent;color:#F87171;border:1px solid rgba(248,113,113,.3);}.dbd:hover{background:rgba(248,113,113,.08);border-color:#F87171;}
  .dem{text-align:center;padding:60px 20px;}
  .dei{width:56px;height:56px;background:rgba(228,245,119,.07);border:1px solid rgba(228,245,119,.15);border-radius:12px;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;color:#7AAA10;}
  .dtg{display:inline-block;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;}
  .tge{background:rgba(5,150,105,.15);color:#34D399;}.tgb{background:rgba(37,99,235,.15);color:#60A5FA;}.tga{background:rgba(217,119,6,.15);color:#FBD862;}.tgr{background:rgba(220,38,38,.15);color:#F87171;}
  .dcc{background:rgba(228,245,119,.06);border:1px solid rgba(228,245,119,.2);border-radius:10px;padding:16px 20px;display:flex;align-items:center;gap:14px;margin-bottom:16px;}
  .dca{width:44px;height:44px;background:var(--dva);border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:17px;font-weight:700;color:var(--tx);flex-shrink:0;}
  .dci h4{font-size:15px;font-weight:600;color:#fff;}
  .dci p{font-size:12px;color:#7AAA10;margin-top:3px;display:flex;align-items:center;gap:5px;}
  /* DEV LOGIN */
  .dlg2{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;background:var(--dv);padding:24px;}
  .dlc{background:var(--dvs);border:1px solid var(--dvb);border-radius:16px;padding:38px 40px;width:100%;max-width:380px;text-align:center;}
  .dlic{width:52px;height:52px;background:var(--dva);border-radius:12px;display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--tx);margin:0 auto 18px;}
  .dlt{font-family:'Playfair Display',serif;font-size:22px;color:#fff;margin-bottom:5px;}
  .dls{font-size:12px;color:#555;margin-bottom:28px;}
  .dlf{width:100%;background:rgba(0,0,0,.3);border:1px solid var(--dvb);border-radius:8px;padding:11px 14px;font-family:'DM Sans',sans-serif;font-size:14px;color:#CCC;outline:none;text-align:center;letter-spacing:2px;transition:border-color .2s;}
  .dlf:focus{border-color:var(--dva);}
  .dle{color:#F87171;font-size:12px;margin-top:10px;}
  .dlb{width:100%;margin-top:18px;padding:12px;background:var(--dva);color:var(--tx);border:none;border-radius:8px;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:700;cursor:pointer;}
  .dlb:hover{opacity:.85;}
  .dlb:disabled{opacity:.5;cursor:not-allowed;}
  /* PRINT */
  @media print{
    .hd,.nv,.pb,.br2,.ab,.ar,.rtg,.no-print{display:none!important;}
    .sh,.ct{background:white!important;padding:0!important;}
    .cd{box-shadow:none!important;border:none!important;border-radius:0!important;}
    .ch{background:#E4F577!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    .ps2{background:#F5FCC0!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    .pr2{background:#FFFBEB!important;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    .bf{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    .wp{max-width:100%!important;}
  }
  @keyframes fu{from{opacity:0;transform:translateY(13px);}to{opacity:1;transform:translateY(0);}}
  .an{animation:fu .32s ease forwards;}
  @keyframes si{from{opacity:0;transform:translateX(18px);}to{opacity:1;transform:translateX(0);}}
  .sla{animation:si .28s ease forwards;}
  @media(max-width:600px){
    .ch,.cb{padding:20px!important;}
    .rg,.sr2,.sb,.ifs,.dbs,.ddg,.dst{grid-template-columns:1fr!important;}
    .hd{padding:12px 14px;}
    .ct{padding:18px 8px 44px;}
    .nv,.rtg{display:none;}
    .ar{flex-direction:column;align-items:stretch;}
    .dcn{padding:16px 14px 40px;}
    .pr{flex-direction:column;}
  }
`;

// ─── SHARED ───────────────────────────────────────────────────────────────────
function RC({ value, sel, onChange, label, sub }) {
  return (
    <div className={`rc ${sel===value?"sl2":""}`} onClick={()=>onChange(value)}>
      <div className="rd"><div className="ri"/></div>
      <div className="rt"><strong>{label}</strong>{sub&&<span>{sub}</span>}</div>
    </div>
  );
}
function Field({ label, sub, children }) {
  return <div className="fg"><label className="fl">{label}</label>{sub&&<span className="fs">{sub}</span>}{children}</div>;
}
function Gauge({ score, color }) {
  const cols={emerald:"#059669",blue:"#2563EB",amber:"#D97706",red:"#DC2626"};
  const c=cols[color], cx=120, cy=115;
  const arc=(s,e,ri,ro)=>{
    const x1=cx+ro*Math.cos(s),y1=cy-ro*Math.sin(s),x2=cx+ro*Math.cos(e),y2=cy-ro*Math.sin(e);
    const x3=cx+ri*Math.cos(e),y3=cy-ri*Math.sin(e),x4=cx+ri*Math.cos(s),y4=cy-ri*Math.sin(s);
    return `M${x1} ${y1} A${ro} ${ro} 0 ${e-s>Math.PI?1:0} 0 ${x2} ${y2} L${x3} ${y3} A${ri} ${ri} 0 ${e-s>Math.PI?1:0} 1 ${x4} ${y4} Z`;
  };
  const zones=[{s:Math.PI,e:Math.PI*.6,c:"#FECACA"},{s:Math.PI*.6,e:Math.PI*.4,c:"#FDE68A"},{s:Math.PI*.4,e:Math.PI*.2,c:"#BFDBFE"},{s:Math.PI*.2,e:0,c:"#BBF7D0"}];
  const va=Math.PI-(score/100)*Math.PI;
  return(
    <svg width="240" height="130" viewBox="0 0 240 130" style={{overflow:"visible"}}>
      {zones.map((z,i)=><path key={i} d={arc(z.s,z.e,72,100)} fill={z.c}/>)}
      <path d={arc(Math.PI,va,72,100)} fill={c} opacity={.85}/>
      <circle cx={cx} cy={cy} r={7} fill={c}/>
      <line x1={cx} y1={cy} x2={cx+82*Math.cos(va)} y2={cy-82*Math.sin(va)} stroke={c} strokeWidth={3} strokeLinecap="round"/>
      <circle cx={cx} cy={cy} r={4} fill="white"/>
      {["0","40","60","80","100"].map((v,i)=>{const a=Math.PI-(parseInt(v)/100)*Math.PI;return<text key={i} x={cx+112*Math.cos(a)} y={cy-112*Math.sin(a)} textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#9CA3AF" fontFamily="DM Sans">{v}</text>;})}
    </svg>
  );
}

// ─── STEPS ────────────────────────────────────────────────────────────────────
function StepIntro({onNext}){
  return(
    <div className="an">
      <div className="ch"><div className="sl">Welcome</div><h2>ATHENA Pre-Check Tool</h2><p>Institutional-grade diagnostic framework for rapid project viability assessment.</p></div>
      <div className="cb">
        <div style={{textAlign:"center",paddingTop:6}}><div className="ibg"><Icon path={I.shield} size={10}/> Confidential · Internal Use Only</div></div>
        <div className="ifs">
          {[{i:I.dollar,t:"Financial Analysis",d:"Budget, financing, and contingency at 35% weight."},{i:I.settings,t:"Operational Readiness",d:"Team capacity and infrastructure at 25% weight."},{i:I.target,t:"Strategic Fit",d:"Market alignment and positioning at 25% weight."},{i:I.alert,t:"Risk Profile",d:"Timeline and stakeholder alignment at 15% weight."}].map((f,i)=>(
            <div className="ifc" key={i}><div className="fic"><Icon path={f.i} size={15}/></div><h4>{f.t}</h4><p>{f.d}</p></div>
          ))}
        </div>
        <div className="disc"><div style={{color:"#7AAA10",flexShrink:0,marginTop:1}}><Icon path={I.lock} size={14}/></div><p>This assessment is proprietary and confidential. Results are for internal qualification purposes only.</p></div>
        <div className="br2" style={{justifyContent:"flex-end"}}><button className="bp bpr" onClick={onNext}>Begin Assessment <Icon path={I.arrow} size={14}/></button></div>
      </div>
    </div>
  );
}

function StepClient({data,setData,onNext,onBack}){
  const ok=data.clientName&&data.clientPhone&&data.clientCountry;
  const country=COUNTRIES.find(c=>c.code===(data.clientCountry||"PT"))||COUNTRIES[0];
  return(
    <div className="an">
      <div className="ch"><div className="sl">Step 1 of 6 — Your Details</div><h2>Client Information</h2><p>Please provide your contact details so we can identify your submission.</p></div>
      <div className="cb">
        <Field label="Full Name" sub="Your first and last name">
          <input className="fi" value={data.clientName||""} onChange={e=>setData({...data,clientName:e.target.value})} placeholder="e.g. João Silva"/>
        </Field>
        <Field label="WhatsApp Number" sub="Select your country and enter your number">
          <div className="pr">
            <select className="cs" value={data.clientCountry||"PT"} onChange={e=>setData({...data,clientCountry:e.target.value})}>
              {COUNTRIES.map(c=><option key={c.code} value={c.code}>{c.flag} {c.dial} — {c.name}</option>)}
            </select>
            <input className="fi" type="tel" value={data.clientPhone||""} onChange={e=>setData({...data,clientPhone:e.target.value})} placeholder="912 345 678" style={{flex:1}}/>
          </div>
          {data.clientPhone&&data.clientCountry&&(
            <div style={{fontSize:11,color:"#7AAA10",marginTop:6,display:"flex",alignItems:"center",gap:5}}>
              <Icon path={I.check} size={11}/> Full number: {country.dial} {data.clientPhone}
            </div>
          )}
        </Field>
        <div className="disc"><div style={{color:"#7AAA10",flexShrink:0,marginTop:1}}><Icon path={I.lock} size={14}/></div><p>Your contact details are kept strictly confidential and are only used by our team to follow up on this assessment.</p></div>
        <div className="br2">
          <button className="bp bsc" onClick={onBack}><Icon path={I.chevL} size={13}/> Back</button>
          <button className="bp bpr" onClick={onNext} disabled={!ok}>Continue <Icon path={I.chevR} size={13}/></button>
        </div>
      </div>
    </div>
  );
}

function StepProjectBasics({data,setData,onNext,onBack}){
  const ok=data.projectName&&data.projectType&&data.teamSize&&data.priorExperience;
  return(
    <div className="an">
      <div className="ch"><div className="sl">Step 2 of 6</div><h2>Project Fundamentals</h2><p>Core identifiers and organizational capacity.</p></div>
      <div className="cb">
        <Field label="Project Name"><input className="fi" value={data.projectName||""} onChange={e=>setData({...data,projectName:e.target.value})} placeholder="Enter project name"/></Field>
        <Field label="Project Type">
          <div className="rg">
            {[{v:"development",l:"Real Estate / Development"},{v:"technology",l:"Technology / Software"},{v:"manufacturing",l:"Manufacturing / Industrial"},{v:"services",l:"Professional Services"},{v:"infrastructure",l:"Infrastructure / Energy"},{v:"other",l:"Other / Mixed"}].map(o=><RC key={o.v} value={o.v} label={o.l} sel={data.projectType} onChange={v=>setData({...data,projectType:v})}/>)}
          </div>
        </Field>
        <Field label="Core Team Size" sub="Dedicated full-time personnel"><input className="fi" type="number" min="0" value={data.teamSize||""} onChange={e=>setData({...data,teamSize:e.target.value})} placeholder="e.g. 8"/></Field>
        <Field label="Prior Experience in This Domain">
          <div className="rg">
            {[{v:"extensive",l:"Extensive",s:"5+ completed projects"},{v:"some",l:"Some",s:"2–4 prior projects"},{v:"limited",l:"Limited",s:"1 project"},{v:"none",l:"None",s:"First attempt"}].map(o=><RC key={o.v} value={o.v} label={o.l} sub={o.s} sel={data.priorExperience} onChange={v=>setData({...data,priorExperience:v})}/>)}
          </div>
        </Field>
        <div className="br2">
          <button className="bp bsc" onClick={onBack}><Icon path={I.chevL} size={13}/> Back</button>
          <button className="bp bpr" onClick={onNext} disabled={!ok}>Continue <Icon path={I.chevR} size={13}/></button>
        </div>
      </div>
    </div>
  );
}

function StepBudget({data,setData,onNext,onBack}){
  const ok=data.budget&&data.financingType&&data.contingency;
  return(
    <div className="an">
      <div className="ch"><div className="sl">Step 3 of 6</div><h2>Budget & Financing</h2><p>Capital allocation and financing structure assessment.</p></div>
      <div className="cb">
        <Field label="Total Project Budget (USD)" sub="Include all phases and soft costs"><input className="fi" type="number" min="0" value={data.budget||""} onChange={e=>setData({...data,budget:e.target.value})} placeholder="e.g. 2500000"/></Field>
        <Field label="Financing Status">
          <div className="rg c1">
            {[{v:"confirmed",l:"Fully Confirmed",s:"Funds committed and accessible"},{v:"preapproved",l:"Pre-Approved",s:"Conditional approval in hand"},{v:"inProgress",l:"In Progress",s:"Active applications underway"},{v:"none",l:"Not Yet Secured",s:"Financing not initiated"}].map(o=><RC key={o.v} value={o.v} label={o.l} sub={o.s} sel={data.financingType} onChange={v=>setData({...data,financingType:v})}/>)}
          </div>
        </Field>
        <Field label="Contingency Reserve (%)" sub="As a percentage of total project budget"><input className="fi" type="number" min="0" max="100" value={data.contingency||""} onChange={e=>setData({...data,contingency:e.target.value})} placeholder="e.g. 12"/></Field>
        <div className="br2">
          <button className="bp bsc" onClick={onBack}><Icon path={I.chevL} size={13}/> Back</button>
          <button className="bp bpr" onClick={onNext} disabled={!ok}>Continue <Icon path={I.chevR} size={13}/></button>
        </div>
      </div>
    </div>
  );
}

function StepProduction({data,setData,onNext,onBack}){
  const ok=data.softwareReady&&data.marketFit&&data.competitiveAdv;
  return(
    <div className="an">
      <div className="ch"><div className="sl">Step 4 of 6</div><h2>Production & Market Readiness</h2><p>Operational infrastructure and strategic market positioning.</p></div>
      <div className="cb">
        <Field label="Technology / Software Readiness">
          <div className="rg c3">
            {[{v:"yes",l:"Fully Ready",s:"Production deployed"},{v:"partial",l:"Partially Ready",s:"In development"},{v:"no",l:"Not Ready",s:"Not initiated"}].map(o=><RC key={o.v} value={o.v} label={o.l} sub={o.s} sel={data.softwareReady} onChange={v=>setData({...data,softwareReady:v})}/>)}
          </div>
        </Field>
        <Field label="Market Fit Assessment">
          <div className="rg">
            {[{v:"strong",l:"Strong",s:"Validated demand"},{v:"moderate",l:"Moderate",s:"Early traction"},{v:"weak",l:"Weak",s:"Speculative"},{v:"unknown",l:"Unvalidated",s:"No assessment done"}].map(o=><RC key={o.v} value={o.v} label={o.l} sub={o.s} sel={data.marketFit} onChange={v=>setData({...data,marketFit:v})}/>)}
          </div>
        </Field>
        <Field label="Competitive Advantage">
          <div className="rg c3">
            {[{v:"strong",l:"Differentiated",s:"Defensible moat"},{v:"moderate",l:"Moderate",s:"Some differentiation"},{v:"weak",l:"Commoditized",s:"Limited distinction"}].map(o=><RC key={o.v} value={o.v} label={o.l} sub={o.s} sel={data.competitiveAdv} onChange={v=>setData({...data,competitiveAdv:v})}/>)}
          </div>
        </Field>
        <div className="br2">
          <button className="bp bsc" onClick={onBack}><Icon path={I.chevL} size={13}/> Back</button>
          <button className="bp bpr" onClick={onNext} disabled={!ok}>Continue <Icon path={I.chevR} size={13}/></button>
        </div>
      </div>
    </div>
  );
}

function StepTimeline({data,setData,onNext,onBack}){
  const ok=data.timeline&&data.externalDependencies&&data.regulatoryClarity&&data.stakeholderBuyIn;
  return(
    <div className="an">
      <div className="ch"><div className="sl">Step 5 of 6</div><h2>Timeline & Risk Factors</h2><p>Execution horizon, dependencies, and organizational alignment.</p></div>
      <div className="cb">
        <Field label="Projected Timeline (months)"><input className="fi" type="number" min="1" value={data.timeline||""} onChange={e=>setData({...data,timeline:e.target.value})} placeholder="e.g. 18"/></Field>
        <Field label="External Dependencies">
          <div className="rg c3">
            {[{v:"none",l:"None",s:"Fully autonomous"},{v:"few",l:"Few",s:"1–3 partners"},{v:"many",l:"Many",s:"4+ dependencies"}].map(o=><RC key={o.v} value={o.v} label={o.l} sub={o.s} sel={data.externalDependencies} onChange={v=>setData({...data,externalDependencies:v})}/>)}
          </div>
        </Field>
        <Field label="Regulatory / Compliance Clarity">
          <div className="rg c3">
            {[{v:"clear",l:"Fully Clear",s:"All permits identified"},{v:"uncertain",l:"Uncertain",s:"Some ambiguity"},{v:"blocked",l:"Blocked",s:"Unresolved barriers"}].map(o=><RC key={o.v} value={o.v} label={o.l} sub={o.s} sel={data.regulatoryClarity} onChange={v=>setData({...data,regulatoryClarity:v})}/>)}
          </div>
        </Field>
        <Field label="Internal Stakeholder Buy-In">
          <div className="rg c3">
            {[{v:"strong",l:"Strong",s:"C-suite championed"},{v:"moderate",l:"Moderate",s:"General support"},{v:"weak",l:"Weak",s:"Significant resistance"}].map(o=><RC key={o.v} value={o.v} label={o.l} sub={o.s} sel={data.stakeholderBuyIn} onChange={v=>setData({...data,stakeholderBuyIn:v})}/>)}
          </div>
        </Field>
        <div className="br2">
          <button className="bp bsc" onClick={onBack}><Icon path={I.chevL} size={13}/> Back</button>
          <button className="bp bpr" onClick={onNext} disabled={!ok}>Continue <Icon path={I.chevR} size={13}/></button>
        </div>
      </div>
    </div>
  );
}

function StepStrategic({data,setData,onNext,onBack}){
  return(
    <div className="an">
      <div className="ch"><div className="sl">Step 6 of 6</div><h2>Strategic Intent</h2><p>Final context to align this assessment with your objectives.</p></div>
      <div className="cb">
        <Field label="Primary Strategic Objective" sub="The single most important outcome this project must achieve">
          <textarea className="fi" rows={3} style={{resize:"vertical"}} value={data.strategicObjective||""} onChange={e=>setData({...data,strategicObjective:e.target.value})} placeholder="e.g. Expand into Southeast Asian markets by Q3..."/>
        </Field>
        <Field label="Known Critical Risks" sub="Risks you've already identified (optional)">
          <textarea className="fi" rows={3} style={{resize:"vertical"}} value={data.knownRisks||""} onChange={e=>setData({...data,knownRisks:e.target.value})} placeholder="e.g. Supply chain disruption, key personnel availability..."/>
        </Field>
        <Field label="Urgency Level">
          <div className="rg c3">
            {[{v:"critical",l:"Critical",s:"Must launch immediately"},{v:"high",l:"High",s:"Within 90 days"},{v:"standard",l:"Standard",s:"No immediate pressure"}].map(o=><RC key={o.v} value={o.v} label={o.l} sub={o.s} sel={data.urgency} onChange={v=>setData({...data,urgency:v})}/>)}
          </div>
        </Field>
        <div className="br2">
          <button className="bp bsc" onClick={onBack}><Icon path={I.chevL} size={13}/> Back</button>
          <button className="bp bpr" onClick={onNext}>Generate Assessment <Icon path={I.arrow} size={14}/></button>
        </div>
      </div>
    </div>
  );
}

// ─── RESULTS CONTENT ──────────────────────────────────────────────────────────
function ResultsContent({data, result, savedId, devMode=false}){
  const [view,setView]=useState(devMode?"internal":"client");
  const reportId=savedId||("ATH-"+Date.now().toString(36).toUpperCase());
  const dateStr=new Date().toLocaleDateString("en-US",{dateStyle:"long"});
  const country=COUNTRIES.find(c=>c.code===data.clientCountry);
  const fullPhone=country?`${country.dial} ${data.clientPhone||""}`:data.clientPhone||"";
  const cc=result.color==="emerald"?"em":result.color==="blue"?"bl":result.color==="amber"?"am":"rd2";
  const bds=[{k:"financial",l:"Financial",w:"35%",c:"#B8CC2A"},{k:"operational",l:"Operational",w:"25%",c:"#3B82F6"},{k:"strategic",l:"Strategic",w:"25%",c:"#8B5CF6"},{k:"risk",l:"Risk",w:"15%",c:"#EF4444"}];
  return(
    <div>
      <div className="ch">
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:14}}>
          <div>
            <div className="sl">Assessment Report</div>
            <h2>{data.projectName||"Project"} — Viability Report</h2>
            <p style={{marginTop:5}}>{dateStr} · ID: {reportId}</p>
          </div>
          <div className="rtg no-print">
            <button className={`tb ${view==="client"?"on":"off"}`} onClick={()=>setView("client")}><Icon path={I.eye} size={11}/> Client</button>
            <button className={`tb ${view==="internal"?"on":"off"}`} onClick={()=>setView("internal")}><Icon path={I.lock} size={11}/> Internal</button>
          </div>
        </div>
      </div>
      <div className="cb">
        {(data.clientName||data.clientPhone)&&(
          <div className="csp no-print">
            <div className="cav">{(data.clientName||"?")[0].toUpperCase()}</div>
            <div className="cin">
              <h4>{data.clientName||"Unknown"}</h4>
              <p><Icon path={I.phone} size={11}/> {fullPhone||"—"}</p>
            </div>
          </div>
        )}
        <div className="ab no-print">
          <Icon path={I.file} size={17} style={{color:"#7AAA10",flexShrink:0}}/>
          <p>Download this assessment as a PDF for sharing or archiving.</p>
          <button className="bp bpr" onClick={()=>window.print()} style={{whiteSpace:"nowrap",flexShrink:0}}><Icon path={I.print} size={13}/> Download PDF</button>
        </div>
        {view==="client"?(
          <>
            <div className="gs">
              <Gauge score={result.composite} color={result.color}/>
              <div className={`sn c${cc}`} style={{display:"flex",alignItems:"baseline",justifyContent:"center",gap:4}}>
                <span>{result.composite}</span>
                <span style={{fontSize:20,opacity:0.5}}>/100</span>
              </div>
              <div className={`cb2 ${cc}`}>
                <Icon path={result.composite>=80?I.star:result.composite>=60?I.trending:result.composite>=40?I.alert:I.x} size={12}/>
                {result.classification}
              </div>
              <p style={{color:"#777",fontSize:13,marginTop:7,maxWidth:460,margin:"7px auto 0"}}>
                {result.composite>=80&&"This project demonstrates exceptional viability and is recommended for immediate engagement."}
                {result.composite>=60&&result.composite<80&&"This project shows meaningful promise. Further due diligence is advised before commitment."}
                {result.composite>=40&&result.composite<60&&"Viability is conditional. Address identified risks before proceeding."}
                {result.composite<40&&"Significant structural concerns undermine project viability at this stage."}
              </p>
            </div>
            <div className="sr2">
              <div className="pn ps2"><h3>✦ Key Strengths</h3>{result.strengths.length>0?result.strengths.map((s,i)=><div className="pi" key={i}><div className="pd"/><span>{s}</span></div>):<div className="pi" style={{color:"#999"}}>No significant strengths at this level.</div>}</div>
              <div className="pn pr2"><h3>⚠ Key Concerns</h3>{result.flags.length>0?result.flags.slice(0,3).map((f,i)=><div className="pi" key={i}><div className="pd"/><span>{f}</span></div>):<div className="pi" style={{color:"#999"}}>No significant risks flagged.</div>}</div>
            </div>
            {data.strategicObjective&&<div style={{background:"#FAFAFA",border:"1.5px solid #EEE",borderRadius:10,padding:"14px 16px"}}><div style={{fontSize:10,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:"#999",marginBottom:7}}>Strategic Objective</div><p style={{fontSize:13,color:"#444",lineHeight:1.6}}>{data.strategicObjective}</p></div>}
          </>
        ):(
          <>
            <div className="ibn"><div style={{color:"#E4F577",flexShrink:0}}><Icon path={I.lock} size={18}/></div><div><strong>Internal Dashboard — Restricted Access</strong><p>Exact scoring, weighted breakdowns, all risk flags. Not for client distribution.</p></div></div>
            <div style={{marginBottom:18}}>
              <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:6}}>
                <span style={{fontFamily:"'Playfair Display',serif",fontSize:38,fontWeight:700,color:"#1C1C1C"}}>{result.composite}</span>
                <span style={{color:"#888",fontSize:12}}>Composite Score (Weighted)</span>
                <span className={`cb2 ${cc}`} style={{marginLeft:"auto",fontSize:11}}>{result.classification}</span>
              </div>
              <div className="bt" style={{height:8}}><div className="bf" style={{width:`${result.composite}%`,background:"#E4F577"}}/></div>
            </div>
            <div className="sb">
              {bds.map(b=>(
                <div className="bc" key={b.k}>
                  <div className="bh"><span>{b.l}</span><strong style={{color:b.c}}>{result[b.k]}</strong></div>
                  <div className="bt"><div className="bf" style={{width:`${result[b.k]}%`,background:b.c}}/></div>
                  <div className="bw">Weight: {b.w} · {Math.round(result[b.k]*parseFloat(b.w)/100)} pts</div>
                </div>
              ))}
            </div>
            {result.flags.length>0&&<div className="fs2"><h3><Icon path={I.alert} size={12}/> Risk Flags ({result.flags.length})</h3>{result.flags.map((f,i)=><div className="fi2" key={i}><Icon path={I.alert} size={12}/><span>{f}</span></div>)}</div>}
            <div style={{background:"#FAFAFA",border:"1.5px solid #EEE",borderRadius:10,padding:"14px 16px"}}>
              <div style={{fontSize:10,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",color:"#999",marginBottom:9}}>Raw Input Data</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3px 18px"}}>
                {[["Budget",data.budget?`$${parseInt(data.budget).toLocaleString()}`:"N/A"],["Financing",data.financingType||"N/A"],["Contingency",data.contingency?`${data.contingency}%`:"N/A"],["Team Size",data.teamSize||"N/A"],["Experience",data.priorExperience||"N/A"],["Market Fit",data.marketFit||"N/A"],["Timeline",data.timeline?`${data.timeline} mo`:"N/A"],["Stakeholder",data.stakeholderBuyIn||"N/A"]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #F0F0F0",fontSize:12}}>
                    <span style={{color:"#888"}}>{k}</span><strong style={{color:"#1C1C1C",textTransform:"capitalize"}}>{v}</strong>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── LOCAL STORAGE HELPERS ────────────────────────────────────────────────────
function lsGet(key){ try{ const v=localStorage.getItem(key); return v?JSON.parse(v):null; }catch{ return null; } }
function lsSet(key,val){ try{ localStorage.setItem(key,JSON.stringify(val)); return true; }catch{ return false; } }
function lsDel(key){ try{ localStorage.removeItem(key); return true; }catch{ return false; } }
function lsList(prefix){ try{ return Object.keys(localStorage).filter(k=>k.startsWith(prefix)); }catch{ return []; } }

// ─── STEP RESULTS ─────────────────────────────────────────────────────────────
function StepResults({data, result, onReset}){
  const [saved,setSaved]=useState(false);
  const [saving,setSaving]=useState(false);
  const rid=useRef("ATH-"+Date.now().toString(36).toUpperCase());

  useEffect(()=>{
    (async()=>{
      setSaving(true);
      try{
        const country=COUNTRIES.find(c=>c.code===data.clientCountry);
        const fullPhone=country?`${country.dial} ${data.clientPhone||""}`:data.clientPhone||"";
        const entry={
          id:rid.current, date:new Date().toISOString(),
          clientName:data.clientName||"Unknown",
          clientPhone:fullPhone, clientCountry:data.clientCountry||"",
          projectName:data.projectName||"Unnamed",
          projectType:data.projectType||"",
          score:result.composite, classification:result.classification,
          color:result.color, data, result,
        };
        lsSet(`assessment:${rid.current}`, entry);
        await syncToSheets(entry);
        setSaved(true);
      }catch(e){console.warn("Auto-save failed",e);}
      setSaving(false);
    })();
  },[]);

  return(
    <div className="an">
      <ResultsContent data={data} result={result} savedId={rid.current}/>
      <div style={{padding:"0 38px 28px"}}>
        <div className="ar no-print">
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            {saving&&<span style={{fontSize:12,color:"#888",display:"flex",alignItems:"center",gap:6}}><Icon path={I.refresh} size={12}/> Saving...</span>}
            {saved&&<div className="sv"><Icon path={I.check} size={13}/> Saved — our team will be in touch</div>}
          </div>
          <button className="bp bsc" onClick={onReset}><Icon path={I.plus} size={13}/> New Assessment</button>
        </div>
      </div>
    </div>
  );
}

// ─── CLIENT ARCHIVE ───────────────────────────────────────────────────────────
function ClientArchive(){
  const [items,setItems]=useState(null);
  const [sel,setSel]=useState(null);
  const cm={emerald:"#059669",blue:"#2563EB",amber:"#D97706",red:"#DC2626"};
  const bm={emerald:"bge",blue:"bgb",amber:"bga",red:"bgr"};
  const cc2=(c)=>c==="emerald"?"em":c==="blue"?"bl":c==="amber"?"am":"rd2";

  useEffect(()=>{
    try{
      const keys=lsList("assessment:");
      const arr=keys.map(k=>lsGet(k)).filter(Boolean);
      arr.sort((a,b)=>new Date(b.date)-new Date(a.date));
      setItems(arr);
    }catch{setItems([]);}
  },[]);

  if(sel) return(
    <div className="sla">
      <button className="bb" onClick={()=>setSel(null)}><Icon path={I.chevL} size={14}/> Back</button>
      <div className="cd"><ResultsContent data={sel.data} result={sel.result} savedId={sel.id}/></div>
    </div>
  );
  return(
    <div className="an">
      <div className="cd">
        <div className="ch"><div className="sl">History</div><h2>My Assessments</h2><p>All your past results, saved automatically upon completion.</p></div>
        <div className="cb">
          {items===null?<div style={{textAlign:"center",padding:"36px 0",color:"#AAA"}}>Loading...</div>
          :items.length===0?<div className="ae"><div className="bi"><Icon path={I.archive} size={26}/></div><h3>No assessments yet</h3><p>Complete an assessment and your results will appear here automatically.</p></div>
          :(
            <div className="al">
              {items.map(item=>(
                <div className="ai" key={item.id} onClick={()=>setSel(item)}>
                  <div className={`asc ${bm[item.color]||"bgb"}`}><span className="asn" style={{color:cm[item.color]||"#2563EB"}}>{item.score}</span></div>
                  <div className="am2"><h4>{item.projectName}</h4><p>{item.projectType?item.projectType[0].toUpperCase()+item.projectType.slice(1):"Project"} · {new Date(item.date).toLocaleDateString("en-US",{dateStyle:"medium"})}</p></div>
                  <span className={`cb2 ${cc2(item.color)}`} style={{fontSize:11,flexShrink:0}}>{item.classification}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── DEV LOGIN (Gmail 2FA) ────────────────────────────────────────────────────
function DevLogin({ onLogin, onBack }) {
  const [stage, setStage] = useState("password");
  const [pw, setPw] = useState("");
  const [code, setCode] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const submitPassword = async () => {
    if (pw !== DEV_PASSWORD) { setError("Incorrect password."); setPw(""); return; }
    setSending(true); setError("");
    try {
      const res = await fetch("/api/send-code", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.token) { setToken(data.token); setStage("code"); }
      else { setError(data.error || "Failed to send email. Check Gmail setup in Vercel."); }
    } catch { setError("Network error."); }
    setSending(false);
  };

  const submitCode = async () => {
    setVerifying(true); setError("");
    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, token }),
      });
      if (res.ok) { onLogin(); }
      else { setError("Invalid or expired code."); setCode(""); }
    } catch { setError("Network error."); }
    setVerifying(false);
  };

  return (
    <div className="dlg2">
      <div className="dlc">
        <div className="dlic">Aθ</div>
        <div className="dlt">Developer Access</div>
        {stage === "password" ? (
          <>
            <div className="dls">Enter your admin password to continue.</div>
            <div style={{position:"relative"}}>
              <input className="dlf" type={show?"text":"password"} value={pw}
                onChange={e=>{setPw(e.target.value);setError("");}}
                onKeyDown={e=>e.key==="Enter"&&submitPassword()}
                placeholder="••••••••" autoFocus/>
              <button onClick={()=>setShow(v=>!v)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#555",display:"flex"}}>
                <Icon path={show?I.eyeOff:I.eye} size={14}/>
              </button>
            </div>
            {error && <div className="dle">{error}</div>}
            <button className="dlb" onClick={submitPassword} disabled={sending}>
              {sending ? "Sending code to Gmail..." : "Continue"}
            </button>
          </>
        ) : (
          <>
            <div className="dls">A 6-digit code was sent to your Gmail. Enter it below.</div>
            <input className="dlf" type="text" value={code}
              onChange={e=>{setCode(e.target.value);setError("");}}
              onKeyDown={e=>e.key==="Enter"&&submitCode()}
              placeholder="000000" maxLength={6} autoFocus/>
            {error && <div className="dle">{error}</div>}
            <button className="dlb" onClick={submitCode} disabled={verifying}>
              {verifying ? "Verifying..." : "Access Dashboard"}
            </button>
            <button onClick={()=>{setStage("password");setError("");}} style={{marginTop:10,background:"none",border:"none",color:"#555",font:"inherit",cursor:"pointer",fontSize:12}}>
              ← Re-enter password
            </button>
          </>
        )}
        {onBack && (
          <button onClick={onBack} style={{marginTop:8,background:"none",border:"none",color:"#444",font:"inherit",cursor:"pointer",fontSize:12}}>
            ← Back to app
          </button>
        )}
      </div>
    </div>
  );
}

// ─── DEV DASHBOARD ────────────────────────────────────────────────────────────
function DevDashboard(){
  const [items,setItems]=useState(null);
  const [sel,setSel]=useState(null);
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");
  const spC=(c)=>c==="emerald"?"spe":c==="blue"?"spb":c==="amber"?"spa":"spr";
  const tgC=(c)=>c==="emerald"?"tge":c==="blue"?"tgb":c==="amber"?"tga":"tgr";
  const bcs={financial:"#B8CC2A",operational:"#3B82F6",strategic:"#8B5CF6",risk:"#EF4444"};

  const load=()=>{
    try{
      const keys=lsList("assessment:");
      const arr=keys.map(k=>lsGet(k)).filter(Boolean);
      arr.sort((a,b)=>new Date(b.date)-new Date(a.date));
      setItems(arr);
    }catch{setItems([]);}
  };
  useEffect(()=>{load();},[]);

  const del=async(id,e)=>{
    if(e)e.stopPropagation();
    if(!window.confirm("Permanently delete?"))return;
    try{lsDel(`assessment:${id}`);if(sel?.id===id)setSel(null);load();}catch{}
  };

  const filtered=(items||[]).filter(a=>{
    if(filter!=="all"&&a.color!==filter)return false;
    if(search){const q=search.toLowerCase();return(a.clientName||"").toLowerCase().includes(q)||(a.clientPhone||"").includes(q)||(a.projectName||"").toLowerCase().includes(q);}
    return true;
  });

  const stats=items?{total:items.length,avg:items.length?Math.round(items.reduce((s,a)=>s+a.score,0)/items.length):0,high:items.filter(a=>a.color==="emerald").length,low:items.filter(a=>a.color==="red").length}:{total:0,avg:0,high:0,low:0};

  if(sel){
    const res=sel.result,d=sel.data;
    return(
      <div className="dcn an">
        <button className="bb" onClick={()=>setSel(null)} style={{color:"#555"}}><Icon path={I.chevL} size={14}/><span style={{color:"#555"}}>All Submissions</span></button>
        <div className="dcc">
          <div className="dca">{(sel.clientName||"?")[0].toUpperCase()}</div>
          <div className="dci">
            <h4>{sel.clientName||"Unknown"}</h4>
            <p><Icon path={I.phone} size={11}/> {sel.clientPhone||"—"} &nbsp;·&nbsp; {sel.id} &nbsp;·&nbsp; {new Date(sel.date).toLocaleDateString("en-US",{dateStyle:"medium"})}</p>
          </div>
          <div style={{marginLeft:"auto",display:"flex",gap:8}}>
            <button className="db2 dbp" onClick={()=>window.print()}><Icon path={I.print} size={12}/> PDF</button>
            <button className="db2 dbd" onClick={e=>del(sel.id,e)}><Icon path={I.trash} size={12}/></button>
          </div>
        </div>
        <div className="ddp" style={{marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:20,flexWrap:"wrap"}}>
            <div><div style={{fontFamily:"'Playfair Display',serif",fontSize:52,fontWeight:700,color:"#fff",lineHeight:1}}>{res.composite}</div><div style={{fontSize:11,color:"#555",marginTop:4}}>Composite Score</div></div>
            <div><span className={`dtg ${tgC(sel.color)}`} style={{fontSize:12,padding:"6px 14px"}}>{res.classification}</span><div style={{fontSize:11,color:"#555",marginTop:6}}>{d.projectName} · {d.projectType||"—"} · Urgency: {d.urgency||"N/A"}</div></div>
          </div>
          <div className="dbs">
            {[{k:"financial",l:"Financial",w:"35%"},{k:"operational",l:"Operational",w:"25%"},{k:"strategic",l:"Strategic",w:"25%"},{k:"risk",l:"Risk",w:"15%"}].map(b=>(
              <div className="dbi" key={b.k}>
                <div className="dbl"><span>{b.l} ({b.w})</span><span className="dbv">{res[b.k]}</span></div>
                <div className="dbt"><div className="dbf" style={{width:`${res[b.k]}%`,background:bcs[b.k]}}/></div>
              </div>
            ))}
          </div>
        </div>
        <div className="ddg">
          <div className="ddp" style={{margin:0}}>
            <div className="dse">Raw Inputs</div>
            {[["Budget",d.budget?`$${parseInt(d.budget).toLocaleString()}`:"N/A"],["Financing",d.financingType||"N/A"],["Contingency",d.contingency?`${d.contingency}%`:"N/A"],["Team Size",d.teamSize||"N/A"],["Experience",d.priorExperience||"N/A"],["Software",d.softwareReady||"N/A"],["Market Fit",d.marketFit||"N/A"],["Competitive",d.competitiveAdv||"N/A"],["Regulatory",d.regulatoryClarity||"N/A"],["Timeline",d.timeline?`${d.timeline} mo`:"N/A"],["Dependencies",d.externalDependencies||"N/A"],["Stakeholders",d.stakeholderBuyIn||"N/A"]].map(([k,v])=>(
              <div className="dfr" key={k}><span className="dfk">{k}</span><span className="dfv">{v}</span></div>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div className="ddp" style={{margin:0}}><div className="dse">Risk Flags ({res.flags.length})</div>{res.flags.length>0?res.flags.map((f,i)=><div className="dfl" key={i}><Icon path={I.alert} size={11}/>{f}</div>):<div style={{fontSize:12,color:"#555"}}>None</div>}</div>
            <div className="ddp" style={{margin:0}}><div className="dse">Strengths ({res.strengths.length})</div>{res.strengths.length>0?res.strengths.map((s,i)=><div className="dsl2" key={i}><Icon path={I.check} size={11}/>{s}</div>):<div style={{fontSize:12,color:"#555"}}>None</div>}</div>
            {d.strategicObjective&&<div className="ddp" style={{margin:0}}><div className="dse">Strategic Objective</div><p style={{fontSize:12,color:"#AAA",lineHeight:1.6}}>{d.strategicObjective}</p></div>}
            {d.knownRisks&&<div className="ddp" style={{margin:0}}><div className="dse">Known Risks</div><p style={{fontSize:12,color:"#AAA",lineHeight:1.6}}>{d.knownRisks}</p></div>}
          </div>
        </div>
      </div>
    );
  }

  return(
    <div className="dcn an">
      <div className="dst">
        <div className="dsi"><div className="dsv">{stats.total}</div><div className="dsl">Total Submissions</div></div>
        <div className="dsi"><div className="dsv">{stats.avg}</div><div className="dsl">Average Score</div></div>
        <div className="dsi"><div className="dsv" style={{color:"#34D399"}}>{stats.high}</div><div className="dsl">High Priority</div><div className="dss">Score ≥ 80</div></div>
        <div className="dsi"><div className="dsv" style={{color:"#F87171"}}>{stats.low}</div><div className="dsl">Low Priority</div><div className="dss">Score &lt; 40</div></div>
      </div>
      <div className="dcd">
        <div className="dch">
          <div className="dct"><Icon path={I.users} size={13}/> All Client Submissions {items&&<span style={{color:"#555",fontWeight:400,textTransform:"none",letterSpacing:0,fontSize:11}}>({filtered.length})</span>}</div>
          <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <input className="dsr" placeholder="Search name, phone, project..." value={search} onChange={e=>setSearch(e.target.value)}/>
            <div className="dfb">
              {["all","emerald","blue","amber","red"].map(f=>(
                <button key={f} className={`dfbt ${filter===f?"on":""}`} onClick={()=>setFilter(f)}>
                  {f==="all"?"All":f==="emerald"?"High":f==="blue"?"Viable":f==="amber"?"Conditional":"Low"}
                </button>
              ))}
            </div>
            <button className="db2 dbg2" onClick={load} title="Refresh"><Icon path={I.refresh} size={13}/></button>
          </div>
        </div>
        {items===null?<div className="dem"><p style={{color:"#555"}}>Loading...</p></div>
        :filtered.length===0?(
          <div className="dem">
            <div className="dei"><Icon path={I.users} size={22}/></div>
            <p style={{color:"#555",fontSize:13}}>{items.length===0?"No client submissions yet. Share the link via WhatsApp to get started!":"No results match this filter."}</p>
          </div>
        ):(
          <table className="dtb">
            <thead>
              <tr><th>Score</th><th>Client</th><th>WhatsApp</th><th>Project</th><th>Type</th><th>Classification</th><th>Fin</th><th>Ops</th><th>Str</th><th>Risk</th><th>Date</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map(a=>(
                <tr key={a.id} onClick={()=>setSel(a)}>
                  <td><div className={`sp ${spC(a.color)}`}>{a.score}</div></td>
                  <td><div style={{fontWeight:600,color:"#fff",fontSize:13}}>{a.clientName||"—"}</div></td>
                  <td style={{color:"#7AAA10",fontSize:12}}>{a.clientPhone||"—"}</td>
                  <td><div style={{fontWeight:500,color:"#CCC",fontSize:12}}>{a.projectName}</div><div style={{fontSize:10,color:"#444",marginTop:2}}>{a.id}</div></td>
                  <td style={{textTransform:"capitalize",fontSize:12}}>{a.projectType||"—"}</td>
                  <td><span className={`dtg ${tgC(a.color)}`}>{a.classification}</span></td>
                  <td style={{fontSize:12}}>{a.result?.financial??"—"}</td>
                  <td style={{fontSize:12}}>{a.result?.operational??"—"}</td>
                  <td style={{fontSize:12}}>{a.result?.strategic??"—"}</td>
                  <td style={{fontSize:12}}>{a.result?.risk??"—"}</td>
                  <td style={{whiteSpace:"nowrap",color:"#555",fontSize:12}}>{new Date(a.date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"2-digit"})}</td>
                  <td><button className="db2 dbd" style={{padding:"5px 9px"}} onClick={e=>{e.stopPropagation();del(a.id,e);}}><Icon path={I.trash} size={12}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const SICONS=[I.shield,I.user,I.briefcase,I.dollar,I.settings,I.phone,I.target];

export default function App(){
  const [mode,setMode]=useState("client"); // "client" | "devlogin" | "dev"
  const [page,setPage]=useState("wizard");
  const [step,setStep]=useState(0);
  const [data,setData]=useState({});
  const [result,setResult]=useState(null);

  const goNext=()=>{if(step===6)setResult(calculateScore(data));setStep(s=>s+1);window.scrollTo(0,0);};
  const goBack=()=>{setStep(s=>s-1);window.scrollTo(0,0);};
  const reset=()=>{setStep(0);setData({});setResult(null);};

  if(mode==="devlogin") return(
    <><style>{CSS}</style><DevLogin onLogin={()=>setMode("dev")} onBack={()=>setMode("client")}/></>
  );

  if(mode==="dev") return(
    <>
      <style>{CSS}</style>
      <div className="dsh">
        <div className="dhd">
          <div className="dlg">Aθ</div>
          <div><div className="dtt">ATHENA Developer Console</div><div className="dts">All Client Submissions · Internal Only</div></div>
          <div className="dbg">DEV</div>
          <div style={{marginLeft:"auto",display:"flex",gap:9}}>
            <button className="db2 dbg2" onClick={()=>setMode("client")}><Icon path={I.eye} size={12}/> View App</button>
            <button className="db2 dbg2" onClick={()=>{setMode("client");}}><Icon path={I.logout} size={12}/> Sign Out</button>
          </div>
        </div>
        <DevDashboard/>
      </div>
    </>
  );

  // ── CLIENT APP ──
  return(
    <>
      <style>{CSS}</style>
      <div className="sh">
        <header className="hd">
          <div className="lg">Aθ</div>
          <div className="ht"><h1>ATHENA Pre-Check</h1><p>Project Viability Diagnostic</p></div>
          <div className="nv no-print">
            <button className={`nt ${page==="wizard"?"on":""}`} onClick={()=>{setPage("wizard");window.scrollTo(0,0);}}>
              <Icon path={I.file} size={12}/> Assessment
            </button>
            <button className={`nt ${page==="archive"?"on":""}`} onClick={()=>{setPage("archive");window.scrollTo(0,0);}}>
              <Icon path={I.archive} size={12}/> My Results
            </button>
            <button className={`nt dev ${mode==="dev"?"on":""}`} onClick={()=>{setMode("devlogin");window.scrollTo(0,0);}}>
              <Icon path={I.lock} size={12}/> Dev
            </button>
          </div>
        </header>
        <div className="ct">
          <div className="wp">
            {page==="archive"?<ClientArchive/>:(
              <>
                {step>0&&step<=6&&(
                  <div className="pb no-print">
                    {Array.from({length:6}).map((_,i)=>(
                      <div className="ps" key={i}>
                        <div className={`pc ${i+1<step?"dn":i+1===step?"ac":""}`}>{i+1<step?<Icon path={I.check} size={12}/>:<Icon path={SICONS[i]} size={12}/>}</div>
                        {i<5&&<div className={`pl ${i+1<step?"dn":""}`}/>}
                      </div>
                    ))}
                  </div>
                )}
                <div className="cd">
                  {step===0&&<StepIntro onNext={goNext}/>}
                  {step===1&&<StepClient data={data} setData={setData} onNext={goNext} onBack={goBack}/>}
                  {step===2&&<StepProjectBasics data={data} setData={setData} onNext={goNext} onBack={goBack}/>}
                  {step===3&&<StepBudget data={data} setData={setData} onNext={goNext} onBack={goBack}/>}
                  {step===4&&<StepProduction data={data} setData={setData} onNext={goNext} onBack={goBack}/>}
                  {step===5&&<StepTimeline data={data} setData={setData} onNext={goNext} onBack={goBack}/>}
                  {step===6&&<StepStrategic data={data} setData={setData} onNext={goNext} onBack={goBack}/>}
                  {step===7&&result&&<StepResults data={data} result={result} onReset={reset}/>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
