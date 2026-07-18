# FITWIN Homepage

Static landing page for `fitwin.ai`.

## Structure

- `index.html`: page markup
- `styles.css`: layout and visual styles
- `script.js`: nav state, reveal behavior, and form feedback
- `assets/`: images and video assets used by the page

## Local Preview

```bash
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/`.

## Deployment Notes

The current production deployment is hosted on AWS S3 and served through CloudFront for `fitwin.ai` and `www.fitwin.ai`.
