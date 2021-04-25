
const THEME_INPUT = document.querySelector('#theme-checkbox-input');

THEME_INPUT.addEventListener('change', () => {
    if(THEME_INPUT.checked){
        document.body.classList.replace('light', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.replace('dark', 'light');
        localStorage.setItem('theme', 'light');
    }
})


//init theme from storage
const theme = localStorage.getItem('theme') || 'light';
THEME_INPUT.checked = theme === 'dark';
document.body.classList.replace('light', theme);