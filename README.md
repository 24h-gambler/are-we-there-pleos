# 다왔어? (Are We There?) — PLEOS 차량용 앱 공모전 제출 저장소

현대자동차그룹 차량용 앱 개발 공모전(Pleos Connect) 출품작 · 팀 **IM**

> 아이가 "다 왔어?"라고 묻기 전에, 내비의 남은 거리·시간에 맞춰 이야기와 퀴즈가 이어지고
> 도착하는 순간 결말이 나는 뒷좌석 음성 동행 앱.

**현재 상태(정직하게):** 이 저장소에는 기획 요약, 차량 화면 **목업**(HTML/CSS/JS), 목업을 장면별로 캡처한
**목업 시연 영상**, 목업을 그대로 띄우는 **목업 뷰어 APK** 가 들어 있다. Pleos Connect SDK(NaviHelper·TTS·STT·Vehicle)
연동은 아직 구현하지 않았다 — 동작 앱은 Pleos Connect Emulator 에서 Kotlin 으로 만들 계획이다.

## 무엇이 다른가
- 지나는 지역 이야기가 아니라 **"얼마나 남았는지"** 를 축으로 한다. 아이는 '40분'을 모른다 —
  남은 시간을 **이야기 몇 편·퀴즈 몇 개** 로 바꾸고, **이야기 결말을 도착 시각에 맞춘다.**
- 내비 경로·교통 정보·주행/정차·문 상태를 읽는 차에서만 할 수 있는 일이다. 휴대폰 오디오북은 못 한다.

## 화면 흐름 (목업 장면 = 영상 장면)
| # | 상황 | 화면 / 동작 |
|---|---|---|
| 0 | 안내 | "목업 시연 영상 — 실제 앱 화면 녹화 아님" |
| 1 | 출발 전(정차) | 목적지 속초, 도착까지 2시간 40분 = 이야기 4편 + 퀴즈 12개, 아이 프로필(하은·지호), 이어 들을 시리즈 |
| 2 | 주행 중 | 화면은 큰 진행 막대 하나, 이야기는 차 스피커로. 길 안내 음성 땐 이야기 잠깐 멈춤 |
| 3 | 정체 +20분 | 이야기 사이에 보너스 퀴즈 장이 끼어듦. "다 왔어?" → "이야기 두 편 반 남았어" |
| 4 | 휴게소(문 열림) | 이야기 멈춤, 정차 화면에만 퀴즈 점수판. 다시 출발하면 "지난 이야기" 한 줄로 이어짐 |
| 5 | 도착 | 도착 3분 전 결말 → "도착! 하은 9개, 지호 7개", 다음 여행 예고 |
| 6 | 정리 | 계획한 Pleos Connect SDK 연결 |

시나리오 인물(하은·지호)은 예시 인물이다.

## 폴더
| 경로 | 내용 |
|---|---|
| `mockup/` | 차량 화면 목업(1280×720 가로). `index.html` 을 브라우저로 열고 ◀ ▶·방향키·화면 누르기로 장면 이동, `?scene=N` 으로 장면 지정 |
| `video/are-we-there-mockup-demo.mp4` | 목업 시연 영상(68초, 1280×720, 소리 없음, 장면별 한국어 자막). 화면 녹화가 아니라 목업 장면 캡처를 이어 붙인 영상 |
| `video/frames/` | 영상에 쓴 장면 캡처 PNG |
| `tools/make_video.py` | 목업 → 영상 생성 스크립트(Playwright headless 캡처 + ffmpeg) |
| `apk/IM_AreWeThere_release.apk` | **목업 뷰어 APK**(release 서명). 앱 안에 묶은 `mockup/` 화면을 WebView 로 띄운다. 차량 SDK 연동 없음 |
| `android/` | 목업 뷰어 APK 소스(Java WebView Activity, Manifest)와 Gradle 없는 빌드 스크립트 `build_apk.sh` |
| `docs/proposal-summary.md` | 기획 요약(기능·시나리오·개발 계획) |

## 실행 방법
**목업 보기:** `mockup/index.html` 을 Chrome/Edge 로 연다(서버 필요 없음).

**영상 다시 만들기:**
```bash
pip install playwright        # Chrome 이 없으면: python -m playwright install chromium
python tools/make_video.py    # → video/are-we-there-mockup-demo.mp4 (ffmpeg 필요)
```

**APK 설치:** `adb install apk/IM_AreWeThere_release.apk` (minSdk 29, targetSdk 34, 가로 화면). 화면을 누르면 다음 장면으로 넘어간다.
Android 14(API 34) 에뮬레이터(일반 x86_64 이미지)에 설치해 실행·장면 넘김을 확인했다. Android Automotive / Pleos Connect Emulator 에서는 아직 확인하지 않았다.

**APK 다시 빌드:** Android SDK(build-tools 34.0.0, platforms/android-34), JDK, python 이 있으면
```bash
export ANDROID_HOME=/path/to/android-sdk KEYSTORE=/path/to/release.jks KS_PASS=...
bash android/build_apk.sh
```
서명 키는 저장소에 넣지 않았다.

## 다음 단계 (기획안 5. 개발 계획)
- Pleos Connect Emulator(Android Automotive, API 34)에서 Kotlin 앱으로 구현
- NaviHelper — 남은 시간·경로·정체·길 안내·경유지/도착 이벤트 → 이야기 길이, 보너스 장, 일시정지
- TextToSpeech(HYBRID) / SpeechToText — 낭독, "다 왔어?"·퀴즈 답 인식
- Vehicle — 주차 브레이크·주행 상태(정차일 때만 화면), 문 열림 시 멈춤
- 이야기·퀴즈는 미리 만들어 사람이 검수한 묶음을 내려받아 쓰고, 아이 정보는 차량 안에만 저장

소개 페이지: https://www.worldwidesomething.com/ko/are-we-there
