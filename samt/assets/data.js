/* equity-scenario-app 데이터 (회사 교체 = 이 파일 교체).
   단위: 금액=억원, 주가/DPS=원, 주식수=주. 모든 핵심 수치에 src(sources.json id).
   file:// 로 열어도 동작하도록 임베드. */

window.SOURCES = {
  bulgom_2019:        { title: "불곰 관심종목 발표 — 에스에이엠티(031330)", url: "(로컬) samt.pdf", date: "2019-05-08" },
  fnguide_snapshot:   { title: "FnGuide Company Guide — 에스에이엠티 Snapshot", url: "https://comp.fnguide.com/SVO2/ASP/SVD_Main.asp?pGB=1&gicode=A031330&MenuYn=Y&ReportGB=B&NewMenuID=Y&stkGb=701", date: "2026-06-12" },
  leadeconomy_q1:     { title: "리드경제 — SAMT, 영업이익 한 분기에 작년의 3배", url: "https://www.leadeconomy.co.kr/news/articleView.html?idxno=7529", date: "2026" },
  digitaltoday_valueup:{ title: "디지털투데이 — 2026 기업가치 제고 계획", url: "https://www.digitaltoday.co.kr/news/articleView.html?idxno=645643", date: "2026" },
  digitaltoday_samji_sell:{ title: "디지털투데이 — 삼지전자 주식 매도", url: "https://www.digitaltoday.co.kr/news/articleView.html?idxno=667777", date: "2026-05-20" },
  edaily_div2024:     { title: "이데일리 — 주당 200원 결산 현금배당(FY2024)", url: "https://www.edaily.co.kr/News/Read?newsId=04880646642074456&mediaCodeNo=257", date: "2025-02-26" },
  investing_earnings: { title: "Investing.com — SAMT 실적", url: "https://www.investing.com/equities/samt-co-ltd-earnings", date: "2026" },
  hankyung_fin:       { title: "한국경제 — 에스에이엠티 기업재무 요약", url: "https://markets.hankyung.com/stock/031330/financial-summary", date: "2026" },
  naver_price:        { title: "네이버 금융 — 031330 월봉 시세", url: "https://finance.naver.com/item/main.naver?code=031330", date: "2026-06-12" },
  kmib_div2019:       { title: "국민일보 — 에스에이엠티 주당 140원 현금배당(FY2019)", url: "https://www.kmib.co.kr/article/view.asp?arcid=0014296615", date: "2020" },
  samt_div_analysis:  { title: "SAMT 배당/주가 밴드 분석노트 (DART·언론 기반, 내부)", url: null, date: "2026-06-16" },
  dart_2025:          { title: "DART 2025 사업보고서 (rcpNo 20260317000665)", url: "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20260317000665", date: "2026-03-17" },
  dart_1q2026:        { title: "DART 2026 1분기 분기보고서 (rcpNo 20260515000521)", url: "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20260515000521", date: "2026-05-15" },
  fnguide_cashflow:   { title: "FnGuide 현금흐름표 (DART 기반)", url: "https://comp.fnguide.com/SVO2/asp/SVD_Finance.asp?pGB=1&gicode=A031330&NewMenuID=103", date: "2026" },
  memory_outlook:     { title: "메모리 가격 전망 — TrendForce/Counterpoint/Gartner (보도 종합)", url: null, date: "2026" },
  assumption:         { title: "분석 가정 (외부 출처 아님)", url: null, date: "2026-06-13" }
};

window.COMPANY = {
  meta: { name: "에스에이엠티", ticker: "031330", market: "KOSDAQ",
          sector: "반도체·전자부품 유통 (삼성그룹 IT제품 국내유통 1위)", asOf: "2026-06-13",
          origin: "불곰 2019.05.08 리포트의 2026 업데이트", originSrc: "bulgom_2019" },

  market: {
    price: { value: 14960, date: "2026-06-12", src: "fnguide_snapshot" },
    marketCap: { value: 14959, src: "fnguide_snapshot" },
    sharesTotal: { value: 99995067, src: "fnguide_snapshot" },
    sharesEligible: { value: 97545067, note: "배당가능주식(자사주 제외). FY2024·FY2025 배당총액÷DPS로 교차검증", src: "edaily_div2024" },
    majorShareholder: { name: "삼지전자", stake: 49.82, note: "2026-05 일부 매도로 축소", src: "digitaltoday_samji_sell" },
    week52: { high: 15650, low: 2605, src: "naver_price" }
  },

  financials: {
    FY2018: { label: "29기(원본)", revenue: 11760, opProfit: 338, netIncome: 318, dps: 130, src: "bulgom_2019" },
    FY2024: { revenue: 28895, opProfit: 674, netIncome: 544, dps: 200, payout: 35.9, dividendTotal: 195.09, src: "edaily_div2024" },
    FY2025: { revenue: 37566, opProfit: 1139, netIncome: 758, equity: 4861, assets: 13762, liabilities: 8902, dps: 230, payout: 29.59, dividendTotal: 224.35, src: "fnguide_snapshot" },
    Q1_2026: { revenue: 17954, opProfit: 3273, netIncome: 2420, opMargin: 18.2, cogsRatio: 81.2, grossProfit: 3383, note: "메모리 가격 급등기 재고 평가이익(일시적 windfall)", src: "leadeconomy_q1" },
    Q1_2025_base: { revenue: 7643, opProfit: 195, src: "leadeconomy_q1" }
  },

  // 연간 실적 시계열 (연결, 억원)
  annualHistory: [
    { year: "2018", rev: 11760, op: 338, ni: 318, src: "bulgom_2019" },
    { year: "2021", rev: 22320, op: 845, ni: 601, src: "hankyung_fin" },
    { year: "2022", rev: 25444, op: 788, ni: 578, src: "hankyung_fin" },
    { year: "2023", rev: 21451, op: 535, ni: 329, src: "hankyung_fin" },
    { year: "2024", rev: 28895, op: 674, ni: 544, src: "hankyung_fin" },
    { year: "2025", rev: 37566, op: 1139, ni: 758, src: "fnguide_snapshot" }
  ],

  // 분기 매출 추이 (억원) — Q1'26 급등 시각화
  quarterlyHistory: [
    { q: "25Q1", rev: 7643, src: "investing_earnings" },
    { q: "25Q2", rev: 9180, src: "investing_earnings" },
    { q: "25Q3", rev: 10300, src: "investing_earnings" },
    { q: "25Q4", rev: 10442, note: "연간−3분기 역산", src: "fnguide_snapshot" },
    { q: "26Q1", rev: 17954, hot: true, src: "leadeconomy_q1" }
  ],

  // 주당배당금 이력 (원) — 2020~2022 미확인(gap)
  dpsHistory: [
    { year: "2018", dps: 130, src: "bulgom_2019" },
    { year: "2019", dps: 140, src: "kmib_div2019" },
    { year: "2023", dps: 200, src: "hankyung_fin" },
    { year: "2024", dps: 200, src: "edaily_div2024" },
    { year: "2025", dps: 230, src: "fnguide_snapshot" }
  ],

  // 2026E 추정 범위 — Bear/Base/Bull 시나리오(아래 scenarios2026) 기반. 막대=중앙값, 수염=저~고.
  // ★DPS는 '순익×배당성향' 공식이 아니라 정책 밴드(점진 DPS + 음의 OCF) 기준 → 과거판(2,900원)보다 크게 하향.
  estimate2026: {
    src: "samt_div_analysis",
    note: "순익=Bear 5,000/Base 7,000/Bull 9,500억(상반기 강세 락인+하반기 가격방향). DPS는 정책밴드(중심 350~700원) — payout 공식은 배당 과대추정이므로 폐기.",
    revenue:   { lo: 51000, mid: 61500, hi: 72000 },   // 억 (참고)
    opMargin:  { lo: 10,    mid: 14,    hi: 18 },        // % (Q1 스파이크 포함 연간)
    netIncome: { lo: 5000,  mid: 7000,  hi: 9500 },      // 억 — 시나리오
    dps:       { lo: 300,   mid: 500,   hi: 900 },        // 원 — 정책 A~B 현실밴드(C는 상방)
    quarter:   { lo: 11000, mid: 14500, hi: 18000 }       // Q2~Q4 각 분기 매출(억)
  },

  // ★FY2026 순이익 시나리오 → 2027.3 배당 기준 (분석노트 §5)
  scenarios2026: {
    src: "samt_div_analysis",
    driver: "SAMT는 제조사가 아닌 유통사 — 마진은 메모리 가격의 '수준'이 아니라 '변화율'에 연동(싸게 산 재고를 급등가에 판매). 1Q 18.2%는 가격 급등 국면 산물이며, 정점 횡보만으로도 통상 2~4%로 회귀.",
    eligibleShares: 97545000,
    items: [
      { key: "Bear", ni: 5000, eps: 5130, h2: "2Q까지 강세, 2H 가격 하락 → 마진 정상화 + 재고평가손실",
        why: "상반기 강세는 사실상 락인(1Q 2,420억 + 2Q 강세). 하방은 하반기 가격 하락 시 재고 6,857억의 평가손실 레버리지." },
      { key: "Base", ni: 7000, eps: 7180, h2: "2H 정점 횡보, 마진 질서있게 정상화",
        why: "가장 무난. 상반기 windfall + 하반기 정상 마진(2~4%)으로 수렴. 중심 가정." },
      { key: "Bull", ni: 9500, eps: 9740, h2: "슈퍼사이클 지속, 2H에도 가격 상승 유지",
        why: "공급부족 지속 + AI 수요. 단 중국 증설로 2H 하방 위험 상존(완전 정상화 2028+)." }
    ],
    next: { event: "2026 2Q 잠정실적", date: "2026-07 말 ~ 08 초", watch: "영업이익률 18%대 유지 vs 정상화 시작 → Bear/Base/Bull 가중 갱신" }
  },

  // ★배당 정책 전제 → DPS 밴드 (분석노트 §6). payout 공식 폐기 근거 = 점진 DPS + 음의 OCF.
  dividendPolicies: {
    src: "samt_div_analysis",
    note: "회사는 고정 payout이 아니라 점진적 DPS(200→230, +15%)를 쓰고, 늘어난 이익을 운전자본·차입상환에 유보. 배당성향이 35.9→29.6%로 오히려 하락(revealed preference). → payout×순익은 배당을 과대추정.",
    central: { low: 350, high: 700 },
    items: [
      { key: "A", label: "A. 정책지속(보수)", stars: 3, scaled: false, dpsLow: 300, dpsHigh: 450,
        why: "점진 DPS 유지(+30~95%). 성향 하락 추세 + 음의 OCF·차입부담 감안. 가장 유력." },
      { key: "B", label: "B. 부분환원(중립)", stars: 2, scaled: false, dpsLow: 500, dpsHigh: 900,
        why: "windfall 일부 환원 + 정부 밸류업 압력. 특별배당 가능성 포함." },
      { key: "C", label: "C. 성향복귀(공격)", stars: 1, scaled: true, payoutLow: 0.15, payoutHigh: 0.25,
        why: "과거 성향(15~25%)을 큰 이익에 적용 → DPS 급등. 음의 OCF 감안 시 가능성 낮음. (선택 시나리오 순익에 연동)" }
    ],
    upTriggers: ["2~4분기 OCF 흑자 전환(재고 정상화)", "정부 밸류업 압박 강화", "특별배당 결의"],
    downTriggers: ["메모리 사이클 둔화", "차환 리스크 부각", "환손실 확대"]
  },

  priceBand: {
    src: "samt_div_analysis",
    perSet: [3, 5, 8],
    note: "점예측 아님 — 밴드가 과도하게 넓음. 사이클 피크의 저PER은 함정(이익 고점=저PER → 사이클 전환 시 E 급감). 유통업 통상 PER 3~6배."
  },

  // ★현금흐름 — 이익≠배당의 실증 (FnGuide/DART)
  cashflow: {
    src: "fnguide_cashflow",
    note: "2년 연속(2024·2025) 영업현금흐름 적자. 순이익은 흑자인데 현금은 재고·매출채권에 묶이고, 부족분을 단기차입으로 조달. 이것이 배당을 제약하는 결정적 근거.",
    years: ["2023", "2024", "2025"],
    ocf: [1408, -1391, -1203],
    fcf: [1334, -1388, -1208],
    fin: [-1074, 1363, 1682],
    cash: [503, 508, 983]
  },

  // 재무 스트레스 (분석노트 §1)
  balanceStress: {
    src: "samt_div_analysis",
    cols: ["2024", "2025", "26Q1"],
    rows: [
      { k: "재고자산(억)", v: ["3,259", "6,857", "n/a"], note: "2025 +110%" },
      { k: "단기차입금(억)", v: ["2,737", "4,618", "8,729"], note: "전액 단기·장기부채 0" },
      { k: "부채비율", v: ["93%", "183%", "213%"], note: "1.5년 만에 2배+" }
    ],
    invTurn: "재고회전 2025 10.3 → 7.1회로 하락 (현금 묶임/평가손실 선행지표)"
  },

  // 분기 추적 대시보드 (분석노트 §8)
  trackIndicators: {
    src: "samt_div_analysis",
    items: [
      { k: "영업이익률", now: "18.2%(1Q)", watch: "2~4% 회귀 vs 유지", role: "구조개선 vs 스파이크 판별 — 최우선" },
      { k: "메모리 계약가 방향", now: "+55~60%(1Q)→+20%(2Q) 후 정점", watch: "상승/횡보/하락", role: "마진 선행지표" },
      { k: "OCF ÷ 순익", now: "음수", watch: "1.0 근접", role: "배당 여력 핵심" },
      { k: "재고회전율", now: "7.1회", watch: "반등 vs 하락", role: "현금 개선/평가손실 신호" },
      { k: "단기차입·부채비율", now: "213%", watch: "차환 리스크", role: "재무 안정성" },
      { k: "환손익(USD 순부채)", now: "환율 10%↑=세전 -175억", watch: "환율·파생", role: "환 노출" }
    ]
  },

  // 2026 Q1 지역별 매출 (억원, %)
  regionMix: { src: "leadeconomy_q1", parts: [
    { name: "국내", value: 9706, pct: 54.0 },
    { name: "중국", value: 3395, pct: 18.9 },
    { name: "미국", value: 2463, pct: 13.7 },
    { name: "홍콩", value: 1900, pct: 10.6 },
    { name: "기타", value: 490, pct: 2.8 }
  ]},

  suppliers: { src: "bulgom_2019", items: ["삼성전자(메모리·시스템반도체·LED)", "삼성전기", "삼성SDI(2차전지)", "삼성디스플레이"] },
  customers: { src: "bulgom_2019", items: ["현대모비스", "LG이노텍", "LG전자", "HUMAX", "파트론", "캠시스", "코텍", "팬택 외"] },

  historyTimeline: [
    { y: "1990", t: "㈜삼테크 설립", src: "bulgom_2019" },
    { y: "2000", t: "코스닥 상장", src: "bulgom_2019" },
    { y: "2008~09", t: "KIKO 사태 — 자본전액잠식·상장폐지 위기 (FY2009 순손실 −1,807억)", src: "bulgom_2019" },
    { y: "2009~14", t: "한국씨티은행 등 채권단 체제", src: "bulgom_2019" },
    { y: "2015", t: "삼지전자, 4,000만주 인수(536억, 지분 50%) — 최대주주 변경", src: "bulgom_2019" },
    { y: "2016", t: "유상증자 131억(총 667억, 지분 55%) → 배당 정책 강화", src: "bulgom_2019" },
    { y: "2026", t: "메모리 슈퍼사이클 — Q1 영업이익률 18.2%, 주가 사상 최고 15,650원", src: "naver_price" }
  ],

  engineDefaults: {
    annualizeFactor:  { value: 4,    min: 3.5, max: 8,    step: 0.1,  label: "연환산 배수 (Q1×?)", src: "assumption", marks: { "Q1×4": 4, "성장가속 ×6": 6 } },
    sustainedOpMargin:{ value: 18.2, min: 3.0, max: 30,   step: 0.1,  label: "연간 영업이익률 (%)", src: "assumption", marks: { "정상화 3%": 3.0, "Q1 18.2%": 18.2, "초피크 25%": 25 } },
    netToOpRatio:     { value: 0.74, min: 0.6, max: 0.95, step: 0.01, label: "순이익/영업이익 비율", src: "leadeconomy_q1" },
    payout:           { value: 29.6, min: 15,  max: 60,   step: 0.5,  label: "배당성향 (%)", src: "fnguide_snapshot", marks: { "FY25 29.6%": 29.6, "FY24 35.9%": 35.9, "밸류업 50%": 50 } },
    per:              { value: 6,    min: 2,   max: 25,   step: 0.5,  label: "PER 배수", src: "bulgom_2019", marks: { "불곰 5~6배": 6, "유통평균 10": 10 } },
    targetYield:      { value: 5,    min: 2,   max: 9,    step: 0.25, label: "목표 배당수익률 (%)", src: "edaily_div2024", marks: { "FY24 7%": 7 } },
    pbr:              { value: 2,    min: 0.5, max: 6,    step: 0.1,  label: "PBR 배수", src: "assumption" },
    evEbitdaMult:     { value: 5,    min: 2,   max: 14,   step: 0.5,  label: "EV/EBITDA 배수", src: "assumption" },
    depreciation:     { value: 50,   min: 0,   max: 400,  step: 10,   label: "감가상각비 (억, EBITDA용)", src: "assumption" },
    netDebt:          { value: 0,    min: -2000, max: 6000, step: 100, label: "순차입금 (억, EV용)", src: "assumption" }
  },

  presets: {
    "Q1 유지 (사용자 가정)": { sustainedOpMargin: 18.2, payout: 29.6, annualizeFactor: 4 },
    "기본 (혼합)":          { sustainedOpMargin: 10.0, payout: 29.6, annualizeFactor: 4 },
    "정상화 (보수)":        { sustainedOpMargin: 3.0,  payout: 29.6, annualizeFactor: 4 }
  },

  events: [
    { date: "2026-07-08", approx: true, company: "삼성전자", title: "2Q26 잠정실적", relevance: "메모리 가격·출하 방향 → SAMT 2Q 가늠", src: "fnguide_snapshot" },
    { date: "2026-07-28", approx: true, company: "삼성전자", title: "2Q26 확정/컨콜", relevance: "DRAM/NAND 가이던스", src: "fnguide_snapshot" },
    { date: "2026-08-14", approx: true, company: "에스에이엠티", title: "2Q26 분기보고서", relevance: "★ Q1 windfall(18.2% 마진) 지속 여부 1차 확인", src: "investing_earnings", star: true },
    { date: "2026-08-14", approx: true, company: "삼지전자", title: "2Q26 실적", relevance: "모회사·지분 동향", src: "assumption" },
    { date: "2026-10-08", approx: true, company: "삼성전자", title: "3Q26 잠정실적", relevance: "하반기 메모리 피크아웃 여부", src: "fnguide_snapshot" },
    { date: "2026-10-28", approx: true, company: "삼성전자", title: "3Q26 확정/컨콜", relevance: "2027 메모리 전망", src: "fnguide_snapshot" },
    { date: "2026-11-14", approx: true, company: "에스에이엠티", title: "3Q26 분기보고서", relevance: "★ 누적실적 → 연간 배당재원 윤곽", src: "investing_earnings", star: true },
    { date: "2026-12-29", approx: true, company: "에스에이엠티", title: "배당기준일/배당락(예상)", relevance: "고배당 이벤트 직전", src: "edaily_div2024" },
    { date: "2027-02-26", approx: true, company: "에스에이엠티", title: "FY2026 결산 + 배당 확정공시", relevance: "★ 배당 확정 (전년 2/26 패턴)", src: "edaily_div2024", star: true },
    { date: "2027-03-20", approx: true, company: "에스에이엠티", title: "배당금 지급(예상)", relevance: "전년 3/20 패턴", src: "edaily_div2024" }
  ],

  narrative: {
    thesis: "2019년 PER 5~6·배당 7%대 저평가 유통 1위 → 2026 메모리 슈퍼사이클로 분기 영업이익이 연간을 초과하는 어닝서프라이즈. 주가 1,840→14,960원(약 9배).",
    keyCaveat: "Q1 영업이익률 18.2%는 재고 평가이익 성격의 일시적 windfall. 메모리 가격 정상화 시 2~3%로 회귀. 'Q1×4' 가정은 상단 시나리오이며 전망치가 아님.",
    watchpoints: ["8월/11월 분기보고서의 마진 지속성", "삼지전자 지분 매도(오버행)", "메모리 고정거래가·SK하이닉스/마이크론 어닝", "매출채권·재고 회전(부채비율 약 183%)"]
  }
};
