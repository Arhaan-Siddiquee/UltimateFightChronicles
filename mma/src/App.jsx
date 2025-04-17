import React, { useState, useEffect } from 'react';

export default function UFCNewsApp() {
  const [articles, setArticles] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState(0);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const apiKey = '9347cc6883f84d39b487fa84e8d58201';
  const articlesPerPage = 6;
  
  // MMA-related keywords for filtering
  const mmaKeywords = ['ufc', 'mma', 'fighter', 'fight', 'championship', 'knockout', 'submission', 'bellator', 
                      'octagon', 'dana white', 'pfl', 'one fc', 'cage', 'bjj', 'grappling', 'kickboxing', 
                      'wrestling', 'mixed martial arts'];
  
  useEffect(() => {
    const query = buildSearchQuery();
    fetchUFCNews(query);
  }, [category]);
  
  // Build a better search query based on category
  const buildSearchQuery = () => {
    let query = '';
    
    switch(category) {
      case 'Fights':
        query = 'UFC MMA fight preview results';
        break;
      case 'Rankings':
        query = 'UFC MMA rankings pound-for-pound champions';
        break;
      case 'Events':
        query = 'UFC MMA event upcoming ppv card';
        break;
      case 'Fighters':
        query = 'UFC MMA fighter profile interview';
        break;
      default:
        query = 'UFC MMA news';
    }
    
    return query;
  };
  
  const fetchUFCNews = async (query = 'UFC MMA') => {
    setLoading(true);
    setError(null);
    
    try {
      // Add MMA filter to any search query
      const enhancedQuery = searchTerm ? `${searchTerm} (UFC OR MMA)` : query;
      const response = await fetch(`https://newsapi.org/v2/everything?q=${enhancedQuery}&language=en&sortBy=publishedAt&apiKey=${apiKey}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch news articles');
      }
      
      const data = await response.json();
      
      // Filter articles to ensure they're MMA related
      const filteredArticles = filterMMAContent(data.articles || []);
      
      setArticles(filteredArticles);
      setDisplayedArticles(Math.min(articlesPerPage, filteredArticles.length));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to fetch news articles. Please try again later.');
      setLoading(false);
    }
  };
  
  // Filter function to ensure content is MMA related
  const filterMMAContent = (articles) => {
    return articles.filter(article => {
      const title = article.title?.toLowerCase() || '';
      const description = article.description?.toLowerCase() || '';
      const content = article.content?.toLowerCase() || '';
      
      // Check if any MMA keywords exist in the article
      return mmaKeywords.some(keyword => 
        title.includes(keyword) || 
        description.includes(keyword) || 
        content.includes(keyword)
      );
    });
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchUFCNews(`${searchTerm} UFC MMA`);
    }
  };
  
  const loadMoreNews = () => {
    setDisplayedArticles(prev => Math.min(prev + articlesPerPage, articles.length));
  };
  
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setSearchTerm('');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-300">
      {/* Header */}
      <header className="bg-gray-900 py-6 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-red-600">UltimateFightChronicles</h1>
          <p className="text-xl mt-2 text-gray-400">Your #1 Source for UFC & MMA News</p>
        </div>
      </header>
      
      {/* Navigation */}
      <nav className="bg-gray-800 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <ul className="flex justify-center space-x-1 md:space-x-4 py-4 overflow-x-auto">
            {['all', 'Fights', 'Rankings', 'Events', 'Fighters', 'Contact'].map((item) => (
              <li key={item}>
                <button 
                  onClick={() => handleCategoryChange(item)}
                  className={`px-3 md:px-6 py-2 rounded-lg transition-all duration-300 hover:bg-gray-700 
                    ${category === item ? 'bg-gray-700 text-red-500 font-bold' : 'text-gray-300'}`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      
      {/* Search Bar */}
      <div className="bg-black py-6">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="flex justify-center">
            <input
              type="text"
              placeholder="Search MMA news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-2/3 lg:w-1/2 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button 
              type="submit" 
              className="ml-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-300"
            >
              Search
            </button>
          </form>
        </div>
      </div>
      
      {/* Hero Section */}
      <section className="bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="w-full lg:w-3/4 rounded-xl overflow-hidden shadow-2xl">
              <img 
                src="components/ufc_banner.jpg" 
                alt="UFC Banner" 
                className="w-full h-auto object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/1200x500?text=UFC+Banner";
                }}
              />
            </div>
            <div className="text-center mt-6 px-4">
              <h2 className="text-3xl font-bold text-red-500">Breaking MMA Headlines</h2>
              <p className="text-xl mt-2 text-gray-400">Get the latest news from inside the octagon</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* News Articles */}
      <section className="py-10 flex-grow">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : articles.length === 0 ? (
            <div className="text-center text-gray-400 py-10">No MMA news articles found. Try a different search term.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.slice(0, displayedArticles).map((article, index) => (
                  <div 
                    key={index} 
                    className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition-transform duration-300 hover:-translate-y-2"
                  >
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={article.urlToImage || "https://via.placeholder.com/400x200?text=MMA+News"} 
                        alt={article.title} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x200?text=MMA+News";
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 text-white line-clamp-2">{article.title}</h3>
                      <p className="text-gray-400 mb-4 line-clamp-3">{article.description || 'No description available'}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </span>
                        <a 
                          href={article.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {displayedArticles < articles.length && (
                <div className="text-center mt-10">
                  <button 
                    onClick={loadMoreNews}
                    className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 border border-gray-700"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} UltimateFightChronicles. All rights reserved.</p>
          <div className="flex justify-center mt-4 space-x-4">
            <a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.69 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-red-500 transition-colors duration-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}