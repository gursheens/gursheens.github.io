// bind search event listener to searchbar
document.getElementById("myInput").addEventListener("search", getWord);
var toastElList = [].slice.call(document.querySelectorAll('.toast'))
var toastList = toastElList.map(function(toastEl) {
    return new bootstrap.Toast(toastEl)
})

async function getWord() {

    // initialize constant-variables
    const keyword = document.getElementById("myInput").value;
    const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + keyword;

    // save fetch result to response
    let response = await fetch(url);

    console.log(response)

    // if fetch is successful do the following
    if (response.status === 200) {

        // save response from fetch to data
        let data = await response.json();

        // initialize empty html string
        let html = '';

        // for each word in data - 1. generate a HTML code block with word information 2. Add to empty HTML string initializeed above
        data.forEach(result => {

            let obj = {
                name: result.word,
                phonetic: result.phonetic,
                origin: result.origin,
                audio: result.phonetics[0].audio
            }            

            html += cardHTML(obj, false);
        });

        // append html to the main results container
        results.innerHTML = html;
    } 
    
    if (response.status === 404){
        results.innerHTML = `
        <div class="container p-5 text-center">
            <a href="/">
                <img src="404.gif" alt="" srcset="">
            </a>
        </div>
        `
    }
}

function cardHTML(obj, isBookmark) {
    return `<div class="card text-center my-4 py-4">
                <div class="card-body">
                    <h5 class="card-title">${obj.name}</h5>
                    <h5 class="card-title">${obj.phonetic || 'Phonetic not available for this result'}</h5>
                    <p class="card-text">${obj.origin || 'Origin not available for this result'}</p>
                    <div data-audio-url="${obj.audio || '#'}">
                        <audio controls src="${obj.audio || '#'}">
                                Your browser does not support the <code>audio</code> element.
                        </audio>
                    </div>
                    ${ isBookmark ? `<button class="btn btn-dark border border-dark mt-5" onclick="bookmarkWord(event)">remove bookmark</button>`: `<button class="btn border border-dark mt-5" onclick="bookmarkWord(event)">bookmark</button>` }
                    <form class="input-group mb-3 w-50 mt-4 d-flex mx-auto" id="share-form" onsubmit="share(event)">
                        <input type="hidden" name="contact_number">
                        <input type="email" class="form-control" placeholder="Recipient's Email" aria-label="Recipient's email" aria-describedby="share-button" name="user_email" required>
                        <input type="hidden" id="miword" name="word" value="${obj.name}">
                        <input type="hidden" id="miphonetic" name="phonetic" value="${obj.phonetic || 'Phonetic not available for this word'}">
                        <input type="hidden" id="miorigin" name="origin" value="${obj.origin || 'Origin not available for this word'}">
                        <button class="btn btn-dark" type="submit" id="share-button" value="send">Share</button>
                    </form>
                </div>
            </div>`;
}

function bookmarkWord(event) {
    let el = event.target.innerHTML;
    if (el === 'bookmark') {
        // add to database
        addWord(event);
    } else {
        deleteWord(event)
    }
}


function showBookmarks(event) {
    let el = event.target.innerHTML;
    if (el === 'view bookmarks') {
        // change text
        event.target.innerHTML = 'go back'
    } else {
        // change text
        event.target.innerHTML = 'view bookmarks'
    }
}

function share(event) {
    event.preventDefault();
    
    let templateParams = {
        user_email: event.target.elements.user_email.value,
        message: 'test'
    };

    // these IDs from the previous steps
    emailjs.sendForm('service_qn1p39z', 'template_56hdeua', '#share-form', 'user_TaH8nxDndyLcCGT8PufSy')
        .then(function() {
            document.getElementById('share-form').reset();
            toastList[0].show()
        }, function(error) {
            toastList[1].show()
            console.log('FAILED...', error);
        });
}  