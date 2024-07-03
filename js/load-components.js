// Load header and footer dynamically
window.onload = function() {
    // Load the header
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
        })
        .catch(error => console.error('Error loading the header:', error));

    // Load the footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer').innerHTML = data;
        })
        .catch(error => console.error('Error loading the footer:', error));
};

// Change favicon based on time
window.onload = function() {
    var today = new Date();
    var hour = today.getHours();
    var favicon = document.getElementById('favicon');
    if (hour >= 18 || hour <= 6) {
        favicon.href = 'favicon-night.ico';
    } else {
        favicon.href = 'favicon-day.ico';
    }
};

// Handle contact form submission (example for Google Sheets)
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    // Example Google Sheets integration will go here
    alert('Form submitted!');
});