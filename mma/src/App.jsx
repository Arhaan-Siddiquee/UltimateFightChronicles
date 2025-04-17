import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { format } from 'date-fns';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaSearch, FaChevronDown, FaTrophy, FaCalendarAlt, FaFistRaised } from 'react-icons/fa';

export default function UFCNewsApp() {
  const [articles, setArticles] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState(0);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeRankingCategory, setActiveRankingCategory] = useState('Pound-for-Pound');
  
  const headerRef = useRef(null);
  const apiKey = 'YOUR_API_KEY'; // Replace with your NewsAPI key
  const articlesPerPage = 6;
  
  // MMA-related keywords for filtering
  const mmaKeywords = ['ufc', 'mma', 'fighter', 'fight', 'championship', 'knockout', 'submission', 'bellator', 
                      'octagon', 'dana white', 'pfl', 'one fc', 'cage', 'bjj', 'grappling', 'kickboxing', 
                      'wrestling', 'mixed martial arts'];
  
  // Scroll to top button visibility
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
      
      // Header animation
      if (headerRef.current) {
        if (window.scrollY > 50) {
          headerRef.current.classList.add('header-scrolled');
        } else {
          headerRef.current.classList.remove('header-scrolled');
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {
    const query = buildSearchQuery();
    fetchUFCNews(query);
    
    if (category === 'Rankings') {
      fetchRankings();
    } else if (category === 'Events') {
      fetchEvents();
    }
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
  
  // Function to fetch news articles
  const fetchUFCNews = async (query = 'UFC MMA') => {
    setLoading(true);
    setError(null);
    
    try {
      // Add MMA filter to any search query
      const enhancedQuery = searchTerm ? `${searchTerm} (UFC OR MMA)` : query;
      const response = await axios.get(`https://newsapi.org/v2/everything?q=${enhancedQuery}&language=en&sortBy=publishedAt&apiKey=${apiKey}`);
      
      // Filter articles to ensure they're MMA related
      const filteredArticles = filterMMAContent(response.data.articles || []);
      
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
  
  // Function to fetch UFC rankings (mock data for now)
  const fetchRankings = async () => {
    // In a real implementation, you would fetch this from an API
    // For now, using mock data
    const mockRankings = {
      'Pound-for-Pound': [
        { rank: 1, name: 'Islam Makhachev', record: '24-1-0', weightClass: 'Lightweight', movement: 'same' },
        { rank: 2, name: 'Jon Jones', record: '27-1-0', weightClass: 'Heavyweight', movement: 'same' },
        { rank: 3, name: 'Leon Edwards', record: '21-3-0', weightClass: 'Welterweight', movement: 'up' },
        { rank: 4, name: 'Alexander Volkanovski', record: '26-3-0', weightClass: 'Featherweight', movement: 'down' },
        { rank: 5, name: 'Alex Pereira', record: '9-2-0', weightClass: 'Light Heavyweight', movement: 'up' },
        { rank: 6, name: 'Charles Oliveira', record: '34-9-0', weightClass: 'Lightweight', movement: 'same' },
        { rank: 7, name: 'Ilia Topuria', record: '14-0-0', weightClass: 'Featherweight', movement: 'up' },
        { rank: 8, name: 'Sean O\'Malley', record: '17-1-0', weightClass: 'Bantamweight', movement: 'up' },
        { rank: 9, name: 'Israel Adesanya', record: '24-3-0', weightClass: 'Middleweight', movement: 'down' },
        { rank: 10, name: 'Max Holloway', record: '25-7-0', weightClass: 'Featherweight', movement: 'up' }
      ],
      'Heavyweight': [
        { rank: 'C', name: 'Jon Jones', record: '27-1-0', weightClass: 'Heavyweight', movement: 'same' },
        { rank: 1, name: 'Ciryl Gane', record: '11-2-0', weightClass: 'Heavyweight', movement: 'same' },
        { rank: 2, name: 'Stipe Miocic', record: '20-4-0', weightClass: 'Heavyweight', movement: 'same' },
        { rank: 3, name: 'Tom Aspinall', record: '14-3-0', weightClass: 'Heavyweight', movement: 'up' },
        { rank: 4, name: 'Sergei Pavlovich', record: '18-2-0', weightClass: 'Heavyweight', movement: 'down' },
        { rank: 5, name: 'Curtis Blaydes', record: '17-4-0', weightClass: 'Heavyweight', movement: 'same' }
      ],
      'Light Heavyweight': [
        { rank: 'C', name: 'Alex Pereira', record: '9-2-0', weightClass: 'Light Heavyweight', movement: 'same' },
        { rank: 1, name: 'Jamahal Hill', record: '12-1-0', weightClass: 'Light Heavyweight', movement: 'same' },
        { rank: 2, name: 'Jiri Prochazka', record: '29-4-1', weightClass: 'Light Heavyweight', movement: 'same' },
        { rank: 3, name: 'Magomed Ankalaev', record: '18-1-1', weightClass: 'Light Heavyweight', movement: 'same' },
        { rank: 4, name: 'Jan Blachowicz', record: '29-10-1', weightClass: 'Light Heavyweight', movement: 'same' },
        { rank: 5, name: 'Aleksandar Rakic', record: '14-3-0', weightClass: 'Light Heavyweight', movement: 'same' }
      ],
      'Middleweight': [
        { rank: 'C', name: 'Dricus Du Plessis', record: '20-2-0', weightClass: 'Middleweight', movement: 'same' },
        { rank: 1, name: 'Israel Adesanya', record: '24-3-0', weightClass: 'Middleweight', movement: 'same' },
        { rank: 2, name: 'Robert Whittaker', record: '25-7-0', weightClass: 'Middleweight', movement: 'same' },
        { rank: 3, name: 'Sean Strickland', record: '28-6-0', weightClass: 'Middleweight', movement: 'down' },
        { rank: 4, name: 'Jared Cannonier', record: '17-6-0', weightClass: 'Middleweight', movement: 'same' },
        { rank: 5, name: 'Marvin Vettori', record: '19-6-1', weightClass: 'Middleweight', movement: 'same' }
      ],
      'Welterweight': [
        { rank: 'C', name: 'Leon Edwards', record: '21-3-0', weightClass: 'Welterweight', movement: 'same' },
        { rank: 1, name: 'Belal Muhammad', record: '23-3-0', weightClass: 'Welterweight', movement: 'up' },
        { rank: 2, name: 'Kamaru Usman', record: '20-3-0', weightClass: 'Welterweight', movement: 'down' },
        { rank: 3, name: 'Shavkat Rakhmonov', record: '17-0-0', weightClass: 'Welterweight', movement: 'up' },
        { rank: 4, name: 'Colby Covington', record: '17-4-0', weightClass: 'Welterweight', movement: 'down' },
        { rank: 5, name: 'Gilbert Burns', record: '22-6-0', weightClass: 'Welterweight', movement: 'same' }
      ],
      'Lightweight': [
        { rank: 'C', name: 'Islam Makhachev', record: '24-1-0', weightClass: 'Lightweight', movement: 'same' },
        { rank: 1, name: 'Charles Oliveira', record: '34-9-0', weightClass: 'Lightweight', movement: 'same' },
        { rank: 2, name: 'Justin Gaethje', record: '24-4-0', weightClass: 'Lightweight', movement: 'same' },
        { rank: 3, name: 'Dustin Poirier', record: '29-8-0', weightClass: 'Lightweight', movement: 'same' },
        { rank: 4, name: 'Arman Tsarukyan', record: '20-3-0', weightClass: 'Lightweight', movement: 'up' },
        { rank: 5, name: 'Michael Chandler', record: '23-8-0', weightClass: 'Lightweight', movement: 'down' }
      ]
    };
    
    setRankings(mockRankings);
  };
  
  // Function to fetch upcoming UFC events (mock data for now)
  const fetchEvents = async () => {
    // In a real implementation, you would fetch this from an API
    // For now, using mock data
    const mockEvents = [
      {
        id: 1,
        name: 'UFC 302: Makhachev vs. Poirier',
        date: '2025-05-24',
        venue: 'Prudential Center, Newark, NJ',
        mainCard: [
          { fighter1: 'Islam Makhachev', fighter2: 'Dustin Poirier', title: 'Lightweight Championship' },
          { fighter1: 'Sean Strickland', fighter2: 'Paulo Costa', title: 'Middleweight Bout' },
          { fighter1: 'Kevin Holland', fighter2: 'Daniel Rodriguez', title: 'Welterweight Bout' },
          { fighter1: 'Erin Blanchfield', fighter2: 'Manon Fiorot', title: "Women's Flyweight Bout" },
          { fighter1: 'Grant Dawson', fighter2: 'Joe Solecki', title: 'Lightweight Bout' }
        ],
        image: 'https://via.placeholder.com/800x450?text=UFC+302'
      },
      {
        id: 2,
        name: 'UFC Fight Night: Allen vs. Evloev',
        date: '2025-06-07',
        venue: 'UFC Apex, Las Vegas, NV',
        mainCard: [
          { fighter1: 'Arnold Allen', fighter2: 'Movsar Evloev', title: 'Featherweight Bout' },
          { fighter1: 'Edson Barboza', fighter2: 'Lerone Murphy', title: 'Featherweight Bout' },
          { fighter1: 'Adrian Yanez', fighter2: 'Said Nurmagomedov', title: 'Bantamweight Bout' },
          { fighter1: 'Alex Caceres', fighter2: 'Dan Ige', title: 'Featherweight Bout' },
          { fighter1: 'Anthony Smith', fighter2: 'Dominick Reyes', title: 'Light Heavyweight Bout' }
        ],
        image: 'https://via.placeholder.com/800x450?text=UFC+Fight+Night'
      },
      {
        id: 3,
        name: 'UFC 303: Jones vs. Miocic',
        date: '2025-06-21',
        venue: 'T-Mobile Arena, Las Vegas, NV',
        mainCard: [
          { fighter1: 'Jon Jones', fighter2: 'Stipe Miocic', title: 'Heavyweight Championship' },
          { fighter1: 'Max Holloway', fighter2: 'Brian Ortega', title: 'Featherweight Bout' },
          { fighter1: 'Irene Aldana', fighter2: 'Kayla Harrison', title: "Women's Bantamweight Bout" },
          { fighter1: 'Gilbert Burns', fighter2: 'Jack Della Maddalena', title: 'Welterweight Bout' },
          { fighter1: 'Diego Lopes', fighter2: 'Dan Ige', title: 'Featherweight Bout' }
        ],
        image: 'https://via.placeholder.com/800x450?text=UFC+303'
      }
    ];
    
    setEvents(mockEvents);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchUFCNews(`${searchTerm} UFC MMA`);
    }
  };
  
  const loadMoreNews = async () => {
    setLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate loading
    setDisplayedArticles(prev => Math.min(prev + articlesPerPage, articles.length));
    setLoadingMore(false);
  };
  
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setSearchTerm('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Animations
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  // Render rankings section
  const renderRankings = () => {
    if (!rankings || Object.keys(rankings).length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      );
    }
    
    const rankingCategories = Object.keys(rankings);
    
    return (
      <div className="rankings-container">
        <motion.div 
          className="ranking-categories flex overflow-x-auto py-4 mb-6 gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {rankingCategories.map(cat => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0 transition-all ${
                activeRankingCategory === cat 
                  ? 'bg-red-600 text-white font-bold shadow-lg' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setActiveRankingCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </motion.div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRankingCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="rankings-table bg-gray-800 rounded-xl overflow-hidden shadow-xl"
          >
            <div className="rankings-header bg-gradient-to-r from-red-700 to-red-900 text-white p-4">
              <h3 className="text-xl font-bold flex items-center">
                <FaTrophy className="mr-2" /> 
                {activeRankingCategory} Rankings
              </h3>
            </div>
            <div className="rankings-body">
              <table className="w-full">
                <thead className="bg-gray-900">
                  <tr className="text-left">
                    <th className="p-4">Rank</th>
                    <th className="p-4">Fighter</th>
                    <th className="p-4 hidden md:table-cell">Record</th>
                    <th className="p-4 hidden md:table-cell">Weight Class</th>
                    <th className="p-4">Movement</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings[activeRankingCategory].map((fighter, index) => (
                    <motion.tr 
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-b border-gray-700 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'} 
                        hover:bg-gray-700 transition-colors`}
                    >
                      <td className="p-4 font-bold">
                        {fighter.rank === 'C' ? (
                          <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-2 py-1 rounded-full text-xs font-bold">
                            C
                          </span>
                        ) : fighter.rank}
                      </td>
                      <td className="p-4 font-medium">{fighter.name}</td>
                      <td className="p-4 hidden md:table-cell">{fighter.record}</td>
                      <td className="p-4 hidden md:table-cell">{fighter.weightClass}</td>
                      <td className="p-4">
                        {fighter.movement === 'up' && (
                          <span className="text-green-500">▲</span>
                        )}
                        {fighter.movement === 'down' && (
                          <span className="text-red-500">▼</span>
                        )}
                        {fighter.movement === 'same' && (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };
  
  // Render events section
  const renderEvents = () => {
    if (!events || events.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      );
    }
    
    return (
      <div className="events-container">
        <motion.h2 
          className="text-3xl font-bold text-white mb-6 flex items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <FaCalendarAlt className="mr-2 text-red-500" /> Upcoming UFC Events
        </motion.h2>
        
        <div className="events-list space-y-8">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              className="event-card bg-gray-800 rounded-xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="md:flex">
                <div className="md:w-1/3 h-48 md:h-auto overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/800x600?text=UFC+Event";
                    }}
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex flex-col md:flex-row justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white">{event.name}</h3>
                    <div className="text-red-500 font-medium flex items-center mt-2 md:mt-0">
                      <FaCalendarAlt className="mr-2" />
                      {format(new Date(event.date), 'MMMM d, yyyy')}
                    </div>
                  </div>
                  <p className="text-gray-400 mb-4">{event.venue}</p>
                  
                  <div className="main-card mt-4">
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <FaFistRaised className="mr-2 text-red-500" /> Main Card
                    </h4>
                    <div className="space-y-3">
                      {event.mainCard.map((fight, idx) => (
                        <div 
                          key={idx} 
                          className={`fight-item p-3 rounded-lg ${
                            idx === 0 ? 'bg-gradient-to-r from-red-900/50 to-red-700/30 border-l-4 border-red-600' : 'bg-gray-700/30'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div className="fighters flex-1 text-center">
                              <span className="font-bold text-white">{fight.fighter1}</span>
                            </div>
                            <div className="vs px-3 text-red-500 font-bold">VS</div>
                            <div className="fighters flex-1 text-center">
                              <span className="font-bold text-white">{fight.fighter2}</span>
                            </div>
                          </div>
                          <div className="fight-title text-center mt-1 text-xs text-gray-400">
                            {fight.title}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };
  
  // Get featured article (first article)
  const featuredArticle = articles.length > 0 ? articles[0] : null;
  
  // Get remaining articles for regular display
  const regularArticles = articles.length > 0 ? articles.slice(1, displayedArticles) : [];
  
  return (
    <div className="min-h-screen flex flex-col bg-black text-gray-300">
      {/* Header */}
      <header ref={headerRef} className="bg-gray-900 py-6 px-4 sticky top-0 z-50 transition-all duration-300">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h1 className="text-4xl font-bold text-red-600 tracking-tighter">
                UltimateFightChronicles
              </h1>
              <p className="text-xl mt-1 text-gray-400">Your #1 Source for UFC & MMA News</p>
            </div>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex w-full md:w-auto">
              <input
                type="text"
                placeholder="Search MMA news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 px-4 py-2 rounded-l-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <button 
                type="submit" 
                className="bg-red-600 text-white px-4 py-2 rounded-r-lg hover:bg-red-700 transition-colors duration-300 flex items-center"
              >
                <FaSearch />
              </button>
            </form>
          </div>
        </div>
      </header>
      
      {/* Navigation */}
      <nav className="bg-gray-800 sticky top-20 z-40 shadow-lg">
        <div className="container mx-auto px-4">
          <ul className="flex justify-center space-x-1 md:space-x-4 py-4 overflow-x-auto">
            {['all', 'Fights', 'Rankings', 'Events', 'Fighters'].map((item) => (
              <li key={item}>
                <button 
                  onClick={() => handleCategoryChange(item)}
                  className={`px-3 md:px-6 py-2 rounded-lg transition-all duration-300 hover:bg-gray-700 
                    ${category === item ? 'bg-red-600 text-white font-bold shadow-lg' : 'text-gray-300'}`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      
      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Category-specific content */}
        {category === 'Rankings' ? (
          <section className="py-10">
            <div className="container mx-auto px-4">
              {renderRankings()}
            </div>
          </section>
        ) : category === 'Events' ? (
          <section className="py-10">
            <div className="container mx-auto px-4">
              {renderEvents()}
            </div>
          </section>
        ) : (
          <>
            {/* Featured Article Hero Section */}
            {featuredArticle && (
              <section className="bg-gray-900 py-8">
                <div className="container mx-auto px-4">
                  <motion.div 
                    className="featured-article"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                      <div className="featured-image rounded-xl overflow-hidden shadow-2xl h-64 md:h-96">
                        <img 
                          src={featuredArticle.urlToImage || "https://via.placeholder.com/800x600?text=Featured+MMA+News"} 
                          alt={featuredArticle.title} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/800x600?text=Featured+MMA+News";
                          }}
                        />
                      </div>
                      <div className="featured-content p-6 bg-gray-800/60 backdrop-blur-sm rounded-xl">
                        <div className="mb-3">
                          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                            Featured
                          </span>
                          <span className="text-gray-400 text-sm ml-3">
                          {new Date(featuredArticle.publishedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                          {featuredArticle.title}
                        </h2>
                        <p className="text-gray-300 mb-6 line-clamp-4">
                          {featuredArticle.description || 'No description available'}
                        </p>
                        <a 
                          href={featuredArticle.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                        >
                          Read Full Story
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>
            )}

            {/* News Articles Grid */}
            <section className="py-10">
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
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: {
                          opacity: 1,
                          transition: {
                            staggerChildren: 0.1
                          }
                        }
                      }}
                    >
                      {regularArticles.map((article, index) => (
                        <motion.div
                          key={index}
                          variants={fadeIn}
                          className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                          whileHover={{ y: -5 }}
                        >
                          <div className="h-48 overflow-hidden relative">
                            <img 
                              src={article.urlToImage || "https://via.placeholder.com/400x200?text=MMA+News"} 
                              alt={article.title} 
                              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/400x200?text=MMA+News";
                              }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent h-16"></div>
                          </div>
                          <div className="p-6">
                            <div className="flex justify-between items-start mb-3">
                              <span className="text-xs text-gray-500">
                                {new Date(article.publishedAt).toLocaleDateString()}
                              </span>
                              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                                {article.source?.name || 'Unknown'}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white line-clamp-2">{article.title}</h3>
                            <p className="text-gray-400 mb-4 line-clamp-3">{article.description || 'No description available'}</p>
                            <a 
                              href={article.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                            >
                              Read More
                            </a>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>

                    {displayedArticles < articles.length && (
                      <div className="text-center mt-10">
                        <button 
                          onClick={loadMoreNews}
                          disabled={loadingMore}
                          className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300 border border-gray-700 flex items-center mx-auto"
                        >
                          {loadingMore ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Loading...
                            </>
                          ) : (
                            'Load More'
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg z-50 transition-colors duration-300"
            aria-label="Scroll to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-red-600 mb-4">UltimateFightChronicles</h3>
              <p className="text-gray-400">
                Your premier destination for the latest UFC and MMA news, fighter rankings, event schedules, and in-depth analysis.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['all', 'Fights', 'Rankings', 'Events', 'Fighters'].map((item) => (
                  <li key={item}>
                    <button 
                      onClick={() => handleCategoryChange(item)}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-300"
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
              <div className="flex space-x-4">
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
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} UltimateFightChronicles. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}