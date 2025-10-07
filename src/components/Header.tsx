import React from 'react';
import Image from 'next/image';
// import Katty from '@/public/bianca_katty_logo.svg'
function Header() {
  return (
  <header

      className="w-full"
      style={{ backgroundColor: 'var(--primary)' }}
    >

      <nav className="container mx-auto flex flex-row items-center justify-between p-2 h-24">

        <div className="flex flex-col border border-black w-30">
          <p>sobre mim</p>
          <p>blablabla</p>
          <p>bibi</p>
        </div>


        <div>            
            <Image src="/logos/bianca_katty_logo.svg" alt="Logo" width={300} height={50} />
        </div>

        
        <div>

          <ul className='flex flex-row border '>
            <li className=''><Image src="/icons/behance.svg" alt="Behance" width={40} height={50}></Image></li>
            <li className=''><Image src="/icons/ig.svg" alt="Instagram" width={40} height={50}></Image></li>
            <li className=''><Image src="/icons/linkedin.svg" alt="WhatsApp" width={40} height={50}></Image></li>
          </ul>
        </div>
      </nav>
    </header>
  );
}

export default Header;
