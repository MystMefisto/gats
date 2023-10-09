const URL = 'https://api.thecatapi.com/v1/images/search?api_key=live_KsiblBWyyuG47PcULa1BnlU4xmnnfGNEwuMsORbM1lqelzd13PKB0kL9mVts6AwU';
const URL_favorites = 'https://api.thecatapi.com/v1/favourites';
const URL_favorites_delete = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const URL_upload = 'https://api.thecatapi.com/v1/images/upload';
const imgContainer = document.querySelector("#random-cats");
const favoriteContainer = document.querySelector('#favorite-cats');
const modalUpload = document.querySelector('#uploadCat');
const btnUpload = document.querySelector('#uploadModalBtn');
const btnUploadClose = document.querySelector('.close');
const reloadBtn = document.querySelector("#reloadBtn");

async function fetchData(urlApi) {
    const response = await fetch(urlApi);
    const data = await response.json();
    return data;
}

async function fetchCats(apiUrl, container) {
    const cats = await fetchData(apiUrl);
    // imgContainer1.src = data[0].url;
    const view = cats
        .map((cat, index) => `
        <article>
            <img src="${cat.url}" data-id="${cat.id}" class="cat-image random-cat" id="img${index+1}" />
            <button class="favorite-button" id="favorite-btn">😍</button>
        </article>
      `)
        .join('');
    document.querySelector(`#${container}`).innerHTML = view;

    //When are no cats
    if (!view) {
        document.querySelector(`#${container}`).innerHTML = 'Cannot bring cats';
    }
}

async function fetchFavoritedCats(apiUrl, container) {
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'X-API-KEY': 'live_KsiblBWyyuG47PcULa1BnlU4xmnnfGNEwuMsORbM1lqelzd13PKB0kL9mVts6AwU'
        }
    });
    const cats = await response.json();
    // imgContainer1.src = data[0].url;
    const view = cats
        .map((cat, index) => `
        <article>
            <img src="${cat.image.url}" data-id="${cat.id}" class="cat-image random-cat" id="favorite-img${index+1}" />
            <button class="favorite-button" id="unfavorite-btn">❌</button>
        </article>
      `)
        .join('');
    document.querySelector(`#${container}`).innerHTML = view;

    //When are no cats favorited
    if (!view) {
        document.querySelector(`#${container}`).innerHTML = 'No Cats favorited :(';
    }
}

async function fetchSingleCat(apiUrl, container) {
    const data = await fetchData(apiUrl);
    document.querySelector(`#${container}`).src = data[0].url;
}

async function saveFavoriteCats(id) {
    const res = await fetch(URL_favorites, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': 'live_KsiblBWyyuG47PcULa1BnlU4xmnnfGNEwuMsORbM1lqelzd13PKB0kL9mVts6AwU'
        },
        body: JSON.stringify({
            image_id: id
        })
    });
}

async function deleteFavoriteCat(id) {
    const res = await fetch(URL_favorites_delete(id), {
        method: 'DELETE',
        headers: {
            'X-API-KEY': 'live_KsiblBWyyuG47PcULa1BnlU4xmnnfGNEwuMsORbM1lqelzd13PKB0kL9mVts6AwU'
        }
    });
}

async function uploadCatImage() {
    const form = document.querySelector('#uploadingForm');
    const formData = new FormData(form);

    console.log(formData.get('file'));

    const res = await fetch(URL_upload, {
        method: 'POST',
        headers: {
            // 'Content-Type': 'multipart/form-data',
            'X-API-KEY': 'live_KsiblBWyyuG47PcULa1BnlU4xmnnfGNEwuMsORbM1lqelzd13PKB0kL9mVts6AwU'
        },
        body: formData
    });

    const data = await res.json();
    saveFavoriteCats(data.id);

    setTimeout(() => {
        fetchFavoritedCats(`${URL_favorites}`, 'favorite-cats');
    }, 200);
}

const previewImage = () => {
    const file = document.getElementById("file").files;
    console.log(file);
    if (file.length > 0) {
        const fileReader = new FileReader();

        fileReader.onload = function (e) {
            document.getElementById("preview").setAttribute("src", e.target.result);
        };
        fileReader.readAsDataURL(file[0]);
    }
}

document.addEventListener('DOMContentLoaded', e => {
    //Bringing random cats to feed
    fetchCats(`${URL}&limit=9`, 'random-cats');
    //Bringing favourite cats
    fetchFavoritedCats(`${URL_favorites}`, 'favorite-cats');
});

imgContainer.addEventListener('click', e => {
    //When is an image is clicked, change image
    if (e.target.className === 'cat-image random-cat') {
        const imageId = e.target.id;
        fetchSingleCat(URL, imageId);
    }

    //If favorite-btn is clicked, then make it favorite

    if (e.target.id === 'favorite-btn') {
        const imgId = e.target.parentElement.querySelector('img').dataset.id;
        saveFavoriteCats(imgId);

        setTimeout(() => {
            fetchFavoritedCats(`${URL_favorites}`, 'favorite-cats');
        }, 200);
        //Aun no lo acabo. Checar el curso
    }
});

//When you click on a unfavorite

favoriteContainer.addEventListener('click', e => {
    if (e.target.id === "unfavorite-btn") {
        const imgId = e.target.parentElement.querySelector('img').dataset.id;
        deleteFavoriteCat(imgId);

        setTimeout(() => {
            fetchFavoritedCats(`${URL_favorites}`, 'favorite-cats');
        }, 200);
    }
});

reloadBtn.addEventListener('click',e=>{
    e.preventDefault();
    fetchCats(`${URL}&limit=9`, 'random-cats');
})

btnUpload.addEventListener('click',e => {
    e.preventDefault();
    if(e.target.classList.contains('fa-upload')){
        modalUpload.style.display = 'block';
    }
})

btnUploadClose.addEventListener('click', e=>{
    modalUpload.style.display = 'none';
})