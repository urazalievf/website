document.addEventListener('DOMContentLoaded', () => {
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('header').innerHTML = data;
            setupNavigation();
        });

    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('footer').innerHTML = data;
        });

    function setupNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        const dropdown = document.querySelector('.dropdown');

        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        navLinks.addEventListener('click', (event) => {
            if (event.target.closest('li').querySelector('.dropdown')) {
                dropdown.classList.toggle('show');
            }
        });
    }
});