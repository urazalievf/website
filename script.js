window.onload = function() {
    loadComponent('header.html', 'header');
    loadComponent('footer.html', 'footer');
    changeFavicon();
};

function loadComponent(url, elementId) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                document.getElementById(elementId).innerHTML = xhr.responseText;
                console.log(elementId + ' loaded successfully');
            } else {
                console.error('Error loading ' + elementId + ': ' + xhr.statusText);
            }
        }
    };
    xhr.send();
}

function changeFavicon() {
    var today = new Date();
    var hour = today.getHours();
    var favicon = document.getElementById('favicon');
    if (hour >= 18 || hour <= 6) {
        favicon.href = 'favicon-night.ico';
    } else {
        favicon.href = 'favicon-day.ico';
    }
}

document.getElementById('contact-form')?.addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Form submitted!');
});