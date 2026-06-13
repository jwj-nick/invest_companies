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

  // 2026E 추정 범위 — 공개 컨센서스 부재(소형 유통주·Not Rated). Q1'26 확정 + Q2~Q4 메모리 사이클 시나리오(정상화↔피크지속) 추론.
  // 막대=중앙값(mid), 수염=저(lo)~고(hi). src=assumption(주황).
  estimate2026: {
    src: "assumption",
    note: "Q1 확정(매출 17,954·영익 3,273·OPM 18.2%) + Q2~Q4 시나리오. 低=마진 정상화·가격스파이크 진정, 高=피크 지속(≈Q1×4). 배당=순익×배당성향 26~32% 가정(이사회 재량 변수).",
    revenue:   { lo: 51000, mid: 61500, hi: 72000 },   // 억
    opMargin:  { lo: 9,     mid: 13,    hi: 17 },        // %
    opProfit:  { lo: 4600,  mid: 8000,  hi: 11900 },     // 억
    netIncome: { lo: 3400,  mid: 6000,  hi: 8800 },      // 억
    dps:       { lo: 900,   mid: 1800,  hi: 2900 },       // 원
    quarter:   { lo: 11000, mid: 14500, hi: 18000 }       // Q2~Q4 각 분기 매출(억)
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
