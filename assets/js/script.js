/* =========================================================
   CONFIGURATION
========================================================= */

const CONFIG = {
    weddingDate: '2026-12-29T09:00:00+07:00',

    googleFormAction:
        'https://docs.google.com/forms/d/e/1FAIpQLSewrQIrtwg6Lvj3WRjoi0RL0x5rkvQmG5iFZiww0z3lSnv_aQ/formResponse',

    fields: {
        name: 'entry.290774784',
        attendance: 'entry.1318967976',
        guests: 'entry.2054287845',
        message: 'entry.692446568'
    },

    slides: {
        cover: [
            'assets/images/25.jpg',
            'assets/images/24.jpg',
            'assets/images/21.jpg',
            'assets/images/20.jpg',
            'assets/images/30.jpg'
        ],

        groom: [
            'assets/images/01.jpg',
            'assets/images/02.jpg',
            'assets/images/03.jpg',
            'assets/images/06.jpg',
            'assets/images/09.jpg'
        ],

        bride: [
            'assets/images/10.jpg',
            'assets/images/11.jpg',
            'assets/images/12.jpg',
            'assets/images/13.jpg'
        ],

        event: [
            'assets/images/30.jpg',
            'assets/images/31.jpg',
            'assets/images/33.jpg',
            'assets/images/29.jpg'
        ],

        event2: [
            'assets/images/22.jpg',
            'assets/images/23.jpg',
            'assets/images/24.jpg',
            'assets/images/25.jpg'
        ]
    }
};


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = selector => document.querySelector(selector);

const $$ = selector => [
    ...document.querySelectorAll(selector)
];


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
    const params = new URLSearchParams(location.search);

    let name =
        params.get('to') ||
        params.get('guest') ||
        'Tamu Undangan';

    try {
        name = decodeURIComponent(name);
    } catch {
        // Gunakan nama asli jika decoding gagal
    }

    const guestName = $('#guestName');

    if (!guestName) return;

    guestName.textContent = name.replaceAll('+', ' ');
}


/* =========================================================
   GENERIC SLIDESHOW
   Untuk Cover & Event
========================================================= */

function makeSlides(element, urls, className, interval) {

    if (!element || !urls?.length) return;

    element.innerHTML = urls
        .map(url => `
            <div
                class="${className}"
                style="background-image:url('${url}')">
            </div>
        `)
        .join('');

    const slideItems = [...element.children];

    if (!slideItems.length) return;

    let currentIndex = 0;

    slideItems[0].classList.add('active');

    setInterval(() => {

        slideItems[currentIndex].classList.remove('active');

        currentIndex++;

        if (currentIndex >= slideItems.length) {
            currentIndex = 0;
        }

        slideItems[currentIndex].classList.add('active');

    }, interval);
}


/* =========================================================
   COUPLE SLIDESHOW
   Efek seperti foto berjalan / kereta
   Semua foto bergerak dari KIRI → KANAN
========================================================= */

function makeCoupleSlides(element, urls, interval) {

    if (!element || !urls?.length) return;

    element.innerHTML = urls
        .map((url, index) => `
            <div
                class="portrait-slide ${index === 0 ? 'active' : ''}"
                style="background-image: url('${url}')">
            </div>
        `)
        .join('');

    const slideItems = [...element.children];

    if (!slideItems.length) return;

    let currentIndex = 0;


    function showNextSlide() {

        const currentSlide = slideItems[currentIndex];

        currentIndex++;

        if (currentIndex >= slideItems.length) {
            currentIndex = 0;
        }

        const nextSlide = slideItems[currentIndex];


        /*
           Foto sekarang bergerak ke kanan
        */
        currentSlide.classList.remove('active');
        currentSlide.classList.add('slide-right');


        /*
           Foto berikutnya masuk dari kiri
        */
        nextSlide.classList.add('next-slide');

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                nextSlide.classList.remove('next-slide');
                nextSlide.classList.add('active');

            });

        });


        /*
           Bersihkan posisi foto lama
        */
        setTimeout(() => {

            currentSlide.classList.remove('slide-right');

        }, 1300);
    }


    setInterval(showNextSlide, interval);
}


/* =========================================================
   INITIALIZE ALL SLIDESHOWS
========================================================= */

function slides() {

    /*
       COVER
    */
    makeSlides(
        $('.cover-slides'),
        CONFIG.slides.cover,
        'slide',
        5200
    );


    /*
       COUPLE
       Anyan + Mela
       Keduanya bergerak ke kanan
    */
    $$('[data-slideshow="groom"]').forEach(element => {

        makeCoupleSlides(
            element,
            CONFIG.slides.groom,
            4000
        );

    });


    $$('[data-slideshow="bride"]').forEach(element => {

        makeCoupleSlides(
            element,
            CONFIG.slides.bride,
            4000
        );

    });


    /*
       EVENT
    */
    $$('[data-slideshow="event"]').forEach(element => {

        makeSlides(
            element,
            CONFIG.slides.event,
            'event-bg-slide',
            5200
        );

    });


    /*
       EVENT 2
    */
    $$('[data-slideshow="event2"]').forEach(element => {

        makeSlides(
            element,
            CONFIG.slides.event2,
            'event-bg-slide',
            5200
        );

    });
}


/* =========================================================
   COUNTDOWN
========================================================= */

function countdown() {

    const target =
        new Date(CONFIG.weddingDate).getTime();

    function tick() {

        const remaining =
            Math.max(0, target - Date.now());

        const values = [
            Math.floor(remaining / 86400000),
            Math.floor(remaining / 3600000) % 24,
            Math.floor(remaining / 60000) % 60,
            Math.floor(remaining / 1000) % 60
        ];

        ['days', 'hours', 'minutes', 'seconds']
            .forEach((id, index) => {

                const element = $('#' + id);

                if (!element) return;

                element.textContent =
                    String(values[index]).padStart(2, '0');

            });
    }

    tick();

    setInterval(tick, 1000);
}


/* =========================================================
   REVEAL ANIMATION
========================================================= */

function reveal() {

    const elements = $$('.reveal');

    if (!('IntersectionObserver' in window)) {

        elements.forEach(element => {
            element.classList.add('visible');
        });

        return;
    }

    const observer = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                entry.target.classList.add('visible');

                observer.unobserve(entry.target);

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
   OPEN INVITATION + AUTO PLAY MUSIC
========================================================= */

function openInvitation() {

    const btn = $('#openBtn');
    const music = $('#music');
    const musicBtn = $('#musicBtn');

    if (!btn) return;

    btn.addEventListener('click', async () => {

        // Buka undangan
        $('#cover')?.classList.add('open');

        document.body.classList.remove('locked');

        // Putar musik setelah klik pengguna
        if (music) {

            try {

                await music.play();

                musicBtn?.classList.add('playing');

            } catch (error) {

                console.log('Musik belum bisa diputar:', error);

                musicBtn?.classList.remove('playing');

            }

        }

        // Ubah URL ke bagian home
        history.replaceState(null, '', '#home');

        // Scroll ke home
        setTimeout(() => {

            document.querySelector('#home')
                ?.scrollIntoView({
                    behavior: 'smooth'
                });

        }, 250);

    });

}


/* =========================================================
   MUSIC
========================================================= */

function music() {

    const musicElement = $('#music');
    const musicButton = $('#musicBtn');

    if (!musicElement || !musicButton) return;

    musicButton.onclick = async () => {

        try {

            if (musicElement.paused) {

                await musicElement.play();

                musicButton.classList.add('playing');

            } else {

                musicElement.pause();

                musicButton.classList.remove('playing');

            }

        } catch {

            toast(
                'Tambahkan MP3 di assets/music/Beautiful In White.mp3'
            );
        }
    };
}


/* =========================================================
   COPY BUTTON
========================================================= */

function copy() {

    $$('[data-copy]').forEach(button => {

        button.onclick = async () => {

            try {

                await navigator.clipboard.writeText(
                    button.dataset.copy
                );

                toast('Berhasil disalin.');

            } catch {

                toast('Gagal menyalin.');
            }
        };
    });
}


/* =========================================================
   RSVP STATISTICS
========================================================= */

const stats = {
    Hadir: 0,
    'Tidak Hadir': 0,
    'Masih Ragu': 0
};


function statsRender() {

    const items = [
        ['Hadir', '#countHadir'],
        ['Tidak Hadir', '#countTidak'],
        ['Masih Ragu', '#countRagu']
    ];

    items.forEach(([key, selector]) => {

        const element = $(selector);

        if (!element) return;

        element.textContent = stats[key] || 0;
    });


    const commentCount = $('#commentCount');

    if (commentCount) {
        commentCount.textContent =
            $$('#wishesList .wish').length;
    }
}


/* =========================================================
   ADD WISH
========================================================= */

function addWish(data) {

    const list = $('#wishesList');

    if (!list) return;

    list.querySelector('.empty')?.remove();


    const article =
        document.createElement('article');

    article.className = 'wish';

    article.innerHTML = `
        <div class="wish-top">
            <span class="wish-name">
                ${esc(data.name)}
            </span>

            <span class="wish-meta">
                ${esc(data.attendance)}
            </span>
        </div>

        <p class="wish-message">
            ${esc(data.message)}
        </p>
    `;


    list.prepend(article);


    stats[data.attendance] =
        (stats[data.attendance] || 0) + 1;

    statsRender();
}


/* =========================================================
   RSVP FORM
========================================================= */

function rsvp() {

    const form = $('#rsvpForm');

    if (!form) return;

    form.addEventListener('submit', event => {

        event.preventDefault();


        const button =
            form.querySelector('button');

        const formData =
            new FormData(form);


        const data = {

            name:
                formData.get(CONFIG.fields.name),

            attendance:
                formData.get(CONFIG.fields.attendance),

            guests:
                formData.get(CONFIG.fields.guests),

            message:
                formData.get(CONFIG.fields.message)

        };


        if (!data.name || !data.message) {

            toast(
                'Mohon isi nama dan ucapan.'
            );

            return;
        }


        button.disabled = true;
        button.textContent = 'MENGIRIM...';


        const temporaryForm =
            document.createElement('form');

        temporaryForm.method = 'POST';

        temporaryForm.target =
            'google-submit-frame';

        temporaryForm.action =
            CONFIG.googleFormAction;

        temporaryForm.style.display = 'none';


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


        Object.entries(fields).forEach(
            ([name, value]) => {

                const input =
                    document.createElement('input');

                input.name = name;
                input.value = value ?? '';

                temporaryForm.appendChild(input);
            }
        );


        document.body.appendChild(
            temporaryForm
        );

        temporaryForm.submit();

        temporaryForm.remove();


        /*
           Tampilkan ucapan di halaman
        */
        addWish(data);

        form.reset();

        $('#thanks')?.classList.add('show');

        toast(
            'Ucapan berhasil dikirim.'
        );


        setTimeout(() => {

            button.disabled = false;
            button.textContent =
                'KIRIM UCAPAN';

        }, 1000);
    });
}


/* =========================================================
   INITIALIZATION
========================================================= */

window.addEventListener('load', () => {

    guest();

    slides();

    countdown();

    reveal();

    openInvitation();

    music();

    copy();

    rsvp();

    statsRender();


    setTimeout(() => {

        $('#loader')?.classList.add('hide');

    }, 450);
});


/* =========================================================
   HOME PHOTO SLIDESHOW
   FAST LOAD + LAZY PRELOAD
========================================================= */

document.addEventListener('DOMContentLoaded', () => {

    const homeSlides = $$('.home-photo-slide');

    if (!homeSlides.length) return;

    let currentSlide = 0;

    const slideDuration = 5000;

    /* -----------------------------------------------------
       Pastikan foto pertama langsung tampil
    ----------------------------------------------------- */

    homeSlides.forEach((slide, index) => {
        slide.classList.toggle('active', index === 0);
    });


    /* -----------------------------------------------------
       Ambil URL background image
    ----------------------------------------------------- */

    function getImageUrl(slide) {

        const bg = slide.style.backgroundImage;

        if (!bg) return null;

        const match = bg.match(/url\(["']?(.*?)["']?\)/);

        return match ? match[1] : null;
    }


    /* -----------------------------------------------------
       Preload satu foto berikutnya saja
       Tidak load semua foto sekaligus
    ----------------------------------------------------- */

    function preloadNext() {

        const nextIndex =
            (currentSlide + 1) % homeSlides.length;

        const url =
            getImageUrl(homeSlides[nextIndex]);

        if (!url) return;

        const img = new Image();

        img.decoding = 'async';

        img.src = url;
    }


    /* -----------------------------------------------------
       Preload foto kedua setelah halaman tampil
    ----------------------------------------------------- */

    requestAnimationFrame(() => {
        setTimeout(preloadNext, 300);
    });


    /* -----------------------------------------------------
       Slideshow
    ----------------------------------------------------- */

    function showNextHomeSlide() {

        const oldSlide =
            homeSlides[currentSlide];

        currentSlide++;

        if (currentSlide >= homeSlides.length) {
            currentSlide = 0;
        }

        const newSlide =
            homeSlides[currentSlide];


        oldSlide.classList.remove('active');

        newSlide.classList.add('active');


        /* preload foto berikutnya */

        preloadNext();
    }


    setInterval(
        showNextHomeSlide,
        slideDuration
    );

});

function music() {

    const m = document.getElementById('music');
    const b = document.getElementById('musicBtn');

    if (!m) return;

    m.volume = 0.7;

    const tryPlay = () => {
        m.play()
            .then(() => {
                b?.classList.add('playing');
                console.log('MUSIC PLAYING');
            })
            .catch(err => {
                console.log('Autoplay diblokir browser:', err);
            });
    };

    // Coba langsung
    tryPlay();

    // Kalau browser memblokir, coba setelah interaksi
    ['click', 'touchstart', 'pointerdown'].forEach(event => {
        document.addEventListener(event, tryPlay, {
            once: true,
            passive: true
        });
    });

    if (b) {
        b.onclick = () => {
            if (m.paused) {
                m.play();
            } else {
                m.pause();
            }
        };
    }
}