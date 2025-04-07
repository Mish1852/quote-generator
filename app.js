import { quotes } from './quotes.js';

// DOM Elements
const quoteText = document.querySelector('.quote-text');
const quoteAuthor = document.querySelector('.quote-author');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const copyBtn = document.getElementById('copyBtn');
const tweetBtn = document.getElementById('tweetBtn');
const commentForm = document.getElementById('commentForm');
const commentsList = document.getElementById('commentsList');
const addQuoteForm = document.getElementById('addQuoteForm');
const scrollToTopBtn = document.getElementById('scrollToTopBtn');
const toast = document.getElementById('toast');

// State
let currentQuote = null;
let comments = JSON.parse(localStorage.getItem('comments')) || [];
let customQuotes = JSON.parse(localStorage.getItem('customQuotes')) || [];

// Initialize
function init() {
    displayRandomQuote();
    displayComments();
    setupEventListeners();
}

// Display random quote
function displayRandomQuote() {
    const allQuotes = [...quotes, ...customQuotes];
    const randomIndex = Math.floor(Math.random() * allQuotes.length);
    currentQuote = allQuotes[randomIndex];
    
    quoteText.textContent = currentQuote.text;
    quoteAuthor.textContent = `- ${currentQuote.author}`;
}

// Display comments
function displayComments() {
    commentsList.innerHTML = comments.map(comment => `
        <div class="comment">
            <p>${comment.text}</p>
            <small>${new Date(comment.date).toLocaleString()}</small>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // New quote button
    newQuoteBtn.addEventListener('click', displayRandomQuote);

    // Copy button
    copyBtn.addEventListener('click', () => {
        const textToCopy = `${currentQuote.text} - ${currentQuote.author}`;
        navigator.clipboard.writeText(textToCopy)
            .then(() => showToast('Quote copied to clipboard!'))
            .catch(err => showToast('Failed to copy quote'));
    });

    // Tweet button
    tweetBtn.addEventListener('click', () => {
        const tweetText = `${currentQuote.text} - ${currentQuote.author}`;
        const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.open(tweetUrl, '_blank');
    });

    // Comment form
    commentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const commentText = document.getElementById('commentText').value;
        
        if (commentText.trim()) {
            const newComment = {
                text: commentText,
                date: new Date().toISOString()
            };
            
            comments.unshift(newComment);
            localStorage.setItem('comments', JSON.stringify(comments));
            displayComments();
            commentForm.reset();
            showToast('Comment added!');
        }
    });

    // Add quote form
    addQuoteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const quoteText = document.getElementById('quoteText').value;
        const quoteAuthor = document.getElementById('quoteAuthor').value;
        
        if (quoteText.trim() && quoteAuthor.trim()) {
            const newQuote = {
                text: quoteText,
                author: quoteAuthor
            };
            
            customQuotes.push(newQuote);
            localStorage.setItem('customQuotes', JSON.stringify(customQuotes));
            addQuoteForm.reset();
            showToast('Quote added successfully!');
            displayRandomQuote();
        }
    });

    // Scroll to top button
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
}

// Show toast notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize the app
init(); 