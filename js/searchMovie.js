document.addEventListener('DOMContentLoaded', () => {
  let likedMoviesArray = JSON.parse(localStorage.getItem("likedMovies")) || [];
  const moviesPresentation = document.getElementById('moviesPresentation');
  const searchMoviesByName = document.getElementById('searchMoviesByName');
  const searchMoviesByNameBtn = document.getElementById('searchMoviesByNameBtn');
  const pagination = document.querySelector('.pagination');
  const totalPages = 5;
  let currentPage = 1;



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
      const index = likedMoviesArray.findIndex((movie) => movie.id === movieData.id);
      if (index !== -1) {
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

  function updateLikedMoviesUI() {
    const heartIcons = document.querySelectorAll(".heart-icon");
    heartIcons.forEach((heartIcon) => {
      const movieTitle = heartIcon.closest("p").textContent.split(":")[1].trim();
      if (likedMoviesArray.some((movie) => movie.title === movieTitle)) {
        heartIcon.classList.remove("fa-regular");
        heartIcon.classList.add("fa-solid");
        heartIcon.style.color = "#ff0000";
      } else {
        heartIcon.classList.remove("fa-solid");
        heartIcon.classList.add("fa-regular");
        heartIcon.style.color = "";
      }
    });
  }

  function displayLikedMovies() {
    const movieCardContainer = document.createElement("div");
    movieCardContainer.className = "movie-card-container";

    likedMoviesArray.forEach((movieData) => {
      const movieCard = createMovieCard(movieData);
      movieCardContainer.appendChild(movieCard);
    });

    likedMoviesList.appendChild(movieCardContainer);
  }


  function updatePagination() {
    const pageItems = pagination.querySelectorAll('.page-item');
    pageItems.forEach((item) => item.classList.remove('active'));

    const pageLinks = pagination.querySelectorAll('.page-link');

    if (currentPage === 1) {
      pageItems[0].classList.add('disabled');
    } else {
      pageItems[0].classList.remove('disabled');
    }

    if (currentPage === totalPages) {
      pageItems[6].classList.add('disabled');
    } else {
      pageItems[6].classList.remove('disabled');
    }

    pageLinks[1 + currentPage - 1].parentElement.classList.add('active');
  }

  function showPagination() {
    pagination.style.display = "flex";
  }

  pagination.addEventListener('click', (event) => {
    const targetTagName = event.target.tagName;

    if (targetTagName === 'A' && !event.target.parentElement.classList.contains('disabled')) {
      event.preventDefault();
      const pageNumber = parseInt(event.target.textContent);

      if (pageNumber === currentPage) {
        return;
      }

      if (event.target.textContent === 'Previous') {
        currentPage--;
      } else if (event.target.textContent === 'Next') {
        currentPage++;
      } else {
        currentPage = pageNumber;
      }

      updatePagination();
      fetchMovies(searchMoviesByName.value, currentPage);
    }
  });

  searchMoviesByNameBtn.addEventListener('click', () => {
    footerHome.style.marginTop = 0;
    currentPage = 1;
    fetchMovies(searchMoviesByName.value, currentPage);
    showPagination();
  });
  updatePagination();
  function fetchMovies(movie, page = 1) {
    const url = `https://api.themoviedb.org/3/search/movie?language=en-US&query=${movie}&page=${page}&api_key=f673b4c51255192622a586f74ec1f251`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        moviesPresentation.innerHTML = '';
        data.results.forEach((movieResult) => {
          const movieCard = createMovieCardWithHover(movieResult);
          moviesPresentation.appendChild(movieCard);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

 
  fetchMovies(searchMoviesByName.value, currentPage);

  displayLikedMovies();

  resetButton.addEventListener("click", () => {
    localStorage.removeItem("likedMovies");
    likedMoviesArray = [];
    updateLocalStorage();
    displayLikedMovies();
  });

  updateLikedMoviesUI();
});
