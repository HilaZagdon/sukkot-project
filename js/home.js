document.addEventListener("DOMContentLoaded", () => {
  let likedMoviesArray = JSON.parse(localStorage.getItem("likedMovies")) || [];
  const moviesPresentation = document.getElementById("moviesPresentation");
  const dailyId = document.getElementById("dailyId");
  const weeklyId = document.getElementById("weeklyId");
  const pagination = document.querySelector(".pagination");
  const likedMoviesList = document.getElementById("likedMoviesList");
  const resetButton = document.getElementById("resetButton");
  let currentPage = 1;
  let popularity = "day";

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
    likedMoviesList.innerHTML = "<h2>Liked Movies</h2>";
    const movieCardContainer = document.createElement("div");
    movieCardContainer.className = "movie-card-container";

    likedMoviesArray.forEach((movieData) => {
      const movieCard = createMovieCard(movieData);
      movieCardContainer.appendChild(movieCard);
    });

    likedMoviesList.appendChild(movieCardContainer);
  }

  function fetchMovies(page = 1, popularity = "day") {
    let url;

    if (popularity === "day") {
      url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}&api_key=f673b4c51255192622a586f74ec1f251`;
    } else if (popularity === "week") {
      if (page >= 1 && page <= 5) {
        const startPage = page + 9;
        url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${startPage}&api_key=f673b4c51255192622a586f74ec1f251`;
      } else {
        console.log("nope");
        return;
      }
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        moviesPresentation.innerHTML = "";
        data.results.forEach((movieResult) => {
          const movieCard = createMovieCardWithHover(movieResult);
          moviesPresentation.appendChild(movieCard);
        });

        updatePagination(page, data.total_pages);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function animateButtons() {
    const isAnimated =
      dailyId.classList.contains("animate-top-right") &&
      weeklyId.classList.contains("animate-top-right");
    if (!isAnimated) {
      dailyId.classList.add("Danimate-top-right");
      weeklyId.classList.add("Wanimate-top-right");
      openingLine.style =
        "animation: moveUp 3s ; animation-fill-mode: forwards;";
      moviesPresentation.style =
        "animation: moveUp1 3s ; animation-fill-mode: forwards;";
    } else {
      dailyId.classList.remove("animate-top-right");
      weeklyId.classList.remove("animate-top-right");
      dailyId.style.transform = "translate(0, 0) scale(1)";
      weeklyId.style.transform = "translate(0, 0) scale(1)";
    }
  }


  
  function showPagination() {
    pagination.style.display = "flex";
  }

  dailyId.addEventListener("click", () => {
    popularity = "day";
    currentPage = 1;
    fetchMovies(currentPage, popularity);
    animateButtons();
    showPagination();
    carouselExampleIndicators.style.display = "none"
    if (window.innerWidth <= 850) {
      moviesPresentation.style.marginTop = "21rem";
    }
  });

  weeklyId.addEventListener("click", () => {
    popularity = "week";
    currentPage = 1;
    fetchMovies(currentPage, popularity);
    animateButtons();
    showPagination();
    carouselExampleIndicators.style.display = "none"
    if (window.innerWidth <= 850) {
      moviesPresentation.style.marginTop = "21rem";
    }
  });

  pagination.addEventListener("click", (event) => {
    const targetTagName = event.target.tagName;

    if (
      targetTagName === "A" &&
      !event.target.parentElement.classList.contains("disabled")
    ) {
      event.preventDefault();
      const pageNumber = parseInt(event.target.textContent);

      if (pageNumber === currentPage) {
        return;
      }

      if (event.target.textContent === "Previous") {
        currentPage--;
      } else if (event.target.textContent === "Next") {
        currentPage++;
      } else {
        currentPage = pageNumber;
      }

      fetchMovies(currentPage, popularity);
    }
  });

  function updatePagination(currentPage, totalPages) {
    const pageItems = pagination.querySelectorAll(".page-item");
    pageItems.forEach((item) => item.classList.remove("active"));

    const pageLinks = pagination.querySelectorAll(".page-link");

    if (currentPage === 1) {
      pageItems[0].classList.add("disabled");
    } else {
      pageItems[0].classList.remove("disabled");
    }

    if (currentPage === 5) {
      pageItems[6].classList.add("disabled");
    } else {
      pageItems[6].classList.remove("disabled");
    }

    if (currentPage === totalPages) {
      pageItems[pageItems.length - 1].classList.add("disabled");
    } else {
      pageItems[pageItems.length - 1].classList.remove("disabled");
    }

    pageLinks.forEach((link, index) => {
      if (index === 0) {
        link.textContent = "Previous";
      } else if (index === pageLinks.length - 1) {
        link.textContent = "Next";
        if (currentPage >= totalPages || currentPage === 5) {
          document.getElementById("nextPage").classList.add("disabled");
        } else {
          document.getElementById("nextPage").classList.remove("disabled");
        }
      } else {
        const pageNumber = index;
        link.textContent = pageNumber.toString();
        if (pageNumber === currentPage) {
          pageItems[pageNumber].classList.add("active");
        }
      }
    });
  }

  displayLikedMovies();


  updateLikedMoviesUI();
});

