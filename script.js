/*=====================================================
 FunFact V4
 script.js
 Part 1
======================================================*/

/*==============================
 Global Variables
==============================*/

let funFacts = [];
let filteredFacts = [];
let currentIndex = 0;
let currentCategory = "all";

/*==============================
 Elements
==============================*/

const gallery = document.getElementById("gallery");
const searchInput = document.getElementById("search");

const categoryButtons =
document.querySelectorAll(".category");

const splash =
document.getElementById("splash");

const toast =
document.getElementById("toast");

/*==============================
 Load JSON
==============================*/

async function loadFunFacts(){

try{

const response =
await fetch("data/funfacts.json");

funFacts =
await response.json();

filteredFacts =
[...funFacts];

renderGallery(filteredFacts);

hideSplash();

}catch(error){

console.error(error);

showToast("Gagal memuat data.");

}

}

/*==============================
 Hide Splash
==============================*/

function hideSplash(){

setTimeout(()=>{

splash.classList.add("hide");

},800);

}

/*==============================
 Render Gallery
==============================*/

function renderGallery(data){

gallery.innerHTML="";

if(data.length===0){

gallery.innerHTML=

`
<div class="empty">

<h2>

Tidak Ada Data

</h2>

<p>

Fun Fact tidak ditemukan.

</p>

</div>

`;

return;

}

data.forEach((item,index)=>{

gallery.appendChild(

createCard(item,index)

);

});

}

/*==============================
 Create Card
==============================*/

function createCard(item,index){

const card =
document.createElement("div");

card.className =
"card fadeIn";

card.innerHTML=

`

<img

loading="lazy"

src="${item.image}"

alt="${item.title}"

>

<div class="cardOverlay">

<div class="cardTitle">

${item.title}

</div>

<div class="cardCategory">

${item.category}

</div>

</div>

<div class="cardFooter">

<div class="cardButtons">

<button

class="primaryButton viewButton">

Lihat

</button>

<a

class="download"

href="${item.image}"

download

target="_blank">

Download

</a>

</div>

<button

class="favorite"

data-id="${item.id}">

${isFavorite(item.id) ? "❤" : "♡"}

</button>

</div>

`;

card

.querySelector("img")

.onclick=()=>{

openViewer(index);

};

card

.querySelector(".viewButton")

.onclick=()=>{

openViewer(index);

};

card
.querySelector(".favorite")
.onclick=(e)=>{

e.stopPropagation();

toggleFavorite(item.id);

const icon=e.currentTarget;

icon.textContent=isFavorite(item.id)
? "❤"
: "♡";

};
return card;

}

/*==============================
 Search
==============================*/

searchInput

.addEventListener(

"input",

function(){

const keyword =

this.value

.toLowerCase()

.trim();

filteredFacts =

funFacts.filter(item=>{

return(

item.title

.toLowerCase()

.includes(keyword)

||

item.category

.toLowerCase()

.includes(keyword)

||

item.description

.toLowerCase()

.includes(keyword)

);

});

if(currentCategory!=="all"){

filteredFacts=

filteredFacts.filter(item=>

item.category===currentCategory

);

}

renderGallery(filteredFacts);

}

);

/*==============================
 Category
==============================*/

categoryButtons.forEach(button=>{

button.onclick=()=>{

categoryButtons.forEach(btn=>{

btn.classList.remove("active");

});

button.classList.add("active");

currentCategory=

button.dataset.category;

if(currentCategory==="all"){

filteredFacts=[...funFacts];

}else{

filteredFacts=

funFacts.filter(item=>

item.category===

currentCategory

);

}

const keyword=

searchInput.value

.toLowerCase()

.trim();

if(keyword!=""){

filteredFacts=

filteredFacts.filter(item=>{

return(

item.title

.toLowerCase()

.includes(keyword)

||

item.description

.toLowerCase()

.includes(keyword)

);

});

}

renderGallery(filteredFacts);

};

});

/*==============================
 Toast
==============================*/

function showToast(message){

toast.textContent=

message;

toast.classList.add("show");

setTimeout(()=>{

toast.classList.remove("show");

},2500);

}

/*==============================
 Favorite
==============================*/

function getFavorites(){

return JSON.parse(

localStorage.getItem(

"favorites"

)

||"[]");

}

function saveFavorites(data){

localStorage.setItem(

"favorites",

JSON.stringify(data)

);

}

function toggleFavorite(id){

let favorites=

getFavorites();

if(

favorites.includes(id)

){

favorites=

favorites.filter(

item=>item!==id

);

showToast(

"Favorite dihapus"

);

}else{

favorites.push(id);

showToast(

"Ditambahkan ke Favorite"

);

}

saveFavorites(favorites);

renderGallery(filteredFacts);

}

/*==============================
 Update Favorite Icon
==============================*/

function isFavorite(id){

return getFavorites()

.includes(id);

}

/*==============================
 Start
==============================*/

loadFunFacts();

/*=====================================================
 FunFact V4
 script.js
 Part 2
 Viewer
======================================================*/

/*==============================
 Viewer Elements
==============================*/

const viewer =
document.getElementById("viewer");

const viewerBackground =
document.querySelector(".viewerBackground");

const viewerImage =
document.getElementById("viewerImage");

const viewerTitle =
document.getElementById("viewerTitle");

const viewerDescription =
document.getElementById("viewerDescription");

const closeViewer =
document.getElementById("closeViewer");

const previousButton =
document.getElementById("previousButton");

const nextButton =
document.getElementById("nextButton");

const downloadButton =
document.getElementById("downloadButton");

const shareButton =
document.getElementById("shareButton");

const favoriteButton =
document.getElementById("favoriteButton");

/*==============================
 Open Viewer
==============================*/

function openViewer(index){

currentIndex=index;

updateViewer();

viewer.classList.add("show");

document.body.style.overflow="hidden";

}

/*==============================
 Close Viewer
==============================*/

function closeViewerWindow(){

viewer.classList.remove("show");

document.body.style.overflow="";

viewerImage.style.transform="scale(1)";

zoomScale=1;

}

closeViewer.onclick=closeViewerWindow;

viewerBackground.onclick=closeViewerWindow;

/*==============================
 Update Viewer
==============================*/

function updateViewer(){

const item=

filteredFacts[currentIndex];

if(!item)return;

viewerImage.src=item.image;

viewerTitle.textContent=item.title;

viewerDescription.textContent=item.description;

downloadButton.href=item.image;

favoriteButton.textContent=

isFavorite(item.id)

?

"❤ Favorite"

:

"♡ Favorite";

}

/*==============================
 Next
==============================*/

function nextImage(){

currentIndex++;

if(currentIndex>=filteredFacts.length){

currentIndex=0;

}

updateViewer();

}

/*==============================
 Previous
==============================*/

function previousImage(){

currentIndex--;

if(currentIndex<0){

currentIndex=

filteredFacts.length-1;

}

updateViewer();

}

nextButton.onclick=

nextImage;

previousButton.onclick=

previousImage;

/*==============================
 Favorite
==============================*/

favoriteButton.onclick=()=>{

const item=

filteredFacts[currentIndex];

toggleFavorite(item.id);

updateViewer();

};

/*==============================
 Share
==============================*/

shareButton.onclick=

async()=>{

const item=

filteredFacts[currentIndex];

if(navigator.share){

try{

await navigator.share({

title:item.title,

text:item.description,

url:item.image

});

}catch(e){}

}else{

navigator.clipboard.writeText(

item.image

);

showToast(

"Link gambar disalin"

);

}

};

/*==============================
 Keyboard
==============================*/

document.addEventListener(

"keydown",

e=>{

if(

!viewer.classList.contains(

"show"

)

)return;

switch(e.key){

case"Escape":

closeViewerWindow();

break;

case"ArrowRight":

nextImage();

break;

case"ArrowLeft":

previousImage();

break;

}

}

);

/*==============================
 Swipe
==============================*/

let touchStartX=0;

let touchEndX=0;

viewer.addEventListener(

"touchstart",

e=>{

touchStartX=

e.changedTouches[0]

.clientX;

}

);

viewer.addEventListener(

"touchend",

e=>{

touchEndX=

e.changedTouches[0]

.clientX;

const distance=

touchEndX-touchStartX;

if(Math.abs(distance)<50)return;

if(distance<0){

nextImage();

}else{

previousImage();

}

}

);

/*==============================
 Double Tap Zoom
==============================*/

let lastTap=0;

let zoomScale=1;

viewerImage.addEventListener(

"touchend",

e=>{

const now=

new Date().getTime();

const delay=

now-lastTap;

if(delay<300&&delay>0){

if(zoomScale==1){

zoomScale=2;

}else{

zoomScale=1;

}

viewerImage.style.transform=

`scale(${zoomScale})`;

}

lastTap=now;

}

);

/*==============================
 Mouse Wheel Zoom
==============================*/

viewerImage.addEventListener(

"wheel",

e=>{

e.preventDefault();

if(e.deltaY<0){

zoomScale+=0.2;

}else{

zoomScale-=0.2;

}

if(zoomScale<1)

zoomScale=1;

if(zoomScale>5)

zoomScale=5;

viewerImage.style.transform=

`scale(${zoomScale})`;

}

);

/*==============================
 Random Button
==============================*/

const randomButton=

document.getElementById(

"randomButton"

);

randomButton.onclick=()=>{

const index=

Math.floor(

Math.random()

*

filteredFacts.length

);

openViewer(index);

};

/*==============================
 Back To Top
==============================*/

const backTop=

document.getElementById(

"backTop"

);

window.addEventListener(

"scroll",

()=>{

if(window.scrollY>500){

backTop.classList.add(

"show"

);

}else{

backTop.classList.remove(

"show"

);

}

}

);

backTop.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};
