import { useEffect, useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import SocialIcons from "./SocailIcons";
import { useNavigate, Link } from "react-router-dom";

interface Contact {
  _id: string;
  location: string;
  phoneNumber1: string;
  phoneNumber2: string;
  phoneNumber3: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [latestContact, setLatestContact] = useState<Contact | null>(null);
  const [latestImage, setLatestImage] = useState<any | null>(null);

  useEffect(() => {
    fetch("https://backend.bahamaslrb.com/api/contact/all")
      .then((res) => res.json())
      .then((data) => {
        if (data?.data?.length) {
          // Sort by updatedAt (newest first)
          const sorted = [...data.data].sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          setLatestContact(sorted[0]); // latest
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const handleImage = async () => {
      try {
        const res = await fetch("https://backend.bahamaslrb.com/branding");
        const data = await res.json();
        setLatestImage(data[0]);
      } catch (error) {
        console.log(error);
      }
    };
    handleImage();
  }, []);

  const handleRedirect = (section: string) => {
    navigate(`/#${section}`);
  };

  return (
    <footer className="w-full bg-[#000000] text-white py-10 text-sm shadow-md border-t border-[var(--color-gold)]/20 relative z-10">
      <div className="max-w-[1050px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-10 border-b border-gray-700">
          {/* Logo & About */}
          <div className="text-center lg:text-left">
            <a
              href="/"
              className="inline-block mb-4 transition-transform duration-300 hover:scale-105"
            >
              <img
                src={`https://backend.bahamaslrb.com/uploads/${latestImage?.logo}`}
                alt="Bahamas Sunshine Lodge Logo"
                className="h-14 w-auto mx-auto lg:mx-0 rounded"
              />
            </a>
            <p className="text-gray-300 leading-relaxed mb-6 max-w-xs mx-auto lg:mx-0">
              {latestImage?.text}
            </p>
            <SocialIcons />
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left sm:ml-20 sm:mt-3">
            <h3 className="text-white font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <button
                  onClick={() => handleRedirect("home")}
                  className="hover:text-white"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRedirect("rooms")}
                  className="hover:text-white"
                >
                  Rooms List
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRedirect("amenities")}
                  className="hover:text-white"
                >
                  Amenities
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRedirect("events")}
                  className="hover:text-white"
                >
                  Events and News
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center sm:text-left sm:ml-6 sm:mt-3">
            <h3 className="text-white font-bold mb-6">Contact</h3>
            {latestContact ? (
              <div className="space-y-4 text-gray-300 text-sm">
                <div className="flex items-start gap-2 justify-center sm:justify-start hover:text-white">
                  <MapPin className="w-5 h-5 mt-1 text-white" />
                  <span>{latestContact.location}</span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start hover:text-white">
                  <Phone className="w-4 h-4 text-white" />
                  <span>{latestContact.phoneNumber1}</span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start hover:text-white">
                  <Phone className="w-4 h-4 text-white" />
                  <span>
                    {latestContact.phoneNumber2}
                    <small className="text-xs">(For English and French)</small>
                  </span>
                </div>

                <div className="flex items-center gap-2 justify-center sm:justify-start hover:text-white">
                  <Mail className="w-4 h-4 text-white" />
                  <span className="underline">{latestContact.email}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-400">Loading contact info...</p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-300 gap-4 sm:gap-0">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} BahamasLRB. All Rights Reserved
          </p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/cookies-policy" className="hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
