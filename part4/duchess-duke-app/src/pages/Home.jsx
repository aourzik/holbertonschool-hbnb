import { useEffect } from 'react';

export default function Home() {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        // On cible tous les éléments avec la classe 'reveal'
        const elements = document.querySelectorAll('.reveal');
        elements.forEach((el) => observer.observe(el));

        // Nettoyage quand on quitte la page
        return () => observer.disconnect();
    }, []);

    return (
        <>
            <section id="home" className="hero">
                <div className="video-container">
                    <video autoPlay muted loop playsInline id="hero-video">
                        <source src="/images/background-london.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className="hero-content">
                    <h1>Duchess & Duke Housing</h1>
                    <h3>Since 1880</h3>
                </div>
                <div className="scroll-indicator">
                    <span>Explore the Estate</span>
                    <div className="mouse">
                        <div className="wheel"></div>
                    </div>
                    <div className="arrow">
                        <span className="s-1"></span>
                        <span className="s-2"></span>
                    </div>
                </div>
            </section>
            <section id="values" className="values">
                <div className="container">
                    <h1 className="reveal title-luxury">Our Values</h1>

                    <p className="reveal value-description">
                        Ensuring your comfort, giving you the feeling of being a Bridgerton in Victorian London.
                    </p>

                    <div className="reveal separator-container">
                        <div className="separator-line"></div>
                        <div className="image-wrapper">
                            <img src="/images/lady.png" alt="Lady Whistledown" />
                        </div>
                    </div>

                    <blockquote className="reveal whistledown-quote">
                        <p>“Formed under pressure, desired by many, but possessed only by a few lucky ones, nothing on earth
                            is as envied as a diamond.”</p>
                        <cite>— Lady Whistledown</cite>
                    </blockquote>
                </div></section>
            <section id="about" className="about">
                <div className="container">
                    <h1 className="reveal title-luxury">About Us</h1>
                    <p className="reveal value-description">
                        In the real estate industry for years, our taste for luxury and perfection combined with our passion
                        for the Bridgerton series has naturally led us to offer you the most luxurious and unusual places in
                        London.
                    </p>

                    <div className="about-grid">
                        <div className="reveal about-card">
                            <div className="card-image-container">
                                <img src="/images/history.jpg" alt="Heritage London" />
                            </div>
                            <div className="card-content">
                                <h3>Architectural Heritage</h3>
                                <p>We select properties that capture the essence of 19th-century grandeur.</p>
                            </div>
                        </div>

                        <div className="reveal about-card">
                            <div className="card-image-container">
                                <img src="/images/curation.jpg" alt="Luxury Interior" />
                            </div>
                            <div className="card-content">
                                <h3>Modern Comfort</h3>
                                <p>Victorian aesthetics meet 21st-century amenities for a seamless stay.</p>
                            </div>
                        </div>

                        <div className="reveal about-card">
                            <div className="card-image-container">
                                <img src="/images/excellence.jpg" alt="Butler Service" />
                            </div>
                            <div className="card-content">
                                <h3>Royal Service</h3>
                                <p>Every guest is treated with the protocols of the highest nobility.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}