'use client';

import { clsx } from 'clsx';
import { useState } from 'react';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import Katty from '@/public/bianca_katty_logo.svg'
function Header() {
  const svgBehanceOff = '/icons/behance_hover.svg';
  const svgBehanceOn = '/icons/behance.svg';

  const [isHovered, setIsHovered] = useState(false);

  const [logoSrc, setLogoSrc] = useState('/logos/bianca_katty_logo.svg');
  const handleMouseEnter = () => {
    setLogoSrc('/logos/bianca_katty_logo_gif.gif');
  };
  const handleMouseLeave = () => {
    setLogoSrc('/logos/bianca_katty_logo.svg');
  };
  return (
    <header
      className="w-full"
      style={{
        backgroundImage: `url('/textures/textura_header.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <nav className="max-w-8xl mx-10 grid grid-cols-3 items-center h-30 px-4 sm:px-6 lg:px-8">
        {/* Coluna 1: Links de navegação */}
        <div className="hidden md:flex flex-row justify-start items-center gap-3">
          <Link href="/about">
            <p className="font-extrabold hover:text-[var(--accent)] transition-all duration-400 ease-in-out">
              ABOUT
            </p>
          </Link>

          <Link href="/">
            <p className="font-extrabold hover:text-[var(--accent)] transition-all duration-400 ease-in-out">
              WORK
            </p>
          </Link>

          <Link href="/">
            <p className="font-extrabold hover:text-[var(--accent)] transition-all duration-400 ease-in-out">
              CONTACT
            </p>
          </Link>
        </div>

        {/* Coluna 2: Logo centralizada */}
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
            />
          </Link>
        </div>

        {/* Coluna 3: Ícones sociais */}
        <div className="hidden md:flex justify-end">
          <ul className="flex flex-row gap-2">
            <li>
              <a
                href="https://www.behance.net/biannca_mo7ac9"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Image
                  src={!isHovered ? svgBehanceOn : svgBehanceOff}
                  alt="Behance"
                  width={40}
                  height={50}
                  className={clsx(
                    'cursor-pointer transition-transform duration-400 ease-out',
                    {
                      '-translate-y-1': isHovered,
                    }
                  )}
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
                  src="/icons/ig.svg"
                  alt="Instagram"
                  width={40}
                  height={50}
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
                  src="/icons/linkedin.svg"
                  alt="LinkedIn"
                  width={40}
                  height={50}
                  className="cursor-pointer"
                />
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
