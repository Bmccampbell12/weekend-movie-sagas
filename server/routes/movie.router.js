const express = require('express');
const router = express.Router();
const pool = require('../modules/pool')

router.get('/', (req, res) => {
  const query = `
    SELECT * FROM "movies"
      ORDER BY "title" ASC;
  `;
  pool.query(query)
    .then(result => {
      res.send(result.rows);
    })
    .catch(err => {
      console.log('ERROR: Get all movies', err);
      res.sendStatus(500)
    })
});
router.get('/api/movies/details/:id', async (req, res) => {
  const query = `
  SELECT
    movies.id,
    movies.title,
    movies.poster,
    movies.description,
    ARRAY_AGG(genres.name) AS genres
  FROM
    movies
  JOIN
    movies_genres ON movies.id = movies_genres.movie_id
  JOIN
    genres ON genres.id = movies_genres.genre_id
  WHERE
    movies.id = $1
  GROUP BY
    movies.id;
  `;
  pool.query(query, [req.params.id])
  .then(result => {
    if (result.rows.length > 0) {
    res.send(result.rows[0]);
    } else {
      res.sendStatus(404)
    }
  })
  .catch(err => {
    console.log('Error in GET movie details', err)
    res.sendStatus(500);
  })
});
// Adds a new movie
router.post('/', (req, res) => {
  console.log(req.body);
  // RETURNING "id" will give us back the id of the created movie
  const insertMovieQuery = `
    INSERT INTO "movies" 
      ("title", "poster", "description")
      VALUES
      ($1, $2, $3)
      RETURNING "id";
  `;

  const insertMovieValues = [
    req.body.title,
    req.body.poster,
    req.body.description
  ];
  // FIRST QUERY MAKES MOVIE
  pool.query(insertMovieQuery, insertMovieValues)
    .then(result => {
      // ID IS HERE!
      console.log('New Movie Id')
      const createdMovieId = result.rows[0].id

      // Now handle the genre reference:
      const insertMovieGenreQuery = `
        INSERT INTO "movies_genres" 
          ("movie_id", "genre_id")
          VALUES
          ($1, $2);
      `;
    
      const insertMovieGenreValues = [
        createdMovieId,
        req.body.genre_id
      ]
      // SECOND QUERY ADDS GENRE FOR THAT NEW MOVIE
      pool.query(insertMovieGenreQuery, insertMovieGenreValues)
        .then(() => {
          //Now that both are done, send back success!
          res.sendStatus(201);
        })
        .catch(err => {
          // catch for second query
          console.log('Error inserting genre', err);
          res.sendStatus(500); // error in second
      })
    })
    .catch(err => { // 👈 Catch for first query
      console.log('Error inserting new movie', err);
      res.sendStatus(500) // error in first query
    })
    router.listen(5001, () => {
      console.log('server running on port 5001')
    })
})

module.exports = router;
