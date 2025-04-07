'use client';

import { useState } from 'react';
import styles from './QuoteGenerator.module.css';

interface Quote {
  text: string;
  author: string;
}

interface AddQuoteFormProps {
  onAddQuote: (quote: Quote) => void;
  onCancel: () => void;
}

export default function AddQuoteForm({ onAddQuote, onCancel }: AddQuoteFormProps) {
  const [quoteText, setQuoteText] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quoteText.trim()) {
      setError('Quote text is required');
      return;
    }
    
    if (!author.trim()) {
      setError('Author name is required');
      return;
    }
    
    onAddQuote({
      text: quoteText.trim(),
      author: author.trim()
    });
    
    // Reset form
    setQuoteText('');
    setAuthor('');
    setError('');
  };

  return (
    <div className={styles.formContainer}>
      <h3 className={styles.formTitle}>Add Your Own Quote</h3>
      
      <form onSubmit={handleSubmit}>
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.formGroup}>
          <label htmlFor="quoteText">Quote Text:</label>
          <textarea
            id="quoteText"
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
            placeholder="Enter your inspirational quote"
            className={styles.textArea}
            rows={4}
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Enter the author's name"
            className={styles.input}
          />
        </div>
        
        <div className={styles.formButtons}>
          <button 
            type="button" 
            onClick={onCancel} 
            className={styles.cancelBtn}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className={styles.submitBtn}
          >
            Add Quote
          </button>
        </div>
      </form>
    </div>
  );
} 