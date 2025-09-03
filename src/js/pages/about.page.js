import { APP_CONFIG } from "../utils/constants";

export class AboutPage {
  constructor() {
    this.container = document.getElementById("main-content");
  }

  async render() {
    this.container.innerHTML = `
      <div class="about-page fade-in">
        <div class="page-header">
          <h1 class="page-title">About PokéBlog</h1>
          <p class="page-subtitle">Your ultimate Pokémon resource and companion</p>
        </div>

        <div class="about-content">
          <div class="about-hero">
            <div class="about-hero-text">
              <h2>Welcome to the world of Pokémon!</h2>
              <p>
                PokéBlog is a modern, comprehensive Pokémon resource built with cutting-edge web technologies. 
                Our mission is to provide trainers of all levels with easy access to detailed Pokémon information, 
                helping you become the very best, like no one ever was.
              </p>
            </div>
          </div>

          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🔍</div>
              <h3>Comprehensive Search</h3>
              <p>Find any Pokémon instantly by name or Pokédex number with our lightning-fast search functionality.</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">📚</div>
              <h3>Type Categories</h3>
              <p>Explore Pokémon organized by their elemental types, from Fire and Water to Dragon and Fairy.</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">🎲</div>
              <h3>Random Discovery</h3>
              <p>Discover new Pokémon with our random generator - perfect for learning about unfamiliar species.</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">❤️</div>
              <h3>Personal Collection</h3>
              <p>Build and manage your personal collection of favorite Pokémon with our favorites system.</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h3>Detailed Stats</h3>
              <p>Access comprehensive stats, abilities, and evolution information for every Pokémon.</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">🌙</div>
              <h3>Dark Mode</h3>
              <p>Enjoy a comfortable viewing experience with our beautiful light and dark themes.</p>
            </div>
          </div>

          <div class="tech-info">
            <div class="info-section">
              <h3>Technical Information</h3>
              <div class="tech-details">
                <div class="tech-item">
                  <span class="tech-label">Version:</span>
                  <span class="tech-value">${APP_CONFIG.VERSION}</span>
                </div>
                <div class="tech-item">
                  <span class="tech-label">Data Source:</span>
                  <span class="tech-value">
                    <a href="https://pokeapi.co/" target="_blank" rel="noopener">PokéAPI</a>
                  </span>
                </div>
                <div class="tech-item">
                  <span class="tech-label">Technologies:</span>
                  <span class="tech-value">HTML5, CSS3, Vanilla JavaScript ES6+</span>
                </div>
                <div class="tech-item">
                  <span class="tech-label">Framework:</span>
                  <span class="tech-value">100% Native Web Technologies</span>
                </div>
              </div>
            </div>
          </div>

          <div class="acknowledgments">
            <div class="info-section">
              <h3>Acknowledgments</h3>
              <p class="mb-4">
                This project would not be possible without the amazing work of the PokéAPI team. 
                PokéAPI provides free and comprehensive Pokémon data that powers millions of applications worldwide.
              </p>
              
              <p class="mb-4">
                Special thanks to:
              </p>
              
              <ul class="acknowledgment-list">
                <li><strong>PokéAPI Team</strong> - For providing the comprehensive Pokémon database</li>
                <li><strong>Nintendo & Game Freak</strong> - For creating the wonderful world of Pokémon</li>
                <li><strong>Pokémon Community</strong> - For keeping the spirit of discovery alive</li>
                <li><strong>Open Source Contributors</strong> - For making projects like this possible</li>
              </ul>
            </div>
          </div>

          <div class="app-stats">
            <div class="stats-highlight">
              <h3>App Statistics</h3>
              <div class="stats-grid">
                <div class="stat-item">
                  <span class="stat-value">1000+</span>
                  <span class="stat-label">Pokémon</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">18</span>
                  <span class="stat-label">Types</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">100%</span>
                  <span class="stat-label">Native Web</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">0</span>
                  <span class="stat-label">Dependencies</span>
                </div>
              </div>
            </div>
          </div>

          <div class="contact-info">
            <div class="info-section text-center">
              <h3>Questions or Feedback?</h3>
              <p class="mb-6">
                We'd love to hear from you! Whether you've found a bug, have a feature suggestion, 
                or just want to share your experience with PokéBlog.
              </p>
              <div class="contact-actions">
                <a href="mailto:feedback@pokeblog.com" class="btn btn-primary">Send Feedback</a>
                <a href="https://github.com/pokeblog/pokeblog" class="btn btn-outline" target="_blank" rel="noopener">
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.addAboutStyles();
  }

  addAboutStyles() {
    if (!document.head.querySelector(".about-styles")) {
      const style = document.createElement("style");
      style.classList.add("about-styles");
      style.textContent = `
        .about-content {
          max-width: 900px;
          margin: 0 auto;
        }
        
        .about-hero {
          background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%);
          color: white;
          padding: var(--spacing-12);
          border-radius: var(--radius-xl);
          text-align: center;
          margin-bottom: var(--spacing-12);
        }
        
        .about-hero h2 {
          font-size: var(--font-size-3xl);
          margin-bottom: var(--spacing-4);
        }
        
        .about-hero p {
          font-size: var(--font-size-lg);
          opacity: 0.95;
          line-height: var(--line-height-relaxed);
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--spacing-6);
          margin-bottom: var(--spacing-12);
        }
        
        .feature-card {
          background-color: var(--bg-secondary);
          padding: var(--spacing-6);
          border-radius: var(--radius-lg);
          text-align: center;
          transition: transform var(--transition-normal);
          border: 1px solid var(--border-color);
        }
        
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
        
        .feature-icon {
          font-size: var(--font-size-4xl);
          margin-bottom: var(--spacing-4);
        }
        
        .feature-card h3 {
          color: var(--primary-500);
          margin-bottom: var(--spacing-3);
        }
        
        .feature-card p {
          color: var(--text-muted);
          font-size: var(--font-size-sm);
          line-height: var(--line-height-relaxed);
        }
        
        .tech-info,
        .acknowledgments,
        .contact-info {
          margin-bottom: var(--spacing-12);
        }
        
        .tech-details {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-3);
        }
        
        .tech-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-3);
          background-color: var(--bg-secondary);
          border-radius: var(--radius-md);
        }
        
        .tech-label {
          font-weight: var(--font-weight-medium);
          color: var(--text-secondary);
        }
        
        .tech-value {
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
        }
        
        .acknowledgment-list {
          list-style: none;
          padding: 0;
        }
        
        .acknowledgment-list li {
          padding: var(--spacing-3);
          margin-bottom: var(--spacing-2);
          background-color: var(--bg-secondary);
          border-radius: var(--radius-md);
          border-left: 4px solid var(--primary-500);
        }
        
        .stats-highlight {
          background: linear-gradient(135deg, var(--accent-500) 0%, var(--secondary-500) 100%);
          color: white;
          padding: var(--spacing-8);
          border-radius: var(--radius-xl);
          text-align: center;
          margin-bottom: var(--spacing-8);
        }
        
        .stats-highlight h3 {
          color: white;
          margin-bottom: var(--spacing-6);
        }
        
        .stats-highlight .stat-item {
          background-color: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }
        
        .stats-highlight .stat-value {
          color: white;
        }
        
        .stats-highlight .stat-label {
          color: rgba(255, 255, 255, 0.8);
        }
        
        .contact-actions {
          display: flex;
          gap: var(--spacing-4);
          justify-content: center;
          flex-wrap: wrap;
        }
      `;
      document.head.appendChild(style);
    }
  }

  destroy() {
    // Clean up any event listeners or resources
  }
}
