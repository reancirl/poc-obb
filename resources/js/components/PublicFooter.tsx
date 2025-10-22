import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

interface FooterLinkGroup {
  title: string;
  links: string[];
}

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
  color: string;
  hoverColor: string;
}

interface PublicFooterProps {
  linkGroups?: FooterLinkGroup[];
  socials?: SocialLink[];
  logoSrc?: string;
  copyrightText?: string;
}

const defaultLinks: FooterLinkGroup[] = [
  {
    title: "Search",
    links: ["Established Business", "Franchise for Sale", "Assets Sale", "Business Real Estate", "Find a Broker"],
  },
  {
    title: "Company",
    links: ["About Us", "Contact Us", "Terms of Use", "Privacy Notice", "Sitemap"],
  },
  {
    title: "Resources",
    links: ["Blog", "Guides", "Case Studies", "FAQs", "Support"],
  },
  {
    title: "Connect",
    links: ["Newsletter", "Events", "Partners", "Community", "Careers"],
  },
];

const defaultSocials: SocialLink[] = [
  {
    icon: <FaFacebookF />,
    href: "#",
    label: "Facebook",
    color: "#3b5998",
    hoverColor: "hover:text-blue-700",
  },
  {
    icon: <FaInstagram />,
    href: "#",
    label: "Instagram",
    color: "#E1306C",
    hoverColor: "hover:text-pink-500",
  },
  {
    icon: <FaLinkedinIn />,
    href: "#",
    label: "LinkedIn",
    color: "#0077B5",
    hoverColor: "hover:text-blue-600",
  },
];

const PublicFooter: React.FC<PublicFooterProps> = ({
  linkGroups = defaultLinks,
  socials = defaultSocials,
  logoSrc = "/images/logo_bg_removed.png",
  copyrightText = "© 2025 Monarch",
}) => {
  return (
    <footer className="bg-white border-t border-gray-200 py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-16 flex flex-col md:flex-row justify-between gap-10">
        {/* Logo & Socials */}
        <div className="flex flex-col items-center gap-4">
          <img src={logoSrc} alt="Logo" className="w-52" />
          <div className="flex gap-3 mt-2 justify-center">
            {socials.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                aria-label={social.label}
                className={`transition-transform duration-300 ease-in-out ${social.hoverColor} hover:scale-110 text-2xl `}
                style={{ color: social.color }}
              >
                {social.icon}
              </a>
            ))}
          </div>
          <p className="text-gray-500 mt-4">{copyrightText}</p>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full pl-10">
          {linkGroups.map((group, idx) => (
            <div key={idx}>
              <h4 className="text-[#102A5C] font-semibold mb-4">{group.title}</h4>
              <ul className="flex flex-col gap-2">
                {group.links.map((link, i) => (
                  <li
                    key={i}
                    className="text-gray-600 hover:text-gray-900 cursor-pointer text-sm transition-colors duration-300 hover:translate-x-1"
                  >
                    {link}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
