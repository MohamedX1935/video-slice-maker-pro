
import React from 'react';

const Header = () => {
  return (
    <header className="py-6 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            <span className="text-brand-purple">Slice</span>
            <span className="text-brand-blue">Tube</span>
          </h1>
          <p className="text-gray-600 mt-2 text-center">Votre découpeur YouTube instantané</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
