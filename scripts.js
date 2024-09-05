const apiKey = '9347cc6883f84d39b487fa84e8d58201';
let articlesArray = [];
let displayedArticles = 0;
const articlesPerPage = 15;

function fetchUFCNews(query = 'UFC') {
    fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const articlesContainer = document.getElementById('news-articles');
            articlesContainer.innerHTML = '';
            document.getElementById('load-more-container').style.display = 'none';  // Hide Load More initially

            if (data.articles.length === 0) {
                articlesContainer.innerHTML = '<p>No news articles found.</p>';
                return;
            }

            articlesArray = data.articles;
            displayedArticles = 0;  // Reset article count
            displayArticles(articlesArray);
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            const articlesContainer = document.getElementById('news-articles');
            articlesContainer.innerHTML = '<p>Failed to fetch news articles.</p>';
        });
}

function displayArticles(articles) {
    const articlesContainer = document.getElementById('news-articles');
    const remainingArticles = articles.length - displayedArticles;
    const articlesToDisplay = Math.min(articlesPerPage, remainingArticles);

    for (let i = 0; i < articlesToDisplay; i++) {
        const article = articles[displayedArticles];
        const articleElement = document.createElement('div');
        articleElement.className = 'news-article';
        articleElement.innerHTML = `
            <img src="${article.urlToImage || 'https://via.placeholder.com/300x200'}" alt="${article.title}">
            <h3>${article.title}</h3>
            <p>${article.description || 'No description available'}</p>
            <a href="${article.url}" target="_blank">Read More</a>
        `;
        articlesContainer.appendChild(articleElement);
        displayedArticles++;
    }

    // Show "Load More" button if there are more articles to display
    if (displayedArticles < articles.length) {
        document.getElementById('load-more-container').style.display = 'block';
    }
}

function loadMoreNews() {
    displayArticles(articlesArray);
}

function searchNews() {
    const searchTerm = document.getElementById('search-bar').value;
    fetchUFCNews(searchTerm);
}

// Fetch initial UFC news when page loads
fetchUFCNews();
