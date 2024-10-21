import { Route, HashRouter as Router } from 'react-router-dom';
import MovieList from '../MovieList/MovieList';
import './App.css';
import DetailsPage from '../DetailsPage/DetailsPage';


function App() {
  return (
    
    <div className="App">
      <h1>The Movies Saga!</h1>
      <Router>        
        <Route path="/" exact>
          <MovieList />
        </Route>

        <Route path="/details/:id" component={DetailsPage} exact>   
        <DetailsPage />
        </Route>
        {/* Add Movie page */}
        
      </Router>
     
      
    </div>
  
  );

}

export default App;
