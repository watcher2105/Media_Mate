let movies = [];
let similarity = [];

// Load JSON data
async function loadData() {
  const [moviesRes, similarityRes] = await Promise.all([
    fetch("movies.json"),
    fetch("similarity.json")
  ]);

  movies = await moviesRes.json();
  similarity = await similarityRes.json();

  populateMovieList();
}

// Populate dropdown with movie titles
function populateMovieList() {
  const select = document.getElementById("movieSelect");
  select.innerHTML = "";

  movies.forEach(movie => {
    const option = document.createElement("option");
    option.value = movie.original_title;
    option.textContent = movie.original_title;
    select.appendChild(option);
  });
}

// Recommendation logic
function recommend(selectedMovie) {
  const movieIndex = movies.findIndex(m => m.original_title === selectedMovie);
  if (movieIndex === -1) return [];

  const distances = similarity[movieIndex];
  const indexedDistances = distances.map((val, index) => [index, val]);

  const similarMovies = indexedDistances
    .sort((a, b) => b[1] - a[1])
    .slice(1, 6); // top 5 (excluding itself)

  return similarMovies.map(([index]) => movies[index].original_title);
}

// Show recommendations on UI
function showRecommendations(recommendations) {
  const list = document.getElementById("recommendations");
  list.innerHTML = "";

  if (recommendations.length === 0) {
    list.innerHTML = "<li>No recommendations found.</li>";
    return;
  }

  recommendations.forEach(title => {
    const li = document.createElement("li");
    li.textContent = title;
    list.appendChild(li);
  });
}

// Event Listener
document.getElementById("recommendBtn").addEventListener("click", () => {
  const selectedMovie = document.getElementById("movieSelect").value;
  const recommendations = recommend(selectedMovie);
  showRecommendations(recommendations);
});

// Load data on page load
loadData();
