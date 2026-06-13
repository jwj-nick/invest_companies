/* equity-scenario-app 엔진 v2 — 회사 무관 재사용 코어.
   데이터는 window.COMPANY / window.SOURCES / window.__PX 에서만 읽는다. 차트는 의존성 없는 인라인 SVG. */
(function () {
  "use strict";
  const C = window.COMPANY, S = window.SOURCES, PX = window.__PX || [];
  const SRC_ORDER = Object.keys(S);
  const fnNum = (id) => SRC_ORDER.indexOf(id) + 1;
  const PAL = ["#4da3ff", "#35c46b", "#f0a13a", "#b07cff", "#ff6b9d", "#5fd0d0"];
  const COMPANY_COLOR = { "에스에이엠티": "#ff6b4a", "삼성전자": "#4da3ff", "삼지전자": "#8b93a7" };

  // ---------- format ----------
  const won = (n) => Math.round(n).toLocaleString("ko-KR") + "원";
  const wonK = (n) => Math.round(n).toLocaleString("ko-KR");
  const eok = (n) => Math.round(n).toLocaleString("ko-KR") + "억";
  const jo  = (n) => (n / 10000).toFixed(2) + "조";
  const pct = (n) => n.toFixed(1) + "%";
  const perShareWon = (amtEok, shares) => (amtEok * 1e8) / shares;
  const el = (id) => document.getElementById(id);
  function srcSup(id) {
    const s = S[id]; if (!s) return "";
    return `<sup class="fn ${id === "assumption" ? "assref" : ""}" title="${s.title}">[${fnNum(id)}]</sup>`;
  }

  // ---------- SVG charts ----------
  function svgLineArea(series, opt) {
    opt = opt || {}; const W = 1000, H = opt.h || 300, pad = 42, padB = 28;
    const ys = series.map(d => d[1]); const minY = Math.min(...ys), maxY = Math.max(...ys);
    const x = i => pad + (W - pad - 12) * (i / (series.length - 1));
    const y = v => (H - padB) - (H - padB - 14) * ((v - minY) / (maxY - minY || 1));
    const line = series.map((d, i) => `${i ? "L" : "M"}${x(i).toFixed(1)} ${y(d[1]).toFixed(1)}`).join(" ");
    const area = `${line} L${x(series.length - 1).toFixed(1)} ${H - padB} L${x(0).toFixed(1)} ${H - padB} Z`;
    let grid = ""; const ny = 4;
    for (let g = 0; g <= ny; g++) { const v = minY + (maxY - minY) * g / ny, yy = y(v);
      grid += `<line x1="${pad}" y1="${yy}" x2="${W - 12}" y2="${yy}" class="grid"/><text x="${pad - 6}" y="${yy + 4}" class="yl" text-anchor="end">${wonK(v)}</text>`; }
    let xlab = ""; const step = Math.max(1, Math.floor(series.length / 7));
    for (let i = 0; i < series.length; i += step) xlab += `<text x="${x(i)}" y="${H - 8}" class="xl" text-anchor="middle">${series[i][0]}</text>`;
    let mk = ""; (opt.marks || []).forEach(m => { const i = m.i < 0 ? series.length + m.i : m.i;
      mk += `<circle cx="${x(i)}" cy="${y(series[i][1])}" r="4.5" fill="${m.color || "#ff6b4a"}"/>` +
            `<text x="${x(i)}" y="${y(series[i][1]) - 12}" class="mklab" text-anchor="middle" fill="${m.color || "#ff6b4a"}">${m.label}</text>`; });
    return `<svg viewBox="0 0 ${W} ${H}" class="chart">
      <defs><linearGradient id="ga" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#4da3ff" stop-opacity=".35"/><stop offset="1" stop-color="#4da3ff" stop-opacity="0"/></linearGradient></defs>
      ${grid}<path d="${area}" fill="url(#ga)"/><path d="${line}" fill="none" stroke="#4da3ff" stroke-width="2.4"/>${mk}${xlab}</svg>`;
  }

  function svgBars(series, opt) {
    opt = opt || {}; const W = 1000, H = opt.h || 260, pad = 46, padB = 30;
    const vals = series.map(d => d.value); const maxV = Math.max(...vals, 1);
    const n = series.length, bw = (W - pad - 12) / n * 0.62, gap = (W - pad - 12) / n;
    const y = v => (H - padB) - (H - padB - 16) * (v / maxV);
    let grid = ""; for (let g = 0; g <= 3; g++) { const v = maxV * g / 3, yy = y(v);
      grid += `<line x1="${pad}" y1="${yy}" x2="${W - 12}" y2="${yy}" class="grid"/><text x="${pad - 6}" y="${yy + 4}" class="yl" text-anchor="end">${opt.fmt ? opt.fmt(v) : wonK(v)}</text>`; }
    let bars = ""; series.forEach((d, i) => { const bx = pad + gap * i + (gap - bw) / 2, by = y(d.value), bh = (H - padB) - by;
      const col = d.hot ? "#ff6b4a" : (opt.color || "#4da3ff");
      bars += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="3" fill="${col}"/>` +
              `<text x="${bx + bw / 2}" y="${by - 6}" class="bl" text-anchor="middle" fill="${col}">${opt.lab ? opt.lab(d.value) : wonK(d.value)}</text>` +
              `<text x="${bx + bw / 2}" y="${H - 8}" class="xl" text-anchor="middle">${d.label}</text>`; });
    return `<svg viewBox="0 0 ${W} ${H}" class="chart">${grid}${bars}</svg>`;
  }

  function svgDonut(parts, opt) {
    opt = opt || {}; const R = 80, r = 48, cx = 110, cy = 110; const tot = parts.reduce((a, p) => a + p.value, 0);
    let ang = -Math.PI / 2, segs = "";
    parts.forEach((p, i) => { const a2 = ang + (p.value / tot) * Math.PI * 2;
      const x1 = cx + R * Math.cos(ang), y1 = cy + R * Math.sin(ang), x2 = cx + R * Math.cos(a2), y2 = cy + R * Math.sin(a2);
      const xi2 = cx + r * Math.cos(a2), yi2 = cy + r * Math.sin(a2), xi1 = cx + r * Math.cos(ang), yi1 = cy + r * Math.sin(ang);
      const large = (a2 - ang) > Math.PI ? 1 : 0; const col = PAL[i % PAL.length];
      segs += `<path d="M${x1} ${y1} A${R} ${R} 0 ${large} 1 ${x2} ${y2} L${xi2} ${yi2} A${r} ${r} 0 ${large} 0 ${xi1} ${yi1} Z" fill="${col}"/>`;
      ang = a2; });
    const legend = parts.map((p, i) => `<div class="lg"><span class="sw" style="background:${PAL[i % PAL.length]}"></span>${p.name} <b>${p.pct}%</b> <span class="sub">${eok(p.value)}</span></div>`).join("");
    return `<div class="donutwrap"><svg viewBox="0 0 220 220" class="donut"><g>${segs}</g></svg><div class="legend">${legend}</div></div>`;
  }

  // ---------- compute ----------
  function compute(st) {
    const shares = C.market.sharesTotal.value, eligible = C.market.sharesEligible.value;
    const q1 = C.financials.Q1_2026, price = C.market.price.value;
    const fyRev = q1.revenue * st.annualizeFactor, fyOp = fyRev * (st.sustainedOpMargin / 100), fyNet = fyOp * st.netToOpRatio;
    const eps = perShareWon(fyNet, shares), divTotal = fyNet * (st.payout / 100), dps = perShareWon(divTotal, eligible);
    const divYield = (dps / price) * 100;
    const projEquity = (C.financials.FY2025.equity || 0) + fyNet * (1 - st.payout / 100), bps = perShareWon(projEquity, shares);
    const ebitda = fyOp + st.depreciation;
    const targets = [
      { key: "PER", assume: `EPS ${won(eps)} × ${st.per}배`, price: eps * st.per, src: "bulgom_2019" },
      { key: "배당수익률", assume: `DPS ${won(dps)} ÷ ${st.targetYield}%`, price: dps / (st.targetYield / 100), src: "edaily_div2024" },
      { key: "PBR", assume: `BPS ${won(bps)} × ${st.pbr}배`, price: bps * st.pbr, src: "assumption" },
      { key: "EV/EBITDA", assume: `EBITDA ${eok(ebitda)} × ${st.evEbitdaMult}배 − 순차입금 ${eok(st.netDebt)}`, price: perShareWon(ebitda * st.evEbitdaMult - st.netDebt, shares), src: "assumption" }
    ].map(t => ({ ...t, upside: ((t.price - price) / price) * 100 }));
    return { shares, eligible, price, fyRev, fyOp, fyNet, eps, divTotal, dps, divYield, projEquity, bps, ebitda, targets };
  }

  const D = C.engineDefaults, state = {};
  Object.keys(D).forEach(k => state[k] = D[k].value);

  // ---------- hero ----------
  function renderHero() {
    const m = C.market;
    const first = PX.length ? PX[0][1] : null, cur = m.price.value;
    const chg = first ? ((cur - first) / first * 100) : 0;
    el("hero").innerHTML = `
      <div class="price"><b>${wonK(cur)}</b><span class="unit">원</span>
        <span class="chg ${chg >= 0 ? "up" : "down"}">${chg >= 0 ? "▲" : "▼"} ${Math.abs(chg).toFixed(0)}% <span class="sub">(2019.1 대비)</span></span></div>
      <div class="herostats">
        <span>시총 <b>${jo(m.marketCap.value)}</b></span>
        <span>52주 <b>${wonK(m.week52.low)}~${wonK(m.week52.high)}</b></span>
        <span>발행 <b>${(m.sharesTotal.value/1e6).toFixed(1)}M주</b></span>
        <span>최대주주 <b>${m.majorShareholder.name} ${m.majorShareholder.stake}%</b></span>
      </div>
      <div class="herostamp sub">${C.meta.market} · ${C.meta.ticker} · 기준일 ${m.price.date}${srcSup(m.price.src)}</div>`;
  }

  // ---------- price chart ----------
  function renderPriceChart() {
    const series = PX.map(p => [p[0].slice(2, 4) + "/" + p[0].slice(4, 6), p[1]]);
    // 마크: 불곰 리포트(2019-04 ~1840), 최고가
    let bgIdx = PX.findIndex(p => p[0] === "201904");
    let peakIdx = PX.reduce((mi, p, i, a) => p[1] > a[mi][1] ? i : mi, 0);
    el("priceChart").innerHTML = svgLineArea(series, { h: 300, marks: [
      { i: bgIdx < 0 ? 3 : bgIdx, label: "불곰'19 1,840", color: "#8b93a7" },
      { i: peakIdx, label: "최고 " + wonK(PX[peakIdx][1]), color: "#ff6b4a" }
    ]});
  }

  // ---------- history charts ----------
  function renderHistory() {
    el("revChart").innerHTML = svgBars(C.annualHistory.map(a => ({ label: a.year, value: a.rev })),
      { h: 240, color: "#4da3ff", lab: v => (v / 10000).toFixed(1) + "조" });
    el("qChart").innerHTML = svgBars(C.quarterlyHistory.map(q => ({ label: q.q, value: q.rev, hot: q.hot })),
      { h: 220, lab: v => (v / 10000).toFixed(2) + "조" });
    el("dpsChart").innerHTML = svgBars(C.dpsHistory.map(d => ({ label: d.year, value: d.dps })),
      { h: 200, color: "#35c46b", lab: v => wonK(v) });
    el("regionChart").innerHTML = svgDonut(C.regionMix.parts);
    el("opChart").innerHTML = svgBars(C.annualHistory.map(a => ({ label: a.year, value: +(a.op / a.rev * 100).toFixed(1) })),
      { h: 200, color: "#f0a13a", lab: v => v.toFixed(1) + "%", fmt: v => v.toFixed(0) + "%" });
  }

  // ---------- company profile ----------
  function renderProfile() {
    const li = (arr) => arr.map(x => `<span class="chip">${x}</span>`).join("");
    el("profile").innerHTML = `
      <div class="pcard"><h3>공급사 (매입)${srcSup(C.suppliers.src)}</h3><div class="chips">${li(C.suppliers.items)}</div></div>
      <div class="pcard"><h3>주요 고객 (납품)${srcSup(C.customers.src)}</h3><div class="chips">${li(C.customers.items)}</div></div>`;
    el("timeline").innerHTML = C.historyTimeline.map(h =>
      `<div class="tl"><div class="tly">${h.y}</div><div class="tlt">${h.t}${srcSup(h.src)}</div></div>`).join("");
  }

  // ---------- sliders / presets ----------
  function renderSliders() {
    const groups = [
      { title: "① 실적 가정", keys: ["annualizeFactor", "sustainedOpMargin", "netToOpRatio"] },
      { title: "② 배당 가정", keys: ["payout"] },
      { title: "③ 주가 모델", keys: ["per", "targetYield", "pbr", "evEbitdaMult", "depreciation", "netDebt"] }
    ];
    el("sliders").innerHTML = groups.map(g => `<div class="sgroup"><h4>${g.title}</h4>${g.keys.map(k => {
      const d = D[k];
      const marks = d.marks ? `<div class="marks">${Object.entries(d.marks).map(([lab, val]) =>
        `<button class="mark" data-key="${k}" data-val="${val}">${lab}</button>`).join("")}</div>` : "";
      return `<div class="srow"><label>${d.label}${srcSup(d.src)}</label>
        <div class="sctl"><input type="range" id="sl_${k}" min="${d.min}" max="${d.max}" step="${d.step}" value="${state[k]}"><output id="ov_${k}">${state[k]}</output></div>${marks}</div>`;
    }).join("")}</div>`).join("");
    Object.keys(D).forEach(k => { const inp = el("sl_" + k);
      inp.addEventListener("input", () => { state[k] = parseFloat(inp.value); el("ov_" + k).textContent = state[k]; refresh(); }); });
    document.querySelectorAll(".mark").forEach(b => b.addEventListener("click", () => {
      const k = b.dataset.key, v = parseFloat(b.dataset.val); state[k] = v; el("sl_" + k).value = v; el("ov_" + k).textContent = v; refresh(); }));
  }
  function renderPresets() {
    el("presets").innerHTML = Object.keys(C.presets).map(n => `<button class="preset" data-name="${n}">${n}</button>`).join("");
    document.querySelectorAll(".preset").forEach(b => b.addEventListener("click", () => {
      const p = C.presets[b.dataset.name];
      Object.entries(p).forEach(([k, v]) => { state[k] = v; el("sl_" + k).value = v; el("ov_" + k).textContent = v; });
      document.querySelectorAll(".preset").forEach(x => x.classList.remove("active")); b.classList.add("active"); refresh(); }));
  }

  // ---------- results ----------
  function renderResults(r) {
    el("pnl").innerHTML = `
      <div class="card-row"><span>연간 매출 (Q1×${state.annualizeFactor})</span><b>${jo(r.fyRev)}</b></div>
      <div class="card-row"><span>연간 영업이익 (${pct(state.sustainedOpMargin)})</span><b>${eok(r.fyOp)}</b></div>
      <div class="card-row"><span>연간 순이익</span><b>${eok(r.fyNet)}</b></div>
      <div class="card-row"><span>EPS</span><b>${won(r.eps)}</b></div>`;
    el("divbox").innerHTML = `
      <div class="big"><span>배당금 총액</span><b>${eok(r.divTotal)}</b></div>
      <div class="big hot"><span>1주당 배당액 (DPS)</span><b>${won(r.dps)}</b></div>
      <div class="big"><span>시가배당률</span><b>${pct(r.divYield)}</b></div>
      <div class="hint">배당성향 ${pct(state.payout)} · 배당가능 ${wonK(r.eligible)}주</div>`;
    const maxP = Math.max(r.price, ...r.targets.map(t => t.price));
    el("targets").innerHTML = `<table><thead><tr><th>모델</th><th>가정</th><th class="num">내재주가</th><th class="num">상승여력</th><th class="bar"></th></tr></thead><tbody>
      ${r.targets.map(t => `<tr><td><b>${t.key}</b>${srcSup(t.src)}</td><td class="assume">${t.assume}</td>
        <td class="num"><b>${won(t.price)}</b></td><td class="num ${t.upside >= 0 ? "up" : "down"}">${t.upside >= 0 ? "+" : ""}${t.upside.toFixed(0)}%</td>
        <td class="bar"><span class="b" style="width:${(t.price / maxP) * 100}%"></span></td></tr>`).join("")}
      <tr class="cur"><td colspan="2">현재가 (기준선)</td><td class="num"><b>${won(r.price)}</b></td><td class="num">—</td><td class="bar"><span class="b cur" style="width:${(r.price / maxP) * 100}%"></span></td></tr>
      </tbody></table>`;
  }

  // ---------- calendar (월별 미니 달력) ----------
  const WD = ["일", "월", "화", "수", "목", "금", "토"];
  function renderCalendar() {
    const byMonth = {};
    C.events.forEach(e => { const k = e.date.slice(0, 7); (byMonth[k] = byMonth[k] || []).push(e); });
    const months = Object.keys(byMonth).sort();
    el("calLegend").innerHTML = Object.entries(COMPANY_COLOR).map(([n, c]) =>
      `<span class="lg"><span class="sw" style="background:${c}"></span>${n}</span>`).join("") + `<span class="lg"><span class="sw star">★</span>분기점</span>`;
    el("calendar").innerHTML = months.map(mk => {
      const [Y, M] = mk.split("-").map(Number);
      const first = new Date(Y, M - 1, 1).getDay(), dim = new Date(Y, M, 0).getDate();
      const evDays = {}; byMonth[mk].forEach(e => { const d = +e.date.slice(8, 10); (evDays[d] = evDays[d] || []).push(e); });
      let cells = "";
      for (let i = 0; i < first; i++) cells += `<div class="cell empty"></div>`;
      for (let d = 1; d <= dim; d++) {
        const evs = evDays[d];
        if (evs) { const e = evs[0], col = COMPANY_COLOR[e.company] || "#8b93a7";
          cells += `<div class="cell ev ${e.star ? "star" : ""}" style="--ec:${col}" title="${evs.map(x => x.company + ": " + x.title).join(" / ")}">${d}<span class="dot"></span></div>`;
        } else cells += `<div class="cell">${d}</div>`;
      }
      const list = byMonth[mk].map(e => `<div class="elist"><span class="d" style="background:${COMPANY_COLOR[e.company] || "#8b93a7"}">${+e.date.slice(8, 10)}</span>
        <div><span class="tag">${e.company}</span> <b>${e.title}</b>${e.star ? " <span class='st'>★</span>" : ""}${srcSup(e.src)}<div class="evr">${e.relevance}</div></div></div>`).join("");
      return `<div class="month"><h4>${Y}.${String(M).padStart(2, "0")}</h4>
        <div class="cal"><div class="wd">${WD.map(w => `<span>${w}</span>`).join("")}</div><div class="grid">${cells}</div></div>
        <div class="elists">${list}</div></div>`;
    }).join("");
  }

  // ---------- narrative / sources ----------
  function renderNarrative() {
    const n = C.narrative;
    el("narrative").innerHTML = `<p><b>논지.</b> ${n.thesis}</p>
      <p class="warn"><b>⚠️ 핵심 경계.</b> ${n.keyCaveat}</p>
      <p><b>관전 포인트.</b></p><ul>${n.watchpoints.map(w => `<li>${w}</li>`).join("")}</ul>`;
  }
  function renderSources() {
    el("sources").innerHTML = SRC_ORDER.map(id => { const s = S[id];
      const link = s.url ? `<a href="${s.url}" target="_blank" rel="noopener">${s.url}</a>` : "<i>가정값 — 외부 출처 아님</i>";
      return `<li><b>[${fnNum(id)}]</b> ${s.title} <span class="sub">${s.date}</span><br>${link}</li>`; }).join("");
  }

  function refresh() { renderResults(compute(state)); }

  document.addEventListener("DOMContentLoaded", () => {
    el("title").textContent = `${C.meta.name} (${C.meta.ticker})`;
    el("subtitle").innerHTML = `${C.meta.sector} · <span class="sub">${C.meta.origin}</span>`;
    el("genstamp").textContent = "생성 " + C.meta.asOf;
    renderHero(); renderPriceChart(); renderHistory(); renderProfile();
    renderSliders(); renderPresets(); renderCalendar(); renderNarrative(); renderSources();
    refresh();
    el("printBtn").addEventListener("click", () => window.print());
  });
})();
