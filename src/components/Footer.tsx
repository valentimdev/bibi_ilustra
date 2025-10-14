import React from 'react';
import Image from 'next/image';

const socialLinks = [
  {
    name: 'Behance',
    url: 'https://www.behance.net/biannca_mo7ac9',
    icon: '/icons/behance.svg', 
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/bianca-tavares-388876221',
    icon: '/icons/linkedin.svg',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/arttbit',
    icon: '/icons/ig.svg',
  },
];

const Footer: React.FC = () => {
  return (
    <footer
      className="flex flex-col items-center justify-center w-full pt-px4 pb-2"

    >
      <div className="flex flex-row items-center gap-6 mb-2">
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:opacity-75 transition-opacity"
          >
            <Image
              src={link.icon}
              alt={link.name}
              width={40}
              height={40}
              className="filter brightness-0"
            />
          </a>
        ))}
      </div>

      <p className="text text-gray-800 ">
        Bianca Tavares © 
      </p>
    </footer>
  );
};

export default Footer;