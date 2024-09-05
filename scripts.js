const apiKey = '9347cc6883f84d39b487fa84e8d58201';
let articlesArray = [];

function fetchUFCNews(query = 'UFC') {
    fetch(`https://newsapi.org/v2/everything?q=${query}&apiKey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const articlesContainer = document.getElementById('news-articles');
            articlesContainer.innerHTML = '';

            if (data.articles.length === 0) {
                articlesContainer.innerHTML = '<p>No news articles found.</p>';
                return;
            }

            articlesArray = data.articles;
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
    articlesContainer.innerHTML = '';

    articles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.className = 'news-article';
        articleElement.innerHTML = `
            <img src="${article.urlToImage || 'https://via.placeholder.com/300x200'}" alt="${article.title}">
            <h3>${article.title}</h3>
            <p>${article.description || 'No description available'}</p>
            <a href="${article.url}" target="_blank">Read More</a>
        `;
        articlesContainer.appendChild(articleElement);
    });
}

function searchNews() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const filteredArticles = articlesArray.filter(article => {
        return (
            article.title.toLowerCase().includes(searchTerm) ||
            article.description.toLowerCase().includes(searchTerm)
        );
    });
    displayArticles(filteredArticles);
}

// Fetch news on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchUFCNews('UFC');
});
