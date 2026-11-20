import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => (
  <footer className="bg-stone-900 text-stone-300 mt-20 border-t border-stone-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <h3 className="font-display text-2xl font-bold text-amber-200">NRITYA</h3>
          <p className="text-sm text-amber-400/90 mt-1">Preserving Tradition. Connecting Generations.</p>
          <p className="text-sm text-stone-400 mt-3 max-w-md leading-relaxed">
            An educational digital archive, structured knowledge repository, and community directory dedicated to the classical dance heritage of Kathak.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">Knowledge Archive</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/history" className="hover:text-amber-300">Kathak History</Link></li>
            <li><Link to="/gharanas" className="hover:text-amber-300">Gharanas</Link></li>
            <li><Link to="/taal-terminology" className="hover:text-amber-300">Taal & Glossary</Link></li>
            <li><Link to="/compositions" className="hover:text-amber-300">Compositions</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">Community & Practice</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/artists" className="hover:text-amber-300">Artists & Gurus</Link></li>
            <li><Link to="/events" className="hover:text-amber-300">Events & Workshops</Link></li>
            <li><Link to="/community" className="hover:text-amber-300">Community Directory</Link></li>
            <li><Link to="/contribute" className="hover:text-amber-300">Submit Contribution</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 gap-2">
        <span>© {new Date().getFullYear()} NRITYA — Digital Kathak Archive & Community Platform.</span>
        <span>Built for students, educators, researchers, and classical arts enthusiasts.</span>
      </div>
    </div>
  </footer>
);

export default Footer;
