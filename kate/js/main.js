// Модалка для карток
const modal = document.getElementById('cardModal');
const modalImg = modal.querySelector('.modal__img');
const modalTitle = modal.querySelector('#modalTitle');
const modalDesc = modal.querySelector('#modalDesc');
const overlay = modal.querySelector('[data-close-modal]');
const closeBtns = modal.querySelectorAll('[data-close-modal], .modal__close');

let lastFocusedBtn = null;

function openModal({
    imgSrc,
    imgAlt,
    title,
    desc
}) {
    modalImg.src = imgSrc || '';
    modalImg.alt = imgAlt || title || 'Image';
    modalTitle.textContent = title || '';
    modalDesc.textContent = desc || '';

    modal.hidden = false;
    document.body.classList.add('no-scroll');

    const closeBtn = modal.querySelector('.modal__close');
    setTimeout(() => closeBtn.focus(), 0);

    document.addEventListener('keydown', onKeydown);
}

function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', onKeydown);

    if (lastFocusedBtn && lastFocusedBtn.focus) {
        lastFocusedBtn.focus();
    }
}

function onKeydown(e) {
    if (e.key === 'Escape') closeModal();

    // focus trap
    if (e.key === 'Tab') {
        const focusable = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    }
}

// Закриття
overlay.addEventListener('click', closeModal);
closeBtns.forEach(btn => btn.addEventListener('click', closeModal));

// Відкриття з кнопок "Детальніше"
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.card-btn');
    if (!btn) return;

    const card = btn.closest('.card');
    if (!card) return;

    const img = card.querySelector('img');
    const titleEl = card.querySelector('h3');
    const descEl = card.querySelector('p');

    lastFocusedBtn = btn;

    openModal({
        imgSrc: img ? img.getAttribute('src') : '',
        imgAlt: img ? img.getAttribute('alt') : '',
        title: titleEl ? titleEl.textContent.trim() : '',
        desc: descEl ? descEl.textContent.trim() : ''
    });
});