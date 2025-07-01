
import React from 'react';

interface FooterProps {
  onNavigate: (destination: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-desert-dark text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">
              <span className="text-gold">Terhal</span>
            </h3>
            <p className="text-desert-light">
              Discover Saudi heritage
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2 text-desert-light">
              <li>
                <button 
                  onClick={() => onNavigate('tours')}
                  className="hover:text-white transition-colors text-left"
                  aria-label="Navigate to UNESCO tours"
                >
                  Tours
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-desert-light">
              <li>
                <button className="hover:text-white transition-colors text-left" aria-label="Help Center">
                  Help
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-desert-light">
              <li>
                <button className="hover:text-white transition-colors text-left" aria-label="Terms of Service">
                  Terms
                </button>
              </li>
              <li>
                <button className="hover:text-white transition-colors text-left" aria-label="Privacy Policy">
                  Privacy
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-desert mt-8 pt-8 text-center text-desert-light">
          <p>&copy; {currentYear} Terhal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
