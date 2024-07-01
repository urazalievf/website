// Add any JavaScript functionality if needed

document.addEventListener('DOMContentLoaded', function () {
    const icon = document.getElementById('time-icon');
    const hours = new Date().getHours();

    if (hours >= 6 && hours < 18) {
        // Daytime: 6 AM to 6 PM
        icon.src = 'assets/daytime-icon.png';
        icon.alt = 'Daytime Icon';
    } else {
        // Nighttime: 6 PM to 6 AM
        icon.src = 'assets/nighttime-icon.png';
        icon.alt = 'Nighttime Icon';
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Contact form submission
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const formData = new FormData(form);
        const data = {
            'entry.1668657256': formData.get('name'),
            'entry.73016882': formData.get('email'),
            'entry.1166974658': formData.get('message')
        };

        fetch('https://docs.google.com/forms/d/e/196Ptnu_XIGdiehgJZdGnHh7srOXQJPR5fpGsPJYanBQ/formResponse', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(data).toString()
        })
        .then(() => {
            document.getElementById('form-response').innerText = 'Thank you for your message!';
            form.reset();
        })
        .catch(() => {
            document.getElementById('form-response').innerText = 'There was a problem submitting your message. Please try again later.';
        });
    });
});