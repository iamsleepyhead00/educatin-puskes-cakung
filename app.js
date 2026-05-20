/* ================================================================
   Edukasi Catin — Kuisioner (Per-Section Flow)
   Flow: Biodata → Pre-Test → Hasil Pre
         → [Video ANEMIA → Post ANEMIA → Hasil]
         → [Video PRANIKAH → Post PRANIKAH → Hasil]
         → [Video IMS → Post IMS → Hasil]
         → Hasil Akhir + Kirim WA
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    const cfg = window.APP_CONFIG || {};
    const KKM = cfg.KKM ?? 100;
    const MIN_CORRECT_PER_SECTION = 3;

    // ============================================================
    // SPLASH SCREEN (auto-dismiss after 2.8s)
    // ============================================================
    const splash = document.getElementById('splash');
    setTimeout(() => { splash.classList.remove('active'); }, 2800);

    // ============================================================
    // SECTIONS CONFIG (video + questions per section)
    // ============================================================
    const SECTIONS = [
        {
            id: 'anemia',
            title: 'ANEMIA',
            shortTitle: 'ANEMIA',
            video: 'https://raw.githubusercontent.com/IAMWFS30/video-educatin/main/video-anemia.mp4',
            questions: [
                {
                    q: 'Apa yang dimaksud Anemia?',
                    options: [
                        { k: 'A', t: 'Kekurangan darah karena hemoglobin rendah' },
                        { k: 'B', t: 'Tekanan darah tinggi' },
                        { k: 'C', t: 'Kadar gula darah tinggi' }
                    ],
                    answer: 'A'
                },
                {
                    q: 'Salah satu tanda anemia adalah?',
                    options: [
                        { k: 'A', t: 'Badan terasa lemas dan mudah lelah' },
                        { k: 'B', t: 'Nafsu makan bertambah' },
                        { k: 'C', t: 'Kulit menjadi gelap' }
                    ],
                    answer: 'A'
                },
                {
                    q: 'Risiko yang terjadi bagi calon bayi jika ibu mengalami anemia adalah?',
                    options: [
                        { k: 'A', t: 'Berat badan bayi rendah' },
                        { k: 'B', t: 'Kelahiran premature' },
                        { k: 'C', t: 'A dan B benar' }
                    ],
                    answer: 'C'
                },
                {
                    q: 'Bagaimana encegah Anemia?',
                    options: [
                        { k: 'A', t: 'Konsumsi makanan kaya zat besi' },
                        { k: 'B', t: 'Minum tablet tambah darah' },
                        { k: 'C', t: 'A dan B benar' }
                    ],
                    answer: 'C'
                }
            ]
        },
        {
            id: 'ims',
            title: 'Infeksi Menular Seksual (IMS)',
            shortTitle: 'IMS',
            video: 'https://raw.githubusercontent.com/IAMWFS30/video-educatin/main/video-ims.mp4',
            questions: [
                {
                    q: 'Apa kepanjangan dari IMS?',
                    options: [
                        { k: 'A', t: 'Infeksi Menular Seksual' },
                        { k: 'B', t: 'Infeksi Menular Saluran' },
                        { k: 'C', t: 'Imunisasi Masyarakat Sehat' }
                    ],
                    answer: 'A'
                },
                {
                    q: 'Berikut yang termasuk contoh penyakit Infeksi Menular Seksual (IMS) adalah?',
                    options: [
                        { k: 'A', t: 'Diabetes' },
                        { k: 'B', t: 'HIV/AIDS' },
                        { k: 'C', t: 'Hipertensi' }
                    ],
                    answer: 'B'
                },
                {
                    q: 'Salah satu tanda seseorang mengalami IMS adalah?',
                    options: [
                        { k: 'A', t: 'Nyeri saat buang air kecil' },
                        { k: 'B', t: 'Nafsu makan meningkat' },
                        { k: 'C', t: 'Rambut cepat panjang' }
                    ],
                    answer: 'A'
                },
                {
                    q: 'Apa yang sebaiknya dilakukan jika mengalami gejala Infeksi Menular Seksual (IMS)?',
                    options: [
                        { k: 'A', t: 'Memeriksakan diri ke tenaga kesehatan' },
                        { k: 'B', t: 'Membiarkannya tanpa pengobatan' },
                        { k: 'C', t: 'Mengonsumsi obat sembarangan' }
                    ],
                    answer: 'A'
                }
            ]
        },
        {
            id: 'pranikah',
            title: 'Persiapan Pranikah',
            shortTitle: 'Pranikah',
            video: 'https://raw.githubusercontent.com/IAMWFS30/video-educatin/main/video-pranikah.mp4',
            questions: [
                {
                    q: 'Isi Piringku adalah pedoman?',
                    options: [
                        { k: 'A', t: 'Makan gizi seimbang' },
                        { k: 'B', t: 'Bermain' },
                        { k: 'C', t: 'Tidur' }
                    ],
                    answer: 'A'
                },
                {
                    q: 'Contoh PHBS adalah?',
                    options: [
                        { k: 'A', t: 'Buang sampah sembarangan' },
                        { k: 'B', t: 'Cuci tangan pakai sabun' },
                        { k: 'C', t: 'Jarang mandi' }
                    ],
                    answer: 'B'
                },
                {
                    q: 'Rokok dapat menyebabkan?',
                    options: [
                        { k: 'A', t: 'Tubuh sehat' },
                        { k: 'B', t: 'Penyakit paru-paru' },
                        { k: 'C', t: 'Nafsu makan baik' }
                    ],
                    answer: 'B'
                },
                {
                    q: 'Persiapan pranikah penting untuk?',
                    options: [
                        { k: 'A', t: 'Menjaga kesehatan pasangan' },
                        { k: 'B', t: 'Menambah masalah' },
                        { k: 'C', t: 'Mengurangi komunikasi' }
                    ],
                    answer: 'A'
                }
            ]
        },
    ];

    // All questions flat (for pre-test)
    const ALL_QUESTIONS = SECTIONS.flatMap(s => s.questions);

    // ============================================================
    // STATE
    // ============================================================
    const state = {
        biodata: null,
        preScore: null,
        sectionScores: {}  // { anemia: 100, pranikah: 100, ims: 100 }
    };

    let pendingConfirmAction = null;

    // ============================================================
    // HELPERS
    // ============================================================
    function showPage(id) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        window.scrollTo(0, 0);
        // Re-render Lucide icons for dynamically shown content
        if (window.lucide) lucide.createIcons();
    }

    function formatTimestamp() {
        const now = new Date();
        const days = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
        const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
        const pad = (n) => String(n).padStart(2, '0');
        return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} - ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} WIB`;
    }

    // ============================================================
    // CONFIRM MODAL
    // ============================================================
    const confirmModal = document.getElementById('confirm-modal');
    document.getElementById('btn-modal-cancel').addEventListener('click', () => {
        confirmModal.classList.remove('active');
        pendingConfirmAction = null;
    });
    const modalCloseBtn = document.getElementById('btn-modal-close');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            confirmModal.classList.remove('active');
            pendingConfirmAction = null;
        });
    }
    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) { confirmModal.classList.remove('active'); pendingConfirmAction = null; }
    });
    document.getElementById('btn-modal-confirm').addEventListener('click', () => {
        confirmModal.classList.remove('active');
        if (pendingConfirmAction) { const fn = pendingConfirmAction; pendingConfirmAction = null; fn(); }
    });
    function askConfirm(onConfirm) { pendingConfirmAction = onConfirm; confirmModal.classList.add('active'); }

    // ============================================================
    // NIK DUPLICATE MODAL
    // ============================================================
    const nikModal = document.getElementById('nik-modal');
    document.getElementById('btn-nik-ok').addEventListener('click', () => {
        nikModal.classList.remove('active');
    });
    nikModal.addEventListener('click', (e) => {
        if (e.target === nikModal) nikModal.classList.remove('active');
    });

    // ============================================================
    // BIODATA (with NIK uniqueness check)
    // ============================================================
    const biodataForm = document.getElementById('biodata-form');
    biodataForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(biodataForm);
        const nik = fd.get('nik').trim();
        const nama = fd.get('nama').trim();
        const wa = fd.get('wa').trim();

        // Check NIK uniqueness via Google Sheets
        if (cfg.SHEETS_ENDPOINT) {
            const submitBtn = biodataForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="btn-spinner"></span>';

            try {
                const checkUrl = `${cfg.SHEETS_ENDPOINT}?action=check&nik=${encodeURIComponent(nik)}`;
                const res = await fetch(checkUrl);
                const result = await res.json();

                if (result.exists) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i data-lucide="log-in" style="width:18px; height:18px;"></i> Lanjut ke Pre-Test';
                    if (window.lucide) lucide.createIcons();
                    // Show custom modal
                    document.getElementById('nik-modal').classList.add('active');
                    return;
                }
            } catch (err) {
                // Kalau check gagal (offline, dll), lanjut aja — jangan block user
                console.warn('NIK check failed, proceeding anyway:', err.message);
            }

            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i data-lucide="log-in" style="width:18px; height:18px;"></i> Lanjut ke Pre-Test';
            if (window.lucide) lucide.createIcons();
        }

        state.biodata = { nik, nama, wa };

        // Show confirmation modal with data summary
        const biodataModal = document.getElementById('biodata-confirm-modal');
        document.getElementById('biodata-confirm-summary').innerHTML = `
            <div style="margin-bottom:6px;"><strong>NIK:</strong> ${nik}</div>
            <div style="margin-bottom:6px;"><strong>Nama:</strong> ${nama}</div>
            <div><strong>WhatsApp:</strong> ${wa}</div>
        `;
        biodataModal.classList.add('active');
        if (window.lucide) lucide.createIcons();
    });

    // Biodata confirm modal handlers
    const biodataModal = document.getElementById('biodata-confirm-modal');
    document.getElementById('btn-biodata-cancel').addEventListener('click', () => {
        biodataModal.classList.remove('active');
    });
    document.getElementById('btn-biodata-modal-close').addEventListener('click', () => {
        biodataModal.classList.remove('active');
    });
    biodataModal.addEventListener('click', (e) => {
        if (e.target === biodataModal) biodataModal.classList.remove('active');
    });
    document.getElementById('btn-biodata-confirm').addEventListener('click', () => {
        biodataModal.classList.remove('active');
        showPage('page-pretest');
    });

    // ============================================================
    // PRE-TEST (all 9 questions with section headers)
    // ============================================================
    const preTestForm = document.getElementById('pretest-form');
    renderPreTestForm();

    function renderPreTestForm() {
        let html = '';
        let globalIdx = 0;
        SECTIONS.forEach(section => {
            html += `<div class="section-header"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/><path d="M12 7v5l3 3" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>${section.title}</div>`;
            section.questions.forEach(item => {
                globalIdx++;
                const name = `q${globalIdx}`;
                const opts = item.options.map((o, i) => `
                    <label><input type="radio" name="${name}" value="${o.k}" ${i === 0 ? 'required' : ''}> ${o.k}. ${o.t}</label>
                `).join('');
                html += `<div class="question-card"><label class="question-label"><span class="q-number">${globalIdx}</span><span>${item.q}</span></label><div class="radio-group">${opts}</div></div>`;
            });
        });
        preTestForm.innerHTML = html;

        // Update progress on radio change
        preTestForm.addEventListener('change', updatePreTestProgress);
    }

    function updatePreTestProgress() {
        const total = ALL_QUESTIONS.length;
        let answered = 0;
        for (let i = 1; i <= total; i++) {
            if (preTestForm.querySelector(`input[name="q${i}"]:checked`)) answered++;
        }
        const pct = Math.round((answered / total) * 100);
        const counterEl = document.getElementById('q-counter');
        const pctEl = document.getElementById('q-progress-pct');
        const circleEl = document.getElementById('progress-circle');
        if (counterEl) counterEl.innerHTML = `${answered} <small>dari ${total}</small>`;
        if (pctEl) pctEl.textContent = pct + '%';
        if (circleEl) {
            const circumference = 2 * Math.PI * 16; // r=16
            circleEl.setAttribute('stroke-dashoffset', circumference - (circumference * pct / 100));
        }
    }

    // Initialize counter on page load
    const initCounter = document.getElementById('q-counter');
    if (initCounter) initCounter.innerHTML = `0 <small>dari ${ALL_QUESTIONS.length}</small>`;

    preTestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        askConfirm(() => {
            const data = new FormData(preTestForm);
            let correct = 0;
            ALL_QUESTIONS.forEach((item, idx) => {
                if (data.get(`q${idx + 1}`) === item.answer) correct++;
            });
            state.preScore = Math.round((correct / ALL_QUESTIONS.length) * 100);
            document.getElementById('pretest-result-summary').innerHTML = `
                <div class="score-hero neutral">
                    <div class="score-hero-label">Skor Pre-Test</div>
                    <div class="score-hero-number">${state.preScore}</div>
                    <div class="score-hero-detail">${correct} dari ${ALL_QUESTIONS.length} benar</div>
                </div>
                <p class="info-box">📺 Ini skor awal Anda. Selanjutnya Anda akan menonton video edukasi per topik dan mengerjakan post-test.</p>
            `;
            showPage('page-pretest-result');
        });
    });

    // ============================================================
    // GENERATE SECTION PAGES (Video → Post-Test → Result)
    // ============================================================
    const sectionPagesContainer = document.getElementById('section-pages');
    let sectionPagesHTML = '';

    SECTIONS.forEach((section, sIdx) => {
        const sid = section.id;
        sectionPagesHTML += `
            <!-- VIDEO ${section.title} -->
            <div id="page-video-${sid}" class="page">
                <div class="layout-wrapper">
                    <header class="app-header">
                        <div class="app-header-left">
                            <i data-lucide="shield-check" style="color:#0d7a4a; width:22px; height:22px;"></i>
                            <div class="header-brand"><strong>POLI CATIN</strong><span>Edukasi • Puskesmas Cakung</span></div>
                        </div>
                    </header>
                    <div class="layout-body layout-body-single">
                        <main class="content-area content-area-full">
                            <div class="content-header">
                                <div class="content-title-icon-circle"><i data-lucide="video" style="width:22px; height:22px; color:#0d7a4a;"></i></div>
                                <div>
                                    <h1 class="content-title">Tonton Video Berikut</h1>
                                    <p class="content-subtitle">Silakan tonton video sampai selesai sebelum mengisi post-test.</p>
                                </div>
                            </div>
                            <div class="video-wrapper">
                                <video id="video-${sid}" controls controlsList="nodownload">
                                    <source src="${section.video}" type="video/mp4">
                                </video>
                            </div>
                            <div class="progress-section">
                                <div class="progress-bar"><div id="progress-${sid}" class="progress-fill"></div></div>
                                <span id="progress-text-${sid}">0% ditonton</span>
                            </div>
                            <p class="video-hint" id="hint-${sid}" hidden><i data-lucide="lock" style="width:14px; height:14px; vertical-align:middle; margin-right:4px;"></i> Tombol lanjut akan muncul setelah video selesai ditonton.</p>
                            <button id="btn-topost-${sid}" class="btn btn-primary" disabled hidden><i data-lucide="arrow-right" style="width:18px; height:18px;"></i> Lanjut ke Post-Test ${section.shortTitle}</button>
                        </main>
                    </div>
                </div>
            </div>

            <!-- POST-TEST ${section.title} -->
            <div id="page-posttest-${sid}" class="page">
                <div class="layout-wrapper">
                    <header class="app-header">
                        <div class="app-header-left">
                            <i data-lucide="shield-check" style="color:#0d7a4a; width:22px; height:22px;"></i>
                            <div class="header-brand"><strong>POLI CATIN</strong><span>Edukasi • Puskesmas Cakung</span></div>
                        </div>
                        <div class="app-header-right">
                            <div class="header-counter">
                                <span class="counter-label">Pertanyaan</span>
                                <span class="counter-value" id="q-counter-${sid}">0 <small>dari ${section.questions.length}</small></span>
                            </div>
                            <div class="header-progress">
                                <svg width="40" height="40" viewBox="0 0 40 40">
                                    <circle cx="20" cy="20" r="16" fill="none" stroke="#e5e7eb" stroke-width="3"/>
                                    <circle cx="20" cy="20" r="16" fill="none" stroke="#0d7a4a" stroke-width="3" stroke-linecap="round"
                                        stroke-dasharray="100.53" stroke-dashoffset="100.53" id="progress-circle-${sid}"
                                        transform="rotate(-90 20 20)"/>
                                </svg>
                                <span class="progress-pct" id="q-progress-pct-${sid}">0%</span>
                            </div>
                        </div>
                    </header>
                    <div class="layout-body layout-body-single">
                        <main class="content-area content-area-full">
                            <div class="content-header">
                                <div class="content-title-icon-circle"><i data-lucide="clipboard-list" style="width:22px; height:22px; color:#0d7a4a;"></i></div>
                                <div>
                                    <h1 class="content-title">Post-Test ${section.title}</h1>
                                    <p class="content-subtitle">Jawab pertanyaan berikut berdasarkan video yang telah Anda tonton.</p>
                                </div>
                            </div>
                            <form id="form-posttest-${sid}" class="quiz-form"></form>
                        </main>
                    </div>
                </div>
            </div>

            <!-- RESULT ${section.title} -->
            <div id="page-result-${sid}" class="page">
                <div class="layout-wrapper">
                    <header class="app-header">
                        <div class="app-header-left">
                            <i data-lucide="shield-check" style="color:#0d7a4a; width:22px; height:22px;"></i>
                            <div class="header-brand"><strong>POLI CATIN</strong><span>Edukasi • Puskesmas Cakung</span></div>
                        </div>
                    </header>
                    <div class="layout-body layout-body-single">
                        <main class="content-area content-area-full">
                            <div class="result-card">
                                <div id="result-${sid}"></div>
                                <button id="btn-retry-${sid}" class="btn btn-primary" hidden><i data-lucide="refresh-cw" style="width:18px; height:18px;"></i> Tonton Ulang Video ${section.shortTitle}</button>
                                <button id="btn-next-${sid}" class="btn btn-primary" hidden><i data-lucide="arrow-right" style="width:18px; height:18px;"></i> Lanjut</button>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        `;
    });
    sectionPagesContainer.innerHTML = sectionPagesHTML;

    // ============================================================
    // WIRE UP SECTION LOGIC
    // ============================================================
    SECTIONS.forEach((section, sIdx) => {
        const sid = section.id;
        const videoEl = document.getElementById(`video-${sid}`);
        const progressFill = document.getElementById(`progress-${sid}`);
        const progressText = document.getElementById(`progress-text-${sid}`);
        const hintEl = document.getElementById(`hint-${sid}`);
        const btnToPost = document.getElementById(`btn-topost-${sid}`);
        const formEl = document.getElementById(`form-posttest-${sid}`);
        const resultEl = document.getElementById(`result-${sid}`);
        const btnRetry = document.getElementById(`btn-retry-${sid}`);
        const btnNext = document.getElementById(`btn-next-${sid}`);

        let videoCompleted = false;
        let maxTime = 0;

        // Prevent speed change
        videoEl.playbackRate = 1;
        videoEl.addEventListener('ratechange', () => {
            if (videoEl.playbackRate !== 1) videoEl.playbackRate = 1;
        });

        // Video tracking
        videoEl.addEventListener('timeupdate', () => {
            if (videoEl.duration) {
                const pct = Math.floor((videoEl.currentTime / videoEl.duration) * 100);
                progressFill.style.width = pct + '%';
                progressText.textContent = pct + '% ditonton';
            }
            if (videoEl.currentTime > maxTime) maxTime = videoEl.currentTime;
        });

        // Prevent skipping forward
        videoEl.addEventListener('seeking', () => {
            if (videoCompleted) {
                // After video ended, prevent replay (lock at end)
                videoEl.currentTime = videoEl.duration;
                videoEl.pause();
            } else if (videoEl.currentTime > maxTime + 0.5) {
                videoEl.currentTime = maxTime;
            }
        });

        // Prevent replay after ended
        videoEl.addEventListener('play', () => {
            if (videoCompleted) {
                videoEl.pause();
                videoEl.currentTime = videoEl.duration;
            }
        });

        videoEl.addEventListener('ended', () => {
            videoCompleted = true;
            progressFill.style.width = '100%';
            progressText.innerHTML = '100% ditonton <i data-lucide="check-circle" style="width:16px; height:16px; color:#0d7a4a; vertical-align:middle;"></i>';
            hintEl.hidden = true;
            btnToPost.hidden = false;
            btnToPost.disabled = false;
            // Remove controls to prevent replay
            videoEl.controls = false;
            if (window.lucide) lucide.createIcons();
        });

        btnToPost.addEventListener('click', () => {
            if (!videoCompleted) return;
            showPage(`page-posttest-${sid}`);
        });

        // Render post-test form
        let html = '';
        section.questions.forEach((item, idx) => {
            const name = `${sid}_q${idx + 1}`;
            const opts = item.options.map((o, i) => `
                <label><input type="radio" name="${name}" value="${o.k}" ${i === 0 ? 'required' : ''}> ${o.k}. ${o.t}</label>
            `).join('');
            html += `<div class="question-card"><label class="question-label"><span class="q-number">${idx + 1}</span><span>${item.q}</span></label><div class="radio-group">${opts}</div></div>`;
        });
        html += `<div class="content-footer"><button type="submit" class="btn btn-primary btn-submit-pretest"><i data-lucide="send" style="width:18px; height:18px;"></i> Kirim Jawaban</button></div>`;
        formEl.innerHTML = html;

        // Track post-test progress
        formEl.addEventListener('change', () => {
            const total = section.questions.length;
            let answered = 0;
            for (let i = 1; i <= total; i++) {
                if (formEl.querySelector(`input[name="${sid}_q${i}"]:checked`)) answered++;
            }
            const pct = Math.round((answered / total) * 100);
            const counterEl = document.getElementById(`q-counter-${sid}`);
            const pctEl = document.getElementById(`q-progress-pct-${sid}`);
            const circleEl = document.getElementById(`progress-circle-${sid}`);
            if (counterEl) counterEl.innerHTML = `${answered} <small>dari ${total}</small>`;
            if (pctEl) pctEl.textContent = pct + '%';
            if (circleEl) {
                const circumference = 2 * Math.PI * 16;
                circleEl.setAttribute('stroke-dashoffset', circumference - (circumference * pct / 100));
            }
        });

        // Post-test submit
        formEl.addEventListener('submit', (e) => {
            e.preventDefault();
            askConfirm(() => {
                const data = new FormData(formEl);
                let correct = 0;
                section.questions.forEach((item, idx) => {
                    if (data.get(`${sid}_q${idx + 1}`) === item.answer) correct++;
                });
                const score = Math.round((correct / section.questions.length) * 100);
                state.sectionScores[sid] = score;
                state.sectionCorrect = state.sectionCorrect || {};
                state.sectionCorrect[sid] = correct;
                const passed = correct >= MIN_CORRECT_PER_SECTION;

                resultEl.innerHTML = `
                    <div class="score-hero ${passed ? 'pass' : 'fail'}">
                        <div class="score-hero-label">Skor ${section.title}</div>
                        <div class="score-hero-number">${score}</div>
                        <div class="score-hero-detail">${correct} dari ${section.questions.length} benar</div>
                    </div>
                    ${passed
                        ? `<div class="result-message pass"><div class="result-emoji"><i data-lucide="circle-check" style="width:48px; height:48px; color:#059669;"></i></div><h2>Lulus ${section.title}!</h2><p>Anda menjawab minimal ${MIN_CORRECT_PER_SECTION} soal dengan benar.</p></div>`
                        : `<div class="result-message fail"><div class="result-emoji"><i data-lucide="book-open" style="width:48px; height:48px; color:#dc2626;"></i></div><h2>Belum Lulus ${section.title}</h2><p>Minimal harus benar ${MIN_CORRECT_PER_SECTION} soal. Silakan tonton ulang video dan coba lagi.</p></div>`
                    }
                `;

                btnRetry.hidden = passed;
                btnNext.hidden = !passed;
                showPage(`page-result-${sid}`);
            });
        });

        // Retry — go back to video
        btnRetry.addEventListener('click', () => {
            videoEl.currentTime = 0;
            videoCompleted = false;
            maxTime = 0;
            videoEl.controls = true;
            btnToPost.hidden = true;
            btnToPost.disabled = true;
            progressFill.style.width = '0%';
            progressText.textContent = '0% ditonton';
            formEl.reset();
            // Reset post-test progress counter
            const counterEl = document.getElementById(`q-counter-${sid}`);
            const pctEl = document.getElementById(`q-progress-pct-${sid}`);
            const circleEl = document.getElementById(`progress-circle-${sid}`);
            if (counterEl) counterEl.innerHTML = `0 <small>dari ${section.questions.length}</small>`;
            if (pctEl) pctEl.textContent = '0%';
            if (circleEl) {
                const circumference = 2 * Math.PI * 16;
                circleEl.setAttribute('stroke-dashoffset', circumference);
            }
            showPage(`page-video-${sid}`);
        });

        // Next section or final
        btnNext.addEventListener('click', () => {
            const nextIdx = sIdx + 1;
            if (nextIdx < SECTIONS.length) {
                showPage(`page-video-${SECTIONS[nextIdx].id}`);
            } else {
                showFinalResult();
            }
        });
    });

    // ============================================================
    // START SECTIONS (from pre-test result)
    // ============================================================
    document.getElementById('btn-start-sections').addEventListener('click', () => {
        showPage(`page-video-${SECTIONS[0].id}`);
    });

    // Initialize Lucide icons
    if (window.lucide) lucide.createIcons();

    // ============================================================
    // FINAL RESULT
    // ============================================================
    function showFinalResult() {
        const totalQuestions = ALL_QUESTIONS.length;
        // Calculate total correct from actual correct counts
        let totalCorrect = 0;
        SECTIONS.forEach(s => {
            totalCorrect += (state.sectionCorrect && state.sectionCorrect[s.id]) || 0;
        });
        const finalScore = Math.round((totalCorrect / totalQuestions) * 100);
        const totalMinCorrect = MIN_CORRECT_PER_SECTION * SECTIONS.length;
        const passed = totalCorrect >= totalMinCorrect;

        const waEnabled = cfg.ENABLE_WA_BUTTON !== false;

        document.getElementById('final-result-summary').innerHTML = `
            <div class="score-hero ${passed ? 'pass' : 'fail'}">
                <div class="score-hero-label">Skor Akhir</div>
                <div class="score-hero-number">${finalScore}</div>
                <div class="score-hero-detail">${totalCorrect} dari ${totalQuestions} benar</div>
                ${state.preScore !== null ? `<div class="delta up">📈 Pre-Test: ${state.preScore} → Post-Test: ${finalScore} (+${finalScore - state.preScore})</div>` : ''}
            </div>
            <div class="result-message pass">
                <div class="result-emoji">🎉</div>
                <h2>Terima Kasih!</h2>
                <p>Selamat, Anda telah menyelesaikan seluruh edukasi dan memenuhi nilai minimum.</p>
                <div class="result-timestamp">🗓️ ${formatTimestamp()}</div>
            </div>
            ${waEnabled ? `
                <button id="btn-share-wa" class="btn btn-wa">
                    <span class="wa-icon">💬</span> Kirim Hasil ke WhatsApp
                </button>
            ` : ''}
        `;

        if (waEnabled) {
            document.getElementById('btn-share-wa').addEventListener('click', () => {
                const bio = state.biodata || {};
                const targetNumber = cfg.TARGET_PHONE || '6289522091583';
                const text =
                    `*Hasil Edukasi Poli Catin*\n\n` +
                    `👤 *Pasien*\n` +
                    `Nama: ${bio.nama || '-'}\n` +
                    `NIK: ${bio.nik || '-'}\n` +
                    `WhatsApp: ${bio.wa || '-'}\n\n` +
                    `📊 *Hasil*\n` +
                    `Pre-Test: ${state.preScore}\n` +
                    `Post-Test ANEMIA: ${state.sectionScores.anemia || 0}\n` +
                    `Post-Test IMS: ${state.sectionScores.ims || 0}\n` +
                    `Post-Test PRANIKAH: ${state.sectionScores.pranikah || 0}\n` +
                    `Skor Akhir: *${finalScore}*\n` +
                    `Status: ✅ LULUS\n\n` +
                    `🗓️ ${formatTimestamp()}`;
                window.open(`https://wa.me/${targetNumber}?text=${encodeURIComponent(text)}`, '_blank');
            });
        }

        // Auto-POST rekap ke Google Sheets
        if (cfg.SHEETS_ENDPOINT) {
            const bio = state.biodata || {};
            const params = new URLSearchParams({
                action: 'save',
                nama: bio.nama || '-',
                nik: bio.nik || '-',
                wa: bio.wa || '-',
                preScore: state.preScore,
                totalPostTest: finalScore,
                status: 'LULUS'
            });
            fetch(`${cfg.SHEETS_ENDPOINT}?${params.toString()}`, { mode: 'no-cors', keepalive: true })
              .then(() => console.log('Sheets: save sent'))
              .catch(err => console.warn('Sheets save error:', err.message));
        }

        showPage('page-final');
    }
});
