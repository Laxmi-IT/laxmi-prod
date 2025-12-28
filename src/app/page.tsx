import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { LuxuryGallery } from "@/components/luxury-gallery";

// Sunburst Logo Component - Half circle with rays above center point
function SunburstLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Rays emanating upward in half-circle pattern */}
      {Array.from({ length: 9 }).map((_, i) => {
        const angle = -180 + (i * 180) / 8; // Spread rays from -180 to 0 (upper half)
        const rad = (angle * Math.PI) / 180;
        const x1 = 20 + Math.cos(rad) * 4;
        const y1 = 22 + Math.sin(rad) * 4;
        const x2 = 20 + Math.cos(rad) * 12;
        const y2 = 22 + Math.sin(rad) * 12;
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity={0.85}
          />
        );
      })}
      {/* Small center dot at base */}
      <circle cx="20" cy="22" r="1.5" fill="currentColor" />
    </svg>
  );
}

// Decorative Line with Arrow
function DecorativeLine({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <line x1="0" y1="5" x2="110" y2="5" stroke="currentColor" strokeWidth="1" />
      <path d="M110 5L105 2.5V7.5L110 5Z" fill="currentColor" />
    </svg>
  );
}

// Organic S-Curve Shape Component for Hero Image
function OrganicImageMask() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 600 800"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* S-Curve clip path matching the reference design */}
        <clipPath id="organic-curve" clipPathUnits="objectBoundingBox">
          <path d="M0,0
                   L0.65,0
                   C0.85,0 0.95,0.15 0.9,0.3
                   C0.85,0.45 0.75,0.5 0.7,0.55
                   C0.65,0.6 0.75,0.7 0.8,0.8
                   C0.85,0.9 0.7,1 0.55,1
                   L0,1 Z" />
        </clipPath>
      </defs>

      {/* Gold accent line following the S-curve */}
      <path
        d="M390,0
           C510,0 570,120 540,240
           C510,360 450,400 420,440
           C390,480 450,560 480,640
           C510,720 420,800 330,800"
        fill="none"
        stroke="#B8956E"
        strokeWidth="1.5"
        opacity="0.6"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-center group">
            <SunburstLogo className="w-10 h-6 text-laxmi-bronze transition-transform duration-500 group-hover:scale-110" />
            <span className="text-xl tracking-[0.3em] font-serif font-light mt-1">
              LAXMI
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/consulting" className="nav-link">Consulting</Link>
            <Link href="/collections" className="nav-link">Collections</Link>
            <Link href="/about" className="nav-link">About</Link>
            <Link href="/contact" className="nav-link">Contact</Link>
          </div>

          {/* Theme Toggle */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Single S-Curve Image Layout - matching reference design exactly */}
        <div className="absolute left-0 top-[80px] w-[52%] h-[calc(100vh-80px)]">
          {/* SVG Definition for S-curve clip path */}
          <svg className="absolute" width="0" height="0">
            <defs>
              <clipPath id="hero-s-curve" clipPathUnits="objectBoundingBox">
                {/* Softer S-curve: gentle flowing curves that don't cut too much */}
                <path d="
                  M0,0
                  L0.75,0
                  C0.88,0 0.92,0.1 0.88,0.22
                  C0.84,0.34 0.78,0.42 0.72,0.5
                  C0.66,0.58 0.7,0.68 0.78,0.78
                  C0.86,0.88 0.82,1 0.7,1
                  L0,1
                  Z
                " />
              </clipPath>
            </defs>
          </svg>

          {/* Main Hero Image with S-curve clip */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: "url(#hero-s-curve)" }}
          >
            <Image
              src="/images/hero-italian.jpg"
              alt="Luxury Italian living room with sage green velvet sofas and arched windows"
              fill
              className="object-cover"
              style={{ objectPosition: "center center" }}
              priority
              sizes="52vw"
            />
            {/* Subtle overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-transparent" />
          </div>

          {/* Gold S-Curve Accent Line - softer curve matching clip path */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 520 1000"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M390,0
                 C458,0 478,100 458,220
                 C438,340 406,420 374,500
                 C342,580 364,680 406,780
                 C448,880 426,1000 364,1000"
              fill="none"
              stroke="#B8956E"
              strokeWidth="1.5"
              opacity="0.6"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left side - spacer for organic shape */}
            <div className="hidden lg:block" />

            {/* Right side - Content */}
            <div className="flex flex-col items-start lg:items-start space-y-8 animate-fade-in-up">
              {/* Main heading with sunburst above the I */}
              <h1 className="font-serif font-light text-foreground tracking-[0.25em] flex items-end">
                <span>LAXM</span>
                <span className="flex flex-col items-center">
                  <SunburstLogo className="w-5 h-4 text-laxmi-gold mb-0.5" />
                  <span>I</span>
                </span>
              </h1>

              {/* Tagline */}
              <div className="space-y-2">
                <p className="text-spaced text-laxmi-bronze">
                  Luxury Furniture Consulting
                </p>
                <p className="text-spaced text-muted-foreground">
                  & Boutique Reseller
                </p>
              </div>

              {/* Decorative line */}
              <DecorativeLine className="w-32 text-laxmi-gold opacity-60" />

              {/* Description */}
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed font-light">
                Crafted for connoisseurs. <span className="text-laxmi-bronze font-normal">Made in Italy.</span>
              </p>

              {/* CTA Button */}
              <Link
                href="/book"
                className="btn-luxury text-laxmi-bronze border-laxmi-bronze hover:bg-laxmi-bronze hover:text-laxmi-cream mt-4"
              >
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-12 right-12 hidden lg:block">
          <div className="w-px h-24 gold-line-vertical" />
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section header */}
          <div className="text-center mb-20 animate-fade-in-up">
            <p className="text-spaced text-laxmi-gold mb-4">Our Philosophy</p>
            <h2 className="font-serif font-light">
              Valori
            </h2>
            <div className="gold-line w-24 mx-auto mt-8" />
          </div>

          {/* Values grid */}
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Vision */}
            <div className="card-luxury text-center group animate-fade-in-up delay-100">
              <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-laxmi-champagne/50 flex items-center justify-center group-hover:bg-laxmi-gold/20 transition-colors duration-500">
                <svg className="w-6 h-6 text-laxmi-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl mb-4">Vision</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Portare nelle case delle persone bellezza, luce, personalità e lusso.
              </p>
            </div>

            {/* Mission */}
            <div className="card-luxury text-center group animate-fade-in-up delay-200">
              <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-laxmi-champagne/50 flex items-center justify-center group-hover:bg-laxmi-gold/20 transition-colors duration-500">
                <svg className="w-6 h-6 text-laxmi-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl mb-4">Mission</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Far sì che le persone si sentano sostenute e guidate nell&apos;arredare la propria casa.
              </p>
            </div>

            {/* Values */}
            <div className="card-luxury text-center group animate-fade-in-up delay-300">
              <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-laxmi-champagne/50 flex items-center justify-center group-hover:bg-laxmi-gold/20 transition-colors duration-500">
                <svg className="w-6 h-6 text-laxmi-bronze" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl mb-4">Values</h3>
              <p className="text-muted-foreground font-light leading-relaxed">
                Professionalità, qualità, autenticità, unicità e <span className="text-laxmi-bronze font-medium">Made in Italy</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-laxmi-cream/30 dark:bg-card/30 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-laxmi-champagne/20 blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 lg:px-12 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left - decorative frame with image */}
            <div className="relative animate-fade-in-up">
              <div className="aspect-[4/5] relative">
                {/* Outer decorative frame */}
                <div
                  className="absolute inset-0 border border-laxmi-gold/30"
                  style={{ borderRadius: "120px 120px 0 0" }}
                />
                {/* Inner content area with image */}
                <div
                  className="absolute inset-4 overflow-hidden"
                  style={{ borderRadius: "100px 100px 0 0" }}
                >
                  <Image
                    src="/images/services-interior.jpg"
                    alt="Elegant Italian interior design with arched doorways"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-laxmi-espresso/20 via-transparent to-transparent" />
                </div>
                {/* Corner decorations */}
                <div className="absolute -top-2 -left-2 w-4 h-4">
                  <div className="w-full h-px bg-laxmi-gold/50 absolute top-1/2" />
                  <div className="h-full w-px bg-laxmi-gold/50 absolute left-1/2" />
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4">
                  <div className="w-full h-px bg-laxmi-gold/50 absolute top-1/2" />
                  <div className="h-full w-px bg-laxmi-gold/50 absolute left-1/2" />
                </div>
              </div>
            </div>

            {/* Right - content */}
            <div className="space-y-8 animate-fade-in-up delay-200">
              <p className="text-spaced text-laxmi-gold">What We Offer</p>
              <h2 className="font-serif font-light">
                Servizi
              </h2>
              <div className="gold-line w-16" />

              <div className="space-y-6 pt-4">
                {/* Service item */}
                <div className="flex gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-laxmi-gold/30 flex items-center justify-center group-hover:bg-laxmi-gold/10 transition-colors duration-300">
                    <span className="text-sm text-laxmi-bronze">01</span>
                  </div>
                  <div>
                    <h4 className="font-serif text-xl mb-2">Furniture Consulting</h4>
                    <p className="text-muted-foreground font-light">
                      Personalized guidance to select the perfect pieces for your space.
                    </p>
                  </div>
                </div>

                {/* Service item */}
                <div className="flex gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-laxmi-gold/30 flex items-center justify-center group-hover:bg-laxmi-gold/10 transition-colors duration-300">
                    <span className="text-sm text-laxmi-bronze">02</span>
                  </div>
                  <div>
                    <h4 className="font-serif text-xl mb-2">Boutique Reselling</h4>
                    <p className="text-muted-foreground font-light">
                      Curated collection of authentic Italian luxury furniture.
                    </p>
                  </div>
                </div>

                {/* Service item */}
                <div className="flex gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-laxmi-gold/30 flex items-center justify-center group-hover:bg-laxmi-gold/10 transition-colors duration-300">
                    <span className="text-sm text-laxmi-bronze">03</span>
                  </div>
                  <div>
                    <h4 className="font-serif text-xl mb-2">Interior Styling</h4>
                    <p className="text-muted-foreground font-light">
                      Complete styling services to bring your vision to life.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-laxmi-bronze hover:text-laxmi-espresso transition-colors duration-300 mt-4"
              >
                <span className="text-spaced text-sm">Discover More</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6 lg:px-12">
          {/* Section header */}
          <div className="text-center mb-16 animate-fade-in-up">
            <p className="text-spaced text-laxmi-gold mb-4">Our Portfolio</p>
            <h2 className="font-serif font-light">
              Ispirazioni
            </h2>
            <p className="text-muted-foreground font-light mt-6 max-w-xl mx-auto">
              A curated collection of interior spaces that embody the essence of Italian luxury and timeless elegance.
            </p>
            <div className="gold-line w-24 mx-auto mt-8" />
          </div>

          {/* Gallery */}
          <LuxuryGallery />

          {/* View all link */}
          <div className="text-center mt-12">
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 text-laxmi-bronze hover:text-laxmi-espresso transition-colors duration-300"
            >
              <span className="text-spaced text-sm">View All Collections</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative bg-laxmi-cream/20 dark:bg-card/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-3xl mx-auto text-center animate-fade-in-up">
            <SunburstLogo className="w-20 h-12 text-laxmi-gold mx-auto mb-8" />
            <h2 className="font-serif font-light mb-6">
              Begin Your Journey
            </h2>
            <p className="text-lg text-muted-foreground font-light mb-10 max-w-xl mx-auto">
              Let us guide you in creating a space that reflects your unique taste and the timeless elegance of Italian craftsmanship.
            </p>
            <Link
              href="/contact"
              className="btn-luxury-filled"
            >
              Schedule a Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex flex-col items-start">
                <SunburstLogo className="w-12 h-8 text-laxmi-bronze mb-2" />
                <span className="text-lg tracking-[0.3em] font-serif font-light">LAXMI</span>
              </div>
              <p className="text-muted-foreground font-light mt-4 max-w-sm">
                Luxury Furniture Consulting & Boutique Reseller. Crafted for connoisseurs. Made in Italy.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-spaced text-xs mb-6 text-laxmi-bronze">Navigation</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-muted-foreground hover:text-foreground transition-colors font-light">Home</Link></li>
                <li><Link href="/consulting" className="text-muted-foreground hover:text-foreground transition-colors font-light">Consulting</Link></li>
                <li><Link href="/collections" className="text-muted-foreground hover:text-foreground transition-colors font-light">Collections</Link></li>
                <li><Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors font-light">About</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-spaced text-xs mb-6 text-laxmi-bronze">Contact</h4>
              <ul className="space-y-3 text-muted-foreground font-light">
                <li>info@laxmi.it</li>
                <li>+39 000 000 0000</li>
                <li>Milan, Italy</li>
              </ul>
            </div>
          </div>

          <div className="gold-line mt-12 mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground font-light">
              &copy; {new Date().getFullYear()} LAXMI. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground font-light italic">
              &ldquo;Goddess of wealth, fortune, prosperity, beauty and light&rdquo;
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
