import { Mail, Instagram } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function SocialIcons() {
  return (
    <div className="flex items-center gap-6 max-sm:justify-center">
      {/* WhatsApp */}
      <div className="relative">
        <a
          href="https://wa.me/19372706688"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md cursor-pointer"
        >
          <FaWhatsapp className="text-black w-5 h-5" />
        </a>
      </div>

      {/* Instagram */}
      <a
        href="https://www.instagram.com/bahamaslrb/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram Profile"
      >
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md cursor-pointer">
          <Instagram className="text-black w-[18px] h-[18px]" />
        </div>
      </a>

      {/* Email */}
      <a
        href="https://mail.google.com/mail/?view=cm&fs=1&to=Infos@bahamaslrb.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Send email via Gmail"
      >
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md cursor-pointer">
          <Mail className="text-black w-5 h-5" />
        </div>
      </a>
    </div>
  );
}
