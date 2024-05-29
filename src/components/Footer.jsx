
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import {BsInstagram, BsLinkedin, BsGithub} from "react-icons/bs";
export const FooterComponent = () => {
  return (
    <Footer className="h-12 flex justify-center p-4 rounded-none text-black dark:text-white relative bottom-0 shadow-xl ">
      <Link
        className="hover:underline hidden md:block "
        target="_blank"
        to="https://gasteac.com"
      >
        Gasteac
      </Link>
      <Footer.LinkGroup>
        <Footer.Link
          className="text-black dark:text-white"
          target="_blank"
          href="https://github.com/gasteac"
        >
          <Footer.Icon icon={BsGithub} />
        </Footer.Link>

        <Footer.Link
          className="text-black dark:text-white"
          target="_blank"
          href="https://www.linkedin.com/in/gasteac/"
        >
          <Footer.Icon icon={BsLinkedin} />
        </Footer.Link>

        <Footer.Link
          className="text-black dark:text-white"
          target="_blank"
          href="https://www.instagram.com/gasteac/"
        >
          <Footer.Icon icon={BsInstagram} />
        </Footer.Link>
        <Footer.Link
          className="text-black dark:text-white"
          target="_blank"
          href="https://gasteac.com"
        >
          Portfolio
        </Footer.Link>
      </Footer.LinkGroup>
    </Footer>
  );
};
