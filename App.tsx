import React, { useState, useMemo } from 'react';
import { Star, StarHalf, StarOff, Film, ThumbsUp, MessageCircle, Search, SlidersHorizontal } from 'lucide-react';

interface Movie {
  id: number;
  title: string;
  imageUrl: string;
  rating: number;
  reviews: number;
  likes: number;
  description: string;
  category: string;
  year: number;
  userReviews: { rating: number; comment: string }[];
}

function App() {
  const [movies, setMovies] = useState<Movie[]>([
    {
      id: 1,
      title: "Inception",
      imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&q=80&w=600",
      rating: 4.8,
      reviews: 2341,
      likes: 15678,
      description: "A thief who enters the dreams of others to steal secrets from their subconscious.",
      category: "Sci-Fi",
      year: 2010,
      userReviews: []
    },
    // Other movies remain unchanged
  ]);

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'likes'>('rating');

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(movies.map(movie => movie.category))];
    return cats.sort();
  }, [movies]);

  const filteredMovies = useMemo(() => {
    return movies
      .filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              movie.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || movie.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => b.rating - a.rating);
  }, [movies, searchTerm, selectedCategory]);

  const handleReviewSubmit = (rating: number, comment: string) => {
    if (!selectedMovie) return;

    const updatedMovies = movies.map(movie => {
      if (movie.id === selectedMovie.id) {
        const newReviews = [...movie.userReviews, { rating, comment }];
        const newRating = newReviews.reduce((sum, review) => sum + review.rating, 0) / newReviews.length;
        return { ...movie, userReviews: newReviews, rating: newRating };
      }
      return movie;
    });
    setMovies(updatedMovies);
    setSelectedMovie(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Film className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-bold text-gray-900">MovieVerse Reviews</h1>
            </div>
            <input
              type="text"
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="bg-white rounded-lg shadow-lg overflow-hidden" onClick={() => setSelectedMovie(movie)}>
              <img src={movie.imageUrl} alt={movie.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{movie.title}</h2>
                <p className="text-sm text-gray-600">{movie.description}</p>
                <div className="text-yellow-500">⭐ {movie.rating.toFixed(1)} ({movie.reviews + movie.userReviews.length} reviews)</div>
              </div>
            </div>
          ))}
        </div>

        {selectedMovie && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-full max-w-md">
              <h2 className="text-2xl font-bold">{selectedMovie.title}</h2>
              <p className="mb-4">{selectedMovie.description}</p>
              <label>Your Rating:</label>
              <input type="number" min="1" max="5" id="rating" />
              <textarea id="comment" placeholder="Write your review..." className="w-full mt-2 p-2 border rounded"></textarea>
              <button onClick={() => handleReviewSubmit(Number((document.getElementById('rating') as HTMLInputElement).value), (document.getElementById('comment') as HTMLTextAreaElement).value)}>Submit</button>
              <button onClick={() => setSelectedMovie(null)}>Cancel</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;