import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer id="footer" className="bg-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            &copy; 2024 Mi Portfolio. Todos los derechos reservados.
          </p>
          <div className="flex-1">
      
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
