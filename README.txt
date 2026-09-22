WEDDING ANYAN — RANDY & ROSIDA INSPIRED BUILD

1. Upload the entire folder to Cloudflare Pages / static hosting.
2. Open with a URL such as:
   https://domain.com/?to=Keluarga%20Cemara%F0%9F%92%96
3. The cover reads the guest from ?to= and keeps the guest name on the cover.
4. Replace the placeholder images in assets/images with your own files. The JS arrays in assets/js/script.js define which images are used by each slideshow.
5. Groom and Bride use automatic crossfade slideshows.
6. Each Wedding Event has its own automatic full-background photo slideshow with a dark overlay, matching the reference interaction.
7. Gallery continues to use the existing Google Apps Script JSONP endpoint from the original project.
8. RSVP submits to the existing Google Form using POST + hidden iframe, so guests stay on the invitation page. New wishes are immediately shown and local statistics update.
9. The Apps Script folder is optional for reading historical Sheet data. It is a template because the exact Sheet column names are owned by your Google Sheet.
10. Add your MP3 as assets/music/Beautiful In White.mp3 if you want autoplay-after-open/music button support.

Google Form fields retained from the original project:
- name: entry.290774784
- attendance: entry.1318967976
- guests: entry.2054287845
- message: entry.692446568

The visual design recreates the structural patterns visible in the reference: full-photo cover, personalized guest + open button, centered invitation card on desktop, portrait groom/bride slideshows, photo-background event cards, floating music control, gallery, gift, RSVP and wishes.
