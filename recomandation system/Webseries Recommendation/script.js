let shows = [];
let topMatches = [];

// Load JSON data
async function loadData() {
  try {
    const [showsRes, similarityRes] = await Promise.all([
      fetch("shows.json"),
      fetch("shows_similarity.json")
    ]);

    shows = await showsRes.json();
    topMatches = await similarityRes.json();

    populateShowList();
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

// Populate dropdown with show titles
function populateShowList() {
  const select = document.getElementById("showSelect");
  select.innerHTML = "";

  shows.forEach(show => {
    const option = document.createElement("option");
    option.value = show.title;
    option.textContent = show.title;
    select.appendChild(option);
  });
}

// Recommendation logic
function recommend(showTitle) {
  const showIndex = shows.findIndex(s => s.title === showTitle);
  if (showIndex === -1) {
    alert(`Show "${showTitle}" not found in catalog.`);
    return [];
  }

  const neighbours = topMatches[showIndex] || [];

  return neighbours.map(([index, score]) => ({
    title: shows[index].title,
    score: Number.parseFloat(score).toFixed(3)
  }));
}

// Show recommendations on page
function showRecommendations(recommendations, selectedShow) {
  const list = document.getElementById("recommendations");
  list.innerHTML = "";

  const heading = document.querySelector(".results h2");
  heading.textContent = `Recommendations for "${selectedShow}":`;

  if (recommendations.length === 0) {
    list.innerHTML = "<li>No recommendations found.</li>";
    return;
  }

  recommendations.forEach((rec, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${index + 1}. <span>${rec.title}</span> — similarity: ${rec.score}`;
    list.appendChild(li);
  });
}

// Button click handler
document.getElementById("recommendBtn").addEventListener("click", () => {
  const selectedShow = document.getElementById("showSelect").value;
  const recommendations = recommend(selectedShow);
  showRecommendations(recommendations, selectedShow);
});

// Initialize data
loadData();
