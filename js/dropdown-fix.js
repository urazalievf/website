// Fix Webflow dropdown when hosted outside Webflow
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".w-dropdown-toggle").forEach(function (toggle) {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var dropdown = toggle.closest(".w-dropdown");
      var list = dropdown.querySelector(".w-dropdown-list");
      var isOpen = list.classList.contains("w--open");

      // Close all other dropdowns first
      document.querySelectorAll(".w-dropdown-list.w--open").forEach(function (openList) {
        openList.classList.remove("w--open");
      });

      // Toggle this one
      if (!isOpen) {
        list.classList.add("w--open");
      }
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".w-dropdown")) {
      document.querySelectorAll(".w-dropdown-list.w--open").forEach(function (openList) {
        openList.classList.remove("w--open");
      });
    }
  });
});
