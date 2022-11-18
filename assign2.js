// WARNING: coding style will put tears in your eyes (not in a good way)

/*
Bugs and limitations: 
-  Cannot view song details from the playlist page.
-  Cannot enable/disable radio buttons.
-  Cannot view song details after returning from the playlist page.
-  Need to clear the playlist before being able to add songs to the playlist.
-  Filtering songs causes the padding between songs to be compacted.
-  After clearing the playlist and going to the song view of a song, you can't close the song view and are stuck on it.
*/

var playlist = []

document.addEventListener("DOMContentLoaded", function () {

    /* url of song api --- https version later in semester?? */
    const songAPI = 'https://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';

    let songJSON = localStorage.getItem("key")
    if (songJSON) {
        console.log("in local storage")
        songData = JSON.parse(songJSON)
        mainApplication(songData)
    } else {

        fetch(songAPI)
            .then(response => response.json())
            .then(songData => {

                /*needs to be string to store*/
                localStorage.setItem("key", JSON.stringify(songData))
                mainApplication(songData)
            })

            .catch((error) => {
                console.error('Error:', error);
            })
    }

})




function mainApplication(songData) {
    /*all main code in here*/

    document.getElementById("song_search").classList.toggle("song_search_hide")
    document.getElementById("playlist_button").classList.toggle("playlist_button_hide")
    //popup for credit button 
    const popupDiv = document.querySelector("#credit_popup")
    const credit = document.querySelector("#credit_button")

    
    // mouseover the credits thing
    credit.addEventListener('mouseover', function(){
        popupDiv.classList.remove("credit_popup_hide")
        setTimeout( () => 
        {popupDiv.classList.add("credit_popup_hide")}, 5000)
    })

    //create an array of genres
    let genreArray = []
    for (let i = 0; i < songData.length; i++) {
        if (!genreArray.includes(songData[i].genre.name)) {
            genreArray.push(songData[i].genre.name)
        }
    }

    //create an array of artists
    let artistArray = []
    for (let i = 0; i < songData.length; i++) {
        if (!artistArray.includes(songData[i].artist.name)) {
            artistArray.push(songData[i].artist.name)
        }
    }

    //populate dropdown for genre
    let select1 = document.querySelector("#pickGenre")

    for (let i = 0; i < genreArray.length; i++) {
        let optionNode = document.createElement("option")
        optionNode.textContent = genreArray[i]
        optionNode.value = genreArray[i]
        select1.appendChild(optionNode)
    }

    //populate dropdown for artist
    let select2 = document.querySelector("#pickArtist")

    for (let i = 0; i < artistArray.length; i++) {
        let optionNode = document.createElement("option")
        optionNode.textContent = artistArray[i]
        optionNode.value = artistArray[i]
        select2.appendChild(optionNode)
    }

    //populate the inital view under browse/search


    //first get each list
    const tBody = document.querySelector("#search_table tbody");
    //populate the table with the songs and add a add button to each row, add event listener to each button to add to playlist array and update playlist table 

    //append items to the list
    for (let i = 0; i < songData.length; i++) {
        make_table(songData[i])
    }

    //sort_by_header(songData)

    //add event listener to each add button
    const addButtons = document.querySelectorAll(".add_button")
    for (let i = 0; i < addButtons.length; i++) {
        addButtons[i].addEventListener("click", function (e) {
            let song_id = e.target.parentNode.parentNode.getAttribute("data-song")
            console.log("song to add is: " + song_id)
            for (let i = 0; i < songData.length; i++) {
                if (songData[i].song_id == song_id && !playlist.includes(songData[i])) {
                    document.getElementById("add_popup").classList.toggle("hide_add_popup")
                    playlist.push(songData[i])
                    playlist_table(songData[i])
                    setTimeout(show_popup, 5000)
                }
            }

        })
    }

    /* 

    SONG DETAILS FUNCTIONALITY


    When a song title is clicked, the song_search div should be hidden and the song_details div should be shown.
    The song_details div should display the song title, artist, year, genre, and popularity of the clicked song.

    */

    let row = document.querySelectorAll("#song_title")

    for (let i = 0; i < row.length; i++) {
        row[i].addEventListener("click", function (e) {
            let song_id = e.target.parentNode.getAttribute("data-song")
            //console.log("song to view details of: " + song_id)
            for (let i = 0; i < songData.length; i++) {
                if (songData[i].song_id == song_id) {
                    console.log("inside song details loop")
                    console.log(songData[i])
                    document.getElementById("song_search").classList.toggle("song_search_hide")
                    document.getElementById("song_details").classList.toggle("song_details_hide");



                    document.getElementById("close_view_button2").classList.toggle("close_view_hide2")
                    document.getElementById("playlist_button").classList.toggle("playlist_button_hide")

                    let songID = event.target.closest("tr").dataset.song
                    let song = songData.find(song => song.song_id == songID)
                    let mins = Math.floor(songData[i].details.duration / 60);
                    let secs = songData[i].details.duration % 60;

                    document.querySelector("li#song_title").textContent = "Title: " + song.title
                    document.querySelector("li#song_artist").textContent = "Artist: " + song.artist.name
                    document.querySelector("li#song_year").textContent = "Year: " + song.year
                    document.querySelector("li#song_genre").textContent = "Genre: " + song.genre.name
                    document.querySelector("li#song_duration").textContent = "Duration: " + mins + ":" + secs;

                    document.querySelector("li#bpm").textContent = "BPMs: " + song.details.bpm
                    document.querySelector("li#energy").textContent = "Energy: " + song.analytics.energy
                    document.querySelector("li#dance").textContent = "Danceability: " + song.analytics.danceability
                    document.querySelector("li#liveness").textContent = "Liveness: " + song.analytics.liveness
                    document.querySelector("li#valence").textContent = "Valence: " + song.analytics.valence
                    document.querySelector("li#acoustic").textContent = "Acoustic: " + song.analytics.acousticness
                    document.querySelector("li#speech").textContent = "Speechiness: " + song.analytics.speechiness
                    document.querySelector("li#analysis_pop").textContent = "Popularity: " + song.details.popularity

                    //console.log(song)

                    let temp = Chart.getChart("myChart")
                    if (temp != undefined) {
                        temp.destroy()
                    }

                    const ctx = document.getElementById('myChart').getContext('2d');
                    const myChart = new Chart(ctx, {
                        type: 'radar',
                        data: {
                            labels: ['Energy', 'Danceability', 'Liveness', 'Valence', 'Acoustic', 'Speechiness'],
                            datasets: [{
                                label: 'Song Analytics',
                                data: [song.analytics.energy, song.analytics.danceability, song.analytics.liveness, song.analytics.valence, song.analytics.acousticness, song.analytics.speechiness],
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)'
                                ],
                                borderWidth: 1
                            }]
                        },
                    });
                }
            }
        })
    }
    const btn2 = document.querySelector("#close_view_button2")
    btn2.addEventListener("click", function () {
        console.log("close button clicked inside function")
        document.getElementById("song_search").classList.toggle("song_search_hide")
        document.getElementById("song_details").classList.toggle("song_details_hide")
        document.getElementById("close_view_button2").classList.toggle("close_view_hide2")
        document.getElementById("playlist_button").classList.toggle("playlist_button_hide")
    })

    /* 
    
    
        FUNCTIONALITY FOR SORTING TABLES BY HEADER
    
    
    
    
    
    */

    const title = document.querySelector("#table_title")
    const artist = document.querySelector("#table_artist")
    const year = document.querySelector("#table_year")
    const genre = document.querySelector("#table_genre")
    const popularity = document.querySelector("#table_popular")

    //show_song_details(songData)
    //add_to_playlist(songData)

    title.addEventListener("click", function () {
        console.log("title clicked")
        songData.sort((a, b) => (a.title > b.title) ? 1 : -1)
        console.log(songData)
        document.querySelector("tbody").innerHTML = ""
        songData.forEach(song => {
            make_search_table(song)
        })
        show_song_details(songData)
        add_to_playlist(songData)
    })

    artist.addEventListener("click", function () {
        console.log("artist clicked")
        songData.sort((a, b) => (a.artist.name > b.artist.name) ? 1 : -1)
        console.log(songData)
        document.querySelector("tbody").innerHTML = ""
        songData.forEach(song => {
            make_search_table(song)
        })
        show_song_details(songData)
        add_to_playlist(songData)
    })

    year.addEventListener("click", function () {
        console.log("year clicked")
        songData.sort((a, b) => (a.year > b.year) ? 1 : -1)
        console.log(songData)
        document.querySelector("tbody").innerHTML = ""
        songData.forEach(song => {
            make_search_table(song)
        })
        show_song_details(songData)
        add_to_playlist(songData)
    })

    genre.addEventListener("click", function () {
        console.log("genre clicked")
        songData.sort((a, b) => (a.genre.name > b.genre.name) ? 1 : -1)
        console.log(songData)
        document.querySelector("tbody").innerHTML = ""
        songData.forEach(song => {
            make_search_table(song)
        })
        show_song_details(songData)
        add_to_playlist(songData)
    })

    popularity.addEventListener("click", function () {
        console.log("popularity clicked")
        songData.sort((a, b) => (a.details.popularity > b.details.popularity) ? 1 : -1)
        console.log(songData)
        document.querySelector("tbody").innerHTML = ""
        songData.forEach(song => {
            make_search_table(song)
        })
        show_song_details(songData)
        add_to_playlist(songData)
    })

    /* 




        FUNCTIONALITY FOR BROWSE/SEARCH FILTERS





    */

    //if the filter button is clicked, clear table and repopulate with filtered data

    const filterButton = document.querySelector("#apply_filter")
    filterButton.addEventListener("click", function () {
        //clear table
        while (tBody.firstChild) {
            tBody.removeChild(tBody.firstChild)
        }
        //get the values of the dropdowns
        let genreValue = document.querySelector("#pickGenre").value
        console.log(genreValue)
        let artistValue = document.querySelector("#pickArtist").value
        console.log(artistValue)
        let tilteValue = document.querySelector("#input_title").value

        //filter by title
        if (tilteValue != "" && document.getElementById("title_filter").checked) {
            console.log("filter by title")
            for (let i = 0; i < songData.length; i++) {
                if (songData[i].title.toString().toLowerCase().includes(tilteValue.toString().toLowerCase())) {
                    make_table(songData[i])
                    //console.log(songData[i].title)
                }
            }
        }
        //filter by artist
        else if (artistValue != "All" && artistValue != 0 && document.getElementById("artist_filter").checked) {
            console.log("in filter artist")
            for (let i = 0; i < songData.length; i++) {
                if (songData[i].artist.name == artistValue) {
                    make_search_table(songData[i])
                }
            }
        }
        //filter by genre
        else if (genreValue != "All" && genreValue != 0 && document.getElementById("genre_filter").checked) {
            console.log("genre selected")
            for (let i = 0; i < songData.length; i++) {
                if (songData[i].genre.name == genreValue) {
                    make_search_table(songData[i])
                }
            }
        }
        //filter by genre and artist
        else if (genreValue != "All" && genreValue != 0 && artistValue != "All" && artistValue != 0 && document.getElementById("artist_filter").checked && document.getElementById("genre_filter").checked) {
            console.log("genre and artist selected")
            for (let i = 0; i < songData.length; i++) {
                if (songData[i].genre.name == genreValue && songData[i].artist.name == artistValue) {
                    make_search_table(songData[i])
                }
            }
        }
        //filter by title and artist
        else if (tilteValue != "" && artistValue != "All" && artistValue != 0 && document.getElementById("artist_filter").checked && document.getElementById("title_filter").checked) {
            console.log("title and artist selected")
            for (let i = 0; i < songData.length; i++) {
                if (songData[i].title.toString().toLowerCase().includes(tilteValue.toString().toLowerCase()) && songData[i].artist.name == artistValue) {
                    make_search_table(songData[i])
                }
            }
        }
        //filter by title and genre
        else if (tilteValue != "" && genreValue != "All" && genreValue != 0 && document.getElementById("genre_filter").checked && document.getElementById("title_filter").checked) {
            console.log("title and genre selected")
            for (let i = 0; i < songData.length; i++) {
                if (songData[i].title.toString().toLowerCase().includes(tilteValue.toString().toLowerCase()) && songData[i].genre.name == genreValue) {
                    make_search_table(songData[i])
                }
            }
        }
        //filter by title, artist, and genre
        else if (tilteValue != "" && artistValue != "All" && artistValue != 0 && genreValue != "All" && genreValue != 0 && document.getElementById("artist_filter").checked && document.getElementById("genre_filter").checked && document.getElementById("title_filter").checked) {
            console.log("title, artist, and genre selected")
            for (let i = 0; i < songData.length; i++) {
                if (songData[i].title.toString().toLowerCase().includes(tilteValue.toString().toLowerCase()) && songData[i].artist.name == artistValue && songData[i].genre.name == genreValue) {
                    make_search_table(songData[i])
                    console.log(songData[i].title)
                }
            }
        }
        else {
            console.log("nothing selected")
            for (let i = 0; i < songData.length; i++) {
                make_search_table(songData[i])

            }
        }

        //add event listener to each add button
        const addButtons = document.querySelectorAll(".add_button")
        for (let i = 0; i < addButtons.length; i++) {
            addButtons[i].addEventListener("click", function (e) {
                let song_id = e.target.parentNode.parentNode.getAttribute("data-song")
                console.log("song to add is: " + song_id)
                for (let i = 0; i < songData.length; i++) {
                    if (songData[i].song_id == song_id && !playlist.includes(songData[i])) {
                        playlist.push(songData[i])
                        playlist_table(songData[i])
                    }
                }

            })
        }

        show_song_details(songData)
        //add_to_playlist(songData)


    })


    //if the clear button is clicked, clear table and repopulate with all data
    const clearButton = document.querySelector("#clear_filter")
    clearButton.addEventListener("click", function () {
        //clear table
        while (tBody.firstChild) {
            tBody.removeChild(tBody.firstChild)
        }
        //repopulate table
        for (let i = 0; i < songData.length; i++) {
            make_search_table(songData[i])
        }
        document.getElementById("title_filter").checked = false
        document.getElementById("artist_filter").checked = false
        document.getElementById("genre_filter").checked = false
        show_song_details(songData)
        add_to_playlist(songData)

    })

    /* 

        FUNCTIONALITY FOR DISPLAYING PLAYLIST VIEW


        If the playlist_button is clicked, the playlist should be displayed in the playlist_details div.




    */
    playlist.push(songData[0])
    playlist.push(songData[4])
    playlist.push(songData[7])
    const playlist_button = document.querySelector("#playlist_button")
    playlist_button.addEventListener('click', function () {

        const tBody = document.querySelector("#playlist_table_stats tbody")
        tBody.innerHTML = ""
        console.log("inside playlist button")
        document.getElementById("song_search").classList.toggle("song_search_hide")
        document.getElementById("playlist_details").classList.toggle("playlist_hide")
        document.getElementById("close_view_button").classList.toggle("close_view_hide")
        document.getElementById("playlist_button").classList.toggle("playlist_button_hide")

        playlist_table();


        //if the delete button is clicked, delete the song from the playlist and update the playlist table
        const delete_button = document.querySelectorAll(".delete_button")
        for (let i = 0; i < delete_button.length; i++) {
            delete_button[i].addEventListener('click', function (e) {
                let song_id = e.target.parentNode.parentNode.getAttribute("data-song")
                console.log("delete button click for " + song_id)
                for (let i = 0; i < playlist.length; i++) {
                    if (playlist[i].song_id == song_id) {
                        playlist.splice(i, 1)
                        console.log(playlist)
                        tBody.innerHTML = ""
                        playlist_table();
                    }
                }



                const btn2 = document.querySelector("#clear_playlist")
                btn2.addEventListener("click", function () {
                    playlist = []
                    tBody.innerHTML = ""
                })


            })
        }


    })

    const btn = document.querySelector("#close_view_button")
    btn.addEventListener("click", function () {
        console.log("inside close view button1")
        document.getElementById("playlist_details").classList.toggle("playlist_hide")
        document.getElementById("song_search").classList.toggle("song_search_hide")
        document.getElementById("close_view_button").classList.toggle("close_view_hide")
        document.getElementById("playlist_button").classList.toggle("playlist_button_hide")
    })

}



function playlist_table() {
    const tBody = document.querySelector("#playlist_table_stats tbody")
    for (let i = 0; i < playlist.length; i++) {
        let tr = document.createElement("tr")
        tr.setAttribute("data-song", playlist[i].song_id)
        tr.innerHTML = `
        <td>${playlist[i].title}</td>
        <td>${playlist[i].artist.name}</td>
        <td>${playlist[i].year}</td>
        <td>${playlist[i].genre.name}</td>
        <td>${playlist[i].details.popularity}</td>
        <td><button class="delete_button">Delete</button></td>
        `
        tBody.appendChild(tr)
    }
}

function make_search_table(song) {
    const tBody = document.querySelector("#search_table tbody");
    let row = document.createElement("tr")
    row.setAttribute("data-song", song.song_id);
    row.innerHTML = `
    <td id="song_title">${song.title}</td>
    <td>${song.artist.name}</td>
    <td>${song.year}</td>
    <td>${song.genre.name}</td>
    <td>${song.details.popularity}</td>
    <td><button class="add_button">Add</button></td>
    `
    tBody.appendChild(row)
}



function show_song_details(songData) {

    let row = document.querySelectorAll("#song_title")

    for (let i = 0; i < row.length; i++) {
        row[i].addEventListener("click", function (e) {
            let song_id = e.target.parentNode.getAttribute("data-song")
            //console.log("song to view details of: " + song_id)
            for (let i = 0; i < songData.length; i++) {
                if (songData[i].song_id == song_id) {
                    console.log("inside show song view function")
                    document.getElementById("song_search").classList.toggle("song_search_hide")
                    document.getElementById("song_details").classList.toggle("song_details_hide");



                    document.getElementById("close_view_button2").classList.toggle("close_view_hide2")
                    document.getElementById("playlist_button").classList.toggle("playlist_button_hide")

                    let songID = event.target.closest("tr").dataset.song
                    let song = songData.find(song => song.song_id == songID)
                    let mins = Math.floor(songData[i].details.duration / 60);
                    let secs = songData[i].details.duration % 60;
                    document.querySelector("li#song_title").textContent = "Title: " + song.title
                    document.querySelector("li#song_artist").textContent = "Artist: " + song.artist.name
                    document.querySelector("li#song_year").textContent = "Year: " + song.year
                    document.querySelector("li#song_genre").textContent = "Genre: " + song.genre.name
                    document.querySelector("li#song_duration").textContent = "Duration: " + mins + ":" + secs;

                    document.querySelector("li#bpm").textContent = "BPMs: " + song.details.bpm
                    document.querySelector("li#energy").textContent = "Energy: " + song.analytics.energy
                    document.querySelector("li#dance").textContent = "Danceability: " + song.analytics.danceability
                    document.querySelector("li#liveness").textContent = "Liveness: " + song.analytics.liveness
                    document.querySelector("li#valence").textContent = "Valence: " + song.analytics.valence
                    document.querySelector("li#acoustic").textContent = "Acoustic: " + song.analytics.acousticness
                    document.querySelector("li#speech").textContent = "Speechiness: " + song.analytics.speechiness
                    document.querySelector("li#analysis_pop").textContent = "Popularity: " + song.details.popularity

                    //console.log(song)
                    let temp = Chart.getChart("myChart")
                    if (temp != undefined) {
                        temp.destroy()
                    }
                    const ctx = document.getElementById('myChart').getContext('2d');
                    const myChart = new Chart(ctx, {
                        type: 'radar',
                        data: {
                            labels: ['Energy', 'Danceability', 'Liveness', 'Valence', 'Acoustic', 'Speechiness'],
                            datasets: [{
                                label: 'Song Analytics',
                                data: [song.analytics.energy, song.analytics.danceability, song.analytics.liveness, song.analytics.valence, song.analytics.acousticness, song.analytics.speechiness],
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(255, 206, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(255, 159, 64, 0.2)'
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)'
                                ],
                                borderWidth: 1
                            }]
                        },
                    });
                }
            }

        })

    }
    const btn = document.querySelector("#close_view_button2")
    btn.addEventListener("click", function () {
        console.log("close button clicked inside function")
        document.getElementById("song_search").classList.toggle("song_search_hide")
        document.getElementById("song_details").classList.toggle("song_details_hide")
        document.getElementById("close_view_button2").classList.toggle("close_view_hide2")
        document.getElementById("playlist_button").classList.toggle("playlist_button_hide")
    })
}


function add_to_playlist(songData) {
    const addButtons = document.querySelectorAll(".add_button")
    for (let i = 0; i < addButtons.length; i++) {
        addButtons[i].addEventListener("click", function (e) {
            let song_id = e.target.parentNode.parentNode.getAttribute("data-song")
            console.log("song to add is: " + song_id)
            for (let i = 0; i < songData.length; i++) {
                if (songData[i].song_id == song_id && !playlist.includes(songData[i])) {
                    document.getElementById("add_popup").classList.toggle("hide_add_popup")
                    playlist.push(songData[i])
                    playlist_table(songData[i])
                    setTimeout(show_popup, 5000)

                }
            }

        })
    }
}

function show_popup() {
    document.getElementById("add_popup").classList.toggle("hide_add_popup")
    console.log("inside show popup")
}

function sort_by_header(songData) {
    const title = document.querySelector("#table_title")
    const artist = document.querySelector("#table_artist")
    const year = document.querySelector("#table_year")
    const genre = document.querySelector("#table_genre")
    const popularity = document.querySelector("#table_popularity")

    show_song_details(songData)
    add_to_playlist(songData)

    title.addEventListener("click", function () {
        console.log("title clicked")
        songData.sort((a, b) => (a.title > b.title) ? 1 : -1)
        console.log(songData)
        document.querySelector("tbody").innerHTML = ""
        songData.forEach(song => {
            make_search_table(song)
        })
        show_song_details(songData)
        add_to_playlist(songData)
    })

    artist.addEventListener("click", function () {
        console.log("artist clicked")
        songData.sort((a, b) => (a.artist.name > b.artist.name) ? 1 : -1)
        console.log(songData)
        document.querySelector("tbody").innerHTML = ""
        songData.forEach(song => {
            make_search_table(song)
        })
        show_song_details(songData)
        add_to_playlist(songData)
    })

    year.addEventListener("click", function () {
        console.log("year clicked")
        songData.sort((a, b) => (a.year > b.year) ? 1 : -1)
        console.log(songData)
        document.querySelector("tbody").innerHTML = ""
        songData.forEach(song => {
            make_search_table(song)
        })
        show_song_details(songData)
        add_to_playlist(songData)
    })

    genre.addEventListener("click", function () {
        console.log("genre clicked")
        songData.sort((a, b) => (a.genre.name > b.genre.name) ? 1 : -1)
        console.log(songData)
        document.querySelector("tbody").innerHTML = ""
        songData.forEach(song => {
            make_search_table(song)
        })
        show_song_details(songData)
        add_to_playlist(songData)
    })

    popularity.addEventListener("click", function () {
        console.log("popularity clicked")
        songData.sort((a, b) => (a.details.popularity > b.details.popularity) ? 1 : -1)
        console.log(songData)
        document.querySelector("tbody").innerHTML = ""
        songData.forEach(song => {
            make_search_table(song)
        })
        show_song_details(songData)
        add_to_playlist(songData)
    })

}

function make_table(song) {

    const tBody = document.querySelector("#search_table tbody");
    let row = document.createElement("tr")
    row.setAttribute("data-song", song.song_id);

    let titleItem = document.createElement("td");
    titleItem.setAttribute("id", "song_title")
    let artistItem = document.createElement("td");
    let yearItem = document.createElement("td");
    let genreItem = document.createElement("td");
    let popularityItem = document.createElement("td");
    let addButton = document.createElement("button");

    titleItem.textContent = song.title;
    artistItem.textContent = song.artist.name
    yearItem.textContent = song.year;
    genreItem.textContent = song.genre.name;
    popularityItem.textContent = song.details.popularity;
    addButton.textContent = "Add";
    addButton.className = "add_button";

    row.appendChild(titleItem)
    row.appendChild(artistItem)
    row.appendChild(yearItem)
    row.appendChild(genreItem)
    row.appendChild(popularityItem)
    row.appendChild(addButton)

    tBody.appendChild(row)

}

/*

function make_table(song) {

    const tBody = document.querySelector("#search_table tbody");
    let row = document.createElement("tr")
    row.setAttribute("data-song", song.song_id);

    let titleItem = document.createElement("td");
    let artistItem = document.createElement("td");
    let yearItem = document.createElement("td");
    let genreItem = document.createElement("td");
    let popularityItem = document.createElement("td");
    let addButton = document.createElement("button");

    titleItem.textContent = song.title;
    artistItem.textContent = song.artist.name
    yearItem.textContent = song.year;
    genreItem.textContent = song.genre.name;
    popularityItem.textContent = song.details.popularity;
    addButton.textContent = "Add";
    addButton.className = "add_button";

    row.appendChild(titleItem)
    row.appendChild(artistItem)
    row.appendChild(yearItem)
    row.appendChild(genreItem)
    row.appendChild(popularityItem)
    row.appendChild(addButton)

    tBody.appendChild(row)

}
    row.addEventListener("click", function (event) {


        document.getElementById("song_search").classList.toggle("song_search_hide")
        document.getElementById("song_details").classList.toggle("song_details_hide");



        document.getElementById("close_view_button2").classList.toggle("close_view_hide2")
        document.getElementById("playlist_button").classList.toggle("playlist_button_hide")

        let songID = event.target.closest("tr").dataset.song
        let song = songData.find(song => song.song_id == songID)
        document.querySelector("li#song_title").textContent = "Title: " + song.title
        document.querySelector("li#song_artist").textContent = "Artist: " + song.artist.name
        document.querySelector("li#song_year").textContent = "Year: " + song.year
        document.querySelector("li#song_genre").textContent = "Genre: " + song.genre.name
        document.querySelector("li#song_duration").textContent = "Duration: " + song.details.duration

        document.querySelector("li#bpm").textContent = "BPMs: " + song.details.bpm
        document.querySelector("li#energy").textContent = "Energy: " + song.analytics.energy
        document.querySelector("li#dance").textContent = "Danceability: " + song.analytics.danceability
        document.querySelector("li#liveness").textContent = "Liveness: " + song.analytics.liveness
        document.querySelector("li#valence").textContent = "Valence: " + song.analytics.valence
        document.querySelector("li#acoustic").textContent = "Acoustic: " + song.analytics.acousticness
        document.querySelector("li#speech").textContent = "Speechiness: " + song.analytics.speechiness
        document.querySelector("li#analysis_pop").textContent = "Popularity: " + song.details.popularity

        console.log(song)

        const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Energy', 'Danceability', 'Liveness', 'Valence', 'Acoustic', 'Speechiness'],
                datasets: [{
                    label: 'Song Analytics',
                    data: [song.analytics.energy, song.analytics.danceability, song.analytics.liveness, song.analytics.valence, song.analytics.acousticness, song.analytics.speechiness],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
        });
        */
/*
const ctx = document.getElementById("radar_chart").getContext("2d")
 
const myChart = new Chart(ctx, {
    type: "radar",
    data: {
        labels: ["Energy", "Danceability", "Liveness", "Valence", "Acoustic", "Speechiness"],
        datasets: [{
            label: "Song Analytics",
            data: [song.analytics.energy, song.analytics.danceability, song.analytics.liveness, song.analytics.valence, song.analytics.acoustic, song.analytics.speechiness],
        }]
    }
})
 
const btn = document.querySelector("#close_view_button2")
btn.addEventListener("click", function () {
    document.getElementById("song_search").classList.toggle("song_search_hide")
    document.getElementById("song_details").classList.toggle("song_details_hide")
    document.getElementById("close_view_button2").classList.toggle("close_view_hide2")
    document.getElementById("playlist_button").classList.toggle("playlist_button_hide")
})
})
*/
