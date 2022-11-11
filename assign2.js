console.log("hello")

/* url of song api --- https versions hopefully a little later this semester */	
const api = 'http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';

 

/* note: you may get a CORS error if you try fetching this locally (i.e., directly from a
   local file). To work correctly, this needs to be tested on a local web server.  
   Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
   use built-in Live Preview.
*/

let songJson = localStorage.getItem("key");

if(songJson){
   let songData = JSON.parse(songJson);
   console.log("slready in local storage")
   console.log(songData);

} else {
   fetch(api)
      .then(resp => resp.json())

  .then(song => {
      localStorage.setItem("key", JSON.stringify(song))
      console.log(localStorage.getItem("key"))
  
  })

  .catch(function (error) {
    console.log("error", error);
  });
}




if(songJson){
   const songData = JSON.parse(songJson);
   const table = document.querySelector("#search_table_body");
   for(let song of songData){
      const row = document.createElement("tr");
      row.className = song.song_id;
      const td1 = document.createElement("td");
      const td2 = document.createElement("td");
      const td3 = document.createElement("td");
      const td4 = document.createElement("td");
      const td5 = document.createElement("td");
      td1.textContent = song.title;
      console.log(td1.textContent);
      td2.textContent = song.artist.name;
      td3.textContent = song.year;
      td4.textContent = song.genre.name;
      td5.textContent = song.details.popularity;
      row.appendChild(td1);
      row.appendChild(td2);
      row.appendChild(td3);
      row.appendChild(td4);
      row.appendChild(td5);
      /* 
      Cant append row to table, no clue why but it the error is
      cannot read properties of null (reading 'appendChild')  
      */
      table.appendChild(row);
      
      
   }
}
