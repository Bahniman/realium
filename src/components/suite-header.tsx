import { useEffect, useRef } from "react";
import { ThemeToggle } from "./theme-toggle";

type Section = { label: string; href: string };
const projects = ["Realium", "Heirloom", "Turnstile", "Windtunnel"];

export function SuiteHeader({ name, sections }: { name: string; sections: Section[] }) {
  const menu = useRef<HTMLDetailsElement>(null);
  const closeMenu = () => { if (menu.current) menu.current.open = false; };
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !menu.current?.contains(event.target)) closeMenu();
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, []);
  return <>
    <a className="suite-skip" href="#main">Skip to content</a>
    <header className="suite-header">
      <div className="suite-header-inner">
        <a className="suite-brand" href="#main"><span aria-hidden="true">b.</span>{name}</a>
        <nav className="suite-sections" aria-label="Page sections">
          {sections.map(section => <a key={section.href} href={section.href}>{section.label}</a>)}
        </nav>
        <div className="suite-actions">
          <a className="suite-portfolio" href="https://bahniman.github.io/">Portfolio</a>
          <details ref={menu} className="suite-menu" onBlur={event => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) closeMenu();
          }} onKeyDown={event => {
            if (event.key === "Escape") { closeMenu(); menu.current?.querySelector("summary")?.focus(); }
          }}>
            <summary aria-label="Explore projects and page sections">Explore <span aria-hidden="true">+</span></summary>
            <nav className="suite-menu-panel" aria-label="Explore projects">
              <div className="suite-mobile-sections">
                <p>On this page</p>
                {sections.map(section => <a key={section.href} href={section.href} onClick={closeMenu}>{section.label}</a>)}
              </div>
              <p>From the same notebook</p>
              {projects.map(project => <a key={project} href={`/${project.toLowerCase()}/`} aria-current={project === name ? "page" : undefined} onClick={closeMenu}>{project}<span aria-hidden="true">↗</span></a>)}
              <a href={`https://github.com/Bahniman/${name.toLowerCase()}`} target="_blank" rel="noreferrer" onClick={closeMenu}>View source<span aria-hidden="true">↗</span></a>
            </nav>
          </details>
          <ThemeToggle />
        </div>
      </div>
      <div className="suite-progress" aria-hidden="true" />
    </header>
  </>;
}
