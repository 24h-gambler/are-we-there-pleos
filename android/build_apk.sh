#!/usr/bin/env bash
# Gradle 없이 Android build-tools 만으로 목업 뷰어 APK 를 만든다.
# 필요: ANDROID_HOME(build-tools 34.0.0, platforms/android-34), JDK, python, 서명 키(KEYSTORE, KS_PASS 환경변수).
# Windows(Git Bash)에서는 build-tools 의 d8.bat / apksigner.bat 을 쓴다.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
BT="$ANDROID_HOME/build-tools/34.0.0"
JAR="$ANDROID_HOME/platforms/android-34/android.jar"
OUT="${1:-$HERE/../apk/IM_AreWeThere_release.apk}"
EXT=""; [ -f "$BT/d8.bat" ] && EXT=".bat"
B="$(mktemp -d)"
mkdir -p "$B/classes" "$B/dex"
"$BT/aapt2" link -o "$B/base.apk" --manifest "$HERE/AndroidManifest.xml" -I "$JAR" \
  --min-sdk-version 29 --target-sdk-version 34
javac -source 8 -target 8 -bootclasspath "$JAR" -d "$B/classes" -nowarn \
  $(find "$HERE/src" -name '*.java') 2>&1 | grep -v '^warning' || true
(cd "$B/classes" && jar cf "$B/classes.jar" .)
"$BT/d8$EXT" --release --lib "$JAR" --min-api 29 --output "$B/dex" "$B/classes.jar"
# classes.dex 와 assets/mockup/* 를 '/' 경로로 넣는다(Windows 에서 aapt2 -A 가 '\' 경로를 만들어서).
python - "$B/base.apk" "$B/dex/classes.dex" "$HERE/../mockup" <<'PY'
import sys, zipfile, pathlib
apk, dex, mock = sys.argv[1], pathlib.Path(sys.argv[2]), pathlib.Path(sys.argv[3])
with zipfile.ZipFile(apk, "a", zipfile.ZIP_DEFLATED) as z:
    z.write(dex, "classes.dex")
    for f in sorted(mock.rglob("*")):
        if f.is_file():
            z.write(f, "assets/mockup/" + f.relative_to(mock).as_posix())
PY
"$BT/zipalign" -f -p 4 "$B/base.apk" "$B/aligned.apk"
mkdir -p "$(dirname "$OUT")"
"$BT/apksigner$EXT" sign --v4-signing-enabled false --ks "$KEYSTORE" --ks-pass env:KS_PASS --out "$OUT" "$B/aligned.apk"
"$BT/apksigner$EXT" verify "$OUT" && echo "OK $OUT"
