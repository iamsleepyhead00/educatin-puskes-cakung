# Deploy ke Netlify (Gratis, Permanent URL, HTTPS)

## Arsitektur

```
Browser → /api/send-wa  →  Netlify Function  →  Fonnte API  →  WhatsApp
              ↑                  ↑
        pretty URL       FONNTE_TOKEN disimpan
                         sebagai env var (secure!)
```

Token Fonnte TIDAK ada di kode frontend — aman untuk public.

---

## Cara Deploy (Pilih Satu)

### 🅰️ Opsi A — Drag & Drop (Paling Gampang, 2 Menit)

1. **Daftar/login** di https://app.netlify.com
2. Di dashboard, klik **Add new site** → **Deploy manually**
3. **Drag folder `dashboard/questionnaire/` ke area upload**
4. Tunggu deploy selesai, dapat URL random (mis. `https://quirky-tesla-abc123.netlify.app`)
5. **Set environment variable** (ini penting!):
   - Buka **Site settings** → **Environment variables** → **Add a variable**
   - Nama: `FONNTE_TOKEN`, value: `GvcHDLTrFdYajYt6U5sx`
   - Nama: `TARGET_PHONE`, value: `6289522091583`
   - Save
6. **Redeploy** (biar function kebaca env barunya): Deploys → **Trigger deploy** → **Clear cache and deploy site**

Selesai. Tes buka URL → submit kuis → kirim WA.

---

### 🅱️ Opsi B — Netlify CLI (Pro, Bisa Versioning)

```bash
# 1. Install CLI sekali
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Masuk folder site
cd dashboard/questionnaire

# 4. Init site baru
netlify init
# pilih "Create & configure a new site"
# team: pilih team default
# site name: catin-kuisioner (atau bebas)

# 5. Set env vars
netlify env:set FONNTE_TOKEN "GvcHDLTrFdYajYt6U5sx"
netlify env:set TARGET_PHONE "6289522091583"

# 6. Deploy production
netlify deploy --prod
```

Dapat URL permanent: `https://catin-kuisioner.netlify.app`

---

## Custom Domain (Opsional)

Kalau lo punya domain sendiri (mis. `kuisioner.puskesmasku.id`):
1. Site settings → **Domain management** → **Add custom domain**
2. Arahkan DNS lo ke Netlify (instruksi di panel)
3. HTTPS otomatis aktif via Let's Encrypt

---

## Test Lokal Sebelum Deploy

```bash
# Install Netlify CLI (sekali aja)
npm install -g netlify-cli

# Di folder dashboard/questionnaire
cd dashboard/questionnaire

# Set env var lokal (pakai file .env, JANGAN di-commit)
echo "FONNTE_TOKEN=GvcHDLTrFdYajYt6U5sx" > .env
echo "TARGET_PHONE=6289522091583" >> .env

# Jalanin Netlify Dev (simulasi Netlify di local)
netlify dev
```

Buka http://localhost:8888 → kuisioner + function jalan sama seperti di production.

---

## Security Notes

- ✅ `config.js` aman di-commit (tidak berisi token)
- ✅ `netlify.toml` aman di-commit
- ✅ `netlify/functions/send-wa.js` aman di-commit (cuma baca env)
- ❌ `.env` JANGAN di-commit (sudah ada di .gitignore)
- ❌ Jangan taruh token di `config.js`, pakai env var

---

## Troubleshooting

| Gejala | Penyebab | Fix |
|--------|----------|-----|
| Tombol WA fallback ke wa.me | Env var belum diset / function error | Cek Netlify dashboard → Functions → logs |
| `500 FONNTE_TOKEN not configured` | Env var belum diset | Site settings → Env vars → add `FONNTE_TOKEN` → redeploy |
| `502 Bad Gateway` | Token salah atau device WA Fonnte disconnect | Cek dashboard Fonnte, reconnect device |
| CORS error | Function deploy gagal | Cek Netlify → Deploy log |
