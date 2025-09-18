// Модалка для карток
const modal = document.getElementById('cardModal');
const modalImg = modal.querySelector('.modal__img');
const modalTitle = modal.querySelector('#modalTitle');
const modalDesc = modal.querySelector('#modalDesc');
const overlay = modal.querySelector('[data-close-modal]');
const closeBtns = modal.querySelectorAll('[data-close-modal], .modal__close');

let lastFocusedBtn = null;


// ДОДАНО: підтримка innerHTML і опційної CTA-кнопки
function openModal({
    imgSrc,
    imgAlt,
    title,
    descText,
    descHTML
}) {
    const isImageOnly = (!title && !descText && !descHTML);
    // Клас для CSS-режиму лайтбокса
    modal.classList.toggle('modal--image-only', isImageOnly);

    modalImg.src = imgSrc || '';
    modalImg.alt = imgAlt || '';

    // Title
    if (title) {
        modalTitle.textContent = title;
        modalTitle.style.display = '';
    } else {
        modalTitle.textContent = '';
        modalTitle.style.display = 'none';
    }

    // Desc
    if (descHTML) {
        modalDesc.innerHTML = descHTML;
        modalDesc.style.display = '';
    } else if (descText) {
        modalDesc.textContent = descText;
        modalDesc.style.display = '';
    } else {
        modalDesc.innerHTML = '';
        modalDesc.style.display = 'none';
    }

    modal.hidden = false;
    document.body.classList.add('no-scroll');
    setTimeout(() => modal.querySelector('.modal__close').focus(), 0);
    document.addEventListener('keydown', onKeydown);
}

function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('no-scroll');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocusedBtn && lastFocusedBtn.focus) lastFocusedBtn.focus();
}

function onKeydown(e) {
    if (e.key === 'Escape') return closeModal();
    if (e.key === 'Tab') {
        const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
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

// Відкриття
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.card-btn');
    if (!btn) return;

    const card = btn.closest('.card');
    if (!card) return;

    lastFocusedBtn = btn;

    const ds = btn.dataset;
    const onlyImg = (ds.onlyimg === 'true' || ds.onlyimg === '1' || ds.onlyimg === '');

    let title = ds.title || '';
    let imgSrc = ds.img || '';
    let descText = ds.desc || '';
    let descHTML = '';

    // Якщо вказано data-template і ми НЕ в режимі onlyImg — беремо HTML із шаблону
    if (!onlyImg && ds.template) {
        const tpl = document.getElementById(ds.template);
        if (tpl) descHTML = tpl.innerHTML.trim();
    }

    // Якщо режим onlyImg → ВІДКЛЮЧАЄМО фолбеки з картки
    if (!onlyImg) {
        if (!title) {
            const t = card.querySelector('h3');
            title = t ? t.textContent.trim() : '';
        }
        if (!imgSrc) {
            const img = card.querySelector('img');
            imgSrc = img ? img.getAttribute('src') : '';
        }
        if (!descText && !descHTML) {
            const p = card.querySelector('p');
            descText = p ? p.textContent.trim() : '';
        }
    } else {
        // режим тільки картинка: якщо шлях не заданий у data-img — беремо з img картки
        if (!imgSrc) {
            const img = card.querySelector('img');
            imgSrc = img ? img.getAttribute('src') : '';
        }
        title = '';
        descText = '';
        descHTML = '';
    }

    openModal({
        imgSrc,
        imgAlt: title, // або пусто, якщо хочеш
        title,
        descText,
        descHTML
    });
});