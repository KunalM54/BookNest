export const scrollToTop = () => {
  setTimeout(() => {
    const container = document.querySelector('.main-content') || document.querySelector('main');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, 0);
};
