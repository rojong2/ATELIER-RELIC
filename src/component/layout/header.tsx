export default function Header() {
  return (
    <header className="absolute top-0 left-0 z-50 w-full text-white">
      <div className="flex h-[113px] items-center justify-between ml-20">
        <div className="flex items-center gap-10">
          <div className="text-[25px] font-semibold tracking-[-0.02em]">
            ATELIER RELIC
          </div>

          <nav>
            <ul className="flex items-center gap-8 text-[12px] tracking-[0.08em]">
              <li className="cursor-pointer hover:opacity-70">MAGAZINE</li>
              <li className="cursor-pointer hover:opacity-70">SHOP</li>
              <li className="cursor-pointer hover:opacity-70">ABOUT</li>
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-8 text-[13px] tracking-[0.08em]">
          <span className="cursor-pointer hover:opacity-70">BAG</span>
          <span className="cursor-pointer hover:opacity-70">MY</span>
          <span className="cursor-pointer hover:opacity-70">JOIN</span>
          <span className="cursor-pointer hover:opacity-70">LOGIN</span>
        </div>
      </div>

      <div className="h-px w-full bg-white/30" />
    </header>
  );
}
