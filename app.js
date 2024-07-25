const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.static(__dirname));
const { exec } = require('child_process');
app.set('view engine', 'ejs')

const port = 3000;
const userModel = require('./models/user');
const collaModel = require('./models/colla');
const linkModel = require('./models/link');
const ratingModel = require('./models/ratings');
const posterModel = require('./models/posters');
const possterModel = require('./models/possters');



app.use(express.urlencoded({ extended: true }));

const dp = 'mongodb+srv://es333:fxjm11066@mediapicks.whfwxlk.mongodb.net/MediaPick?retryWrites=true&w=majority'
mongoose.connect(dp)
    .then(() => {
        console.log('DB connected');
        app.listen(port, () => console.log(`Server is running on port ${port}`));
    })
    .catch((err) => console.log(err));

app.get('/index', async (req, res) => {
        try {
            const titles = [
                "The Shawshank Redemption",
                "Fight Club",
                "The Dark Knight",
                "Pulp Fiction",
                "Inception",
                "The Godfather",
                "Interstellar",
                "Forrest Gump",
                "The Lord of the Rings: The Return of the King",
                "The Empire Strikes Back"
            ];
            
            // Now 'titles' array holds only the titles from the provided data
            
            posterModel.find({ Title: { $in: titles } })
            .then(posters1 => {
                let name1= posters1.map(x=>x.Title)
                let irating=posters1.map(y =>y.score )
                possterModel.find({ title: { $in: titles } })
                .then(posters1 => {
                    let posters = posters1.map(poster => "https://image.tmdb.org/t/p/original" + poster.poster_path);
                    let back = posters1.map(p=> "https://image.tmdb.org/t/p/w1280" + p.backdrop_path);
                    let name= posters1.map(x=>x.title)
                    let irating = posters1.map(c => parseFloat(c.vote_average).toFixed(1));
                    console.log(irating)
                 
                    res.render('index', { posters: posters, name: name,ratings:irating,back :back });
    
                })
             })
                
           
        } catch (error) {
            console.error('Error rendering index page:', error);
            res.status(500).send('Internal Server Error');
        }
});    




app.get('/home', (req, res) => {
    res.render('home')
});
app.get('/', (req, res) => {
    res.redirect('index')
});
app.get('/home_page', (req, res) => {
    res.render('home')
});

let id=0;
app.post('/Movie_selection', async (req, res) => {
    try {
        const { name, password } = req.body;

        if (!name || !password) {
            return res.status(400).send('Name and password are required.');
        }

        const check = await userModel.findOne({ name: req.body.name });

        if (!check) {
            // If the user does not exist, proceed with creating a new user
          

            const highestUserId = await userModel.findOne({}, { userId: 1 }, { sort: { userId: -1 } });

            // Set id to the highest userId + 1 or 1 if no users exist
            id = highestUserId ? highestUserId.userId + 1 : 1;

            const data = {
                name,
                password,
                userId: id
            };

            const result = await userModel.create(data);

            res.redirect('Movie_selection');
        } else {
            // If the user already exists, send a response indicating so
            res.send('User already exists');
        }
    } catch (error) {
        console.error('Error handling sign-up request:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/home', async (req, res) => {
    try {
      
        if (req.body.signInPage === 'true') {
            const check = await userModel.findOne({ name: req.body.name });
           
            if (check.password === req.body.password) {
                
                const pythonScriptPath = 'calibrative/calb.py';
                const command = `python ${pythonScriptPath} "${check.userId}"`;
             
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error executing Python script: ${stderr}`);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }

                    console.log(stdout);
                   let  uname=check.name

                    const trimmedStdout = stdout.trim().replace(/'/g, '"');

                    // Parse the string containing IMDb IDs into an array
                    const imdbIdsArray = JSON.parse(trimmedStdout);

                    // Query the MongoDB database with the parsed array
                    posterModel.find({ imdbId: { $in: imdbIdsArray } })
                    .then(posters1 => {
                        let name1= posters1.map(x=>x.Title) 
                          possterModel.find({ title: { $in: name1 } })
                        .then(posters1 => {
                            let posters = posters1.map(poster => "https://image.tmdb.org/t/p/original" + poster.poster_path);
                            let name= posters1.map(x=>x.title)
                            let irating = posters1.map(c => parseFloat(c.vote_average).toFixed(1));
                            res.render('home', { posters: posters, name: name,ratings:irating ,uname :uname});
        
                        })
                     })
                        .catch(err => {
                            // Handle errors
                            console.error(err);
                            return res.status(500).json({ error: 'Internal Server Error' });
                        });
                });
            } else {
                res.send('Invalid credentials');
            }
        } else {
            console.log(id)
          const unam = await userModel.findOne({ userId: id });
        const uname = unam.name;
           
        const movie1Title = req.body.movie;
        const rating1 = req.body.rating;
        const movie2Title = req.body.movie2;
        const rating2 = req.body.rating2;
        const movie3Title = req.body.movie3;
        const rating3 = req.body.rating3;
        const movie4Title = req.body.movie4;
        const rating4 = req.body.rating4;
        const movie5Title = req.body.movie5;
        const rating5 = req.body.rating5;

        try {
            // Find the movie1 by title
            const movie1 = await collaModel.findOne({ original_title: movie1Title });
            console.log(movie1.id, id, rating1);

            const m_id1 = await linkModel.findOne({ tmdbId: movie1.id });
            const newRating1 = new ratingModel({
                userId: id,
                movieId: m_id1.movieId,
                rating: rating1
            });
            await newRating1.save();

            // Repeat the process for movie2
            const movie2 = await collaModel.findOne({ original_title: movie2Title });
            console.log(movie2.id, id, rating2);

            const m_id2 = await linkModel.findOne({ tmdbId: movie2.id });
            const newRating2 = new ratingModel({
                userId: id,
                movieId: m_id2.movieId,
                rating: rating2
            });
            await newRating2.save();

            // Repeat the process for movie3
            const movie3 = await collaModel.findOne({ original_title: movie3Title });
            console.log(movie3.id, id, rating3);

            const m_id3 = await linkModel.findOne({ tmdbId: movie3.id });
            const newRating3 = new ratingModel({
                userId: id,
                movieId: m_id3.movieId,
                rating: rating3
            });
            await newRating3.save();
            const movie4 = await collaModel.findOne({ original_title: movie4Title });
            console.log(movie3.id, id, rating3);

            const m_id4 = await linkModel.findOne({ tmdbId: movie4.id });
            const newRating4 = new ratingModel({
                userId: id,
                movieId: m_id4.movieId,
                rating: rating4
            });
            await newRating4.save();
            const movie5 = await collaModel.findOne({ original_title: movie5Title });
            console.log(movie3.id, id, rating3);

            const m_id5 = await linkModel.findOne({ tmdbId: movie5.id });
            const newRating5 = new ratingModel({
                userId: id,
                movieId: m_id5.movieId,
                rating: rating5
            });
            await newRating5.save();

            console.log('All ratings saved successfully');

                const pythonScriptPath = 'calibrative/calb.py';
                const command = `python ${pythonScriptPath} "${id}"`;

                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Error executing Python script: ${stderr}`);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }

                    console.log(stdout);


                    const trimmedStdout = stdout.trim().replace(/'/g, '"');

                    // Parse the string containing IMDb IDs into an array
                    const imdbIdsArray = JSON.parse(trimmedStdout);
                    posterModel.find({ imdbId: { $in: imdbIdsArray } })
                    .then(posters1 => {
                        let name1= posters1.map(x=>x.Title)

                         possterModel.find({ title: { $in: name1 } })
                        .then(posters1 => {
                            let posters = posters1.map(poster => "https://image.tmdb.org/t/p/original" + poster.poster_path);
                            let name= posters1.map(x=>x.title)
                            let irating = posters1.map(c => parseFloat(c.vote_average).toFixed(1));
                            res.render('home', { posters: posters, name: name,ratings:irating ,uname:uname});
        
                        })
                     })
                    
                   
                        .catch(err => {
                            // Handle errors
                            console.error(err);
                            return res.status(500).json({ error: 'Internal Server Error' });
                        });
                });
            } catch (error) {
                console.error('Error:', error);
                // Handle the error appropriately
            }
        }
    } catch (error) {
        console.error('Error handling sign-in request:', error);
        res.status(500).send('Internal Server Error');
    }
});




app.post('/movies', (req, res) => {
    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }
    
    const favoriteMovie = toTitleCase(req.body.favoriteMovie);

    const pythonScriptPath = 'content/content.py';
    const command = `python ${pythonScriptPath} "${favoriteMovie}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing Python script: ${stderr}`);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        try {
            const jsonData = JSON.parse(stdout);
            console.log(stdout);
            
            // Extract movie titles as separate strings
            const movies = jsonData.recommendations.slice(0, 9); 
            console.log(movies);

            possterModel.find({ title: { $in: movies } })
                .then(posters2 => {
                    let posters = posters2.map(poster => "https://image.tmdb.org/t/p/original" + poster.poster_path);
                    let names = posters2.map(x => x.title);
                    let iratings1 = posters2.map(c => parseFloat(c.vote_average).toFixed(1));

                
                
                        // Now render
                        res.render('movies', { posters: posters, name: names, ratings: iratings1 });
                    })
                        .catch(err => {
                            console.error('Error finding posters by name:', err);
                            res.status(500).send('Internal Server Error');
                        });
            
             
        } catch (err) {
            console.error('Error parsing JSON:', err);
            res.status(500).send('Internal Server Error');
        }
    });
});

        





app.get('/signin', (req, res) => {
    res.render('signin')
});
app.get('/movies', (req, res) => {
    res.render('movies')
});
app.get('/signup', (req, res) => {
    res.render('signup')
});
app.get('/Movie_selection', (req, res) => {
    res.render('Movie_selection')
});

app.use((req, res) => {
    res.render('404')
});
