import React, { useState } from 'react';

export default function ReviewModal({ isOpen, onClose, estateName, onSubmit }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ rating, comment, date: new Date().toLocaleDateString() });
        setComment("");
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content review-modal reveal-on-load">
                <button className="close-modal" onClick={onClose}>&times;</button>

                <div className="modal-header">
                    <h2 className="title-luxury">Publish your Memoirs</h2>
                    <p className="subtitle">Share your thoughts on your stay at <strong>{estateName}</strong></p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label>Your Rating</label>
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={star <= rating ? "star active" : "star"}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Your Review</label>
                        <textarea
                            placeholder="Write your impressions here, My Lord..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <button type="submit" className="btn-gold-full">Publish to the Ton</button>
                </form>
            </div>
        </div>
    );
}