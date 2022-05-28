// https://api.themoviedb.org/3/list/8202933?api_key=61022532bb5ed4d2a4a36463a039e57f
const API_KEY="api_key=61022532bb5ed4d2a4a36463a039e57f";
const BASE_URL="https://api.themoviedb.org/3";
const API_URL_TELUGU=BASE_URL+'/list/8202933?'+API_KEY;
const API_URL_HINDI=BASE_URL+'/list/8202940?'+API_KEY;
const API_URL_ENGLISH=BASE_URL+'/list/8202944?'+API_KEY;
const API_URL=BASE_URL+'/movie/now_playing?'+API_KEY+"&page=1&region=IN";
const SEARCH_URL="https://api.themoviedb.org/3/search/movie?"+API_KEY;
// const API_URL=BASE_URL+'/discover/movie?primary_release_date.gte=2022-04-13&primary_release_date.lte=2022-04-15&'+API_KEY;
const IMG_URL="https://image.tmdb.org/t/p/w500";
const searchURL=BASE_URL+'/search/movie?'+API_KEY;
const form=document.getElementById("form");
const search=document.getElementById("search");
const main=document.getElementById('main');
const topic=document.getElementById("topic");
const bn=document.getElementById("bn");

function showTelugu(){
    fetch(API_URL_TELUGU).then(res=>res.json()).then(data=>{
        console.log(data.items);
        showMovies(data.items);
    })
}

function showHindi(){
    fetch(API_URL_HINDI).then(res=>res.json()).then(data=>{
        console.log(data.items);
        showMovies(data.items);
    })
}

function showEnglish(){
    fetch(API_URL_ENGLISH).then(res=>res.json()).then(data=>{
        console.log(data.items);
        showMovies(data.items);
    })
}

getMovies(API_URL);
function getMovies(url){
    fetch(url).then(res=>res.json()).then(data=>{
        console.log(data.results);
        showMovies(data.results);
    })
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

function redir(){
    getMovies(API_URL);
    topic.innerText="Latest movies in theaters";
}

form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const searchTerm=search.value;
    if(searchTerm){
        getMovies(searchURL+'&query='+searchTerm);
    }
    topic.innerText="The item you searched is: "+searchTerm;
    // topic.innerHTML(<h1>The item you searched is: <span>{searchTerm}</span></h1>);
    showMovies(data.results);
})