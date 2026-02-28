import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Heart, Shield, Sparkles, Users, Lock, Star,
  CheckCircle, Phone, ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Privacy Protected',
    desc: 'Phone numbers always hidden. Revealed only after verified payment.',
  },
  {
    icon: Sparkles,
    title: 'AI Compatibility',
    desc: 'Smart matching based on 8 compatibility factors for better matches.',
  },
  {
    icon: Lock,
    title: 'Secure Chat',
    desc: 'Encrypted messaging with auto-lock if contact details are shared.',
  },
  {
    icon: Users,
    title: 'Verified Profiles',
    desc: 'All profiles reviewed and approved by our trusted mediator.',
  },
  {
    icon: Heart,
    title: 'Mutual Matching',
    desc: 'Chat unlocks only when both parties express interest.',
  },
  {
    icon: Star,
    title: 'Trusted Mediator',
    desc: 'Personal guidance from experienced matrimonial mediator.',
  },
];

const steps = [
  { num: '01', title: 'Register', desc: 'Create your profile with phone verification' },
  { num: '02', title: 'Complete Profile', desc: 'Add photos and detailed information' },
  { num: '03', title: 'Get AI Matches', desc: 'Receive compatibility-ranked suggestions' },
  { num: '04', title: 'Like & Match', desc: 'Express interest and find mutual matches' },
  { num: '05', title: 'Pay & Chat', desc: 'Unlock secure chat for ₹200 per user' },
  { num: '06', title: 'Find Life Partner', desc: 'Proceed with confidence and trust' },
];

const testimonials = [
  {
    name: 'Sunita & Rajesh',
    location: 'Delhi',
    text: 'Vivah Connect helped us find each other. The privacy features gave us confidence to connect safely.',
    rating: 5,
  },
  {
    name: 'Meera & Arjun',
    location: 'Mumbai',
    text: 'The AI matching was surprisingly accurate. We had 87% compatibility and it showed in our conversations!',
    rating: 5,
  },
  {
    name: 'Priya & Vikram',
    location: 'Bangalore',
    text: 'The mediator was very helpful throughout the process. Highly recommend this platform.',
    rating: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/assets/generated/hero-bg.dim_1400x700.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-background/80" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <Badge className="mb-6 bg-gold-500/20 text-gold-300 border-gold-400/50 font-body text-xs px-4 py-1.5">
            ✨ Trusted Matrimonial Platform
          </Badge>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Find Your
            <span className="text-gold-400"> Perfect </span>
            Life Partner
          </h1>
          <p className="font-body text-lg md:text-xl text-white/85 mb-10 max-w-2xl mx-auto leading-relaxed">
            Privacy-first, AI-powered matrimonial platform with verified profiles,
            secure chat, and trusted mediator support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-saffron-500 hover:bg-saffron-600 text-white px-8 py-6 text-base font-body shadow-saffron gap-2">
                <Heart className="w-5 h-5" />
                Register Free Today
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="border-gold-400 text-gold-300 hover:bg-gold-400/10 px-8 py-6 text-base font-body gap-2">
                View Services
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { num: '10,000+', label: 'Profiles' },
              { num: '2,500+', label: 'Matches Made' },
              { num: '98%', label: 'Privacy Score' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="font-serif text-2xl md:text-3xl font-bold text-gold-400">{stat.num}</div>
                <div className="font-body text-xs text-white/70 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ornamental Divider */}
      <div className="flex items-center justify-center py-2 bg-background">
        <img
          src="/assets/generated/divider-ornament.dim_800x60.png"
          alt=""
          className="w-full max-w-2xl h-12 object-contain opacity-70"
        />
      </div>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">
              Why Choose Vivah Connect?
            </h2>
            <p className="font-body text-muted-foreground max-w-xl mx-auto">
              Built with enterprise-level security and traditional values at heart.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="card-matrimonial hover:shadow-gold transition-shadow duration-300 group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-saffron-100 flex items-center justify-center mb-4 group-hover:bg-saffron-200 transition-colors">
                    <f.icon className="w-6 h-6 text-saffron-600" />
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="font-body text-muted-foreground">Your journey to finding the perfect match</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={step.num} className="relative flex gap-4 p-6 bg-card rounded-xl border border-border/60 hover:border-gold-400 transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-saffron-500 text-white flex items-center justify-center font-serif font-bold text-lg">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-serif text-base font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="font-body text-sm text-muted-foreground">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="w-5 h-5 text-gold-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">Success Stories</h2>
            <p className="font-body text-muted-foreground">Real couples who found love through Vivah Connect</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="card-matrimonial">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-gold-500 fill-gold-500" />
                    ))}
                  </div>
                  <p className="font-body text-sm text-muted-foreground italic mb-4 leading-relaxed">"{t.text}"</p>
                  <div>
                    <p className="font-serif font-semibold text-foreground">{t.name}</p>
                    <p className="font-body text-xs text-muted-foreground">{t.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 saffron-gradient">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
            Begin Your Journey Today
          </h2>
          <p className="font-body text-white/85 mb-8 max-w-lg mx-auto">
            Join thousands of verified profiles. Your perfect match is waiting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-saffron-600 hover:bg-ivory-dark px-8 font-body gap-2">
                <Heart className="w-5 h-5" />
                Register Now — Free
              </Button>
            </Link>
            <a href="tel:6370081492">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 font-body gap-2">
                <Phone className="w-5 h-5" />
                Call Mediator
              </Button>
            </a>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/80">
            {['Free Registration', 'Verified Profiles', 'Privacy Protected', 'AI Matching'].map(item => (
              <div key={item} className="flex items-center gap-2 font-body text-sm">
                <CheckCircle className="w-4 h-4 text-gold-300" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
