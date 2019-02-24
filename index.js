function getBooks(event) {
    let query = document.getElementsByName('bookcategory')[0].value;
    fetch('http://openlibrary.org/subjects/' + query + '.json?details=false&limit=120').then(response => {
            return response.json();
        })
        .then(data => {
            document.getElementById('content').innerHTML = "";

            if (data.works.length === 0) {
                writeDefault();
            } else {
                data.works.filter(book => stringIsEnglish(book.title)).forEach((value) => writeToDoc(value));
            }
        })
        .catch(err => {
            console.log(err)
        });
}

function writeToDoc(book) {
    document.getElementById('content').innerHTML += '<a target="_blank" href="https://openlibrary.org' + book.key + '">' + book.title + '</a> by ' + book.authors[0].name + '<br>';
}

function writeDefault() {
    document.getElementById('content').innerHTML = 'No Results for Query'
}

var ENGLISH = " '-,abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function stringIsEnglish(str) {
    var index;

    for (index = str.length - 1; index >= 0; --index) {
        if (ENGLISH.indexOf(str.substring(index, index + 1)) < 0) {
            return false;
        }
    }
    return true;
}