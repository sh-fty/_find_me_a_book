function getBooks(event) {
    let query = document.getElementsByName('bookcategory')[0].value;
    fetch('http://openlibrary.org/subjects/' + query + '.json?details=false&limit=10').then(response => {
            return response.json();
        })
        .then(data => {
            document.getElementById('content').innerHTML = "";

            if (data.works.length === 0) {
                writeDefault();
            } else {
                data.works.filter(book => stringIsEnglish(book.title)).forEach((value) => {
                    writeToDoc(value)
                });
            }
        })
        .catch(err => {
            console.log(err)
        });
}

function writeToDoc(book) {
    if(!book.availability.isbn) {
        console.log("didn't have isbn: " + book.title)
    }
    document.getElementById('content').innerHTML 
    += '<div class="col-lg"><img class="img-fluid w-100 mb-3 img-thumbnail shadow-sm rounded-0" src="https://covers.openlibrary.org/b/isbn/' + book.availability.isbn + '.jpg"><h2 class="h4">'+ book.authors[0].name +'</h2></div>';
}

function writeDefault() {
    document.getElementById('content').innerHTML = 'No Results for Query'
}

const ENGLISH = " '-,abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function stringIsEnglish(str) {
    let index;

    for (index = str.length - 1; index >= 0; --index) {
        if (ENGLISH.indexOf(str.substring(index, index + 1)) < 0) {
            return false;
        }
    }
    return true;
}