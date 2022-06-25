const express=require("express");
const md5=require("md5");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const ejs = require("ejs");
const bcrypt=require("bcrypt");
const saltRounds=10;
const API_KEY="api_key=*****";  //Enter your API Key
const BASE_URL="https://api.themoviedb.org/3";
const API_URL=BASE_URL+'/movie/now_playing?'+API_KEY+"&page=1&region=IN";
const SEARCH_URL="https://api.themoviedb.org/3/search/movie?"+API_KEY+"&query=" ;
// const API_URL=BASE_URL+'/discover/movie?primary_release_date.gte=2022-04-13&primary_release_date.lte=2022-04-15&'+API_KEY;
const IMG_URL="https://image.tmdb.org/t/p/w500";
const https=require("https");
const searchURL=BASE_URL+'/search/movie?'+API_KEY;
const genreN=[
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
]

const app=express();
app.set('view engine',"ejs");
app.use(express.static(__dirname+"/public"));
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://localhost:27017/movieDB",{useNewUrlParser:true});

//for the signup page
const movieSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
});


const User=new mongoose.model("User",movieSchema);

//contact us form home page
const contactUsSchema=new mongoose.Schema({
    name:String,
    phoneNo:Number,
    email:String,
    message:String
});

const contactUs=new mongoose.model("contactUs",contactUsSchema);

app.get("/",function(req,res){
    res.render(__dirname+"/home");
})

app.get("/secrets",function(req,res){
    // https.get(API_URL,function(response){
    //     response.on("data",function(data){
    //         const movieData=JSON.parse(data);
            res.render("secrets",{username:"Just Enjoy the things and chillout.",Display:"New Movies In Theaters"});
    //     })
    // })
});

app.get("/webseries",function(req,res){
    res.render("webseries");
})

app.get("/list",function(req,res){
    res.render("list");
})

app.get("/login",function(req,res){
    res.render("login");
    // https.get(API_URL,function(response){
    //     response.on('data',function(data){
    //         const movieData=JSON.parse(data);
    //         console.log(movieData.results);
    //         res.render("secrets",{newItems:movieData.results});
    //         movieData.results.forEach(movie=>{
    //             const movieImage=IMG_URL+movie.poster_path;
    //             const movieE1=document.createElement('div');
    //             movieE1.classList.add('movie');
    //             movieE1.innerHTML=`
    //                 <img src="movieImage" alt="Image">
    //                 <div class="movie-info">
    //                     <h3>Movie Title</h3>
    //                     <span class="green">9.8</span>
    //                 </div>
    //                 <div class="overview">
    //                     <h1>Overview</h1>
    //                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure voluptates eaque veniam dolor error! Amet
    //                     quos
    //                     officia voluptate a iure nostrum, tempora incidunt et cum dolorem eos hic natus tenetur?
    //                 </div>
    //             `
    //         })
    //     })
    }
);

app.get("/genre",function(req,res){
    res.render("genre",{genreList:genreN});
});

app.post("/secrets",function(req,res){
    // const search=req.body.search;
    // https.get(SEARCH_URL+search,function(response){
    //     response.on("data",function(data){
    //         const movieData=JSON.parse(data);
            res.render("secrets",{username:" ",Display:"Movies related to your search : "});
            // res.render("secrets",{username:" ",Display:"Movies related to your search : "+search,newItems:movieData.results});
    //     })
    // })
})

app.get("/signup",function(req,res){
    res.render("signup");
})

app.get("/home",function(req,res){
    res.render("home");
});


app.post("/",function(req,res){
    const newContact=new contactUs({
        name:req.body.name,
        phoneNo:req.body.phoneNo,
        email:req.body.email,
        message:req.body.message
    });
    newContact.save(function(err){
        if(!err){
            res.render("success");
        }else{
            res.render("failure",{errorName:"Please try again or connect the developer!"});
        }
    })
})

app.post("/failure",function(req,res){
    res.redirect("/");
})

app.post("/success",function(req,res){
    res.redirect("/");
})

app.post("/signup",function(req,res){
    const username=req.body.username;
    User.findOne({email:username},function(err,foundUser){
        if(!foundUser){
            bcrypt.hash(req.body.password,saltRounds,function(err,hash){
                const newUser=new User({
                    name:req.body.name,
                    email:req.body.username,
                    password:hash
                });
                newUser.save(function(err){
                    if(!err){
                        res.render("secrets",{username:req.body.name,Display:"New Movies In Theaters"});
                    }else{
                        console.log(err);
                    }
                });
            })
        }else{
            res.render("failure",{errorName:"User with this name already exists please try another one"});
        }
    })
});

app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    User.findOne({email:username},function(err,foundlist){
        if(err){
            res.render("failure","User with this details not found please try again");
            console.log("err");
        }else{
            if(foundlist){
                bcrypt.compare(password,foundlist.password,function(err,result){
                    if(result===true){
                        // res.render("secrets",{userName:foundlist.name});
                        // res.redirect("/secrets");
                        // https.get(API_URL,function(response){
                        //     response.on("data",function(data){
                        //         const movieData=JSON.parse(data);
                                res.render("secrets",{username:foundlist.name,Display:"New Movies In Theaters"});
                                // res.render("secrets",{username:foundlist.name,Display:"New Movies In Theaters",newItems:movieData.results});
                        //     })
                        // })
                    }
                }
            )}else{
                res.render("failure","User with this details not found please try again");
            }
        }
    })
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
 
app.listen(port, function() {
  console.log("Server started succesfully");
});        
