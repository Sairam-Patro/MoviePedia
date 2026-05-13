const movies = [
    {
        id: 1,
        title: "3 Idiots",
        year: 2009,
        genre: "Comedy/Drama",
        rating: 8.4,
        poster: "assets/images/3_idiots_poster.png",
        intro: "Two friends are searching for their long lost companion. They revisit their college days and recall the memories of their friend who inspired them to think differently.",
        featured: true
    },
    {
        id: 2,
        title: "Dangal",
        year: 2016,
        genre: "Sports/Biography",
        rating: 8.3,
        poster: "assets/images/dangal_poster.png",
        intro: "Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games in the face of societal oppression.",
        featured: true
    },
    {
        id: 3,
        title: "Zindagi Na Milegi Dobara",
        year: 2011,
        genre: "Drama/Romance",
        rating: 8.2,
        poster: "assets/images/znmd_poster.png",
        intro: "Three friends decide to turn their fantasy vacation into reality after one of their number becomes engaged.",
        featured: true
    },
    {
        id: 4,
        title: "Sholay",
        year: 1975,
        genre: "Action/Adventure",
        rating: 8.1,
        poster: "assets/images/sholay_poster.png",
        intro: "After his family is murdered by a notorious and ruthless bandit, a former police officer enlists the services of two outlaws to capture him.",
        featured: false
    },
    {
        id: 5,
        title: "Lagaan",
        year: 2001,
        genre: "Drama/Musical",
        rating: 8.1,
        poster: "assets/images/lagaan_poster.png",
        intro: "The people of a small village in Victorian India stake their future on a game of cricket against their ruthless British rulers.",
        featured: false
    },
    {
        id: 6,
        title: "PK",
        year: 2014,
        genre: "Comedy/Sci-Fi",
        rating: 8.1,
        poster: "assets/images/pk_poster.png",
        intro: "An alien on Earth loses the only device he can use to communicate with his spaceship. His innocent nature and child-like questions force the country to evaluate the impact of religion.",
        featured: false
    },
    {
        id: 7,
        title: "Queen",
        year: 2013,
        genre: "Comedy/Drama",
        rating: 8.1,
        poster: "assets/images/queen_poster.png",
        intro: "A Delhi girl from a traditional family sets out on a solo honeymoon after her marriage gets cancelled.",
        featured: false
    },
    {
        id: 8,
        title: "Barfi!",
        year: 2012,
        genre: "Comedy/Romance",
        rating: 8.1,
        poster: "assets/images/barfi_poster.png",
        intro: "Three young people learn that love can neither be defined nor contained by society's norms of normal and abnormal.",
        featured: false
    },
    {
        id: 9,
        title: "Yeh Jawaani Hai Deewani",
        year: 2013,
        genre: "Romance/Musical",
        rating: 7.2,
        poster: "assets/images/yjhd_poster.png",
        intro: "Kabir and Naina bond during a trekking trip. Before Naina can express herself, Kabir leaves India to pursue his career.",
        featured: false
    },
    {
        id: 10,
        title: "Kabhi Khushi Kabhie Gham",
        year: 2001,
        genre: "Drama/Romance",
        rating: 7.4,
        poster: "assets/images/k3g_poster.png",
        intro: "Yashvardhan Raichand lives a very wealthy lifestyle along with his wife and two sons. After one son marries a girl of lower socio-economic status, he is banished.",
        featured: false
    }
];

// Generate fake reviews
const generateReviews = () => {
    const names = ["Aarav", "Priya", "Rahul", "Anjali", "Vikram", "Neha", "Rohan", "Sneha", "Karan", "Pooja"];
    const texts = [
        "An emotional masterpiece with brilliant performances.",
        "A true cinematic gem. Highly recommended!",
        "Loved the storytelling and the character development.",
        "One of the best Bollywood movies ever made.",
        "A must-watch! The cinematography is breathtaking.",
        "Captivating from start to finish.",
        "Great music, great acting, great direction.",
        "A beautiful story told in a very engaging way."
    ];
    
    let reviews = [];
    for(let i=0; i<8; i++) {
        reviews.push({
            user: names[Math.floor(Math.random() * names.length)],
            stars: "⭐".repeat(Math.floor(Math.random() * 2) + 4), // 4 or 5 stars
            text: texts[Math.floor(Math.random() * texts.length)]
        });
    }
    return reviews;
};

// Map reviews to movies
const movieReviews = {};
movies.forEach(m => {
    movieReviews[m.id] = generateReviews();
});

// DOM Elements
const featuredContainer = document.getElementById('featured-container');
const moviesContainer = document.getElementById('movies-container');
const genreFilter = document.getElementById('genre-filter');
const searchInput = document.getElementById('search-input');
const reviewModal = document.getElementById('review-modal');
const closeModal = document.getElementById('close-modal');
const reviewsContainer = document.getElementById('reviews-container');
const modalMovieTitle = document.getElementById('modal-movie-title');
const loader = document.getElementById('loader');

// Create Movie Card HTML
const createMovieCard = (movie) => {
    return `
        <div class="movie-card scroll-fade">
            <div class="card-image-wrapper">
                <img src="${movie.poster}" alt="${movie.title} Poster" loading="lazy">
                <div class="badge-rating">⭐ ${movie.rating}</div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${movie.title}</h3>
                <div class="card-meta">
                    <span>${movie.year}</span>
                    <span>${movie.genre}</span>
                </div>
                <p class="card-intro">${movie.intro}</p>
                <button class="btn-reviews" onclick="openReviews(${movie.id}, '${movie.title.replace(/'/g, "\\'")}')">Read Reviews</button>
            </div>
        </div>
    `;
};

// Render Movies
const renderMovies = () => {
    // Featured
    const featured = movies.filter(m => m.featured);
    featuredContainer.innerHTML = featured.map(createMovieCard).join('');

    // All Movies
    moviesContainer.innerHTML = movies.map(createMovieCard).join('');

    // Populate Genres
    const genres = new Set();
    movies.forEach(m => genres.add(m.genre));
    genres.forEach(g => {
        const option = document.createElement('option');
        option.value = g;
        option.textContent = g;
        genreFilter.appendChild(option);
    });

    initScrollAnimations();
};

// Filter Logic
const filterMovies = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGenre = genreFilter.value;

    const filtered = movies.filter(m => {
        const matchSearch = m.title.toLowerCase().includes(searchTerm);
        const matchGenre = selectedGenre === 'all' || m.genre === selectedGenre;
        return matchSearch && matchGenre;
    });

    moviesContainer.innerHTML = filtered.length 
        ? filtered.map(createMovieCard).join('')
        : '<p style="text-align:center; grid-column: 1/-1; color: var(--text-muted);">No movies found.</p>';
    
    initScrollAnimations();
};

searchInput.addEventListener('input', filterMovies);
genreFilter.addEventListener('change', filterMovies);

// Review Modal Logic
window.openReviews = (id, title) => {
    modalMovieTitle.textContent = `Reviews for ${title}`;
    const reviews = movieReviews[id];
    
    reviewsContainer.innerHTML = reviews.map(r => `
        <div class="review-card">
            <div class="review-header">
                <span class="reviewer">${r.user}</span>
                <span class="stars">${r.stars}</span>
            </div>
            <p class="review-text">"${r.text}"</p>
        </div>
    `).join('');
    
    reviewModal.showModal();
    document.body.style.overflow = 'hidden'; // prevent bg scroll
};

closeModal.addEventListener('click', () => {
    reviewModal.close();
    document.body.style.overflow = 'auto';
});

reviewModal.addEventListener('click', (e) => {
    if(e.target === reviewModal) {
        reviewModal.close();
        document.body.style.overflow = 'auto';
    }
});

// Scroll Animations (Fade-in)
const initScrollAnimations = () => {
    const fadeElements = document.querySelectorAll('.scroll-fade');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));
};

// Navbar Background on Scroll & Scroll-to-Top Button
const navbar = document.querySelector('.navbar');
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Mobile Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Initialization
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
        renderMovies();
    }, 1000); // Simulate cinematic loading
});
