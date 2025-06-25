import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const scrollContainerRef = useRef(null);

    const fetchArticles = async (currentPage, append = true) => {
        setLoading(true);
        try {
            const baseUrl = `${import.meta.env.VITE_SERVER_URL}/api/articles`;
            const url = `${baseUrl}?page=${currentPage}&limit=15`;

            const response = await axios.get(url);
            const newArticles = response.data.articles;

            if (append) {
                setArticles(prevArticles => [...prevArticles, ...newArticles]);
            } else {
                setArticles(newArticles);
            }

            setHasMore(newArticles.length === 5);
        } catch (error) {
            console.error('Error fetching articles:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        setArticles([]);
        setHasMore(true);
        fetchArticles(1, false);
    }, []);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
            if (scrollTop + clientHeight >= scrollHeight - 50 && !loading && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        };

        scrollContainer.addEventListener('scroll', handleScroll);
        return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore]);

    useEffect(() => {
        if (page > 1) {
            fetchArticles(page);
        }
    }, [page]);

    return (
        <div className="min-h-screen bg-gray-100 font-sans antialiased text-gray-800 flex flex-col">
            

            <main className="flex-grow container mx-auto p-6 overflow-y-auto" ref={scrollContainerRef} style={{ height: 'calc(100vh - 120px)' }}>
                <h2 className="text-3xl font-bold text-center mb-8 text-indigo-800">
                    Latest Articles
                </h2>
                {articles.length === 0 && !loading && (
                    <p className="text-center text-gray-600 text-xl">No articles found. Please try again later.</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.map(article => (
                        <ArticleCard key={article._id} article={article} />
                    ))}
                </div>

                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
                        <p className="ml-4 text-xl text-blue-600">Loading more articles...</p>
                    </div>
                )}

                {!hasMore && !loading && articles.length > 0 && (
                    <p className="text-center text-gray-600 py-8 text-lg">You've reached the end of the articles!</p>
                )}
            </main>
        </div>
    );
};

const ArticleCard = ({ article }) => {
    return (
        <div className="bg-white rounded-lg shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl flex flex-col h-full">
            <img
                src={article.image_url}
                alt={article.name}
                className="w-full h-36 object-cover rounded-t-lg"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x200/ccc/000?text=Image+Not+Found"; }}
            />
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 text-indigo-700 leading-tight">{article.name}</h3>
                <p className="text-sm text-gray-600 mb-3 italic">Published by: {article.publishedBy || 'Unknown'}</p>
                <p className="text-gray-700 text-base mb-4 flex-grow line-clamp-3">{article.info}</p>
                <div className="mt-auto pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                        Hospital: {article.hospital?.name || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">Published on: {new Date(article.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default Articles;
