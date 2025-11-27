// Add your JavaScript code here

// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        body.setAttribute('data-bs-theme', 'dark');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }

    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
        if (body.classList.contains('dark-theme')) {
            body.setAttribute('data-bs-theme', 'dark');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'dark');
        } else {
            body.removeAttribute('data-bs-theme');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'light');
        }
    });
}

// Tax toggle functionality
const taxToggle = document.getElementById('tax-toggle');
if (taxToggle) {
    taxToggle.addEventListener('change', function() {
        const taxInfos = document.querySelectorAll('.tax-info');
        taxInfos.forEach(info => {
            info.style.display = this.checked ? 'inline' : 'none';
        });
    });
}

// Infinite scroll functionality
let currentPage = parseInt(document.getElementById('listings-container')?.dataset.page || 1);
const listingsContainer = document.getElementById('listings-container');
let isLoading = false;

function loadMoreListings() {
    if (isLoading) return;
    isLoading = true;

    currentPage++;
    fetch(`/listings?page=${currentPage}&limit=20`)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newListings = doc.querySelectorAll('#listings-container .col-lg-4');
            if (newListings.length > 0) {
                newListings.forEach(listing => {
                    listingsContainer.appendChild(listing);
                });
            } else {
                // No more listings to load
                window.removeEventListener('scroll', handleScroll);
            }
            isLoading = false;
        })
        .catch(error => {
            console.error('Error loading more listings:', error);
            isLoading = false;
        });
}

function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadMoreListings();
    }
}

if (listingsContainer) {
    window.addEventListener('scroll', handleScroll);
}
