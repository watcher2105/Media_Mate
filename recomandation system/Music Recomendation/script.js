let music = [];
let similarity = [];

async function loadData() {
  try {
    const musicRes = await fetch("data.json");
    music = await musicRes.json();

    const simRes = await fetch("similarity.json");
    similarity = await simRes.json();

    const select = document.getElementById("songSelect");
    music.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.song.toLowerCase();
      option.textContent = item.song;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

function recommend(selectedSong) {
  selectedSong = selectedSong.toLowerCase().trim();
  const index = music.findIndex((s) => s.song.toLowerCase().includes(selectedSong));

  if (index === -1) {
    alert(`❌ No songs found matching "${selectedSong}"`);
    return [];
  }

  const distances = similarity[index];
  const indexedDistances = distances.map((dist, i) => [i, dist]);
  indexedDistances.sort((a, b) => b[1] - a[1]);

  const top5 = indexedDistances.slice(1, 6);
  return top5.map((i) => music[i[0]].song);
}

document.getElementById("recommendBtn").addEventListener("click", () => {
  const selectedSong = document.getElementById("songSelect").value;
  const resultsDiv = document.getElementById("recommendations");

  if (!selectedSong) {
    alert("Please select a song first.");
    return;
  }

  const recs = recommend(selectedSong);
  resultsDiv.innerHTML = "";

  if (recs.length === 0) {
    resultsDiv.innerHTML = `<p>❌ Sorry, no recommendations found.</p>`;
  } else {
    let html = `<h3>✅ Top 5 Recommendations for "${selectedSong}":</h3><ul>`;
    recs.forEach((r, i) => (html += `<li>${i + 1}. ${r}</li>`));
    html += "</ul>";
    resultsDiv.innerHTML = html;
  }
});

loadData();
