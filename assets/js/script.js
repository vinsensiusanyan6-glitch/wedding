/* =========================================================
   CONFIGURATION
========================================================= */

const CONFIG = {

    weddingDate: '2026-12-29T09:00:00+07:00',

    /* =====================================================
       GOOGLE FORM
       Untuk MENGIRIM RSVP
    ===================================================== */

    googleFormAction:
        'https://docs.google.com/forms/d/e/1FAIpQLSewrQIrtwg6Lvj3WRjoi0RL0x5rkvQmG5iFZiww0z3lSnv_aQ/formResponse',


    /* =====================================================
       GOOGLE SHEET
       Untuk MEMBACA RSVP / UCAPAN
    ===================================================== */

    googleSheetUrl:
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vSy-JUNzJlRIOTTSDJRGuK_AQGQvsiZM34EwRfBiPIRh53rW_IFsWirRg_gLaZQdPz2z3sO1VLZ_7fv/pub?output=csv',


    /* =====================================================
       GOOGLE FORM FIELD ID
    ===================================================== */

    fields: {

        name:
            'entry.290774784',

        attendance:
            'entry.1318967976',

        guests:
            'entry.2054287845',

        message:
            'entry.692446568'
    },


    /* =====================================================
       SLIDESHOW
    ===================================================== */

    slides: {

        cover: [
            'assets/images/couple/25.avif',
            'assets/images/couple/24.avif',
            'assets/images/couple/21.avif',
            'assets/images/couple/20.avif'
        ],

        groom: [
            'assets/images/pria/09.avif',
            'assets/images/pria/03.avif',
            'assets/images/pria/02.avif'
        ],

        bride: [
            'assets/images/wanita/13.avif',
            'assets/images/wanita/10.avif',
            'assets/images/wanita/12.avif'
        ],

        event: [
            'assets/images/30.webp',
            'assets/images/31.webp',
            'assets/images/32.webp',
            'assets/images/29.webp'
        ],

        event2: [
            'assets/images/21.webp',
            'assets/images/22.webpg',
            'assets/images/23.webp',
            'assets/images/24.webp'
        ]
    }
};


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = selector =>
    document.querySelector(selector);

const $$ = selector =>
    [...document.querySelectorAll(selector)];


/* =========================================================
   ESCAPE HTML
========================================================= */

function esc(value) {

    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}


/* =========================================================
   TOAST
========================================================= */

function toast(message) {

    const element = $('#toast');

    if (!element) return;

    element.textContent = message;

    element.classList.add('show');

    clearTimeout(window.__toast);

    window.__toast = setTimeout(() => {

        element.classList.remove('show');

    }, 2500);
}


/* =========================================================
   GUEST NAME
========================================================= */

function guest() {

    const params =
        new URLSearchParams(location.search);

    let name =
        params.get('to') ||
        params.get('guest') ||
        'Tamu Undangan';

    try {

        name = decodeURIComponent(name);

    } catch {

        // Gunakan nama asli
    }

    const guestName =
        $('#guestName');

    if (!guestName) return;

    guestName.textContent =
        name.replaceAll('+', ' ');
}


/* =========================================================
   GENERIC SLIDESHOW
========================================================= */

function makeSlides(
    element,
    urls,
    className,
    interval
) {

    if (!element || !urls?.length) return;

    element.innerHTML = urls
        .map(url => `
            <div
                class="${className}"
                style="background-image:url('${url}')">
            </div>
        `)
        .join('');

    const slideItems =
        [...element.children];

    if (!slideItems.length) return;

    let currentIndex = 0;

    slideItems[0]
        .classList.add('active');

    setInterval(() => {

        slideItems[currentIndex]
            .classList.remove('active');

        currentIndex++;

        if (
            currentIndex >=
            slideItems.length
        ) {
            currentIndex = 0;
        }

        slideItems[currentIndex]
            .classList.add('active');

    }, interval);
}


/* =========================================================
   COUPLE SLIDESHOW
   FOTO BERGERAK KIRI → KANAN
========================================================= */

function makeCoupleSlides(
    element,
    urls,
    interval
) {

    if (!element || !urls?.length) return;

    element.innerHTML = urls
        .map((url, index) => `
            <div
                class="portrait-slide ${
                    index === 0
                        ? 'active'
                        : ''
                }"
                style="background-image:url('${url}')">
            </div>
        `)
        .join('');

    const slideItems =
        [...element.children];

    if (!slideItems.length) return;

    let currentIndex = 0;


    function showNextSlide() {

        const currentSlide =
            slideItems[currentIndex];

        currentIndex++;

        if (
            currentIndex >=
            slideItems.length
        ) {
            currentIndex = 0;
        }

        const nextSlide =
            slideItems[currentIndex];


        /* Foto lama bergerak ke kanan */

        currentSlide
            .classList.remove('active');

        currentSlide
            .classList.add('slide-right');


        /* Foto berikutnya masuk */

        nextSlide
            .classList.add('next-slide');

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                nextSlide
                    .classList.remove(
                        'next-slide'
                    );

                nextSlide
                    .classList.add('active');

            });

        });


        /* Bersihkan foto lama */

        setTimeout(() => {

            currentSlide
                .classList.remove(
                    'slide-right'
                );

        }, 1300);
    }


    setInterval(
        showNextSlide,
        interval
    );
}


/* =========================================================
   INITIALIZE SLIDESHOWS
========================================================= */

function slides() {

    /* COVER */

    makeSlides(
        $('.cover-slides'),
        CONFIG.slides.cover,
        'slide',
        5200
    );


    /* GROOM */

    $$('[data-slideshow="groom"]')
        .forEach(element => {

            makeCoupleSlides(
                element,
                CONFIG.slides.groom,
                4000
            );

        });


    /* BRIDE */

    $$('[data-slideshow="bride"]')
        .forEach(element => {

            makeCoupleSlides(
                element,
                CONFIG.slides.bride,
                4000
            );

        });


    /* EVENT */

    makeSlides(
        $('.event-slides'),
        CONFIG.slides.event,
        'slide',
        5200
    );


    /* EVENT 2 */

    makeSlides(
        $('.event-slides-2'),
        CONFIG.slides.event2,
        'slide',
        5200
    );


    /* EVENT PHOTO ANIMATION */

    const eventPhoto =
        document.querySelector(
            '.event-photo'
        );

    if (eventPhoto &&
        'IntersectionObserver' in window) {

        const eventObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        eventPhoto
                            .classList
                            .add(
                                'event-photo-visible'
                            );

                        eventObserver
                            .unobserve(
                                eventPhoto
                            );

                    });

                },
                {
                    threshold: 0.2
                }
            );

        eventObserver.observe(
            eventPhoto
        );
    }
}


/* =========================================================
   COUNTDOWN
========================================================= */

function countdown() {

    const target =
        new Date(
            CONFIG.weddingDate
        ).getTime();


    function tick() {

        const remaining =
            Math.max(
                0,
                target - Date.now()
            );


        const values = [

            Math.floor(
                remaining / 86400000
            ),

            Math.floor(
                remaining / 3600000
            ) % 24,

            Math.floor(
                remaining / 60000
            ) % 60,

            Math.floor(
                remaining / 1000
            ) % 60

        ];


        [
            'days',
            'hours',
            'minutes',
            'seconds'
        ].forEach(
            (id, index) => {

                const element =
                    $('#' + id);

                if (!element) return;

                element.textContent =
                    String(
                        values[index]
                    ).padStart(2, '0');

            }
        );
    }


    tick();

    setInterval(
        tick,
        1000
    );
}


/* =========================================================
   REVEAL ANIMATION
========================================================= */

function reveal() {

    const elements =
        $$('.reveal');


    if (
        !('IntersectionObserver'
            in window)
    ) {

        elements.forEach(element => {

            element.classList
                .add('visible');

        });

        return;
    }


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (
                        !entry.isIntersecting
                    ) {
                        return;
                    }

                    entry.target
                        .classList
                        .add('visible');

                    observer.unobserve(
                        entry.target
                    );

                });

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(element => {

        observer.observe(element);

    });
}


/* =========================================================
   OPEN INVITATION
========================================================= */

function openInvitation() {

    const btn =
        $('#openBtn');

    const music =
        $('#music');

    const musicBtn =
        $('#musicBtn');

    if (!btn) return;


    btn.addEventListener(
        'click',
        async () => {

            $('#cover')
                ?.classList
                .add('open');

            document.body
                .classList
                .remove('locked');


            /* Musik setelah klik user */

            if (music) {

                try {

                    await music.play();

                    musicBtn
                        ?.classList
                        .add('playing');

                } catch (error) {

                    console.log(
                        'Musik belum bisa diputar:',
                        error
                    );

                }
            }


            history.replaceState(
                null,
                '',
                '#home'
            );


            setTimeout(() => {

                document
                    .querySelector('#home')
                    ?.scrollIntoView({
                        behavior: 'smooth'
                    });

            }, 250);

        }
    );
}


/* =========================================================
   MUSIC
========================================================= */

function music() {

    const musicElement =
        $('#music');

    const musicButton =
        $('#musicBtn');

    if (!musicElement) return;


    musicElement.volume = 0.7;


    /* Tombol musik */

    if (musicButton) {

        musicButton.onclick =
            async () => {

                try {

                    if (
                        musicElement.paused
                    ) {

                        await musicElement
                            .play();

                        musicButton
                            .classList
                            .add('playing');

                    } else {

                        musicElement.pause();

                        musicButton
                            .classList
                            .remove(
                                'playing'
                            );
                    }

                } catch {

                    toast(
                        'Musik belum dapat diputar.'
                    );

                }

            };
    }
}


/* =========================================================
   COPY BUTTON
========================================================= */

function copy() {

    $$('[data-copy]')
        .forEach(button => {

            button.onclick =
                async () => {

                    try {

                        await navigator
                            .clipboard
                            .writeText(
                                button.dataset.copy
                            );

                        toast(
                            'Berhasil disalin.'
                        );

                    } catch {

                        toast(
                            'Gagal menyalin.'
                        );

                    }

                };

        });
}


/* =========================================================
   CSV PARSER
   Membaca Google Sheet CSV
========================================================= */

function parseCSV(text) {

    const rows = [];

    let row = [];

    let value = '';

    let insideQuotes = false;


    for (
        let i = 0;
        i < text.length;
        i++
    ) {

        const char =
            text[i];

        const next =
            text[i + 1];


        /* Quote di dalam quote */

        if (
            char === '"' &&
            insideQuotes &&
            next === '"'
        ) {

            value += '"';

            i++;

        }


        /* Buka / tutup quote */

        else if (
            char === '"'
        ) {

            insideQuotes =
                !insideQuotes;

        }


        /* Kolom */

        else if (
            char === ',' &&
            !insideQuotes
        ) {

            row.push(
                value.trim()
            );

            value = '';

        }


        /* Baris */

        else if (
            (
                char === '\n' ||
                char === '\r'
            ) &&
            !insideQuotes
        ) {

            if (
                char === '\r' &&
                next === '\n'
            ) {
                i++;
            }


            row.push(
                value.trim()
            );

            value = '';


            if (
                row.some(
                    cell =>
                        cell !== ''
                )
            ) {

                rows.push(row);

            }

            row = [];

        }


        else {

            value += char;

        }
    }


    /* Data terakhir */

    if (
        value ||
        row.length
    ) {

        row.push(
            value.trim()
        );

        if (
            row.some(
                cell =>
                    cell !== ''
            )
        ) {

            rows.push(row);

        }
    }


    return rows;
}


/* =========================================================
   CARI KOLOM GOOGLE SHEET
========================================================= */

function findColumn(
    headers,
    keywords
) {

    return headers.findIndex(
        header => {

            const clean =
                String(header)
                    .toLowerCase()
                    .trim();

            return keywords.some(
                keyword =>
                    clean.includes(
                        keyword
                    )
            );

        }
    );
}


/* =========================================================
   LOAD WISHES
   GOOGLE SHEET → WEBSITE
========================================================= */

async function loadWishes() {

    try {

        console.log(
            '💌 Membaca Google Sheet...'
        );


        /*
         * Tambahkan timestamp supaya browser
         * tidak memakai cache lama.
         */

        const separator =
            CONFIG.googleSheetUrl
                .includes('?')
                ? '&'
                : '?';


        const url =
            CONFIG.googleSheetUrl +
            separator +
            't=' +
            Date.now();


        const response =
            await fetch(
                url,
                {
                    method: 'GET',
                    cache: 'no-store'
                }
            );


        if (!response.ok) {

            throw new Error(
                'HTTP ' +
                response.status
            );

        }


        const csv =
            await response.text();


        console.log(
            'Google Sheet berhasil dibaca.'
        );


        const rows =
            parseCSV(csv);


        console.log(
            'Jumlah baris:',
            rows.length
        );


        if (
            rows.length < 2
        ) {

            console.log(
                'Belum ada RSVP.'
            );

            return;
        }


        /* =================================================
           HEADER
        ================================================= */

        const headers =
            rows[0].map(
                header =>
                    String(header)
                        .toLowerCase()
                        .trim()
            );


        console.log(
            'Header Google Sheet:',
            headers
        );


        /* =================================================
           CARI KOLOM
        ================================================= */

        const nameIndex =
            findColumn(
                headers,
                [
                    'nama',
                    'name'
                ]
            );


        const attendanceIndex =
            findColumn(
                headers,
                [
                    'kehadiran',
                    'attendance',
                    'konfirmasi'
                ]
            );


        const guestsIndex =
            findColumn(
                headers,
                [
                    'jumlah tamu',
                    'jumlah',
                    'guest',
                    'guests'
                ]
            );


        const messageIndex =
            findColumn(
                headers,
                [
                    'ucapan',
                    'pesan',
                    'message',
                    'wishes'
                ]
            );


        console.log(
            'Kolom ditemukan:',
            {
                nameIndex,
                attendanceIndex,
                guestsIndex,
                messageIndex
            }
        );


        /*
         * Kalau nama / ucapan tidak ketemu,
         * tampilkan error jelas di console.
         */

        if (
            nameIndex === -1 ||
            messageIndex === -1
        ) {

            console.error(
                'Kolom Nama atau Ucapan tidak ditemukan.'
            );

            console.log(
                'Header yang terbaca:',
                headers
            );

            return;
        }


        /* =================================================
           BERSIHKAN CARD LAMA
        ================================================= */

        const rsvp =
            document.querySelector(
                '.rsvp'
            );


        if (!rsvp) {

            console.log(
                'Section RSVP tidak ditemukan.'
            );

            return;
        }


        let stage =
            rsvp.querySelector(
                '.rsvp-wish-stage'
            );


        if (!stage) {

            stage =
                document.createElement(
                    'div'
                );

            stage.className =
                'rsvp-wish-stage';

            rsvp.appendChild(stage);

        }


        stage.innerHTML = '';


        /* =================================================
           TAMPILKAN SEMUA UCAPAN
        ================================================= */

        const wishes =
            rows
                .slice(1)
                .map(row => {

                    return {

                        name:
                            row[nameIndex] ||
                            '',

                        attendance:
                            attendanceIndex >= 0
                                ? row[
                                    attendanceIndex
                                ] || ''
                                : '',

                        guests:
                            guestsIndex >= 0
                                ? row[
                                    guestsIndex
                                ] || ''
                                : '',

                        message:
                            row[messageIndex] ||
                            ''

                    };

                })
                .filter(
                    item =>
                        item.name &&
                        item.message
                );


        console.log(
            'Ucapan ditemukan:',
            wishes.length
        );


        /* =================================================
           BUAT CARD SATU PER SATU
        ================================================= */

        wishes.forEach(
            (wish, index) => {

                setTimeout(() => {

                    showWishOnBackground(
                        wish
                    );

                }, index * 250);

            }
        );


    } catch (error) {

        console.error(
            '❌ Gagal membaca Google Sheet:',
            error
        );

    }
}


/* =========================================================
   SHOW WISH ON RSVP BACKGROUND
========================================================= */

function showWishOnBackground(
    data
) {

    const rsvp =
        document.querySelector(
            '.rsvp'
        );


    if (!rsvp) return;


    let stage =
        rsvp.querySelector(
            '.rsvp-wish-stage'
        );


    if (!stage) {

        stage =
            document.createElement(
                'div'
            );

        stage.className =
            'rsvp-wish-stage';

        rsvp.appendChild(stage);

    }


    const card =
        document.createElement(
            'div'
        );


    /* =====================================================
       ANIMASI BERGANTIAN
    ===================================================== */

    const animations = [

        'float-1',
        'float-2',
        'float-3',
        'float-4',
        'float-5',
        'float-6'

    ];


    const animationIndex =
        stage.children.length %
        animations.length;


    card.className =
        `rsvp-floating-wish ${
            animations[
                animationIndex
            ]
        }`;


    /* =====================================================
       POSISI DESKTOP
    ===================================================== */

    const desktopPositions = [

        {
            left: '8%',
            top: '8%'
        },

        {
            left: '72%',
            top: '10%'
        },

        {
            left: '18%',
            top: '35%'
        },

        {
            left: '78%',
            top: '38%'
        },

        {
            left: '5%',
            top: '65%'
        },

        {
            left: '68%',
            top: '70%'
        },

        {
            left: '40%',
            top: '18%'
        },

        {
            left: '45%',
            top: '78%'
        }

    ];


    /* =====================================================
       POSISI MOBILE
    ===================================================== */

    const mobilePositions = [

        {
            left: '4%',
            top: '8%'
        },

        {
            left: '58%',
            top: '12%'
        },

        {
            left: '8%',
            top: '32%'
        },

        {
            left: '60%',
            top: '38%'
        },

        {
            left: '3%',
            top: '62%'
        },

        {
            left: '57%',
            top: '68%'
        }

    ];


    const positions =
        window.innerWidth <= 600
            ? mobilePositions
            : desktopPositions;


    const position =
        positions[
            stage.children.length %
            positions.length
        ];


    card.style.left =
        position.left;

    card.style.top =
        position.top;


    /* =====================================================
       CARD CONTENT
    ===================================================== */

    card.innerHTML = `

        <div class="wish-title">
            WEDDING WISHES ♡
        </div>

        <span class="wish-name">
            ${esc(data.name)}
        </span>

        <p class="wish-message">
            “${esc(data.message)}”
        </p>

        <div class="wish-line"></div>

        <div class="wish-attendance">
            ${esc(data.attendance)}
        </div>

    `;


    stage.appendChild(card);
}


/* =========================================================
   RSVP FORM
   GOOGLE FORM → GOOGLE SHEET
========================================================= */

function rsvp() {

    const form =
        $('#rsvpForm');


    if (!form) return;


    form.addEventListener(
        'submit',
        event => {

            event.preventDefault();


            const button =
                form.querySelector(
                    'button'
                );


            const formData =
                new FormData(form);


            const data = {

                name:
                    formData.get(
                        CONFIG.fields.name
                    ),

                attendance:
                    formData.get(
                        CONFIG.fields.attendance
                    ),

                guests:
                    formData.get(
                        CONFIG.fields.guests
                    ),

                message:
                    formData.get(
                        CONFIG.fields.message
                    )

            };


            /* =================================================
               VALIDASI
            ================================================= */

            if (
                !data.name ||
                !data.message
            ) {

                toast(
                    'Mohon isi nama dan ucapan.'
                );

                return;
            }


            /* =================================================
               BUTTON
            ================================================= */

            if (button) {

                button.disabled = true;

                button.textContent =
                    'MENGIRIM...';

            }


            /* =================================================
               KIRIM KE GOOGLE FORM
            ================================================= */

            const temporaryForm =
                document.createElement(
                    'form'
                );


            temporaryForm.method =
                'POST';


            temporaryForm.target =
                'google-submit-frame';


            temporaryForm.action =
                CONFIG.googleFormAction;


            temporaryForm.style.display =
                'none';


            const fields = {

                [CONFIG.fields.name]:
                    data.name,

                [CONFIG.fields.attendance]:
                    data.attendance,

                [CONFIG.fields.guests]:
                    data.guests,

                [CONFIG.fields.message]:
                    data.message

            };


            Object.entries(
                fields
            ).forEach(
                ([name, value]) => {

                    const input =
                        document.createElement(
                            'input'
                        );

                    input.type =
                        'hidden';

                    input.name =
                        name;

                    input.value =
                        value ?? '';

                    temporaryForm
                        .appendChild(
                            input
                        );

                }
            );


            document.body
                .appendChild(
                    temporaryForm
                );


            temporaryForm.submit();


            temporaryForm.remove();


            /* =================================================
               TAMPILKAN LANGSUNG
               TANPA MENUNGGU REFRESH
            ================================================= */

            showWishOnBackground(
                data
            );


            form.reset();


            toast(
                'Ucapan berhasil dikirim.'
            );


            /* =================================================
               RESET BUTTON
            ================================================= */

            setTimeout(() => {

                if (button) {

                    button.disabled =
                        false;

                    button.textContent =
                        'KIRIM UCAPAN';

                }

            }, 1200);

        }
    );
}


/* =========================================================
   HOME PHOTO SLIDESHOW
========================================================= */

function homePhotoSlideshow() {

    const homeSlides =
        $$('.home-photo-slide');


    if (
        !homeSlides.length
    ) {
        return;
    }


    let currentSlide = 0;

    const slideDuration =
        5000;


    /* Foto pertama */

    homeSlides.forEach(
        (slide, index) => {

            slide.classList.toggle(
                'active',
                index === 0
            );

        }
    );


    /* Ambil URL */

    function getImageUrl(slide) {

        const bg =
            slide.style
                .backgroundImage;


        if (!bg) return null;


        const match =
            bg.match(
                /url\(\s*['"]?(.*?)['"]?\s*\)/
            );


        return match
            ? match[1]
            : null;
    }


    /* Preload berikutnya */

    function preloadNext() {

        const nextIndex =
            (
                currentSlide + 1
            ) %
            homeSlides.length;


        const url =
            getImageUrl(
                homeSlides[
                    nextIndex
                ]
            );


        if (!url) return;


        const img =
            new Image();


        img.decoding =
            'async';


        img.src =
            url;
    }


    requestAnimationFrame(
        () => {

            setTimeout(
                preloadNext,
                300
            );

        }
    );


    /* Slideshow */

    function showNextHomeSlide() {

        const oldSlide =
            homeSlides[
                currentSlide
            ];


        currentSlide++;


        if (
            currentSlide >=
            homeSlides.length
        ) {

            currentSlide = 0;

        }


        const newSlide =
            homeSlides[
                currentSlide
            ];


        oldSlide
            .classList
            .remove('active');


        newSlide
            .classList
            .add('active');


        preloadNext();
    }


    setInterval(
        showNextHomeSlide,
        slideDuration
    );
}


/* =========================================================
   INITIALIZATION
========================================================= */

window.addEventListener(
    'load',
    () => {

        /* Guest */

        guest();


        /* Slideshow */

        slides();


        /* Countdown */

        countdown();


        /* Reveal */

        reveal();


        /* Open invitation */

        openInvitation();


        /* Music */

        music();


        /* Copy */

        copy();


        /* RSVP */

        rsvp();


        /*
         * PENTING:
         * Ambil semua ucapan dari Google Sheet
         */

        loadWishes();


        /* Home slideshow */

        homePhotoSlideshow();


        /* Loader */

        setTimeout(() => {

            $('#loader')
                ?.classList
                .add('hide');

        }, 450);

    }
);

/* =========================================================
   MOBILE PERFORMANCE MODE
   Tidak mengubah desktop
========================================================= */

(function () {

    const isMobile =
        window.matchMedia('(max-width: 768px)').matches;

    if (!isMobile) return;


    /* =====================================================
       1. DETEKSI HP LEMAH
    ===================================================== */

    const cores =
        navigator.hardwareConcurrency || 4;

    const memory =
        navigator.deviceMemory || 4;

    const slowDevice =
        cores <= 4 || memory <= 4;


    document.documentElement.classList.add('mobile-device');

    if (slowDevice) {
        document.documentElement.classList.add('low-power-device');
    }


    /* =====================================================
       2. JANGAN JALANKAN ANIMASI BERAT SAAT SCROLL
    ===================================================== */

    let scrollTimer;

    window.addEventListener(
        'scroll',
        function () {

            document.documentElement.classList.add(
                'is-scrolling'
            );

            clearTimeout(scrollTimer);

            scrollTimer = setTimeout(() => {

                document.documentElement.classList.remove(
                    'is-scrolling'
                );

            }, 180);

        },
        {
            passive: true
        }
    );


    /* =====================================================
       3. PAUSE ANIMASI SAAT SCROLL
    ===================================================== */

    const style = document.createElement('style');

    style.textContent = `

        @media (max-width: 768px) {

            html.is-scrolling
            .rsvp-floating-wish {

                animation-play-state:
                    paused !important;
            }


            html.is-scrolling
            .closing-heart {

                animation-play-state:
                    paused !important;
            }


            html.is-scrolling
            .closing-background-image {

                animation-play-state:
                    paused !important;
            }


            html.is-scrolling
            .event-background-image {

                animation-play-state:
                    paused !important;
            }


            html.low-power-device
            .rsvp-floating-wish {

                animation-duration:
                    45s !important;
            }


            html.low-power-device
            .closing-background-image {

                animation-duration:
                    50s !important;
            }


            html.low-power-device
            .event-background-image {

                animation-duration:
                    50s !important;
            }

        }

    `;

    document.head.appendChild(style);


    /* =====================================================
       4. BATASI RSVP WISH YANG TAMPIL
    ===================================================== */

    function limitWishes() {

        const stage =
            document.querySelector(
                '.rsvp-wish-stage'
            );

        if (!stage) return;

        const wishes =
            stage.querySelectorAll(
                '.rsvp-floating-wish'
            );

        const max =
            slowDevice ? 5 : 7;

        wishes.forEach((wish, index) => {

            if (index >= max) {

                wish.remove();

            }

        });

    }


    /* =====================================================
       5. OBSERVER UNTUK RSVP
    ===================================================== */

    const wishObserver =
        new MutationObserver(() => {

            limitWishes();

        });


    const startWishObserver = () => {

        const stage =
            document.querySelector(
                '.rsvp-wish-stage'
            );

        if (!stage) {

            setTimeout(
                startWishObserver,
                1000
            );

            return;
        }

        wishObserver.observe(
            stage,
            {
                childList: true
            }
        );

        limitWishes();
    };


    startWishObserver();


    /* =====================================================
       6. PAUSE ANIMASI SECTION YANG JAUH
    ===================================================== */

    const sections =
        document.querySelectorAll(
            '.closing, .wedding-event, .rsvp'
        );


    if ('IntersectionObserver' in window) {

        const sectionObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        const section =
                            entry.target;

                        if (entry.isIntersecting) {

                            section.classList.remove(
                                'section-hidden'
                            );

                        } else {

                            section.classList.add(
                                'section-hidden'
                            );

                        }

                    });

                },
                {
                    rootMargin:
                        '150px 0px'
                }
            );


        sections.forEach(section => {

            sectionObserver.observe(
                section
            );

        });

    }


    /* =====================================================
       7. LAZY LOAD IMAGE
    ===================================================== */

    const images =
        document.querySelectorAll(
            'img'
        );


    images.forEach(img => {

        if (!img.hasAttribute('loading')) {

            img.setAttribute(
                'loading',
                'lazy'
            );

        }

        if (!img.hasAttribute('decoding')) {

            img.setAttribute(
                'decoding',
                'async'
            );

        }

    });


    /* =====================================================
       8. JANGAN LAZY LOAD FOTO PERTAMA
    ===================================================== */

    const firstImages =
        document.querySelectorAll(
            '.hero img, .cover img, .couple img'
        );


    firstImages.forEach(img => {

        img.setAttribute(
            'loading',
            'eager'
        );

    });


    /* =====================================================
       9. LOW POWER DEVICE
    ===================================================== */

    if (slowDevice) {

        document.documentElement.classList.add(
            'very-light-mode'
        );

    }

})();
