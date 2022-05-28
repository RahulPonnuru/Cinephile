const API_KEY="api_key=61022532bb5ed4d2a4a36463a039e57f";
const BASE_URL="https://api.themoviedb.org/3";
const API_URL=BASE_URL+'/discover/movie?'+API_KEY+"&page=1&region=IN";
const SEARCH_URL="https://api.themoviedb.org/3/search/movie?"+API_KEY+"&query=" ;
// const API_URL=BASE_URL+'/discover/movie?primary_release_date.gte=2022-04-13&primary_release_date.lte=2022-04-15&'+API_KEY;
const IMG_URL="https://image.tmdb.org/t/p/w500";
const searchURL=BASE_URL+'/search/movie?'+API_KEY;
const main=document.getElementById('main');

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
const tagE1=document.getElementById("tags");
var selectedGenre=[];
function setGenre(){
    tagE1.innerHTML="";
    genreN.forEach(genre=>{
        const newG=document.createElement("div");
        newG.classList.add('tag');
        newG.id=genre.id;
        newG.innerText=genre.name;
        newG.addEventListener('click',()=>{
            if(selectedGenre.length==0){
                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id,idx)=>{ //idx is index no
                        if(id==genre.id){
                            selectedGenre.splice(idx,1);
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            console.log(selectedGenre);
            getMovies(API_URL+'&with_genres='+encodeURI(selectedGenre.join(',')));
            displaySelection();
        })
        tagE1.append(newG);
    })
}

setGenre();

getMovies(API_URL);
function getMovies(url){
    fetch(url).then(res=>res.json()).then(data=>{
        console.log(data.results);
        if(data.results.length!=0){
            showMovies(data.results);
        }else{
            main.innerHTML='<h1 class="noResults">No results found</h1>'
        }
    })
}

function displaySelection(){
    const tags=document.querySelectorAll('.tag');
    tags.forEach(tag=>{
        tag.classList.remove('highlight');
    })
    if(selectedGenre.length!=0){
        selectedGenre.forEach(id=>{
            const dispaly=document.getElementById(id);
            dispaly.classList.add('highlight');
        })
    }
    
}

function showMovies(data){
    main.innerHTML='';
    data.forEach(movie=>{
        const{title,poster_path,vote_average,overview,id}=movie;
        const movieE1=document.createElement('div');
        movieE1.classList.add('movie');
        movieE1.innerHTML=`
            <img src="${poster_path?IMG_URL+poster_path:"http://via.placeholder.com/1080x1500"}" alt="${title}">

            <div class="movie-info">
                <h3 class="movieName">${title}</h3> 
                <span class="${getColor(vote_average)} average">${vote_average}</span>
            </div>
            
            <div class="overview">
                <h3>${title}</h3>
                <p>${overview}</p>
                <br/>
                <button class="know-more" id="${id}">Know More</button>
            </div>   
        `

        main.appendChild(movieE1);
        document.getElementById(id).addEventListener("click",()=>{
            console.log(id);
            openNav(movie);
        })
    })
}

const overlayContent=document.getElementById('overlay-content');
/* Open when someone clicks on the span element */
function openNav(movie) {
    let id=movie.id;
    fetch(BASE_URL+'/movie/'+id+'/videos?'+API_KEY).then(res=>res.json()).then(videoData=>{
        console.log(videoData);
        if(videoData){
            document.getElementById("myNav").style.width = "100%";
            if(videoData.results.length>0){
                var embed=[];
                var dots=[];
                videoData.results.forEach((video,idx)=>{
                    let {name,key,site}=video;
                    if(site=='YouTube'){
                        embed.push(`
                        <iframe width="900" height="500" src="https://www.youtube.com/embed/${key}" title="${name}" class="embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    `)
                    dots.push(`
                        <span class="dot">${idx+1}</span>   
                    `)
                    }
                })
                var content=`
                    <h1 class="no-results">${movie.title}</h1>
                    <br/>
                    ${embed.join('')}
                    <br/>

                    <div class="dots">${dots.join('')}</div>
                `
                overlayContent.innerHTML=content;
                activeSlide=0;
                showVideos();
            }else{
                overlayContent.innerHTML=`<h1>No results found</h1>`;
            }
        }
    })
    
  }
  
  /* Close when someone clicks on the "x" symbol inside the overlay */
  function closeNav() {
    document.getElementById("myNav").style.width = "0%";
    const iframes = document.getElementsByTagName('iframe');
    if (iframes !== null) {
      for (let i = 0; i < iframes.length; i++) {
        iframes[i].src = iframes[i].src; //causes a reload so it stops playing, music, video, etc.
      }
    }
  }

  var activeSlide=0;
  var totalVideos=0;
  function showVideos(){
    let embedClasses = document.querySelectorAll('.embed');
    let dots = document.querySelectorAll('.dot');
  
    totalVideos = embedClasses.length; 
    embedClasses.forEach((embedTag, idx) => {
      if(activeSlide == idx){
        embedTag.classList.add('show')
        embedTag.classList.remove('hide')
  
      }else{
        embedTag.classList.add('hide');
        embedTag.classList.remove('show')
      }
    })
  
    dots.forEach((dot, indx) => {
      if(activeSlide == indx){
        dot.classList.add('active');
      }else{
        dot.classList.remove('active')
      }
    })
  }
  const leftarrow=document.getElementById('left-arrow');
  const rightarrow=document.getElementById('right-arrow');

  leftarrow.addEventListener("click",()=>{
      if(activeSlide>0){
          activeSlide--;
      }else{
        activeSlide=totalVideos-1;
      }
      showVideos()
  })

  rightarrow.addEventListener("click",()=>{
      if(activeSlide<(totalVideos-1)){
          activeSlide++;
      }else{
        activeSlide=0;
      }
      showVideos()
  })


function getColor(vote){
    if(vote>=8){
        return "green";
    }else if(vote>=5){
        return "orange";
    }else{
        return "red";
    }
}

