"""Compress video-pranikah.mp4 to under 25MB and save as video-phbs.mp4"""
from moviepy import VideoFileClip
import os

input_path = r"C:\Users\MIKA\Downloads\video-pranikah.mp4"
output_path = r"c:\KIRO AKUH\sinta\dashboard\questionnaire\video-phbs.mp4"

clip = VideoFileClip(input_path)
print(f"Original: {clip.duration:.1f}s, {clip.size[0]}x{clip.size[1]}")

# Target under 25MB for 366s video -> bitrate ~500kbps
clip.write_videofile(
    output_path,
    codec='libx264',
    audio_codec='aac',
    bitrate='500k',
    preset='medium',
    logger='bar'
)

clip.close()

size_mb = os.path.getsize(output_path) / (1024 * 1024)
print(f"\nDone! Output: {size_mb:.1f} MB")
