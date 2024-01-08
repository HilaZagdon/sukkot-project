let likedMoviesArray = JSON.parse(localStorage.getItem("likedMovies")) || [];

document.addEventListener("DOMContentLoaded", () => {
  const likedMoviesList = document.getElementById("likedMoviesList");
  const resetButton = document.getElementById("resetButton");
  const noLikedMoviesMessage = document.createElement("p");
  
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
    updateVisibility();
  }

  function displayLikedMovies() {
    likedMoviesList.innerHTML = ""; 
  
    if (likedMoviesArray.length === 0) {
  
      likedMoviesList.appendChild(noLikedMoviesMessage);
    } else {
      const movieCardContainer = document.createElement("div");
      movieCardContainer.className = "movie-card-container";
  
      likedMoviesArray.forEach((movieData) => {
        const movieCard = createMovieCardWithHover(movieData);
        movieCardContainer.appendChild(movieCard);
      });
  
      likedMoviesList.appendChild(movieCardContainer);
    }
  
    updateVisibility();
  }

  function updateVisibility() {
    const hasLikedMovies = likedMoviesArray.length > 0;
  
    resetButton.style.display = hasLikedMovies ? "block" : "none";
    noLikedMoviesMessage.style.display = hasLikedMovies ? "none" : "block";
  }

  noLikedMoviesMessage.innerHTML = `<i style="color:white" class="fa-solid fa-clapperboard fa-flip"></i> <span> No liked movies yet...</span>`;
  if (window.innerWidth <= 450) {
    noLikedMoviesMessage.style.fontSize = "3.5rem";
    noLikedMoviesMessage.style.margin = "5rem 2rem 0 2rem";
  } 
 else if (window.innerWidth <= 850) {
    noLikedMoviesMessage.style.fontSize = "4rem";
    noLikedMoviesMessage.style.margin = "0 5rem";
  } else {
    noLikedMoviesMessage.style.fontSize = "8rem";
    noLikedMoviesMessage.style.margin = "auto";
  }
  
  noLikedMoviesMessage.style.fontFamily = "Dancing Script";
  noLikedMoviesMessage.style.color = "#D42029";
  noLikedMoviesMessage.style.display = likedMoviesArray.length > 0 ? "none" : "block";
  likedMoviesList.appendChild(noLikedMoviesMessage);

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

