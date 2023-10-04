const fetchMovies = (page = 1, popularity = 'day') => {
  let url;

  if (popularity === 'day') {
    url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}&api_key=f673b4c51255192622a586f74ec1f251`;
  } else if (popularity === 'week') {
    if (page >= 1 && page <= 5) {
      const startPage = page + 9;
      url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${startPage}&api_key=f673b4c51255192622a586f74ec1f251`;
    } else {
      console.log('nope');
      return;
    }
  }

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      moviesPresentation.innerHTML = '';
      data.results.forEach((movieResult) => {
        moviesPresentation.innerHTML += `
  <p>title:${movieResult.title}<i class="heart-icon fa-regular fa-heart" style="color: #ff0000;"></i></p>
  <img style="width: 20%; height: auto;" src="https://image.tmdb.org/t/p/original${movieResult.poster_path}" />
`;
      });
      moviesPresentation.addEventListener('click', (event) => {
        const target = event.target;
      
        const heartIcon = target.tagName === 'I' && target.classList.contains('fa-heart')
          ? target
          : target.closest('i.fa-heart');
      
        if (heartIcon) {
          const movieTitle = target.closest('p').textContent.split(':')[1].trim();
          const movieData = data.results.find((movieResult) => movieResult.title === movieTitle);
      
          if (heartIcon.classList.contains('fa-regular')) {
            heartIcon.classList.remove('fa-regular');
            heartIcon.classList.add('fa-solid');
            heartIcon.style.color = '#ff0000';
      
            if (movieData) {
              likedMoviesArray.push(movieData);
            }
          } else if (heartIcon.classList.contains('fa-solid')) {
            heartIcon.classList.remove('fa-solid');
            heartIcon.classList.add('fa-regular');
      
            if (movieData) {
              const index = likedMoviesArray.findIndex((movie) => movie.id === movieData.id);
              if (index !== -1) {
                likedMoviesArray.splice(index, 1);
              }
            }
          }
      
          localStorage.setItem("likedMovies", JSON.stringify(likedMoviesArray));
        }
      });
      const heartIcons = document.querySelectorAll('.heart-icon');
      heartIcons.forEach((heartIcon) => {
        const movieTitle = heartIcon.closest('p').textContent.split(':')[1].trim();
        if (likedMoviesArray.includes(movieTitle)) {
          heartIcon.classList.remove('fa-regular');
          heartIcon.classList.add('fa-solid');
          heartIcon.style.color = '#ff0000';
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

 let currentPage = 1;
let popularity = 'day'
 dailyId.addEventListener('click', () => {
  popularity = 'day'

currentPage = 1 
      fetchMovies(currentPage, 'day');


});
weeklyId.addEventListener('click', () => {
  popularity = 'week'
  currentPage = 1 
        fetchMovies(currentPage, 'week');
  
  
  });





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
    fetchMovies(currentPage, popularity);
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


updatePagination();

let likedMoviesArray = JSON.parse(localStorage.getItem("likedMovies")) || [];