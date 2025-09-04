export class HeaderComponent {
  constructor() {
    this.navToggle = null;
    this.navMenu = null;
    this.isMenuOpen = false;
  }

  init() {
    this.navToggle = document.getElementById("nav-toggle");
    this.navMenu = document.getElementById("nav-menu");

    if (this.navToggle && this.navMenu) {
      this.setupMobileMenu();
    }
  }

  setupMobileMenu() {
    this.navToggle.addEventListener("click", () => {
      this.toggleMobileMenu();
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        this.isMenuOpen &&
        !this.navMenu.contains(e.target) &&
        !this.navToggle.contains(e.target)
      ) {
        this.closeMobileMenu();
      }
    });

    // Close menu when clicking on a nav link
    this.navMenu.addEventListener("click", (e) => {
      if (e.target.classList.contains("nav-link")) {
        this.closeMobileMenu();
      }
    });

    // Handle escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    this.navMenu.classList.add("active");
    this.navToggle.classList.add("active");
    this.isMenuOpen = true;
    document.body.style.overflow = "hidden";
  }

  closeMobileMenu() {
    this.navMenu.classList.remove("active");
    this.navToggle.classList.remove("active");
    this.isMenuOpen = false;
    document.body.style.overflow = "";
  }
}
