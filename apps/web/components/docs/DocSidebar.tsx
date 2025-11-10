'use client';

import React, { useEffect, useState } from 'react';

interface Section {
  id: string;
  title: string;
  subsections?: { id: string; title: string }[];
}

interface DocSidebarProps {
  sections: Section[];
}

export function DocSidebar({ sections }: DocSidebarProps) {
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -66%',
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);

      section.subsections?.forEach((subsection) => {
        const subElement = document.getElementById(subsection.id);
        if (subElement) observer.observe(subElement);
      });
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.offsetTop - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <aside className="sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto w-64 flex-shrink-0">
      <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Table of Contents
        </h2>
        <nav>
          <ul className="space-y-1">
            {sections.map((section) => (
              <li key={section.id}>
                <button
                  onClick={() => scrollToSection(section.id)}
                  className={`w-full text-left text-sm py-2 px-3 rounded-lg transition-all ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white font-medium'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {section.title}
                </button>
                {section.subsections && section.subsections.length > 0 && (
                  <ul className="ml-4 mt-1 space-y-1 border-l border-white/10 pl-3">
                    {section.subsections.map((subsection) => (
                      <li key={subsection.id}>
                        <button
                          onClick={() => scrollToSection(subsection.id)}
                          className={`w-full text-left text-xs py-1.5 px-2 rounded-lg transition-all ${
                            activeSection === subsection.id
                              ? 'text-purple-400 font-medium'
                              : 'text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {subsection.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
