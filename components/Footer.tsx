import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="py-20 border-t border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <Link href="/" className="text-3xl font-display font-bold tracking-tighter mb-8 block">
              ABIR<span className="text-zinc-500">.</span>
            </Link>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
              Crafting premium digital experiences through design-led engineering. Specializing in high-performance web applications and enterprise-grade security.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-zinc-400">Navigation</h4>
            <ul className="space-y-4">
              {['About', 'Services', 'Projects', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href={`#${item.toLowerCase()}`} className="text-sm font-medium hover:text-zinc-500 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-zinc-400">Social</h4>
            <ul className="space-y-4">
              {['LinkedIn', 'GitHub', 'Twitter', 'Dribbble'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm font-medium hover:text-zinc-500 transition-colors underline underline-offset-4">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-12 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">
            &copy; {new Date().getFullYear()} Abir Siddiky. All rights reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link href="/privacy" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
