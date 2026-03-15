export default function Footer() {
  return (
    <footer className="w-full bg-[#513838] py-16 text-center text-white">
      <div className="mx-auto flex w-full flex-col items-center gap-16">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-3 justify-items-center text-xs tracking-[0.15em]">
          <div className="space-y-3 text-center">
            <h3 className="text-[11px] font-semibold tracking-[0.18em]">
              ADDRESS
            </h3>
            <p className="text-[11px] leading-relaxed tracking-[0.08em] text-white/90">
              Seongdong-gu, Seoul, Korea
            </p>
          </div>

          <div className="space-y-3 text-center">
            <h3 className="text-[11px] font-semibold tracking-[0.18em]">
              SHOWROOM
            </h3>
            <p className="text-[11px] leading-relaxed tracking-[0.08em] text-white/90">
              Furniture Archive Seongsu
              <br />
              Seongdong-gu, Seoul, Korea
              <br />( Open Wed-Sun, 12:00-19:00 )
            </p>
          </div>

          <div className="space-y-2 text-center">
            <h3 className="text-[11px] font-semibold tracking-[0.18em]">
              CONTACT
            </h3>
            <p className="text-[11px] leading-relaxed tracking-[0.08em] text-white/90">
              e-mail. 0000@gmail.com
              <br />
              Tel. 000 0000 0000
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-[24px] font-semibold tracking-[0.3em]">
            ATELIER RELIC
          </div>

          <div className="space-y-1 text-[10px] leading-relaxed tracking-[0.12em] text-white/80">
            <p>Stay connected with Furniture Archive.</p>
            <p>
              Be the first to discover newly-collected furniture and upcoming
              showroom updates.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
