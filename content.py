
import pandas as pd 
import numpy as np 
df1=pd.read_csv('content/tmdb_5000_credits.csv')
df2=pd.read_csv('content/tmdb_5000_movies.csv')





df1.columns = ['id','tittle','cast','crew']
df2= df2.merge(df1,on='id')


# # In[ ]:


# df2.head(5)


# # In[4]:


# C= df2['vote_average'].mean()
# C


# # In[5]:


# m= df2['vote_count'].quantile(0.9)
# m


# # In[6]:


# q_movies = df2.copy().loc[df2['vote_count'] >= m]
# q_movies.shape


# # In[7]:


# def weighted_rating(x, m=m, C=C):
#     v = x['vote_count']
#     R = x['vote_average']
#     # Calculation based on the IMDB formula
#     return (v/(v+m) * R) + (m/(m+v) * C)


# # In[8]:


# # Define a new feature 'score' and calculate its value with `weighted_rating()`
# q_movies['score'] = q_movies.apply(weighted_rating, axis=1)


# # In[9]:


# #Sort movies based on score calculated above
# q_movies = q_movies.sort_values('score', ascending=False)

# #Print the top 15 movies
# q_movies[['title', 'vote_count', 'vote_average', 'score']].head(10)


# # In[10]:


# pop= df2.sort_values('popularity', ascending=False)
# import matplotlib.pyplot as plt
# plt.figure(figsize=(12,4))

# plt.barh(pop['title'].head(6),pop['popularity'].head(6), align='center',
#         color='skyblue')
# plt.gca().invert_yaxis()
# plt.xlabel("Popularity")
# plt.title("Popular Movies")


# # In[11]:


# df2['overview'].head(5)


# # In[12]:


# #Import TfIdfVectorizer from scikit-learn
# from sklearn.feature_extraction.text import TfidfVectorizer

# #Define a TF-IDF Vectorizer Object. Remove all english stop words such as 'the', 'a'
# tfidf = TfidfVectorizer(stop_words='english')

# #Replace NaN with an empty string
# df2['overview'] = df2['overview'].fillna('')

# #Construct the required TF-IDF matrix by fitting and transforming the data
# tfidf_matrix = tfidf.fit_transform(df2['overview'])

# #Output the shape of tfidf_matrix
# tfidf_matrix.shape


# # In[13]:


# # Import linear_kernel
# from sklearn.metrics.pairwise import linear_kernel

# # Compute the cosine similarity matrix
# cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)


# In[14]:


# #Construct a reverse map of indices and movie titles
indices = pd.Series(df2.index, index=df2['title']).drop_duplicates()





# # Parse the stringified features into their corresponding python objects
# from ast import literal_eval

# features = ['cast', 'crew', 'keywords', 'genres']
# for feature in features:
#     df2[feature] = df2[feature].apply(literal_eval)


# # In[19]:


# # Get the director's name from the crew feature. If director is not listed, return NaN
# def get_director(x):
#     for i in x:
#         if i['job'] == 'Director':
#             return i['name']
#     return np.nan


# # In[20]:


# # Returns the list top 3 elements or entire list; whichever is more.
# def get_list(x):
#     if isinstance(x, list):
#         names = [i['name'] for i in x]
#         #Check if more than 3 elements exist. If yes, return only first three. If no, return entire list.
#         if len(names) > 3:
#             names = names[:3]
#         return names

#     #Return empty list in case of missing/malformed data
#     return []


# # In[21]:


# # Define new director, cast, genres and keywords features that are in a suitable form.
# df2['director'] = df2['crew'].apply(get_director)

# features = ['cast', 'keywords', 'genres']
# for feature in features:
#     df2[feature] = df2[feature].apply(get_list)


# # In[22]:


# # Print the new features of the first 3 films
# df2[['title', 'cast', 'director', 'keywords', 'genres']].head(3)


# # In[23]:


# # Function to convert all strings to lower case and strip names of spaces
# def clean_data(x):
#     if isinstance(x, list):
#         return [str.lower(i.replace(" ", "")) for i in x]
#     else:
#         #Check if director exists. If not, return empty string
#         if isinstance(x, str):
#             return str.lower(x.replace(" ", ""))
#         else:
#             return ''


# # In[24]:


# # Apply clean_data function to your features.
# features = ['cast', 'keywords', 'director', 'genres']

# for feature in features:
#     df2[feature] = df2[feature].apply(clean_data)


# # In[25]:


# def create_soup(x):
#     return ' '.join(x['keywords']) + ' ' + ' '.join(x['cast']) + ' ' + x['director'] + ' ' + ' '.join(x['genres'])
# df2['soup'] = df2.apply(create_soup, axis=1)


# # In[26]:


# # Import CountVectorizer and create the count matrix
# from sklearn.feature_extraction.text import CountVectorizer

# count = CountVectorizer(stop_words='english')
# count_matrix = count.fit_transform(df2['soup'])


# # In[27]:


# # Compute the Cosine Similarity matrix based on the count_matrix
# from sklearn.metrics.pairwise import cosine_similarity

# cosine_sim2 = cosine_similarity(count_matrix, count_matrix)
import joblib
cosine_sim2 = joblib.load('content/cosine_sim2_model.joblib')

# In[28]:
import json
import sys
def get_recommendations(title):
    # Check if the title is a non-empty string
    if not title:
        print("Error: Empty title provided")
        return {"error": "Empty title"}

    # Check if the title exists in the indices dictionary
    if title not in indices:
        print(f"Error: Title '{title}' not found in the dataset")
        return {"error": "Movie not found"}

    # Get the index of the movie that matches the title
    idx = indices[title]

    # Get the pairwise similarity scores of all movies with that movie
    sim_scores = list(enumerate(cosine_sim2[idx]))

    # Sort the movies based on the similarity scores
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    # Get the indices of the 10 most similar movies
    movie_indices = [i[0] for i in sim_scores[1:11]]

    # Get the titles of the most similar movies
    similar_movies = list(df2['title'].iloc[movie_indices])

    # Return the top 10 most similar movies
    return {"recommendations": similar_movies}

if __name__ == "__main__":
    # Assuming that you are passing the favorite movie as a command-line argument
    favorite_movie = sys.argv[1] if len(sys.argv) > 1 else "Fifty Shades of Grey"
    
    # Call the get_recommendations function with the provided movie title
    recommendations = get_recommendations(favorite_movie)
    
    # Print the recommendations as JSON to the standard output
    print(json.dumps(recommendations))




# Reset index of our main DataFrame and construct reverse mapping as before
df2 = df2.reset_index()
indices = pd.Series(df2.index, index=df2['title'])

# Import joblib directly
# 

# # Save the cosine_sim2 matrix to a file
# joblib.dump(cosine_sim2, 'cosine_sim2_model.joblib')






