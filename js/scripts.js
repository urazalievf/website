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