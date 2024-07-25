const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    budget: Number,
    genres: [String],
    homepage: String,
    id: Number,
    keywords: [String],
    original_language: String,
    original_title: String,
    overview: String,
    popularity: Number,
    production_companies: [String],
    production_countries: [String],
    release_date: Date,
    revenue: Number,
    runtime: Number,
    spoken_languages: [String],
    status: String,
    tagline: String,
    title: String,
    vote_average: Number,
    vote_count: Number
 
});

const Movie= mongoose.model('content', movieSchema);
module.exports=Movie