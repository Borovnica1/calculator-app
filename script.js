const themeSlider = document.querySelector('.themes__slider');
const body = document.querySelector('body');

console.log('XXX', themeSlider);

themeSlider.addEventListener('input', function changeTheme() {
  console.log('IDEMOO', this.value);
  ['theme-1', 'theme-2', 'theme-3'].forEach(c => body.classList.remove(c));
  body.classList.add(`theme-${this.value}`)
});