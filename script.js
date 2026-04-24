document.addEventListener('DOMContentLoaded', () => {
    // --- Current Year for Footer ---
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // --- Mobile Navigation ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('ph-list');
            icon.classList.add('ph-x');
        } else {
            icon.classList.remove('ph-x');
            icon.classList.add('ph-list');
        }
    });

    // Close mobile nav when a link is clicked
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('ph-x');
            icon.classList.add('ph-list');
        });
    });

    // --- Navbar Scroll Effect & Active Link ---
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        // Navbar styling on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinksItems.forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href') === `#${current}`) {
                li.classList.add('active');
            }
        });
    });

    // --- Intersection Observer for Scroll Animations ---
    const hiddenElements = document.querySelectorAll('.hidden');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Optional: stop observing once shown
                // observer.unobserve(entry.target);
            } else {
                // If you want it to hide again when scrolled up
                entry.target.classList.remove('show');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    hiddenElements.forEach((el) => observer.observe(el));

    // --- Fetch GitHub Projects ---
    const GITHUB_USERNAME = 'Aadarsh279';
    const projectsContainer = document.getElementById('github-projects-container');
    const projectsLoader = document.getElementById('projects-loader');
    const reposCountEl = document.getElementById('github-repos-count');

    async function fetchGitHubProjects() {
        try {
            // Fetch the repos, sorted by updated time
            const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch from GitHub');
            }

            const repos = await response.json();
            
            // Update Repo Count Stat
            if(reposCountEl) {
                reposCountEl.textContent = repos.length + (repos.length === 6 ? '+' : '');
            }

            // Remove loader
            if(projectsLoader) {
                projectsLoader.remove();
            }

            // Filter out to only show the two main projects from resume
            const mainProjects = ['MedWell-care', 'SWIGGY-ANALYZER'];
            const displayRepos = repos.filter(repo => mainProjects.includes(repo.name));

            if (displayRepos.length === 0) {
                projectsContainer.innerHTML = '<p>No projects found.</p>';
                return;
            }

            // Custom analysis descriptions based on the resume
            const projectAnalysis = {
                'MedWell-care': 'Implemented authentication, real-time database, and chatbot integration. Designed a user-friendly dashboard for health tracking and prescription management. Applied scalable architecture and secure data handling.',
                'SWIGGY-ANALYZER': 'Built a browser extension to track and analyze user spending behavior. Processed order data to generate insights on expenses and usage patterns. Published project on GitHub with documentation.'
            };

            // Map languages to colors for better UI
            const languageColors = {
                'JavaScript': '#f1e05a',
                'HTML': '#e34c26',
                'CSS': '#563d7c',
                'Python': '#3572A5',
                'C': '#555555',
                'C++': '#f34b7d',
                'Java': '#b07219',
                'TypeScript': '#3178c6'
            };

            displayRepos.forEach(repo => {
                // Create card
                const card = document.createElement('div');
                card.className = 'project-card glass-panel hidden'; // Hidden for observer to catch it
                
                const langColor = languageColors[repo.language] || '#8b5cf6';
                const langDot = repo.language ? `<span style="color: ${langColor}">●</span> ${repo.language}` : '';

                // Handle description
                let desc = projectAnalysis[repo.name] || repo.description || 'No description provided for this project.';

                card.innerHTML = `
                    <div class="project-header">
                        <i class="ph-fill ph-folder-open folder-icon"></i>
                        <div class="project-links">
                            ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" title="Live Demo"><i class="ph ph-arrow-square-out"></i></a>` : ''}
                            <a href="${repo.html_url}" target="_blank" title="GitHub Repo"><i class="ph ph-github-logo"></i></a>
                        </div>
                    </div>
                    <h3 class="project-title">${repo.name.replace(/-/g, ' ')}</h3>
                    <p class="project-desc">${desc}</p>
                    <div class="project-tech">
                        ${langDot ? `<span>${langDot}</span>` : ''}
                    </div>
                `;
                
                projectsContainer.appendChild(card);
                
                // Observe the new element
                observer.observe(card);
            });

        } catch (error) {
            console.error('Error fetching projects:', error);
            if(projectsLoader) projectsLoader.remove();
            projectsContainer.innerHTML = `
                <div class="glass-panel" style="padding: 2rem; text-align: center; grid-column: 1 / -1;">
                    <p style="color: var(--text-secondary);">Could not load projects at this time. Please visit my GitHub profile directly.</p>
                </div>
            `;
        }
    }

    // Call the fetch function
    fetchGitHubProjects();

    // --- Contact Form Submission (Mock) ---
    const contactForm = document.getElementById('contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<span>Sending...</span> <i class="ph ph-spinner ph-spin"></i>';
            btn.style.opacity = '0.7';
            btn.style.cursor = 'not-allowed';

            // Mock API Call
            setTimeout(() => {
                btn.innerHTML = '<span>Sent Successfully!</span> <i class="ph ph-check"></i>';
                btn.classList.remove('btn-primary');
                btn.style.background = '#10b981';
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.add('btn-primary');
                    btn.style.background = '';
                    btn.style.opacity = '1';
                    btn.style.cursor = 'pointer';
                }, 3000);
            }, 1500);
        });
    }
});
