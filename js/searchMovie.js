const fetchMovies = (movie, page = 1) => {
  const url = `https://api.themoviedb.org/3/search/movie?language=en-US&query=${movie}&page=${page}&api_key=f673b4c51255192622a586f74ec1f251`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      moviesPresentation.innerHTML = '';
      data.results.forEach((movieResult) => {
        if (movieResult.poster_path !== null) {
          moviesPresentation.innerHTML += `
            <p >Title: ${movieResult.title}</p>
            <p >Release Date: ${movieResult.release_date}</p>
            <img style="width:20%; height:auto;" src="https://image.tmdb.org/t/p/original${movieResult.poster_path}" />
          `;
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

const pagination = document.querySelector('.pagination');
const totalPages = 5;

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

const updatePagination = () => {
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
};

let currentPage = 1;
updatePagination();

searchMoviesByNameBtn.addEventListener('click', () => {
  currentPage = 1;
  fetchMovies(searchMoviesByName.value, currentPage);
});


