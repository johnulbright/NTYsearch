const baseURL = "https://api.nytimes.com/svc/search/v2/articlesearch.json"; //1
const key = "osevwPA4htbKB5VjXTIlAzOHAxK3vwgm"; //2
let url; //3

//SEARCH FORM
const searchTerm = document.querySelector(".search");
const startDate = document.querySelector(".start-date");
const endDate = document.querySelector(".end-date");
const searchForm = document.querySelector("form");
const submitBtn = document.querySelector(".submit");

//RESULTS NAVIGATION
const nextBtn = document.querySelector(".next");
const previousBtn = document.querySelector(".prev");
const nav = document.querySelector("nav");

//RESULTS SECTION
const section = document.querySelector("section");

//nav.style.display = "none";
nextBtn.style.display = "none";
previousBtn.style.display = "none";
let pageNumber = 0;
console.log("Page number:",pageNumber)
let displayNav = false;

//1                     //2
searchForm.addEventListener("submit", fetchResults);
nextBtn.addEventListener("click", nextPage); //3
previousBtn.addEventListener("click", previousPage); //3


//1
function fetchResults(e) {
  e.preventDefault(); //2
  // Assemble the full URL
  url =
    baseURL +
    "?api-key=" +
    key +
    "&page=" +
    pageNumber +
    "&q=" +
    searchTerm.value;
    console.log("URL:", url);
    fetch(url)
    .then(function (result) {
      console.log(result);
      return result.json(); //2
    })
    .then(function (json) {
      console.log(json); //3
    });
  if (startDate.value !== "") {
    console.log(startDate.value);
    url += "&begin_date=" + startDate.value;
  }
  if (endDate.value !== "") {
    url += "&end_date=" + endDate.value;
  }
  fetch(url)
    .then(function (result) {
      return result.json();
    })
    .then(function (json) {
      displayResults(json); //1 & //3
    });
}
function displayResults(json) {
    while (section.firstChild) {
        section.removeChild(section.firstChild); //1
    }
  let articles = json.response.docs;
  if (articles.length >= 10) {
    nextBtn.style.display = "block"; //shows the nav display if 10 items are in the array
  } else {
    nextBtn.style.display = "none"; //hides the nav display if less than 10 items are in the array
  }
  if(pageNumber>0){
      previousBtn.style.display="block";
  } else{ 
    previousBtn.style.display="none";
  }
  
  if (articles.length === 0) {
    console.log("No results");
  } else {
    for (index in articles) {
      let article = document.createElement("article");
      let heading = document.createElement("h2");
      let link = document.createElement("a");
      let img=document.createElement("img");
      let para = document.createElement('p'); 
      let clearfix = document.createElement('div'); //2

      let current = articles[index];
      //console.log("Current", current);

      link.href = current.web_url;
      link.textContent = current.headline.main;

      para.textContent="Keywords: ";
      for(let j = 0; j < current.keywords.length; j++) {
        let span = document.createElement('span');   
        span.textContent += current.keywords[j].value + ' ';   
        para.appendChild(span);
      }
      if(current.multimedia.length > 0) {
        img.src = 'http://www.nytimes.com/' + current.multimedia[0].url;
        img.alt = current.headline.main;
      }
      clearfix.setAttribute('class','clearfix');

      article.appendChild(heading);
      heading.appendChild(link);
      article.appendChild(img);
      article.appendChild(para);
      article.appendChild(clearfix);
      section.appendChild(article);
    }
    //Display the data
  }
}

function nextPage(e) {
    pageNumber++; //1
    fetchResults(e);  //2
    console.log("Page number:", pageNumber); //3
 }; //5

function previousPage(e) {
    if(pageNumber>0){
        pageNumber--;
    } else{
        return;
    }
    fetchResults(e);
    console.log("Previous button clicked");
} //5
