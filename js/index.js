let searchTxt = document.getElementById('searchbox');
let searchBtn = document.getElementById('searchbtn');

// press enter to search
searchTxt.addEventListener('keypress', function (e) {
    if (e.key == 'Enter') {
        e.preventDefault()

        searchBtn.click();
        searchTxt.value = "";

        searchBtn.disabled = true
        searchTxt.disabled = true
        
        setTimeout(function () {
            searchBtn.disabled = false
            searchTxt.disabled = false            
        }, 2000)

    }
})

// grabs books from OpenLib
function getBooks(event) {
    document.getElementById('content').innerHTML = "";
    
    fetch(`http://openlibrary.org/subjects/${document.getElementsByName('bookcategory')[0].value}.json?details=false&limit=10`)
        .then(response => response.json())
        .then(data => {
            if (data.works.length === 0) {
                writeDefault();
            } else {
                data.works
                .filter(book => {
                    return book.availability && book.availability.isbn
                })
                .forEach((book) => {
    fetch(`http://openlibrary.org${book.key}.json`)
        .then(response => response.json())
        .then(bookInfo => {

            let bookCollectedInfo = {}

            if(!bookInfo.description) {
                bookCollectedInfo.desc = 'no description provided'
            } else {
                bookCollectedInfo.desc = bookInfo.description.value
            }
            
            bookCollectedInfo.isbn = book.availability.isbn ? book.availability.isbn : 'isbn'
            bookCollectedInfo.key = book.key
            bookCollectedInfo.title = book.title
            bookCollectedInfo.authorsKey = book.authors[0].key
            bookCollectedInfo.authorsName = book.authors[0].name

            writeToDoc(bookCollectedInfo)

        })
                });
            }
        })
    .catch(err => {
        console.log(err)
    });
}

// places results into html
function writeToDoc(book) {

    console.log(book)

    document.getElementById('content').innerHTML
        += `<div class="col-md-4">
        <div class="card mb-4 box-shadow">
        <div class="card-body">
        <p class="card-text book-title">${book.title.replace(/\*/g, "")}</p>
        </div>
        <a target="new" href="https://openlibrary.org${book.key}">
        <img class="card-img-top" src="https://covers.openlibrary.org/b/isbn/${book.isbn}.jpg" alt="Card image cap">
        </a>
          <div class="card-body">
            <p class="card-text">${book.desc.replace(/\*/g, "")}</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="btn-group">
              <a target="new" href="https://openlibrary.org${book.authorsKey}/${book.authorsName.replace(' ', '_')}">
                <button type="button" class="button btn btn-sm btn-outline-secondary">${book.authorsName}</button>
              </a>
              </div>
              <small class="text-muted">9 mins</small>
            </div>
          </div>
        </div>
      </div>`
}

// default text of no search results
function writeDefault() {
    document.getElementById('content').innerHTML = 'No Results for Query'
}