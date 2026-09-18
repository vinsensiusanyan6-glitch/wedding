document.addEventListener("DOMContentLoaded", () => {
  const slots = ["groom","bride","photo01","photo02","photo03","photo04","photo05","photo06"];

  function key(slot){ return "wedding_photo_" + slot; }

  function loadSlot(card) {
    const slot = card.dataset.slot;
    const img = card.querySelector(".manage-photo img");
    const placeholder = card.querySelector(".manage-placeholder");
    const saved = localStorage.getItem(key(slot));

    if (saved) {
      img.src = saved;
      img.style.display = "block";
      placeholder.style.display = "none";
    } else {
      img.removeAttribute("src");
      img.style.display = "none";
      placeholder.style.display = "grid";
    }
  }

  function status(card, message) {
    const el = card.querySelector(".card-status");
    if (el) el.textContent = message;
    setTimeout(() => { if (el) el.textContent = ""; }, 2500);
  }

  document.querySelectorAll(".manage-card").forEach(card => {
    const input = card.querySelector('input[type="file"]');
    const upload = card.querySelector(".manage-upload");
    const remove = card.querySelector(".delete-btn");

    loadSlot(card);

    if (upload && input) {
      upload.addEventListener("click", e => {
        if (e.target !== input) input.click();
      });

      input.addEventListener("change", () => {
        const file = input.files && input.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
          status(card, "File harus berupa gambar.");
          input.value = "";
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          localStorage.setItem(key(card.dataset.slot), reader.result);
          loadSlot(card);
          status(card, "Foto tersimpan di browser.");
        };
        reader.readAsDataURL(file);
      });
    }

    if (remove) {
      remove.addEventListener("click", () => {
        localStorage.removeItem(key(card.dataset.slot));
        loadSlot(card);
        status(card, "Foto dihapus.");
      });
    }
  });
});