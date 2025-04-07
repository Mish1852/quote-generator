'use client';

import { useState } from 'react';
import styles from './QuoteGenerator.module.css';

interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (text: string) => void;
}

export default function CommentSection({ comments, onAddComment }: CommentSectionProps) {
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      setError('Comment text is required');
      return;
    }
    
    onAddComment(commentText.trim());
    
    // Reset form
    setCommentText('');
    setError('');
  };

  return (
    <div className={styles.commentSection}>
      <h3 className={styles.commentTitle}>Comments</h3>
      
      <div className={styles.commentList}>
        {comments.length === 0 ? (
          <p className={styles.noComments}>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className={styles.commentItem}>
              <div className={styles.commentHeader}>
                <span className={styles.commentAuthor}>{comment.author}</span>
                <span className={styles.commentTime}>{comment.timestamp}</span>
              </div>
              <p className={styles.commentText}>{comment.text}</p>
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={handleSubmit} className={styles.commentForm}>
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.formGroup}>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment..."
            className={styles.commentTextArea}
            rows={3}
          />
        </div>
        
        <button type="submit" className={styles.submitCommentBtn}>
          Add Comment
        </button>
      </form>
    </div>
  );
} 