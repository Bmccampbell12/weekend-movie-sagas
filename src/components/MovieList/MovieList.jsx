import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import './MovieList.css';

function MovieList() {
  const dispatch = useDispatch();
  const history = useHistory(); // UseHistory for navigation
  const movies = useSelector(store => store.movies);
  

  useEffect(() => {
    dispatch({ type: 'FETCH_MOVIES' });
  }, [dispatch]); 

  const goToDetails = (id) => {
    history.push(`/details/${id}`) // Navigation to details page. 
  }

  return (
    <main>
      <h1>MovieList</h1>
      <section className="movies">
        {movies.map(movie => (
            <div 
             data-testid='movieItem' 
             key={movie.id} 
             onClick={() => goToDetails(movie.id)}> 
              <h3>{movie.title}</h3>
              <img 
              data-testid="toDetails"
              src={movie.poster} 
              alt={movie.title}
              />
            </div>
          ))}
      </section>
    </main>
  );
}

export default MovieList;
