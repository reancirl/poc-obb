"use client";

import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NextArrow = ({ style, onClick }: any) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768); // breakpoint for mobile
    handleResize(); // check on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        ...style,
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        right: isMobile ? "-22px" : "-40px", // adjust for mobile
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 20,
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <img src="icons/right.svg" alt="Next" className="w-7 h-7" />
    </div>
  );
};

const PrevArrow = ({ style, onClick }: any) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        ...style,
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        left: isMobile ? "-22px" : "-40px", // adjust for mobile
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 20,
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <img src="icons/left.svg" alt="Previous" className="w-7 h-7" />
    </div>
  );
};



const RecentBusinessesSold = () => {
  const listings = [
    {
      title: "Car Rental HREUS",
      desc: "Connect with verified business brokers who can help you buy or sell your business.",
      img: "/images/Mask group.png",
    },
    {
      title: "Restaurant Chain Sold",
      desc: "A successful multi-location restaurant chain has been acquired.",
      img: "/images/Mask group 2.png",
    },
    {
      title: "Tech Startup Acquired",
      desc: "A growing SaaS company was recently sold to a global firm.",
      img: "/images/Mask group 3.png",
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3500,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <section className="w-full py-16 bg-white px-4 sm:px-6 md:px-16">
      {/* Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 max-w-7xl mx-auto">
        <div className="md:w-1/3">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-semibold text-[#102A5C] mb-4">
            Recent Businesses Sold
          </h2>
          <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed">
            Lorem Ipsum Lorem Lorem Ipsum Lorem Lorem Ipsum Lorem Lorem Ipsum Lorem.
          </p>
          <button className="bg-[#102A5C] text-white px-6 py-3 rounded-md font-medium hover:bg-[#16397a] transition">
            See More Brokers
          </button>
        </div>

        <div className="w-full md:w-2/5">
          <Slider {...settings}>
            {listings.map((item, index) => (
              <div key={index} className="px-2 sm:px-4">
                <div className="bg-white border rounded-xl shadow-sm overflow-hidden flex flex-col">
                  {/* Image */}
                  <div className="px-4 sm:px-6 pt-4">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-48 sm:h-52 md:h-48 lg:h-52 object-cover rounded-xl"
                    />
                  </div>

                  {/* Description */}
                  <div className="px-4 py-4 sm:px-6 pb-6 flex flex-col">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-xs sm:text-sm">{item.desc}</p>
                    <button className="border border-[#102A5C] text-[#102A5C] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm hover:bg-[#102A5C] hover:text-white transition">
                      Know More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default RecentBusinessesSold;
