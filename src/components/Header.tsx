'use client';

import { useState } from 'react';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const svgBehanceOff = '/icons/behance_hover.svg';
  const svgBehanceOn = '/icons/behance.svg';
  const svgIgOff = '/icons/ig_hover.svg';
  const svgIgOn = '/icons/ig.svg';
  const svgLinkedInOff = '/icons/linkedin_hover.svg';
  const svgLinkedInOn = '/icons/linkedin.svg';

  const [isBehanceHovered, setIsBehanceHovered] = useState(false);
  const [isIgHovered, setIsIgHovered] = useState(false);
  const [isLinkedInHovered, setIsLinkedInHovered] = useState(false);

  const [logoSrc, setLogoSrc] = useState('/logos/bianca_katty_logo.svg');
  
  const handleMouseEnter = () => {
    setLogoSrc('/logos/bianca_katty_logo_gif.gif');
  };
  
  const handleMouseLeave = () => {
    setLogoSrc('/logos/bianca_katty_logo.svg');
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className="w-full relative"
      style={{
        backgroundImage: `url('/textures/textura_header.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <nav className="max-w-8xl mx-10 grid grid-cols-[1fr_auto_1fr] items-center h-30 px-4 sm:px-6 lg:px-8">
        <div className="hidden md:flex flex-row justify-start items-center gap-3">
          <Link href="/">
            <p
              className={`font-extrabold transition-all duration-400 ease-in-out ${
                isActive('/')
                  ? 'text-[var(--accent)]'
                  : 'hover:text-[var(--accent)]'
              }`}
            >
              WORK
            </p>
          </Link>

          <Link href="/about">
            <p
              className={`font-extrabold transition-all duration-400 ease-in-out ${
                isActive('/about')
                  ? 'text-[var(--accent)]'
                  : 'hover:text-[var(--accent)]'
              }`}
            >
              ABOUT
            </p>
          </Link>

          <Link href="/contact">
            <p
              className={`font-extrabold transition-all duration-400 ease-in-out ${
                isActive('/contact')
                  ? 'text-[var(--accent)]'
                  : 'hover:text-[var(--accent)]'
              }`}
            >
              CONTACT
            </p>
          </Link>
        </div>

        <div className="flex md:hidden justify-start items-center">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none z-50 relative"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-full bg-white transition-all duration-300 ease-in-out ${
                  isMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              ></span>
              <span
                className={`block h-0.5 w-full bg-white transition-all duration-300 ease-in-out ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}
              ></span>
              <span
                className={`block h-0.5 w-full bg-white transition-all duration-300 ease-in-out ${
                  isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              ></span>
            </div>
          </button>
        </div>

        <div className="flex justify-center items-center">
          <Link
            href="/"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={logoSrc}
              alt="Logo"
              width={350}
              height={70}
              unoptimized={true}
              className=" w-60 md:w-[350px]  h-auto"
            />
          </Link>
        </div>

        <div className="hidden md:flex justify-end">
          <ul className="flex flex-row gap-2">
            <li>
              <a
                href="https://www.behance.net/biannca_mo7ac9"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setIsBehanceHovered(true)}
                onMouseLeave={() => setIsBehanceHovered(false)}
              >
                <Image
                  unoptimized
                  src={!isBehanceHovered ? svgBehanceOn : svgBehanceOff}
                  alt="Behance"
                  width={40}
                  height={50}
                  className="cursor-pointer transition-all duration-400 ease-in-out"
                />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/arttbit?igsh=aTJzN2J2YmJqc3V0&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setIsIgHovered(true)}
                onMouseLeave={() => setIsIgHovered(false)}
              >
                <Image
                  unoptimized
                  src={!isIgHovered ? svgIgOn : svgIgOff}
                  alt="Instagram"
                  width={40}
                  height={50}
                  className="cursor-pointer transition-all duration-400 ease-in-out"
                />
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/bianca-tavares-388876221?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setIsLinkedInHovered(true)}
                onMouseLeave={() => setIsLinkedInHovered(false)}
              >
                <Image
                  unoptimized
                  src={!isLinkedInHovered ? svgLinkedInOn : svgLinkedInOff}
                  alt="LinkedIn"
                  width={40}
                  height={50}
                  className="cursor-pointer transition-all duration-400 ease-in-out"
                />
              </a>
            </li>
          </ul>
        </div>

        {/* Espaço vazio na terceira coluna em mobile */}
        <div className="flex md:hidden"></div>
      </nav>

      {/* Menu Mobile (Overlay) */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
      ></div>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[var(--primary)] z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundImage: `url('/textures/textura_header.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex flex-col p-8 pt-20">
          <Link href="/" onClick={closeMenu}>
            <p
              className={`font-extrabold text-2xl mb-6 transition-all duration-300 ${
                isActive('/')
                  ? 'text-[var(--accent)]'
                  : 'text-white hover:text-[var(--accent)]'
              }`}
            >
              WORK
            </p>
          </Link>

          <Link href="/about" onClick={closeMenu}>
            <p
              className={`font-extrabold text-2xl mb-6 transition-all duration-300 ${
                isActive('/about')
                  ? 'text-[var(--accent)]'
                  : 'text-white hover:text-[var(--accent)]'
              }`}
            >
              ABOUT
            </p>
          </Link>

          <Link href="/contact" onClick={closeMenu}>
            <p
              className={`font-extrabold text-2xl mb-6 transition-all duration-300 ${
                isActive('/contact')
                  ? 'text-[var(--accent)]'
                  : 'text-white hover:text-[var(--accent)]'
              }`}
            >
              CONTACT
            </p>
          </Link>

          <div className="mt-8 pt-8 border-t border-white/30">
            <ul className="flex flex-row gap-4">
              <li>
                <a
                  href="https://www.behance.net/biannca_mo7ac9"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    unoptimized
                    src={svgBehanceOn}
                    alt="Behance"
                    width={35}
                    height={35}
                    className="cursor-pointer"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/arttbit?igsh=aTJzN2J2YmJqc3V0&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    unoptimized
                    src={svgIgOn}
                    alt="Instagram"
                    width={35}
                    height={35}
                    className="cursor-pointer"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/bianca-tavares-388876221?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    unoptimized
                    src={svgLinkedInOn}
                    alt="LinkedIn"
                    width={35}
                    height={35}
                    className="cursor-pointer"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;