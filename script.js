(() => {
  'use strict';

  const pages = [...document.querySelectorAll('.story-page')];
  const dots = [...document.querySelectorAll('.dot')];
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressFill = document.getElementById('progressFill');
  const stepName = document.getElementById('stepName');
  const stepCount = document.getElementById('stepCount');
  const toast = document.getElementById('toast');
  let currentPage = 0;
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
  }

  function showPage(index) {
    currentPage = Math.max(0, Math.min(pages.length - 1, index));
    pages.forEach((page, i) => page.classList.toggle('active', i === currentPage));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentPage));
    stepName.textContent = pages[currentPage].dataset.title || 'Anı';
    stepCount.textContent = `${currentPage + 1} / ${pages.length}`;
    progressFill.style.width = `${((currentPage + 1) / pages.length) * 100}%`;
    prevBtn.disabled = currentPage === 0;
    nextBtn.innerHTML = currentPage === pages.length - 1 ? 'Başa dön <span>↺</span>' : 'Devam et <span>→</span>';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentPage === pages.length - 1) popConfetti(24);
  }

  // Static photos: add/replace the named files in the assets folder.
  // No upload controls, browser storage, or automatic photo rotation are used.
  document.querySelectorAll('img.static-photo').forEach((img) => {
    const placeholder = document.getElementById(img.dataset.placeholder);
    const showPlaceholder = () => {
      img.classList.remove('is-loaded');
      if (placeholder) placeholder.classList.remove('hidden');
    };
    const showImage = () => {
      img.classList.add('is-loaded');
      if (placeholder) placeholder.classList.add('hidden');
    };
    img.addEventListener('load', showImage);
    img.addEventListener('error', showPlaceholder);
    if (img.complete && img.naturalWidth > 0) showImage();
  });

  document.getElementById('startBtn').addEventListener('click', () => showPage(1));
  nextBtn.addEventListener('click', () => showPage(currentPage === pages.length - 1 ? 0 : currentPage + 1));
  prevBtn.addEventListener('click', () => showPage(currentPage - 1));
  dots.forEach(dot => dot.addEventListener('click', () => showPage(Number(dot.dataset.go))));
  document.getElementById('brandHome').addEventListener('click', event => { event.preventDefault(); showPage(0); });
  document.getElementById('restartBtn').addEventListener('click', () => showPage(0));

  // Secret note reveal.
  const revealSecretBtn = document.getElementById('revealSecretBtn');
  const secretNote = document.getElementById('secretNote');
  revealSecretBtn.addEventListener('click', () => {
    const isHidden = secretNote.classList.toggle('hidden');
    revealSecretBtn.textContent = isHidden ? 'Gizli mesajı aç 🔐' : 'Mesajı sakla ♡';
    document.getElementById('secretEnvelope').classList.toggle('hidden', !isHidden);
  });

  // Birthday letter.
  const openLetterBtn = document.getElementById('openLetterBtn');
  const birthdayLetter = document.getElementById('birthdayLetter');
  openLetterBtn.addEventListener('click', () => {
    const willOpen = birthdayLetter.classList.contains('hidden');
    birthdayLetter.classList.toggle('hidden', !willOpen);
    document.getElementById('letterClosed').classList.toggle('hidden', willOpen);
    openLetterBtn.textContent = willOpen ? 'Mektubu kapat' : 'Zarfı aç';
  });

  // Countdown to the next occurrence of the selected birthday.
  const birthdayDate = document.getElementById('birthdayDate');
  const countdownResult = document.getElementById('countdownResult');
  let countdownTimer;

  function getNextBirthday(month, day, now) {
    let year = now.getFullYear();
    let target = new Date(year, month, day, 0, 0, 0, 0);
    if (target <= now) target = new Date(year + 1, month, day, 0, 0, 0, 0);
    return target;
  }

  function updateCountdown() {
    if (!birthdayDate.value) {
      countdownResult.textContent = 'Doğum günü tarihini seçince geri sayım burada görünecek. ♡';
      return;
    }
    const [year, month, day] = birthdayDate.value.split('-').map(Number);
    if (!year || !month || !day) return;
    const now = new Date();
    if (now.getMonth() === month - 1 && now.getDate() === day) {
      countdownResult.textContent = 'BUGÜN EMİNE’NİN GÜNÜ! İYİ Kİ DOĞDUN! 🎂💙';
      return;
    }
    const target = getNextBirthday(month - 1, day, now);
    const diff = Math.max(0, target.getTime() - now.getTime());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    countdownResult.textContent = `${days} gün • ${hours} saat • ${minutes} dakika • ${seconds} saniye kaldı 💙`;
  }

  birthdayDate.addEventListener('change', () => {
    updateCountdown();
    clearInterval(countdownTimer);
    countdownTimer = setInterval(updateCountdown, 1000);
  });

  // Celebration confetti and floating hearts.
  function popConfetti(amount = 45) {
    const layer = document.getElementById('confettiLayer');
    if (!layer) return;
    layer.innerHTML = '';
    for (let i = 0; i < amount; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.animationDelay = `${Math.random() * .8}s`;
      piece.style.animationDuration = `${2 + Math.random() * 1.7}s`;
      piece.style.transform = `rotate(${Math.random() * 180}deg)`;
      layer.appendChild(piece);
    }
    setTimeout(() => { layer.innerHTML = ''; }, 5000);
  }

  document.getElementById('celebrateBtn').addEventListener('click', () => {
    popConfetti(75);
    showToast('İYİ Kİ DOĞDUN EMİNE! 🎂💙');
  });

  showPage(0);
})();
