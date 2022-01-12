const footerCopyright = document.getElementsByClassName('js-date');
const date = new Date();

if (footerCopyright.length && !footerCopyright[0].parentElement.innerText.includes(date.getFullYear())) footerCopyright[0].innerText = ` - ${date.getFullYear()}`;