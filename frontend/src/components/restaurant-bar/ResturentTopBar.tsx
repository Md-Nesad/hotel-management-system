import { FaPhoneAlt } from "react-icons/fa";
import LanguageSelector from "../LanguageSelector";
import { usePageData } from "../../context/PageDataContext";

const ResturentTopBar = () => {
  const { pageData } = usePageData();
  return (
    <div className="bg-[#FEF3EA] shadow-md text-[#000000] text-sm sm:fixed sm:top-15 left-0 w-full z-50 max-sm:mt-16">
      <div className="max-w-[1090px] mx-auto flex flex-col sm:flex-row justify-between items-center px-4 py-2 gap-2 sm:gap-0">
        {/* Left Side - Location Info */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <svg
            width="10"
            height="12"
            viewBox="0 0 16 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.2993 1.95202C10.4187 1.01565 9.24667 0.5 8 0.5C6.75334 0.5 5.58134 1.01565 4.7 1.95202C2.88067 3.88498 2.88067 7.03056 4.70534 8.96919L6.36867 10.6975C6.81867 11.1649 7.40933 11.3987 8 11.3987C8.59067 11.3987 9.18133 11.1649 9.63133 10.6975L11.2993 8.96352C12.1807 8.02714 12.6667 6.78195 12.6667 5.45742C12.6667 4.13289 12.1807 2.88911 11.2993 1.95202ZM8 7.57595C6.89534 7.57595 6 6.6247 6 5.45104C6 4.27738 6.89534 3.32613 8 3.32613C9.10467 3.32613 10 4.27738 10 5.45104C10 6.6247 9.10467 7.57595 8 7.57595ZM16 12.3726C16.0013 12.6233 15.878 12.8557 15.6767 12.9839L9.10267 17.1749C8.76267 17.3916 8.38133 17.5 8.00067 17.5C7.62 17.5 7.238 17.3916 6.89867 17.1749L0.323344 12.9839C0.121344 12.8549 -0.00132257 12.6226 1.07596e-05 12.3726C0.00134409 12.1226 0.126677 11.8917 0.33001 11.7656L3.56667 9.75257C3.63334 9.83049 3.70201 9.90769 3.77267 9.98277L5.436 11.7103C6.12134 12.4229 7.03267 12.816 8 12.816C8.96733 12.816 9.878 12.4229 10.564 11.7103L12.2427 9.96577C12.308 9.89636 12.372 9.82482 12.434 9.75257L15.67 11.7649C15.8733 11.8917 15.9987 12.1233 16 12.3726Z"
              fill="black"
              fillOpacity="0.5"
            />
          </svg>
          <span className="max-sm:text-[13px] text-[#5f5b5b] font-semibold py-1">
            {pageData?.location ||
              "We're located in Nyanirambo near green corn at kn192 st, house #3"}
          </span>
        </div>

        {/* Right Side - Contact & Language */}
        <div className="flex items-center gap-4 max-sm:flex-col max-sm:text-[10px]">
          <div className="flex items-center gap-1">
            <FaPhoneAlt className="text-gray-500" />
            <span className="font-bold text-[#5f5b5b]">
              {pageData?.phoneNumber || "+250 788 948 148"}
            </span>
          </div>

          <div className="flex items-center gap-2 cursor-pointer z-48">
            <LanguageSelector />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResturentTopBar;
