export default function Footer() {
    return (
        <footer id="main-footer" className="main-footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <div className="footer-logo-icon">
                        <img src="/images/logo.png" alt="Duchess & Duke Icon" />
                    </div>
                    <h3>Duchess & Duke</h3>
                    <p>Establishing the standards of luxury since 1880.</p>
                </div>

                <div className="footer-links">
                    <div className="link-group">
                        <h4>Legal</h4>
                        <ul>
                            <li><a href="#">Terms & Conditions</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Cookie Settings</a></li>
                        </ul>
                    </div>
                    <div className="link-group">
                        <h4>Support</h4>
                        <ul>
                            <li><a href="#">Help Center</a></li>
                            <li><a href="#">Safety Information</a></li>
                            <li><a href="#">Cancellation Options</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 Duchess and Duke Housing. All rights reserved. An Aïny Ourzik Production.</p>
                </div>
            </div>
        </footer>
    )
}