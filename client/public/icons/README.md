# PWA Icons

This directory should contain PWA icons in various sizes for optimal display across different devices.

## Required Icon Sizes:

- **icon-72x72.png** - Small icon for older devices
- **icon-96x96.png** - Standard small icon
- **icon-128x128.png** - Medium icon
- **icon-144x144.png** - Windows tile icon
- **icon-152x152.png** - Apple touch icon
- **icon-192x192.png** - Standard Android icon (required)
- **icon-384x384.png** - Large Android icon
- **icon-512x512.png** - Extra large icon (required)

## How to Generate Icons:

You can use the existing `/abhishek_icon.svg` file and generate PNG icons from it using:

### Option 1: Online Tools

- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [PWA Asset Generator](https://progressier.com/pwa-icons-generator)
- [Favicon.io](https://favicon.io/)

### Option 2: Command Line (ImageMagick)

```bash
# Install ImageMagick
# Then convert SVG to PNG at different sizes

convert abhishek_icon.svg -resize 72x72 icons/icon-72x72.png
convert abhishek_icon.svg -resize 96x96 icons/icon-96x96.png
convert abhishek_icon.svg -resize 128x128 icons/icon-128x128.png
convert abhishek_icon.svg -resize 144x144 icons/icon-144x144.png
convert abhishek_icon.svg -resize 152x152 icons/icon-152x152.png
convert abhishek_icon.svg -resize 192x192 icons/icon-192x192.png
convert abhishek_icon.svg -resize 384x384 icons/icon-384x384.png
convert abhishek_icon.svg -resize 512x512 icons/icon-512x512.png
```

### Option 3: Use Sharp (Node.js)

```javascript
const sharp = require("sharp");

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach((size) => {
  sharp("abhishek_icon.svg")
    .resize(size, size)
    .toFile(`icons/icon-${size}x${size}.png`);
});
```

## Note:

Until you generate these icons, the PWA will fallback to the SVG icon defined in manifest.json. However, for full PWA compliance and better compatibility, PNG icons are recommended.
