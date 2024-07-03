window.onload = function() {
    // Load the header
    fetch('header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log('Header loaded successfully');
            document.getElementById('header').innerHTML = data;
        })
        .catch(error => console.error('Error loading the header:', error));

    // Load the footer
    fetch('footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            console.log('Footer loaded successfully');
            document.getElementById('footer').innerHTML = data;
        })
        .catch(error => console.error('Error loading the footer:', error));
};

// Change favicon based on time
(function() {
    var today = new Date();
    var hour = today.getHours();
    var favicon = document.getElementById('favicon');
    if (hour >= 18 || hour <= 6) {
        favicon.href = 'favicon-night.ico';
    } else {
        favicon.href = 'favicon-day.ico';
    }
})();

// Handle contact form submission (example for Google Sheets)
document.getElementById('contact-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    // Example Google Sheets integration will go here
    alert('Form submitted!');
});