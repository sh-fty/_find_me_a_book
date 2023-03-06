let searchTxt = document.getElementById('searchbox');
let searchBtn = document.getElementById('searchbtn');

// press enter to search
searchTxt.addEventListener('keypress', function (e) {
    if (e.key == 'Enter') {
        e.preventDefault()

        searchBtn.click();
        searchBtn.disabled = true
        setTimeout(function () {
            searchBtn.disabled = false
        }, 1000)

    }
})

// grabs books from OpenLib
function getBooks(event) {
    fetch(`http://openlibrary.org/subjects/${document.getElementsByName('bookcategory')[0].value}.json?details=false&limit=10`).then(response => response.json())
    .then(data => {
        if (data.works.length === 0) {
            writeDefault();
        } else {

        document.getElementById('content').innerHTML = "";

        data.works.forEach((book) => {
    fetch(`http://openlibrary.org${book.key}.json`)
    .then(response => response.json()).then(bookInfo => {
                let bookCollectedInfo = {}

                if (!book.availability) {
                    console.log("didn't have isbn: " + book.title)
                } else {
                    bookCollectedInfo.isbn = book.availability.isbn
                    bookCollectedInfo.title = book.title
                    bookCollectedInfo.authorsKey = book.authors[0].key
                    bookCollectedInfo.authorsName = book.authors[0].name
                    bookCollectedInfo.desc = bookInfo.description.value

                    writeToDoc(bookCollectedInfo)
                }
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
          <img class="card-img-top" src="https://covers.openlibrary.org/b/isbn/${book.isbn}.jpg" alt="Card image cap">
          <div class="card-body">
            <p class="card-text">${book.desc}</p>
            <div class="d-flex justify-content-between align-items-center">
              <div class="btn-group">
              <a target="new" href="https://openlibrary.org${book.authorsKey}/${book.authorsName.replace(' ', '_')}"><button type="button" class="btn btn-sm btn-outline-secondary">${book.authorsName}</button></a>
                <button type="button" class="btn btn-sm btn-outline-secondary">book</button>
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