import { FC } from 'react';

const Footer: FC = () => {
  return (
    <footer id="footer" className="bg-gray-800 py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-2 md:mb-0">
            &copy; Cosas sueltas <span className="text-xs"> by Adolfo</span>
          </p>
          <div className="flex-1">
      
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
