const API_URL = "https://ghibliapi.vercel.app/films";

const moviesContainer = document.getElementById("movies");
document.getElementById("searchInput").addEventListener("input", applyFilters);
document.getElementById("directorFilter").addEventListener("change", applyFilters);
document.getElementById("sortFilter").addEventListener("change", applyFilters);

const moviesPerPage = 6;

let currentPage = 1;
let movies = [];

let filteredMovies = [];

function showLoading() {

    moviesContainer.innerHTML = `
        <div class="col-12 text-center my-5">

            <div class="spinner-border text-success"
                 role="status">
                <span class="visually-hidden">Loading...</span>
            </div>

            <p class="mt-3">Loading Studio Ghibli movies...</p>

        </div>
    `;

}

async function getMovies() {

    try {
        showLoading();
        const response = await fetch(API_URL);
        movies = await response.json();

        filteredMovies = movies;

        populateDirectors();
        displayMovies();

    } catch (error) {

        moviesContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger text-center">
                    ${error.message}
                </div>
            </div>
        `;

    }

}

function displayMovies() {

    const start = (currentPage - 1) * moviesPerPage;
    const end = start + moviesPerPage;

    const moviesToShow = filteredMovies.slice(start, end);

    moviesContainer.innerHTML = moviesToShow
        .map(movie => createMovieCard(movie))
        .join("");

    createPagination();
}

function createMovieCard(movie) {

    return `
        <div class="col-md-4">

            <div class="card h-100 shadow-sm movie-card">

                <!-- Movie Image -->
                <img src="${movie.image || 'https://via.placeholder.com/400x600'}"
                     class="card-img-top"
                     alt="${movie.title}">

                <div class="card-body d-flex flex-column">

                    <!-- Title -->
                    <h5 class="card-title mb-1">
                        ${movie.title}
                    </h5>

                    <p class="text-muted mb-2">
                        ${movie.original_title || ''}
                    </p>

                    <!-- Info -->
                    <p class="mb-1">
                        <strong>Director:</strong> ${movie.director || 'N/A'}
                    </p>

                    <p class="mb-1">
                        <strong>Score:</strong> ${movie.rt_score || 'N/A'}%
                    </p>

                    <!-- Footer -->
                    <div class="mt-auto pt-3">

                        <button class="btn btn-outline-success btn-sm w-100"
                                onclick="event.stopPropagation(); goToDetails('${movie.id}')">
                            View Details
                        </button>

                    </div>

                </div>
            </div>

        </div>
    `;
}

function populateDirectors() {

    const directorFilter = document.getElementById("directorFilter");

    const directors = [...new Set(movies.map(m => m.director))];

    directors.forEach(director => {
        directorFilter.innerHTML += `
            <option value="${director}">${director}</option>
        `;
    });
}

function createPagination() {

    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

    for (let i = 1; i <= totalPages; i++) {

        pagination.innerHTML += `
            <button class="btn btn-outline-success mx-1 ${i === currentPage ? "active" : ""}"
                    onclick="goToPage(${i})">
                ${i}
            </button>
        `;
    }
}

function goToPage(page) {

    currentPage = page;

    displayMovies();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

function goToDetails(id) {
    window.location.href = `movie.html?id=${id}`;
}

function applyFilters() {

    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const directorValue = document.getElementById("directorFilter").value;
    const sortValue = document.getElementById("sortFilter").value;

    filteredMovies = movies.filter(movie => {

        const matchesSearch =
            movie.title.toLowerCase().includes(searchValue);

        const matchesDirector =
            directorValue === "" || movie.director === directorValue;

        return matchesSearch && matchesDirector;
    });

    // Sorting
    switch (sortValue) {

        case "year-asc":
            filteredMovies.sort((a, b) => a.release_date - b.release_date);
            break;

        case "year-desc":
            filteredMovies.sort((a, b) => b.release_date - a.release_date);
            break;

        case "score-desc":
            filteredMovies.sort((a, b) => b.rt_score - a.rt_score);
            break;

        case "score-asc":
            filteredMovies.sort((a, b) => a.rt_score - b.rt_score);
            break;

        case "title-asc":
            filteredMovies.sort((a, b) => a.title.localeCompare(b.title));
            break;

        case "title-desc":
            filteredMovies.sort((a, b) => b.title.localeCompare(a.title));
            break;
    }

    currentPage = 1;
    displayMovies();
}

getMovies();