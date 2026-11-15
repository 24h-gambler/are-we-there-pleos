"""목업 장면을 headless 브라우저로 캡처해 mp4 로 묶는다.

사용: python tools/make_video.py [출력.mp4]
필요: playwright(Python), Chrome 또는 `playwright install chromium`, ffmpeg
"""
import subprocess
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "video" / "are-we-there-mockup-demo.mp4"
SHOTS = ROOT / "video" / "frames"
SECONDS = [6, 9, 9, 10, 9, 9, 8]  # 장면별 길이(초)


def main() -> None:
    SHOTS.mkdir(parents=True, exist_ok=True)
    url = (ROOT / "mockup" / "index.html").as_uri()
    with sync_playwright() as p:
        try:
            browser = p.chromium.launch(channel="chrome", headless=True, args=["--mute-audio"])
        except Exception:  # noqa: BLE001
            browser = p.chromium.launch(headless=True, args=["--mute-audio"])
        page = browser.new_page(viewport={"width": 1280, "height": 720})
        page.goto(url + "?capture=1")
        n = page.evaluate("window.SCENE_COUNT")
        for i in range(n):
            page.goto(f"{url}?scene={i}&capture=1")
            page.wait_for_timeout(300)
            page.locator("#screen").screenshot(path=str(SHOTS / f"scene{i}.png"))
        browser.close()
    lst = SHOTS / "list.txt"
    lines = []
    for i in range(n):
        lines += [f"file 'scene{i}.png'", f"duration {SECONDS[i] if i < len(SECONDS) else 8}"]
    lines.append(f"file 'scene{n - 1}.png'")
    lst.write_text("\n".join(lines) + "\n", encoding="utf-8")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lst),
                    "-vf", "fps=30,format=yuv420p", "-c:v", "libx264", "-crf", "23", "-preset", "medium",
                    "-movflags", "+faststart", str(OUT)], check=True, cwd=SHOTS)
    print(OUT, OUT.stat().st_size)


if __name__ == "__main__":
    main()
