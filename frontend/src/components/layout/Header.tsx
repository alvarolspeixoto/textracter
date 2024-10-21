import Image from 'next/image';
import Link from 'next/link';
import logo from '../../../public/logo.png'
const Header = () => {
  return (
    <header className="bg-[#000] fixed top-0 left-0 right-0 z-50 text-white py-4">
      <div className="mx-auto flex flex-col justify-between items-center">
        <Link href="/">
          <p className='text-2xl font-bold'>Textracter</p>
        </Link>
        <Image src={logo} alt="Logo" width={80}/>
      </div>
    </header>
  );
};

export default Header;
