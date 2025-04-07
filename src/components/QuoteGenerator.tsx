'use client';

import { useState, useEffect } from 'react';
import styles from './QuoteGenerator.module.css';
import quotes from '../data/quotes.json';
import AddQuoteForm from './AddQuoteForm';
import CommentSection from './CommentSection';

interface Quote {
  text: string;
  author: string;
  id?: string;
}

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

export default function QuoteGenerator() {
  const [allQuotes, setAllQuotes] = useState<Quote[]>(quotes);
  const [quote, setQuote] = useState<Quote>({ text: '', author: '' });
  const [fadeIn, setFadeIn] = useState(true);
  const [showAddQuote, setShowAddQuote] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  // Load saved quotes from localStorage
  useEffect(() => {
    try {
      // Try to load quotes from localStorage
      const savedQuotes = localStorage.getItem('customQuotes');
      if (savedQuotes) {
        const parsedQuotes = JSON.parse(savedQuotes);
        setAllQuotes(prevQuotes => [...quotes, ...parsedQuotes]);
      }
      
      // Get random quote on initial load
      getRandomQuote();
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  const getRandomQuote = () => {
    setFadeIn(false);
    setShowComments(false);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * allQuotes.length);
      setQuote(allQuotes[randomIndex]);
      setFadeIn(true);
    }, 500); // Wait for fade out animation to complete
  };

  const handleTweetClick = () => {
    const tweetText = encodeURIComponent(`"${quote.text}" - ${quote.author}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  };

  const handleAddQuote = (newQuote: Quote) => {
    try {
      const quoteWithId = {
        ...newQuote,
        id: Date.now().toString()
      };
      
      // Save to local storage
      const savedQuotes = localStorage.getItem('customQuotes');
      const parsedQuotes = savedQuotes ? JSON.parse(savedQuotes) : [];
      localStorage.setItem('customQuotes', JSON.stringify([...parsedQuotes, quoteWithId]));
      
      // Update state
      setAllQuotes(prevQuotes => [...prevQuotes, quoteWithId]);
      setShowAddQuote(false);
    } catch (error) {
      console.error('Error saving quote:', error);
    }
  };

  const handleAddComment = (text: string) => {
    try {
      const newComment = {
        id: Date.now().toString(),
        text,
        author: 'Anonymous',
        timestamp: new Date().toLocaleString()
      };
      
      // Save to local storage with quote reference
      const storageKey = `comments_${quote.id || quote.text}`;
      const savedComments = localStorage.getItem(storageKey);
      const parsedComments = savedComments ? JSON.parse(savedComments) : [];
      localStorage.setItem(storageKey, JSON.stringify([...parsedComments, newComment]));
      
      // Update state
      setComments(prevComments => [...prevComments, newComment]);
    } catch (error) {
      console.error('Error saving comment:', error);
    }
  };

  const toggleComments = () => {
    try {
      if (!showComments) {
        // Load comments for this quote
        const storageKey = `comments_${quote.id || quote.text}`;
        const savedComments = localStorage.getItem(storageKey);
        if (savedComments) {
          setComments(JSON.parse(savedComments));
        } else {
          setComments([]);
        }
      }
      setShowComments(!showComments);
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Inspirational Quotes</h1>
      
      <div className={styles.quoteBox}>
        <div className={`${styles.quoteContent} ${fadeIn ? styles.fadeIn : styles.fadeOut}`}>
          <blockquote className={styles.quote}>"{quote.text}"</blockquote>
          <p className={styles.author}>- {quote.author}</p>
        </div>
        
        <div className={styles.buttons}>
          <button className={styles.newQuoteBtn} onClick={getRandomQuote}>
            New Quote
          </button>
          <button className={styles.tweetBtn} onClick={handleTweetClick}>
            <svg className={styles.twitterIcon} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
            </svg>
            Tweet
          </button>
          <button className={styles.commentBtn} onClick={toggleComments}>
            {showComments ? 'Hide Comments' : 'Show Comments'}
          </button>
        </div>
        
        {showComments && (
          <CommentSection 
            comments={comments} 
            onAddComment={handleAddComment} 
          />
        )}
      </div>
      
      <div className={styles.addQuoteSection}>
        {!showAddQuote ? (
          <button 
            className={styles.addQuoteBtn} 
            onClick={() => setShowAddQuote(true)}
          >
            Add Your Own Quote
          </button>
        ) : (
          <AddQuoteForm 
            onAddQuote={handleAddQuote} 
            onCancel={() => setShowAddQuote(false)} 
          />
        )}
      </div>
    </div>
  );
} 