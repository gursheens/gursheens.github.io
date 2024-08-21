// Bind search event listener to search bar
document.getElementById("myInput").addEventListener("search", getWord);

// Initialize Bootstrap toasts
var toastElList = [].slice.call(document.querySelectorAll('.toast'));
var toastList = toastElList.map(function(toastEl) {
    return new bootstrap.Toast(toastEl);
});

// Define the results container
const results = document.getElementById('results'); // Make sure this ID matches your HTML

async function getWord() {
    // Initialize constant variables
    const keyword = document.getElementById("myInput").value;
    const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + keyword;

    try {
        // Save fetch result to response
        let response = await fetch(url);

        console.log(response);

        // If fetch is successful
        if (response.status === 200) {
            // Save response from fetch to data
            let data = await response.json();

            // Initialize empty HTML string
            let html = '';

            // For each word in data
            data.forEach(result => {
                let phonetics = result.phonetics || [];
                let audio = phonetics.length > 0 ? phonetics[0].audio : '#';

                let obj = {
                    name: result.word,
                    phonetic: result.phonetic || 'Phonetic not available for this result',
                    origin: result.origin || 'Origin not available for this result',
                    audio: audio
                };

                html += cardHTML(obj, false);
            });

            // Append HTML to the main results container
            results.innerHTML = html;
        } else if (response.status === 404) {
            results.innerHTML = `
            <div class="container p-5 text-center">
                <a href="/">
                    <img src="404.gif" alt="" srcset="">
                </a>
            </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        results.innerHTML = `
        <div class="container p-5 text-center">
            <p>Error fetching data. Please try again later.</p>
        </div>
        `;
    }
}

function cardHTML(obj, isBookmark) {
    return `<div class="card text-center my-4 py-4">
                <div class="card-body">
                    <h5 class="card-title">${obj.name}</h5>
                    <h5 class="card-title">${obj.phonetic}</h5>
                    <p class="card-text">${obj.origin}</p>
                    <div data-audio-url="${obj.audio}">
                        <audio controls src="${obj.audio}">
                            Your browser does not support the <code>audio</code> element.
                        </audio>
                    </div>
                    ${isBookmark ? `<button class="btn btn-dark border border-dark mt-5" onclick="bookmarkWord(event)">remove bookmark</button>` : `<button class="btn border border-dark mt-5" onclick="bookmarkWord(event)">bookmark</button>`}
                    <form class="input-group mb-3 w-50 mt-4 d-flex mx-auto" id="share-form" onsubmit="share(event)">
                        <input type="hidden" name="contact_number">
                        <input type="email" class="form-control" placeholder="Recipient's Email" aria-label="Recipient's email" aria-describedby="share-button" name="user_email" required>
                        <input type="hidden" id="miword" name="word" value="${obj.name}">
                        <input type="hidden" id="miphonetic" name="phonetic" value="${obj.phonetic}">
                        <input type="hidden" id="miorigin" name="origin" value="${obj.origin}">
                        <button class="btn btn-dark" type="submit" id="share-button" value="send">Share</button>
                    </form>
                </div>
            </div>`;
}

function bookmarkWord(event) {
    let el = event.target.innerHTML;
    if (el === 'bookmark') {
        // Add to database
        addWord(event);
    } else {
        deleteWord(event);
    }
}

function showBookmarks(event) {
    let el = event.target.innerHTML;
    if (el === 'view bookmarks') {
        // Change text
        event.target.innerHTML = 'go back';
    } else {
        // Change text
        event.target.innerHTML = 'view bookmarks';
    }
}

function share(event) {
    event.preventDefault();
    
    let templateParams = {
        user_email: event.target.elements.user_email.value,
        message: 'test'
    };

    // Send email using EmailJS
    emailjs.sendForm('service_qn1p39z', 'template_56hdeua', '#share-form', 'user_TaH8nxDndyLcCGT8PufSy')
        .then(function() {
            document.getElementById('share-form').reset();
            toastList[0].show();
        }, function(error) {
            toastList[1].show();
            console.log('FAILED...', error);
        });
}
