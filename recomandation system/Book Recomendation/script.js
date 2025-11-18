let books = [];
let similarity = [];

// Load JSON data
async function loadData() {
  const [booksRes, similarityRes] = await Promise.all([
    fetch("books.json"),
    fetch("similarity.json")
  ]);

  books = await booksRes.json();
  similarity = await similarityRes.json();

  populateBookList();
}

// Populate dropdown with book titles
function populateBookList() {
  const select = document.getElementById("bookSelect");
  select.innerHTML = "";

  books.forEach(book => {
    const option = document.createElement("option");
    option.value = book.title;
    option.textContent = book.title;
    select.appendChild(option);
  });
}

// Recommendation logic
function recommend(bookTitle) {
  const bookIndex = books.findIndex(b => b.title === bookTitle);
  if (bookIndex === -1) {
    alert(`Book "${bookTitle}" not found in database.`);
    return [];
  }

  const distances = similarity[bookIndex];
  const indexedDistances = distances.map((val, index) => [index, val]);

  // Sort by similarity score (descending), skip self [0]
  const similarBooks = indexedDistances
    .sort((a, b) => b[1] - a[1])
    .slice(1, 6);

  return similarBooks.map(([idx, score]) => ({
    title: books[idx].title,
    score: score.toFixed(3)
  }));
}

// Display recommendations
function showRecommendations(recommendations, selectedBook) {
  const list = document.getElementById("recommendations");
  list.innerHTML = "";

  if (recommendations.length === 0) {
    list.innerHTML = "<li>No recommendations found.</li>";
    return;
  }

  const heading = document.querySelector(".results h2");
  heading.textContent = `Recommendations for "${selectedBook}":`;

  recommendations.forEach((book, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${i + 1}. <span>${book.title}</span> — similarity: ${book.score}`;
    list.appendChild(li);
  });
}

// Button click handler
document.getElementById("recommendBtn").addEventListener("click", () => {
  const selectedBook = document.getElementById("bookSelect").value;
  const recommendations = recommend(selectedBook);
  showRecommendations(recommendations, selectedBook);
});

// Initialize data
loadData();
