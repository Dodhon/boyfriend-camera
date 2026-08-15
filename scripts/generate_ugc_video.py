#!/usr/bin/env python3
"""Generate viral 9:16 UGC video clips for Boyfriend Camera using Seedance API (ByteDance SeaDance 2.0).

Usage:
  python3 scripts/generate_ugc_video.py
  python3 scripts/generate_ugc_video.py --duration 10 --prompt "Custom UGC scene..."
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

DEFAULT_PROMPT = (
    "Viral TikTok POV video: A stylish girlfriend wearing a casual loose chic autumn outfit on a sunny city sidewalk "
    "hands her iPhone to her boyfriend to take an aesthetic photo of her. The boyfriend looks at the phone screen, "
    "crouches down to waist height with a confident smile, tilts the phone slightly up to frame her perfectly, and taps the screen. "
    "The girlfriend smiles and poses naturally. Realistic smartphone video, cinematic natural lighting, authentic social media UGC aesthetic."
)


def resolve_api_key() -> str:
    key = os.environ.get("SEEDANCE_API_KEY", "").strip()
    if key:
        return key
    candidates = [
        Path.cwd() / ".env",
        Path.home() / ".env",
        Path.home() / "boyfriend-camera" / ".env",
    ]
    for p in candidates:
        if p.is_file():
            for line in p.read_text().splitlines():
                line = line.strip()
                if line.startswith("SEEDANCE_API_KEY="):
                    return line.split("=", 1)[1].strip().strip("'\"")
    return ""


def main():
    parser = argparse.ArgumentParser(description="Generate UGC marketing video clips via Seedance API")
    parser.add_argument("--prompt", default=DEFAULT_PROMPT, help="Video generation prompt")
    parser.add_argument("--aspect-ratio", default="9:16", choices=["9:16", "16:9", "1:1", "4:3"], help="Video aspect ratio")
    parser.add_argument("--duration", type=int, default=5, choices=[5, 10, 15, 4, 8], help="Duration in seconds")
    parser.add_argument("--resolution", default="720p", choices=["480p", "720p", "1080p"], help="Output resolution")
    parser.add_argument("--model", default="seedance-2.0-fast", help="Seedance model name")
    parser.add_argument("--output", default="/Users/thuptenwangpo/boyfriend-camera/assets/ugc/boyfriend_camera_ugc_v1.mp4", help="Output MP4 file path")
    parser.add_argument("--open", action="store_true", default=True, help="Open video after download")
    args = parser.parse_args()

    api_key = resolve_api_key()
    if not api_key:
        print("Error: SEEDANCE_API_KEY not found in environment or ~/.env", file=sys.stderr)
        sys.exit(1)

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    }

    payload = {
        "prompt": args.prompt,
        "aspect_ratio": args.aspect_ratio,
        "duration": args.duration,
        "resolution": args.resolution,
        "model": args.model,
    }

    print(f"🎬 Submitting UGC generation task to Seedance API ({args.model}, {args.duration}s, {args.aspect_ratio})...")

    req = urllib.request.Request(
        "https://seedanceapi.org/v2/generate",
        data=json.dumps(payload).encode("utf-8"),
        headers=headers,
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            resp_data = json.loads(resp.read().decode("utf-8"))
            task_id = resp_data.get("data", {}).get("task_id")
            if not task_id:
                print(f"Error: {resp_data}", file=sys.stderr)
                sys.exit(1)
            print(f"✅ Task created successfully: {task_id}")
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        if e.code == 402:
            print(f"\n❌ HTTP 402: Insufficient Credits on seedanceapi.org.", file=sys.stderr)
            print("👉 Please top up credits at https://seedanceapi.org/pricing or check your dashboard.", file=sys.stderr)
        else:
            print(f"HTTP Error {e.code}: {err_body}", file=sys.stderr)
        sys.exit(1)

    # Poll status
    status_url = f"https://seedanceapi.org/v2/status?task_id={task_id}"
    video_url = None
    start_time = time.time()

    print("⏳ Rendering video (polling status every 4s)...")
    for attempt in range(75):  # Up to 5 minutes
        time.sleep(4)
        status_req = urllib.request.Request(status_url, headers=headers, method="GET")
        try:
            with urllib.request.urlopen(status_req, timeout=15) as s_resp:
                s_data = json.loads(s_resp.read().decode("utf-8"))
                status = s_data.get("data", {}).get("status")
                elapsed = int(time.time() - start_time)
                print(f"   [{elapsed}s] Status: {status}")

                if status == "SUCCESS":
                    responses = s_data.get("data", {}).get("response", [])
                    if responses:
                        video_url = responses[0]
                        print(f"\n🎉 Video generation completed! URL: {video_url}")
                        break
                elif status == "FAILED":
                    err_msg = s_data.get("data", {}).get("error_message")
                    print(f"Generation failed: {err_msg}", file=sys.stderr)
                    sys.exit(1)
        except Exception as poll_err:
            pass

    if not video_url:
        print("Error: Timed out waiting for video completion", file=sys.stderr)
        sys.exit(1)

    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    print(f"📥 Downloading video to {out_path}...")

    dl_req = urllib.request.Request(video_url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(dl_req) as dl_resp:
        out_path.write_bytes(dl_resp.read())

    print(f"✨ Video saved: {out_path} ({out_path.stat().st_size} bytes)")

    if args.open:
        subprocess.run(["open", str(out_path)])


if __name__ == "__main__":
    main()
