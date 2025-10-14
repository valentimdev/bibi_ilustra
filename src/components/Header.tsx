'use client';

import { useState } from 'react';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// import Katty from '@/public/bianca_katty_logo.svg'
function Header() {
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
      <nav className="w-full mx-auto flex flex-row items-center justify-between p-2 h-24 px-8">
        <div className="flex flex-col  w-30 justify-center items-center">
          <Link href="/about">
            <p>ABOUT</p>
          </Link>

          <Link href="/">
            <p>WORK</p>
          </Link>

          <Link href="/">
            <p>CONTACT</p>
          </Link>
        </div>

        <div>
          <Link
            href="/"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={logoSrc}
              alt="Logo"
              width={300}
              height={50}
              unoptimized={true}
            />
          </Link>
        </div>

        <div>
          <ul className="flex flex-row gap-2">
            <li>
              <a
                href="https://www.behance.net/biannca_mo7ac9"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/icons/behance.svg"
                  alt="Behance"
                  width={40}
                  height={50}
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
