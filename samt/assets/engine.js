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
    const maxV = Math.max(...series.map(d => Math.max(d.value, d.hi || 0)), 1);
    const n = series.length, bw = (W - pad - 12) / n * 0.62, gap = (W - pad - 12) / n;
    const y = v => (H - padB) - (H - padB - 16) * (v / maxV);
    let grid = ""; for (let g = 0; g <= 3; g++) { const v = maxV * g / 3, yy = y(v);
      grid += `<line x1="${pad}" y1="${yy}" x2="${W - 12}" y2="${yy}" class="grid"/><text x="${pad - 6}" y="${yy + 4}" class="yl" text-anchor="end">${opt.fmt ? opt.fmt(v) : wonK(v)}</text>`; }
    let bars = ""; series.forEach((d, i) => { const bx = pad + gap * i + (gap - bw) / 2, by = y(d.value), bh = (H - padB) - by, cxp = bx + bw / 2;
      const col = d.hot ? "#ff6b4a" : (d.est ? "#f0a13a" : (opt.color || "#4da3ff"));
      const rectAttr = d.est ? `fill="${col}" fill-opacity="0.28" stroke="${col}" stroke-width="1.5" stroke-dasharray="4 3"` : `fill="${col}"`;
      bars += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="3" ${rectAttr}/>`;
      if (d.lo != null && d.hi != null) { const yh = y(d.hi), yl = y(d.lo);
        bars += `<line x1="${cxp}" y1="${yh}" x2="${cxp}" y2="${yl}" class="wk"/><line x1="${cxp - 6}" y1="${yh}" x2="${cxp + 6}" y2="${yh}" class="wk"/><line x1="${cxp - 6}" y1="${yl}" x2="${cxp + 6}" y2="${yl}" class="wk"/>`; }
      const labY = (d.est && d.hi != null) ? y(d.hi) - 7 : by - 6;
      bars += `<text x="${cxp}" y="${labY}" class="bl" text-anchor="middle" fill="${col}">${opt.lab ? opt.lab(d.value) : wonK(d.value)}</text>` +
              `<text x="${cxp}" y="${H - 8}" class="xl" text-anchor="middle">${d.label}</text>`; });
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

  // ---------- date helpers (YYYYMMDD) ----------
  const pad2 = n => String(n).padStart(2, "0");
  const parseD = s => new Date(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8));
  const fmtD = d => `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`;
  const dot = s => `${s.slice(0, 4)}.${s.slice(4, 6)}.${s.slice(6, 8)}`;
  const iso = s => `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;

  // ---------- hero ----------
  function renderHero() {
    const m = C.market;
    el("hero").innerHTML = `
      <div class="price"><b id="heroPrice">${wonK(m.price.value)}</b><span class="unit">원</span>
        ${pxRefreshed ? `<span class="chg up">↻ 갱신됨</span>` : ""}</div>
      <div class="herostats">
        <span>시총 <b>${jo(m.marketCap.value)}</b></span>
        <span>52주 <b>${wonK(m.week52.low)}~${wonK(m.week52.high)}</b></span>
        <span>발행 <b>${(m.sharesTotal.value / 1e6).toFixed(1)}M주</b></span>
        <span>최대주주 <b>${m.majorShareholder.name} ${m.majorShareholder.stake}%</b></span>
      </div>
      <div class="herostamp sub">${C.meta.market} · ${C.meta.ticker} · 종가기준일 ${dot(m.price.date.replace(/-/g, ""))}${srcSup(m.price.src)}</div>`;
  }

  // ---------- price chart (기간 선택 + 갱신) ----------
  const pxState = { period: "3Y", from: null, to: null };
  let pxLive = null, pxRefreshed = false;
  const PERIOD_M = { "6M": 6, "1Y": 12, "3Y": 36, "10Y": 120, "ALL": 600 };

  function pxSeriesArray() {
    let arr = PX.slice();
    if (pxLive) { const last = arr[arr.length - 1];
      if (pxLive.date > last[0]) arr.push([pxLive.date, pxLive.close]);
      else if (pxLive.date === last[0]) arr[arr.length - 1] = [pxLive.date, pxLive.close]; }
    return arr;
  }

  function renderPriceChart() {
    if (!PX.length) { el("priceChart").innerHTML = "<p class='sub'>주가 데이터 없음</p>"; return; }
    const arr = pxSeriesArray();
    const ref = arr[arr.length - 1][0];
    let lo, hi;
    if (pxState.from && pxState.to) { lo = pxState.from; hi = pxState.to; }
    else { const d = parseD(ref); d.setMonth(d.getMonth() - (PERIOD_M[pxState.period] || 36)); lo = fmtD(d); hi = "99999999"; }
    let f = arr.filter(p => p[0] >= lo && p[0] <= hi);
    if (f.length < 2) f = arr.slice(-2);
    // 다운샘플(최대 ~450)
    const MAX = 450, step = Math.ceil(f.length / MAX);
    let ds = step > 1 ? f.filter((_, i) => i % step === 0) : f.slice();
    if (ds[ds.length - 1][0] !== f[f.length - 1][0]) ds.push(f[f.length - 1]);
    const spanDays = (parseD(f[f.length - 1][0]) - parseD(f[0][0])) / 864e5;
    const fmtLab = spanDays <= 200 ? (s => s.slice(4, 6) + "/" + s.slice(6, 8)) : (s => s.slice(2, 4) + "/" + s.slice(4, 6));
    const series = ds.map(p => [fmtLab(p[0]), p[1]]);
    let peakI = 0; ds.forEach((p, i) => { if (p[1] > ds[peakI][1]) peakI = i; });
    const marks = [{ i: peakI, label: "최고 " + wonK(ds[peakI][1]), color: "#ff6b4a" }];
    const bgI = ds.findIndex(p => p[0] >= "20190401" && p[0] <= "20190630");
    if (bgI >= 0) marks.unshift({ i: bgI, label: "불곰'19", color: "#8b93a7" });
    el("priceChart").innerHTML = svgLineArea(series, { h: 300, marks });
    const fi = f[0], la = f[f.length - 1], chg = (la[1] - fi[1]) / fi[1] * 100;
    const hp = Math.max(...f.map(p => p[1])), lp = Math.min(...f.map(p => p[1]));
    el("priceStats").innerHTML =
      `<span>${dot(fi[0])} → ${dot(la[0])}</span><span>고 <b>${wonK(hp)}</b> · 저 <b>${wonK(lp)}</b></span>` +
      `<span class="${chg >= 0 ? "up" : "down"}">기간수익률 <b>${chg >= 0 ? "+" : ""}${chg.toFixed(1)}%</b></span>`;
  }

  function initPxControls() {
    document.querySelectorAll(".pxbtns button").forEach(b => b.addEventListener("click", () => {
      pxState.period = b.dataset.p; pxState.from = pxState.to = null;
      el("pxFrom").value = ""; el("pxTo").value = "";
      document.querySelectorAll(".pxbtns button").forEach(x => x.classList.toggle("on", x === b));
      renderPriceChart();
    }));
    const fI = el("pxFrom"), tI = el("pxTo");
    fI.min = tI.min = iso(PX[0][0]); fI.max = tI.max = iso(PX[PX.length - 1][0]);
    el("pxApply").addEventListener("click", () => {
      if (fI.value && tI.value) { pxState.from = fI.value.replace(/-/g, ""); pxState.to = tI.value.replace(/-/g, "");
        document.querySelectorAll(".pxbtns button").forEach(x => x.classList.remove("on")); renderPriceChart(); }
    });
    el("pxRefresh").addEventListener("click", refreshPrice);
  }

  async function refreshPrice() {
    const st = el("pxStatus"); st.textContent = "갱신 중…"; st.className = "sub";
    const now = new Date(), s = new Date(now); s.setDate(s.getDate() - 16);
    const url = `https://api.finance.naver.com/siseJson.naver?symbol=${C.meta.ticker}&requestType=1&startTime=${fmtD(s)}&endTime=${fmtD(now)}&timeframe=day`;
    const proxies = [u => `https://corsproxy.io/?url=${encodeURIComponent(u)}`, u => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`];
    for (const p of proxies) {
      try {
        const r = await fetch(p(url)); if (!r.ok) continue;
        const t = await r.text();
        const m = [...t.matchAll(/\["(\d{8})",\s*\d+,\s*\d+,\s*\d+,\s*(\d+)/g)];
        if (!m.length) continue;
        const last = m[m.length - 1], date = last[1], close = +last[2];
        pxLive = { date, close }; pxRefreshed = true;
        C.market.price = { value: close, date: iso(date), src: "naver_price" };
        renderHero(); renderPriceChart();
        st.textContent = `✓ 갱신됨: ${dot(date)} ${wonK(close)}`; st.className = "sub up";
        refresh(); // 시나리오 결과의 현재가 기준선도 갱신
        return;
      } catch (e) { /* try next proxy */ }
    }
    st.textContent = "갱신 실패 — 프록시 차단. 정적 종가(2026-06-12) 유지"; st.className = "sub down";
  }

  // ---------- history charts ----------
  function renderHistory() {
    const e = C.estimate2026;
    const joLab = v => (v / 10000).toFixed(1) + "조";
    // 연간 매출 + 2026E 범위
    const rev = C.annualHistory.map(a => ({ label: a.year, value: a.rev }));
    if (e) rev.push({ label: "2026E", value: e.revenue.mid, lo: e.revenue.lo, hi: e.revenue.hi, est: true });
    el("revChart").innerHTML = svgBars(rev, { h: 240, color: "#4da3ff", lab: joLab });
    // 분기 매출 + Q2~Q4 2026E 범위
    const q = C.quarterlyHistory.map(x => ({ label: x.q, value: x.rev, hot: x.hot }));
    if (e) ["26Q2E", "26Q3E", "26Q4E"].forEach(lab => q.push({ label: lab, value: e.quarter.mid, lo: e.quarter.lo, hi: e.quarter.hi, est: true }));
    el("qChart").innerHTML = svgBars(q, { h: 220, lab: v => (v / 10000).toFixed(2) + "조" });
    // DPS + 2026E 범위
    const dps = C.dpsHistory.map(d => ({ label: d.year, value: d.dps }));
    if (e) dps.push({ label: "2026E", value: e.dps.mid, lo: e.dps.lo, hi: e.dps.hi, est: true });
    el("dpsChart").innerHTML = svgBars(dps, { h: 200, color: "#35c46b", lab: v => wonK(v) });
    el("regionChart").innerHTML = svgDonut(C.regionMix.parts);
    // 영업이익률 + 2026E 범위
    const op = C.annualHistory.map(a => ({ label: a.year, value: +(a.op / a.rev * 100).toFixed(1) }));
    if (e) op.push({ label: "2026E", value: e.opMargin.mid, lo: e.opMargin.lo, hi: e.opMargin.hi, est: true });
    el("opChart").innerHTML = svgBars(op, { h: 200, color: "#f0a13a", lab: v => v.toFixed(1) + "%", fmt: v => v.toFixed(0) + "%" });
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

  // ---------- theme (light/dark) ----------
  function initTheme() {
    let saved; try { saved = localStorage.getItem("eq-theme"); } catch (e) {}
    if (saved === "light") document.documentElement.classList.add("light");
    const btn = el("themeBtn");
    const sync = () => { btn.textContent = document.documentElement.classList.contains("light") ? "🌙 다크" : "☀ 라이트"; };
    sync();
    btn.addEventListener("click", () => {
      document.documentElement.classList.toggle("light");
      try { localStorage.setItem("eq-theme", document.documentElement.classList.contains("light") ? "light" : "dark"); } catch (e) {}
      sync();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    el("title").textContent = `${C.meta.name} (${C.meta.ticker})`;
    el("subtitle").innerHTML = `${C.meta.sector} · <span class="sub">${C.meta.origin}</span>`;
    el("genstamp").textContent = "생성 " + C.meta.asOf;
    renderHero(); renderPriceChart(); initPxControls(); renderHistory(); renderProfile();
    renderSliders(); renderPresets(); renderCalendar(); renderNarrative(); renderSources();
    refresh();
    el("printBtn").addEventListener("click", () => window.print());
  });
})();
