from surprise.dump import load
from pymongo import MongoClient
import pandas as pd
import sys

# Connect to MongoDB Atlas
mongo_uri = 'mongodb+srv://es333:fxjm11066@mediapicks.whfwxlk.mongodb.net/MediaPick?retryWrites=true&w=majority'
client = MongoClient(mongo_uri)

# Replace 'MediaPick' with your MongoDB database name
db = client['MediaPick']
collection1 = db['ratings']

# Load link data from CSV
link = pd.read_csv('calibrative/links_small.csv')

loaded_algo = load('svd_model.pkl')[1]  # Index 1 contains the loaded algorithm

# Generate recommendations for the specified user
# Generate recommendations for the specified user
uID = sys.argv[1] if len(sys.argv) > 1 else "20"  # Changed 20 to '20' as uID should be a string
recommended_movies = []

watched_movies = set(
    doc['movieId'] for doc in collection1.find({'userId': int(uID)}, {'movieId': 1})
)

for movie_id in collection1.distinct('movieId'):
    # Skip if the user has already watched the movie
    if movie_id in watched_movies:
        continue
    # Predict rating for the user-movie combination
    prediction = loaded_algo.predict(int(uID), movie_id)
    # Add the predicted rating along with user_id and movie_id
    recommended_movies.append((int(uID), movie_id, prediction.est))

# Sort recommended movies by estimated rating in descending order
recommended_movies.sort(key=lambda x: x[2], reverse=True)

counter = 0
# Create an empty list to store TMDB IDs
tmdb_ids_array = []

for _, movie_id, _ in recommended_movies:
    if counter < 15:
        tmdb_id = str(link.loc[link['movieId'] == movie_id, 'imdbId'].iloc[0])
        tmdb_ids_array.append(tmdb_id)
        counter += 1
    else:
        break

# Print the array of TMDB IDs
print(tmdb_ids_array)
