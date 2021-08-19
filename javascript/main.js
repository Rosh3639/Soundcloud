// 1. Do the search 

// Grab the input 
let mainSearch = {};

// On click 
mainSearch.submitClick = function () {

    document.querySelector(".js-submit").addEventListener('click', (e) => {
        let input = document.querySelector('.js-search').value;
        SoundCloudAPI.getTrack(input);
    });
};
mainSearch.submitClick();

// On keyup 
mainSearch.enterPress = function () {
    document.querySelector(".js-search").addEventListener('keyup', (e) => {
        let input = document.querySelector('.js-search').value;
        if (e.which === 13) {
            SoundCloudAPI.getTrack(input);
        }
    });
}
mainSearch.enterPress();


// 2. Query Soundcloud API
// Wrap Code in an Object
let SoundCloudAPI = {};

SoundCloudAPI.init = function () {
    SC.initialize({
        client_id: 'cd9be64eeb32d1741c17cb39e41d254d'
    });

}
SoundCloudAPI.init();


SoundCloudAPI.getTrack = function (inputValue) {
    // find all sounds of buskers licensed under 'creative commons share alike'
    SC.get('/tracks', {
        q: inputValue,
        genres: ''
    }).then(function (tracks) {
        // console.log(tracks);
        SoundCloudAPI.renderTracks(tracks); //  Render cards
    });
}
SoundCloudAPI.getTrack("What do you mean");



// 3. Display the cards of songs.

SoundCloudAPI.renderTracks = function (tracks) {

    document.querySelector('.js-search-results').innerHTML = '';

    tracks.forEach(function (track) {
        // console.log(track);
        // Card
        let card = document.createElement("div");
        card.classList.add('card');

        // Image
        let imageDiv = document.createElement("div");
        imageDiv.classList.add('image');

        let image_img = document.createElement("img");
        image_img.classList.add("image_img");
        image_img.src = track.artwork_url || "https://source.unsplash.com/200x200/?songs";

        imageDiv.appendChild(image_img);

        // Content
        let content = document.createElement("div");
        content.classList.add("content");

        let header = document.createElement("div");
        header.classList.add("header");
        header.innerHTML = '<a href="' + track.permalink_url + '" target="_blank">' + track.title + "</a>";

        // Button
        let button = document.createElement("div");
        button.classList.add("ui", "bottom", "attached", "button", "js-button");

        let icon = document.createElement("i");
        icon.classList.add("add", "icon");

        let buttontext = document.createElement("span");
        buttontext.innerHTML = "Add to playlist";

        // Appendchild
        content.appendChild(header);

        button.appendChild(icon);
        button.appendChild(buttontext);

        // on click , add to playlist
        button.addEventListener('click', () => {
            SoundCloudAPI.getEmbed(track.permalink_url);
        })

        card.appendChild(imageDiv);
        card.appendChild(content);
        card.appendChild(button);

        let searchResults = document.querySelector(".js-search-results");
        searchResults.appendChild(card);
    });

}


// 4. Add to playlist and play.
SoundCloudAPI.getEmbed = function (trackURL) {
    // console.log("Click");
    SC.oEmbed(trackURL, {
        auto_play: false
    }).then(function (embed) {
        console.log('oEmbed response: ', embed);

        // add to left side bar on ther upper box
        let sideBar = document.querySelector(".js-playlist");

        // add to a box
        let box = document.createElement("div");
        box.innerHTML = embed.html;

        sideBar.insertBefore(box, sideBar.firstChild);

        // Save to local storage
        localStorage.setItem("key", sideBar.innerHTML);


    });
};


mainSearch.getLocalStorage = () => {
    let sideBar = document.querySelector(".js-playlist");
    sideBar.innerHTML = localStorage.getItem("key");


    // fill localstorage playlist
    localStorage.setItem('key', sideBar.innerHTML);
};
mainSearch.getLocalStorage();


/**  clear playlist */
mainSearch.clearLocalStorage = () => {

    // add to right side under search box
    let main = document.querySelector('.main');



    // button
    let button = document.createElement('div');
    button.classList.add("ui", "attached", 'grey', "button", "js-button");

    let buttonText = document.createElement('span');
    buttonText.innerHTML = "<em>Clear playlist </em>";


    let icon = document.createElement('i');
    icon.classList.add('remove', 'icon');

    button.appendChild(buttonText);
    button.appendChild(icon);

    // add it on a box
    main.insertBefore(button, main.firstChild);
    button.addEventListener('click', function () {

        localStorage.clear();
        document.querySelector('.js-playlist').innerHTML = '';

    });

};

mainSearch.clearLocalStorage();