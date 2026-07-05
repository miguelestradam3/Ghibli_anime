const API_BASE = "https://ghibliapi.vercel.app/films";

const container = document.getElementById("movie-details");

// Get ID from URL
const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

async function getMovieDetails() {

    try {

        const response = await fetch(`${API_BASE}/${movieId}`);

        if (!response.ok) {
            throw new Error("Movie not found");
        }

        const movie = await response.json();

        renderMovie(movie);

    } catch (error) {

        container.innerHTML = `
            <div class="alert alert-danger text-center">
                ${error.message}
            </div>
        `;

    }
}

async function renderMovie(movie) {

    container.innerHTML = `
        <div class="card shadow">

            <img src="${movie.movie_banner}"
                 class="card-img-top"
                 alt="${movie.title}">

            <div class="card-body">

                <h1>${movie.title}</h1>
                <h4>${movie.original_title}</h4>
                <p><em>${movie.original_title_romanised}</em></p>

                <hr>

                <p><strong>Director:</strong> ${movie.director}</p>
                <p><strong>Producer:</strong> ${movie.producer}</p>
                <p><strong>Release:</strong> ${movie.release_date}</p>
                <p><strong>Running Time:</strong> ${movie.running_time} min</p>
                <p><strong>Score:</strong> ${movie.rt_score}</p>

                <hr>

                <p>${movie.description}</p>

                <hr>

                <a href="index.html" class="btn">
                    ← Back to Explorer
                </a>

            </div>

        </div>
    `;
}

getMovieDetails();