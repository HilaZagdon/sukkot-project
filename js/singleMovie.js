const fetchMovies = (movieId) => {
  let url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=f673b4c51255192622a586f74ec1f251&language=en-US&append_to_response=credits`;
   
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      movieTitle.innerHTML =  
      `<p >title:${data.title}</p>`
          dateAndRuntime.innerHTML = 
        `  <p >date:${data.release_date}</p> 
        <p >runtime:${data.runtime}</p>`
      
        const genreNames = data.genres.map((genre) => genre.name);
        movieGenre.innerHTML = `<span>${genreNames.join(", ")}</span>`

        let crewHtml = '';

        for(let i = 0 ; i<10 && i <data.credits.crew.length ; i++){
        const crew = data.credits.crew[i];
        const crewNames = `${crew.job} : ${crew.name}`;
        crewHtml += (i > 0 ? ' , ' : '') + crewNames;
}
movieCrew.innerHTML = `<span>${crewHtml}</span>`;

let castHtml = '';

for (let i = 0; i < data.credits.cast.length; i++) {
    const cast = data.credits.cast[i];
    const characterName = cast.character;
    const actorName = cast.name;
    const profilePath = `https://image.tmdb.org/t/p/original${cast.profile_path}`
   
    const imageTag = profilePath ? `<img src="${profilePath}" alt="${actorName}" width="50" height="50">` : '';

    const slashIndex = characterName.indexOf('/');

    if (slashIndex !== -1) {
        const characters = characterName.substring(0, slashIndex);
        castHtml += (i > 0 ? ' , ' : '') + `${imageTag} ${characters} : ${actorName} `;
    } else {
        castHtml += (i > 0 ? ' , ' : '') + `${imageTag} ${characterName} : ${actorName} `;
    }

    if (i >= 9) {
        break;
    }
}

movieCast.innerHTML = `<span>${castHtml}</span>`

         MoviePoster.innerHTML = 
          `<img  style="width:20%; height:auto;" src="https://image.tmdb.org/t/p/original${data.poster_path}" />`
       ;
 })
   
    .catch((error) => {
      console.log(error);
    });
}


 searchIdButton.addEventListener('click', () => {
  SearchMovieVal = searchByIdInput.value
   fetchMovies(SearchMovieVal)
 })

 fetchMovies(35)