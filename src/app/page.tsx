import Image from "next/image";

export default function Home() {
  return (
    <main className="relative w-full">
      <div className="relative h-screen w-full">
        <Image
          src="/home.png"
          alt="ATELIER RELIC home"
          fill
          priority
          className="object-cover brightness-[0.6]"
        />

        <div className="pointer-events-none hero-overlay">
          <Image
            src="/home_title.png"
            width={1200}
            height={1200}
            alt="ATELIER RELIC home title"
            className="hero-title"
          />

          <p className="hero-subtitle">
            More than furniture, a collected history.
            <br />
            Objects shaped by use and memory,
            <br />
            chosen for their enduring presence.
          </p>

          <button className="pointer-events-auto hero-button">SHOP</button>
        </div>
      </div>
    </main>
  );
}
