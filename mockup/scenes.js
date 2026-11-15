// 다왔어? (Are We There?) — 차량 화면 목업. 장면 데이터는 기획안의 '주요 사용 시나리오'(서울 마포 → 속초) 그대로.
// 실제 앱이 아니라 화면 흐름을 보여 주는 정적 목업이다. ?scene=N&capture=1 로 장면 하나만 띄울 수 있다.

function track(segs, carPct) {
  const total = segs.reduce((a, s) => a + s.w, 0);
  const html = segs.map(s =>
    `<div class="seg ${s.k}${s.done ? ' done' : ''}" style="width:${(s.w / total) * 100}%">${s.t || ''}</div>`).join('');
  return `<div class="track">${html}<span class="car" style="left:${carPct}%">🚗</span></div>`;
}
function wave(n) {
  let h = '';
  for (let i = 0; i < n; i++) h += `<i style="height:${10 + ((i * 37) % 30)}px"></i>`;
  return `<span class="wave">${h}</span>`;
}
const BASE = [
  { k: 'story', w: 3, t: '이야기 1' }, { k: 'quiz', w: 1.5, t: '퀴즈 3' },
  { k: 'story', w: 3, t: '이야기 2' }, { k: 'quiz', w: 1.5, t: '퀴즈 3' },
  { k: 'story', w: 3, t: '이야기 3' }, { k: 'quiz', w: 1.5, t: '퀴즈 3' },
  { k: 'story', w: 3, t: '이야기 4 · 결말' }, { k: 'quiz', w: 1.5, t: '퀴즈 3' },
];
function marked(segs, doneUpTo) { return segs.map((s, i) => Object.assign({}, s, { done: i < doneUpTo })); }

const SCENES = [
  {
    mode: '', time: '',
    caption: '목업 시연 영상 — 실제 앱 화면 녹화가 아니라 HTML 화면 시안입니다',
    html: `<div class="center">
      <div class="sub" style="margin-bottom:18px">현대자동차그룹 차량용 앱 개발 공모전 · 팀 IM</div>
      <div class="big">다왔어? <span class="accent">Are We There?</span></div>
      <div class="mid" style="margin-top:22px">남은 시간을 아이가 아는 단위로, 도착하는 순간 끝나는 이야기</div>
      <div class="sub" style="margin-top:26px">이 영상은 기획안의 화면 흐름을 보여 주는 <b class="warm">목업(프로토타입 시안)</b>입니다.<br>실제 차량·에뮬레이터 화면 녹화가 아닙니다.</div>
    </div>`,
  },
  {
    mode: 'park', modeText: '정차', time: '토 08:30',
    caption: '① 출발 전(정차): 목적지 속초 → 남은 시간을 "이야기 4편 · 퀴즈 12개"로',
    html: `<div class="row">
      <div class="card" style="flex:1.25">
        <div class="sub">내비 목적지</div>
        <div class="mid">서울 마포 → <span class="accent">속초</span></div>
        <div class="sub" style="margin-top:18px">도착까지</div>
        <div class="big">2시간 40분</div>
        <div class="mid" style="margin-top:14px">= <span class="accent">이야기 4편</span> + <span class="warm">퀴즈 12개</span></div>
        <div class="sub" style="margin-top:16px">결말은 도착 2~3분 전에 맞춰 끝나요</div>
      </div>
      <div class="card" style="flex:1">
        <div class="sub">누가 타나요?</div>
        <div><span class="pill on">하은 · 7세</span><span class="pill on">지호 · 5세</span><span class="pill">+ 프로필</span></div>
        <div class="sub" style="margin-top:26px">이어서 들을 시리즈</div>
        <div class="mid">🐋 구름 고래 <span class="warm">2편</span></div>
        <div class="sub">지난 여행: 고래가 바다로 내려온 데까지</div>
        <div class="pill on" style="margin-top:24px;font-size:26px;padding:12px 26px">출발하면 시작 ▶</div>
      </div>
    </div>`,
  },
  {
    mode: 'drive', modeText: '주행 중 · 음성만', time: '09:05',
    caption: '② 주행 중: 화면은 진행 막대 하나, 이야기는 차 스피커로 — 길 안내 음성 땐 잠깐 쉼',
    html: `<div class="center" style="gap:34px">
      <div class="mid">🐋 구름 고래 2편 · 이야기 1 ${wave(14)}</div>
      <div style="width:1120px">${track(marked(BASE, 0), 14)}<span></span></div>
      <div class="mid">이야기 <span class="accent">4편</span> · 퀴즈 <span class="warm">12개</span> 남음</div>
      <div class="sub">🔈 "300m 앞 오른쪽 방향" 길 안내가 나오면 이야기가 잠깐 멈췄다가 이어져요 · 운전자는 만질 것 없음</div>
    </div>`,
  },
  {
    mode: 'drive', modeText: '주행 중 · 음성만', time: '10:10',
    caption: '③ 정체 +20분: 보너스 퀴즈 장이 끼어들고, "다 왔어?"엔 아이 단위로 답',
    html: `<div class="center" style="gap:22px">
      <div class="sub">서울양양고속도로 정체 · 예상 도착 <span class="warm">+20분</span> → 보너스 장 추가</div>
      <div style="width:1120px">${track(marked([
        BASE[0], BASE[1], BASE[2], { k: 'bonus', w: 2, t: '보너스' }, BASE[3], BASE[4], BASE[5], BASE[6], BASE[7]], 3), 34)}</div>
      <div style="display:flex;flex-direction:column;gap:16px;width:1060px;margin-top:6px">
        <div class="bubble kid">🧒 하은: "다 왔어?"</div>
        <div class="bubble app">🔊 "이야기 두 편 반 남았어. 다음 휴게소에서 쉬어 갈 거야."</div>
      </div>
    </div>`,
  },
  {
    mode: 'park', modeText: '정차 · 문 열림', time: '10:42',
    caption: '④ 휴게소(문 열림): 이야기 멈춤 · 정차 화면에만 퀴즈 점수판',
    html: `<div class="row">
      <div class="card" style="flex:1">
        <div class="sub">⏸ 홍천강 휴게소 · 문이 열려 이야기를 멈췄어요</div>
        <div class="mid" style="margin-top:22px">지금까지 맞힌 퀴즈</div>
        <div class="mid" style="margin-top:16px">하은 <span class="stars">⭐⭐⭐⭐⭐⭐</span></div>
        <div class="mid" style="margin-top:8px">지호 <span class="stars">⭐⭐⭐⭐⭐</span></div>
        <div class="sub" style="margin-top:18px">주행 중에는 화면을 그리지 않고, 정차일 때만 그림을 보여 줘요</div>
      </div>
      <div class="card" style="flex:1">
        <div class="sub">다시 출발하면</div>
        <div class="bubble app" style="margin-top:14px;max-width:none">🔊 "고래가 막 섬을 찾았던 데까지 들었지?"</div>
        <div class="sub" style="margin-top:24px">남은 것</div>
        <div class="mid"><span class="accent">이야기 2편</span> · <span class="warm">퀴즈 6개</span></div>
        <div class="sub" style="margin-top:8px">도착까지 1시간 10분</div>
      </div>
    </div>`,
  },
  {
    mode: 'park', modeText: '도착', time: '11:30',
    caption: '⑤ 도착 3분 전 결말 → 도착과 함께 "끝!" · 다음 여행 예고',
    html: `<div class="center" style="gap:20px">
      <div style="width:1120px">${track(marked(BASE, 8), 96)}</div>
      <div class="big">🏁 도착! 속초</div>
      <div class="mid">오늘 <span class="accent">하은이는 퀴즈 9개</span>, <span class="warm">지호는 7개</span></div>
      <div class="card" style="margin-top:6px"><div class="sub">다음 여행에서 계속 →</div>
        <div class="mid">🐋 구름 고래 3편: "섬 너머의 등대"</div></div>
    </div>`,
  },
  {
    mode: '', time: '',
    caption: '차량에서만 되는 것: 내비 남은 시간 · 주행/정차 · 문 상태 · 차 스피커',
    html: `<div class="row" style="flex-direction:column;gap:18px">
      <div class="mid">계획한 Pleos Connect SDK 연결 (기획안 5. 개발 계획)</div>
      <div class="card" style="font-size:26px"><b class="accent">NaviHelper</b> — 남은 시간·경로·정체·길 안내·휴게소/도착 이벤트 → 이야기 길이, 보너스 장, 일시정지</div>
      <div class="card" style="font-size:26px"><b class="accent">TextToSpeech / SpeechToText</b> — 이야기 낭독(통신 끊기면 차량 내장 엔진), "다 왔어?"·퀴즈 답 인식</div>
      <div class="card" style="font-size:26px"><b class="accent">Vehicle</b> — 주차 브레이크·주행 상태(정차일 때만 화면), 문 열림 시 멈춤</div>
      <div class="sub">이 영상은 목업입니다. 동작 앱은 Pleos Connect Emulator(Android Automotive, Kotlin)로 만들 예정입니다.</div>
    </div>`,
  },
];

const params = new URLSearchParams(location.search);
let cur = Math.max(0, Math.min(SCENES.length - 1, parseInt(params.get('scene') || '0', 10)));
if (params.get('capture')) document.body.classList.add('capture');

function render() {
  const s = SCENES[cur];
  document.getElementById('stage').innerHTML = s.html;
  document.getElementById('caption').textContent = s.caption;
  const m = document.getElementById('sb-mode');
  m.textContent = s.modeText || '';
  m.className = s.mode || '';
  m.style.display = s.modeText ? '' : 'none';
  document.getElementById('sb-time').textContent = s.time || '';
  document.getElementById('idx').textContent = `${cur + 1} / ${SCENES.length}`;
}
document.getElementById('prev').onclick = () => { cur = Math.max(0, cur - 1); render(); };
document.getElementById('next').onclick = () => { cur = Math.min(SCENES.length - 1, cur + 1); render(); };
// 차량 화면(APK)에서는 화면을 누르면 다음 장면(마지막 다음은 처음).
document.getElementById('screen').onclick = () => { cur = (cur + 1) % SCENES.length; render(); };
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') document.getElementById('next').click();
  if (e.key === 'ArrowLeft') document.getElementById('prev').click();
});
window.SCENE_COUNT = SCENES.length;
render();
