document.addEventListener('DOMContentLoaded', () => {
  let likedMoviesArray = JSON.parse(localStorage.getItem("likedMovies")) || [];
  const movieTitle = document.getElementById('movieTitle');
  const dateAndRuntime = document.getElementById('dateAndRuntime');
  const movieGenre = document.getElementById('movieGenre');
  const movieCast = document.getElementById('movieCast');
  const MoviePoster = document.getElementById('MoviePoster');
  const searchIdButton = document.getElementById('searchIdButton');
  const searchByIdInput = document.getElementById('searchByIdInput');




  function createMovieCard(data) {
    const heartIconClass = isMovieLiked(data.id) ? 'fa-solid' : 'fa-regular';


    movieTitle.innerHTML =
      `<p > ${data.title} <i class="heart-icon ${heartIconClass} fa-heart" style="color: #ff0000;"></i></p>`;
    dateAndRuntime.innerHTML =
      `<p>Release Date: ${data.release_date} </p> <p> Runtime: ${data.runtime} min</p>`;

    const heartIcon = movieTitle.querySelector('.heart-icon');

    heartIcon.addEventListener('click', () => {
      if (heartIcon.classList.contains('fa-regular')) {
        heartIcon.classList.remove('fa-regular');
        heartIcon.classList.add('fa-solid');
        heartIcon.style.color = '#ff0000';
        likedMoviesArray.push(data);
      } else {
        heartIcon.classList.remove('fa-solid');
        heartIcon.classList.add('fa-regular');

        const index = likedMoviesArray.findIndex((movie) => movie.id === data.id);
        if (index !== -1) {
          likedMoviesArray.splice(index, 1);
        }
      }

      localStorage.setItem('likedMovies', JSON.stringify(likedMoviesArray));
    });

    const genreNames = data.genres.map((genre) => genre.name);
    movieGenre.innerHTML = `<span>Genres: ${genreNames.join(", ")}</span>`;


    let castHtml = '';
    let column1 = '';
    let column2 = '';
    
    for (let i = 0; i < data.credits.cast.length; i++) {
      const cast = data.credits.cast[i];
      const characterName = cast.character;
      const actorName = cast.name;
      const profilePath = `https://image.tmdb.org/t/p/original${cast.profile_path}`;
      const imageTag = profilePath ? `<img src="${profilePath}" alt="${actorName}" width="50" height="50" style="margin-right: 10px;">` : '';
    
    
      const actorInfo = `<div style="display:flex;"> ${imageTag} <div class="bigCharacterName" style="display:flex; flex-direction:column; align-items:center;  justify-content:center; margin-left:auto; margin-right:auto"><span style="font-weight: 600;">${characterName}</span> <span style="font-weight: 400;">  ${actorName}</span> </div> </div>`;
    
      if (i < 5) {
        column1 += (i > 0 ? '<br>' : '') + actorInfo;
      } else {
        column2 += (i > 5 ? '<br>' : '') + actorInfo;
      }
    
      if (i >= 9) {
        break;
      }
    }
    
    castHtml = `<section class="columnsSection"><div class="cast-columns1">${column1}</div><div class="cast-columns2">${column2}</div></section>`;
    movieCast.innerHTML = castHtml;


    MoviePoster.innerHTML =
      `<img  src="https://image.tmdb.org/t/p/original${data.poster_path}" />`;
  }

  function isMovieLiked(movieId) {
    return likedMoviesArray.some((movie) => movie.id === movieId);
  }

  function animateButtons() {
    const isAnimated = MainHome.classList.contains("animate-up");
    if (!isAnimated) {
      MainHome.classList.add("animate-up");
    } else {
      MainHome.style.transform = "translateY(-100px)";
    }
  }
  
searchIdButton.addEventListener('click', searchMovie);

searchByIdInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    searchMovie();
  }
});

function searchMovie() {
  const searchMovieVal = searchByIdInput.value;
  searchLineID.style.visibility = "hidden";
  carouselContainer.style.display = "none";
  moviePresentation.style.background = "linear-gradient(to left, #61090d, #d3585e3a)";
  movieDescriptionUnderPoster.style.background = "linear-gradient(to right, #d3585e00, #61090d)";
  animateButtons();
  fetchMovies(searchMovieVal);
}

  function fetchMovies(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=f673b4c51255192622a586f74ec1f251&language=en-US&append_to_response=credits`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        createMovieCard(data);
        updateHeartIcons();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function updateHeartIcons() {
    const heartIcons = document.querySelectorAll('.heart-icon');
    heartIcons.forEach((heartIcon) => {
      const movieTitleText = heartIcon.closest('p').textContent.split(':')[1].trim();
      if (likedMoviesArray.some((movie) => movie.title === movieTitleText)) {
        heartIcon.classList.remove('fa-regular');
        heartIcon.classList.add('fa-solid');
        heartIcon.style.color = '#ff0000';
      }
    });
  }
});



(function () {
  "use strict";

  var carousel = document.getElementsByClassName("carousel")[0],
    slider = carousel.getElementsByClassName("carousel__slider")[0],
    items = carousel.getElementsByClassName("carousel__slider__item"),
    prevBtn = carousel.getElementsByClassName("carousel__prev")[0],
    nextBtn = carousel.getElementsByClassName("carousel__next")[0];

  var width,
    height,
    totalWidth,
    margin = 20,
    currIndex = 0,
    interval,
    intervalTime = 4000;

  function init() {
    resize();
    move(Math.floor(items.length / 2));
    bindEvents();

    timer();
  }

  function resize() {
    (width = Math.max(window.innerWidth * 0.25, 275)),
      (height = window.innerHeight * 0.5),
      (totalWidth = width * items.length);

    slider.style.width = totalWidth + "px";

    for (var i = 0; i < items.length; i++) {
      let item = items[i];
      item.style.width = width - margin * 2 + "px";
      item.style.height = height + "px";
    }
  }

  function move(index) {
    if (index < 1) index = items.length;
    if (index > items.length) index = 1;
    currIndex = index;

    for (var i = 0; i < items.length; i++) {
      let item = items[i],
        box = item.getElementsByClassName("item__3d-frame")[0];
      if (i == index - 1) {
        item.classList.add("carousel__slider__item--active");
        box.style.transform = "perspective(1200px)";
      } else {
        item.classList.remove("carousel__slider__item--active");
        box.style.transform =
          "perspective(1200px) rotateY(" + (i < index - 1 ? 40 : -40) + "deg)";
      }
    }

    slider.style.transform =
      "translate3d(" +
      (index * -width + width / 2 + window.innerWidth / 2) +
      "px, 0, 0)";
  }

  function timer() {
    clearInterval(interval);
    interval = setInterval(() => {
      move(++currIndex);
    }, intervalTime);
  }

  function prev() {
    move(--currIndex);
    timer();
  }

  function next() {
    move(++currIndex);
    timer();
  }

  function bindEvents() {
    window.onresize = resize;
    prevBtn.addEventListener("click", () => {
      prev();
    });
    nextBtn.addEventListener("click", () => {
      next();
    });
  }

  init();
})();
