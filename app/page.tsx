import Link from "next/link";
import StarfieldBackground from "./components/StarfieldBackground";

export default function Home() {
  const navigationLinks = [
    { name: "Embedded Systems", href: "/hardware" },
    { name: "Software Engineering", href: "/software" },
    { name: "Economic Data Analysis", href: "/data" },
    { name: "Mechanical Design", href: "/cad" },
    { name: "Questions and Concerns", href: "/contact" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden homepage-container">
      <StarfieldBackground />
      
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
        <h1 className="homepage-title mb-6 pb-2 text-center">
          OLIVER GRENON
        </h1>
        
        <nav className="navigation-box">
          {navigationLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="homepage-nav-link text-center block py-2"
            >
              {link.name}
            </Link>
          ))}
        </nav>
        
        <div className="description-box mt-10">
          <p>Electrical & computer engineering student at Oregon State University. Computer architect, web developer, automotive design & prototyping. Passion for driving, breaking, and fixing classic BMWs. </p>
        </div>
      </main>
    </div>
  );
}
