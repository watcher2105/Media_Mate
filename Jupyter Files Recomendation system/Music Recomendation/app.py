# ==============================
# 🎵 Spotify Music Recommendation System
# ==============================

import pickle
import streamlit as st

# ==============================
# ✅ Load Preprocessed Data
# ==============================
music = pickle.load(open("df.pkl", "rb"))
similarity = pickle.load(open("similarity.pkl", "rb"))

# Reset index to ensure alignment with similarity matrix
music = music.reset_index(drop=True)

# Handle column naming variations
if "song" not in music.columns and "title" in music.columns:
    music["song"] = music["title"]

music["song"] = music["song"].str.lower()

# Sanity check
if similarity.shape[0] != len(music):
    st.error("❌ Error: similarity.pkl and df.pkl are mismatched. Please regenerate them.")
    st.stop()

# ==============================
# ✅ Recommendation Function
# ==============================
def recommend(song):
    """
    Recommends up to 5 similar songs based on cosine similarity.
    """
    song = song.lower().strip()

    matches = music[music["song"].str.contains(song, case=False, na=False)]
    if matches.empty:
        st.error(f"❌ No songs found matching '{song}'")
        return []

    index = int(matches.index[0])
    st.info(f"✓ Found: {music.iloc[index]['song'].title()} at index {index}")

    try:
        distances = similarity[index]
    except Exception as e:
        st.error(f"❌ Error accessing similarity: {e}")
        return []

    recommended_indices = sorted(
        list(enumerate(distances)), reverse=True, key=lambda x: x[1]
    )[1:6]

    recommended_music_names = []

    for i in recommended_indices:
        idx = int(i[0])
        song_name = music.iloc[idx].get("song", "Unknown")
        recommended_music_names.append(song_name.title())

    return recommended_music_names

# ==============================
# ✅ Streamlit UI
# ==============================
st.set_page_config(page_title="Music Recommendation App", page_icon="🎧", layout="wide")
st.title("🎶 Spotify Music Recommendation System")
st.markdown("Select a song from the dropdown to get 5 similar song recommendations.")

# Get unique songs and sort them
available_songs = music["song"].unique()
available_songs_title = [song.title() for song in available_songs]

# Dropdown to select from all available songs (up to 90)
st.subheader("🎵 Choose from Available Songs:")
selected_song_name = st.selectbox(
    "Select a song:",
    available_songs_title[:90] if len(available_songs_title) >= 90 else available_songs_title,
    index=0
)

if st.button("🔍 Recommend"):
    if selected_song_name.strip() == "":
        st.warning("Please select a song first.")
    else:
        names = recommend(selected_song_name)
        if not names:
            st.error("❌ Sorry, that song was not found in your dataset.")
        else:
            st.success(f"✅ Top 5 Recommendations based on '{selected_song_name}':")
            for i, name in enumerate(names, 1):
                st.write(f"{i}. {name}")



