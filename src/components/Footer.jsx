
import { Link } from "react-router-dom";
import { BsInstagram, BsLinkedin, BsGithub } from "react-icons/bs";
export const FooterComponent = () => {
  return (
    <footer className="flex bg-base-200 justify-between p-4  text-neutral-content">
      <Link
        className="font-bold"
        target="_blank"
        to="https://gasteac.com"
      >
        GASTEAC
      </Link>
      <nav className="flex gap-4 md:justify-self-end">
        <Link
          className="text-black dark:text-white"
          target="_blank"
          href="https://github.com/gasteac"
        >
          <BsGithub size={20} />
        </Link>

        <Link
          className="text-black dark:text-white"
          target="_blank"
          href="https://www.linkedin.com/in/gasteac/"
        >
          <BsLinkedin size={20} />
        </Link>

        <Link
          className="text-black dark:text-white"
          target="_blank"
          href="https://www.instagram.com/gasteac/"
        >
          <BsInstagram size={20}/>
        </Link>
      </nav>
    </footer>
  );
};
