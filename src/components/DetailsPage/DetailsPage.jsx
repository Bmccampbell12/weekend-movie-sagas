import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from 'react-router-dom';
import './DetailsPage.css';

// Function to fetch movie ID from store
function DetailsPage() {
    const dispatch = useDispatch();
    const { id } = useParams()  // Fetches Movie ID from url. 
    const movie = useSelector(store => store.selectedMovie); // Will fetch selected movie from store.
    const history = useHistory();
 // Fetches movie details on mount or whenever ID changes
 console.log('selected movie from redux state:', movie)
useEffect(() => {
    console.log('fetching details for movie id:', id)
    dispatch({ type: 'FETCH_MOVIE_DETAILS', payload: id }); // Fetches movie details
}, [dispatch, id])

return (
    <div data-testid="movieDetails">
        <h1>{movie.title}</h1>
        <img 
        src={movie.poster} 
        alt={movie.title} 
        />
        <p>{movie.description}</p>

        <ul>
            {movie.genres && movie.genres.map((genre, index) => (
                <li key={index}>{genre}</li> // shows all genres
            ))}
        </ul>
        <button 
        data-testid="toList" 
        onClick={() => history.push('/')}>
            Back to Movie List
        </button>
    </div>
    );
 }

 export default DetailsPage;