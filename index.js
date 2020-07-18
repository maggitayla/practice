(function () {
    const baseURL = 'https://movie-list.alphacamp.io'
    const movieURL = baseURL + '/api/v1/movies/'
    const posterURL = baseURL + '/posters/'
    const data = [] //使用 const 代表你不能用 data = response.data.results 這樣簡單的寫法來把資料放進變數裡//
    const dataPanel = document.getElementById('data-panel')
    const searchForm = document.getElementById('search')
    const searchInput = document.getElementById('search-input')
    const pagination = document.getElementById('pagination')
    const ITEM_PER_PAGE = 12

    axios.get(movieURL)
        .then((response) => {
            data.push(...response.data.results)
            getPageData(1, data)
            // displayDataList(data)
            getTotalPages(data)
        })
        .catch((error) => {
            console.log(error)
        })

    // listen to data panel
    dataPanel.addEventListener('click', (event) => {
        if (event.target.matches('.btn-show-movie')) {
            showMovie(event.target.dataset.id)
            // console.log(event.target.dataset.id)
        } else if (event.target.matches('.btn-add-favorite')) {
            addFavoriteItem(event.target.dataset.id)
        }
    })


    // listen to search form submit event

    searchForm.addEventListener('submit', event => {
        event.preventDefault()

        let results = []
        const regex = new RegExp(searchInput.value, 'i')

        results = data.filter(movie => movie.title.match(regex))
        console.log(results)
        // displayDataList(results)
        getTotalPages(results)
        getPageData(1, results)
    })



    // listen to pagination click event
    pagination.addEventListener('click', event => {
        console.log(event.target.dataset.page)
        if (event.target.tagName === 'A') {
            getPageData(event.target.dataset.page)
        }
    })

    let paginationData = []

    function getPageData(pageNum, data) {
        paginationData = data || paginationData
        let offset = (pageNum - 1) * ITEM_PER_PAGE
        let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
        displayDataList(pageData)
    }

    function displayDataList(data) {
        let htmlContent = ''
        data.forEach(function (item, index) {
            htmlContent += `
            <div class="col-sm-3">
                <div class="card mb-2">
                    <img class="card-img-top " src="${posterURL}${item.image}" alt="Card image cap">
                    <div class="card-body movie-item-body">
                    <h6 class="card-title">${item.title}</h6>
                    </div>
                    <!-- "More" button -->
                        <div class="card-footer">
                        <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
                    <!-- favorite button -->
                    <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                    </div>
                    
                </div>
            </div>
            `
        })
        dataPanel.innerHTML = htmlContent
    }

    function showMovie(id) {
        // get elements
        const modalTitle = document.getElementById('show-movie-title')
        const modalImage = document.getElementById('show-movie-image')
        const modalDate = document.getElementById('show-movie-date')
        const modalDescription = document.getElementById('show-movie-description')

        // set request url
        const url = movieURL + id
        console.log(url)

        // send request to show api
        axios.get(url).then(response => {
            const data = response.data.results
            console.log(data)

            // insert data into modal ui
            modalTitle.textContent = data.title
            modalImage.innerHTML = `<img src="${posterURL}${data.image}" class="img-fluid" alt="Responsive image">`
            modalDate.textContent = `release at : ${data.release_date}`
            modalDescription.textContent = `${data.description}`
        })
    }

    function addFavoriteItem(id) {
        const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
        const movie = data.find(item => item.id === Number(id))

        if (list.some(item => item.id === Number(id))) {
            alert(`${movie.title} is already in your favorite list.`)
        } else {
            list.push(movie)
            alert(`Added ${movie.title} to your favorite list!`)
        }
        localStorage.setItem('favoriteMovies', JSON.stringify(list))
    }

    function getTotalPages(data) {
        let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
        let pageItemContent = ''
        for (let i = 0; i < totalPages; i++) {
            pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
        }
        pagination.innerHTML = pageItemContent
    }
})()