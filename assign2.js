document.addEventListener("DOMContentLoaded", function(){

   /* url of song api --- https version later in semester?? */	
   const songAPI = 'http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';

   let songJSON = localStorage.getItem("key")
   if (songJSON){
       songData = JSON.parse(songJSON)
       mainApplication(songData)
   }else{

       fetch(songAPI)
       .then(response=> response.json())
       .then(songData=>{

       /*needs to be string to store*/  
       localStorage.setItem("key", JSON.stringify(songData))
       mainApplication(songData) 
   })

   .catch((error) => {
       console.error('Error:', error);
   })
}

})

function mainApplication(songData){
   /*all main code in here*/

   //popup for credit button 
   const popupDiv = document.querySelector("#creditPopup")
   const credit = document.querySelector("#creditButton")

   // mouseover the credits thing
   credit.addEventListener('mouseover', function(){
       popupDiv.classList.remove("hide")
   })

   // mouse away from credit thing
   credit.addEventListener('mouseout', function(){
       popupDiv.classList.add("hide")
   })

   //create an array of genres
   let genreArray =[]
   for (let i = 0; i< songData.length; i++){
       if ( !genreArray.includes(songData[i].genre.name)){
           genreArray.push(songData[i].genre.name)
       }
   }

   //create an array of artists
   let artistArray =[]
   for (let i = 0; i< songData.length; i++){
       if (!artistArray.includes(songData[i].artist.name)){
           artistArray.push(songData[i].artist.name)
       }
   }

   //populate dropdown for genre
   let select1 = document.querySelector("#pickGenre")

   for (let i = 0; i < genreArray.length; i++){
       let optionNode = document.createElement("option") 
       optionNode.textContent= genreArray[i]
       optionNode.value = genreArray[i]
       select1.appendChild(optionNode)
   }

   //populate dropdown for artist
   let select2 = document.querySelector("#pickArtist")

   for (let i = 0; i < artistArray.length; i++){
       let optionNode = document.createElement("option") 
       optionNode.textContent= artistArray[i]
       optionNode.value = artistArray[i]
       select2.appendChild(optionNode)
   }

   //populate the inital view under browse/search

   //first get each list
   const titleListNode = document.querySelector("#titleResultList")
   const artistListNode = document.querySelector("#artistResultList")
   const yearListNode = document.querySelector("#yearResultList")
   const genreListNode = document.querySelector("#genreResultList")
   const popularityListNode = document.querySelector("#popularityResultList")

   //append items to the list
   for (let i =0; i< songData.length; i++){
       let titleItem = document.createElement("li")
       let artistItem = document.createElement("li")
       let yearItem = document.createElement("li")
       let genreItem = document.createElement("li")
       let popularityItem = document.createElement("li")

       titleItem.textContent = songData[i].title;
       artistItem.textContent = songData[i].artist.name
       yearItem.textContent = songData[i].year;
       genreItem.textContent = songData[i].genre.name;
       popularityItem.textContent = songData[i].details.popularity;

       titleListNode.append(titleItem)
       artistListNode.append(artistItem)
       yearListNode.append(yearItem)
       genreListNode.append(genreItem)
       popularityListNode.append(popularityItem)
   }

   //add event handler for clearing filter options
   const clearButtonNode = document.querySelector("#clearButton")

   /* need to make sure this actually works
   clearButtonNode.addEventListener("click", function(){
 
       let titleSearchNode = document.querySelector("#titleSearch")
       let titleArtistNode = document.querySelector("#artistSearch")
       let titleGenreNode = document.querySelector("#genreSearch")

       if(titleSearchNode.checked){
           titleSearchNode.checked = false;
       }

       if(titleArtistNode.checked){
           titleArtistNode.checked = false;
       }

       if(titleGenreNode.checked){
           titleGenreNode.checked = false;
       }
   });
   */


   // this is where main ends so oyur brain doesnt go boom
}



