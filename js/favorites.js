let likedMoviesArray = JSON.parse(localStorage.getItem("likedMovies")) || [];

document.addEventListener("DOMContentLoaded", () => {
  const likedMoviesList = document.getElementById("likedMoviesList");
  const resetButton = document.getElementById("resetButton");

  
  function createMovieCardWithHover(movieData) {
    const movieCard = document.createElement("div");
    movieCard.className = "movie-card";
  
    const movieImage = document.createElement("img");
    movieImage.src = `https://image.tmdb.org/t/p/original${movieData.poster_path}`;
    movieImage.alt = movieData.title;
  
    const movieDetails = document.createElement("div");
    movieDetails.className = "movie-details";
  
    const movieHover = document.createElement("div");
    movieHover.className = "movie-hover";
  
    const movieHoverBackground = document.createElement("div");
    movieHoverBackground.className = "movie-hover-background";
  
    const movieTitle = document.createElement("p");
    movieTitle.className = "movie-title";
    movieTitle.textContent = `${movieData.title}
    `;
    movieTitle.innerHTML += `<p class="movieSpan">${movieData.overview}<p>`

  
    const heartIcon = document.createElement("i");
    const isLiked = likedMoviesArray.some((movie) => movie.id === movieData.id);
    heartIcon.className = `heart-icon ${isLiked ? "fas" : "far"} fa-heart`;
    heartIcon.style.color = isLiked ? "#ff0000" : "";
  
    heartIcon.addEventListener("click", () => {
      const isLiked = likedMoviesArray.some((movie) => movie.id === movieData.id);
      if (isLiked) {
     
        const index = likedMoviesArray.findIndex((movie) => movie.id === movieData.id);
        likedMoviesArray.splice(index, 1);
        heartIcon.classList.remove("fas");
        heartIcon.classList.add("far");
        heartIcon.style.color = "";
      } else {

        likedMoviesArray.push(movieData);
        heartIcon.classList.remove("far");
        heartIcon.classList.add("fas");
        heartIcon.style.color = "#ff0000";
      }
      updateLocalStorage();
      displayLikedMovies();
    });
  
    movieHover.appendChild(movieHoverBackground);
    movieHover.appendChild(movieTitle);
    movieHover.appendChild(heartIcon);
  
    movieDetails.appendChild(movieHover);
  
    movieCard.appendChild(movieImage);
    movieCard.appendChild(movieDetails);
  
    return movieCard;
  }

  function updateLocalStorage() {
    localStorage.setItem("likedMovies", JSON.stringify(likedMoviesArray));
  }

  function displayLikedMovies() {
    likedMoviesList.innerHTML = `<h2 style="visibility: hidden;" >Liked Movies</h2>`;
    const movieCardContainer = document.createElement("div");
    movieCardContainer.className = "movie-card-container";

    likedMoviesArray.forEach((movieData) => {
      const movieCard = createMovieCardWithHover(movieData);
      movieCardContainer.appendChild(movieCard);
    });

    likedMoviesList.appendChild(movieCardContainer);
  }

  displayLikedMovies();

  resetButton.addEventListener("click", () => {
    localStorage.removeItem("likedMovies");
    likedMoviesArray = [];
    updateLocalStorage();
    displayLikedMovies();
  });

  window.addEventListener("beforeunload", () => {
    localStorage.setItem("likedMovies", JSON.stringify(likedMoviesArray));
  });
});

window.addEventListener("beforeunload", () => {
  localStorage.setItem("likedMovies", JSON.stringify(likedMoviesArray));
});


/*document.addEventListener("DOMContentLoaded", () => {
  let likedMoviesArray = JSON.parse(localStorage.getItem("likedMovies")) || [];
  const likedMoviesList = document.getElementById("likedMoviesList");
  const resetButton = document.getElementById("resetButton");

  function createMovieCard(movieData) {
    const movieCard = document.createElement("div");
    movieCard.className = "movie-card";

    const movieTitle = document.createElement("p");
    movieTitle.textContent = `Title: ${movieData.title}`;

    const moviePoster = document.createElement("img");
    moviePoster.src = `https://image.tmdb.org/t/p/original${movieData.poster_path}`;
    moviePoster.style.width = "10%";
    moviePoster.alt = movieData.title;

    const heartIcon = document.createElement("i");
    const isLiked = likedMoviesArray.some((movie) => movie.id === movieData.id);
    heartIcon.className = `heart-icon ${
      isLiked ? "fa-solid" : "fa-regular"
    } fa-heart`;
    heartIcon.style.color = isLiked ? "#ff0000" : "";

    heartIcon.addEventListener("click", () => {
      const index = likedMoviesArray.findIndex(
        (movie) => movie.id === movieData.id
      );
      if (index !== -1) {
        likedMoviesArray.splice(index, 1);
      } else {
        likedMoviesArray.push(movieData);
      }
      updateLocalStorage();

      heartIcon.className = `heart-icon ${
        likedMoviesArray.some((movie) => movie.id === movieData.id)
          ? "fa-solid"
          : "fa-regular"
      } fa-heart`;
      heartIcon.style.color = likedMoviesArray.some((movie) => movie.id === movieData.id)
        ? "#ff0000"
        : "";
      displayLikedMovies();
    });

    movieCard.appendChild(movieTitle);
    movieCard.appendChild(moviePoster);
    movieCard.appendChild(heartIcon);

    return movieCard;
  }

  function updateLocalStorage() {
    localStorage.setItem("likedMovies", JSON.stringify(likedMoviesArray));
  }

  function displayLikedMovies() {
    likedMoviesList.innerHTML = "<h2>Liked Movies</h2>";
    const movieCardContainer = document.createElement("div");
    movieCardContainer.className = "movie-card-container";

    likedMoviesArray.forEach((movieData) => {
      const movieCard = createMovieCard(movieData);
      movieCardContainer.appendChild(movieCard);
    });

    likedMoviesList.appendChild(movieCardContainer);
  }

  displayLikedMovies();

  resetButton.addEventListener("click", () => {
    localStorage.removeItem("likedMovies");
    likedMoviesArray = [];
    updateLocalStorage();
    displayLikedMovies();
  });
});

window.addEventListener("beforeunload", () => {
  localStorage.setItem("likedMovies", JSON.stringify(likedMoviesArray));
});

*/