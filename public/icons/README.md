# PWA Icons

이 폴더에는 PWA 설치에 필요한 아이콘 파일이 들어갑니다.

## 필요한 파일

| 파일 | 크기 | 용도 |
|------|------|------|
| `icon-192.png` | 192×192 | Android Chrome PWA 설치 아이콘 (maskable) |
| `icon-512.png` | 512×512 | 스플래시 스크린 / PWA 아이콘 |
| `icon.svg` | any | 벡터 아이콘 (SVG 지원 브라우저) |

## PNG 아이콘 생성 방법

`icon.svg`를 기반으로 PNG를 생성하세요.

### Squoosh (브라우저)
1. https://squoosh.app 접속
2. `icon.svg` 업로드
3. 192×192, 512×512로 각각 내보내기

### ImageMagick (CLI)
```bash
magick icon.svg -resize 192x192 icon-192.png
magick icon.svg -resize 512x512 icon-512.png
```

> **주의**: PNG 파일 없이도 "홈 화면에 추가"는 동작하지만,
> Android Chrome의 PWA Install 배너는 PNG 아이콘이 있어야 완전히 활성화됩니다.
