import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import { takeEvery, put, call } from 'redux-saga/effects';
import axios from 'axios';

// Create the rootSaga generator function
function* rootSaga() {
  yield takeEvery('FETCH_MOVIES', fetchAllMovies);
  yield takeEvery('FETCH_MOVIE_DETAILS', fetchMovieDetails); // New Saga added
}
 // Saga for fetching all movies
function* fetchAllMovies() {
  try {
    // Get the movies:
    const moviesResponse = yield call(axios.get, `/api/movies/`); // Axios call
    // Set the value of the movies reducer:
    yield put({
      type: 'SET_MOVIES',
      payload: moviesResponse.data
    });
  } catch (error) {
    console.log('fetchAllMovies error:', error);
  }
}
// Created new Saga to fetch movie details by ID.
function* fetchMovieDetails(action) {
  console.log('running saga for action:', action)
  try {
    console.log('fetching movie details for id.', action.payload)
    const detailsResponse = yield call(axios.get, `/api/movies/details/${action.payload}`); // Axios call with ID
    console.log('movie details response:', detailsResponse.data)
    yield put({ 
      type: 'SET_MOVIE_DETAILS', 
      payload: detailsResponse.data,
     }) 
  } catch (error) {
    console.log('FetchMovie details error', error)
  }
}

// Movies Reducer
const movies = (state = [], action) => {
  switch (action.type) {
    case 'SET_MOVIES':
      return action.payload;
    default:
      return state;
  }
}
// Used to store the movie genres
// const genres = (state = [], action) => {
//   switch (action.type) {
//     case 'SET_GENRES':
//       return action.payload;
//     default:
//       return state;
//   }
// }
// Reducer to store details of selected movie title
const selectedMovie = (state = {}, action) => {
  switch (action.type) {
    case 'SET_MOVIE_DETAILS':
      console.log('setting movie details state:', action.payload)
      return action.payload;
      default:
        return state;
  }
};
// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

// Create one store that all components can use
const store = createStore(
  combineReducers({
    movies,
    selectedMovie, // Added the selectedMovie reducer
  }),
  // Add sagaMiddleware to our store
  applyMiddleware(sagaMiddleware, logger),
);

// Pass rootSaga into our sagaMiddleware
sagaMiddleware.run(rootSaga);

export default store;
