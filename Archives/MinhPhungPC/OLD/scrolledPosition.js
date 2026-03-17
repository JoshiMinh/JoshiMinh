window.addEventListener('beforeunload', () => localStorage.setItem('scrollPosition', window.scrollY));
window.addEventListener('load', () => {
    const pos = localStorage.getItem('scrollPosition');
    if (pos) { window.scrollTo(0, pos); localStorage.removeItem('scrollPosition'); }
});