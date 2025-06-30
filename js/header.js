window.addEventListener('DOMContentLoaded', () => {
  const placeholder = document.getElementById('header-placeholder');
  if (!placeholder) return;
  fetch('/header.html')
    .then(resp => resp.text())
    .then(html => {
      placeholder.innerHTML = html;
    })
    .catch(err => console.error('Failed to load header:', err));
});
