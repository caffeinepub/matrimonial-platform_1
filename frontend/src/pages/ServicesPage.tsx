import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, CheckCircle, Star } from 'lucide-react';

const services = [
  {
    icon: '📱',
    title: 'View Candidate Phone Number',
    price: '₹250',
    desc: 'Get direct access to the candidate\'s verified phone number for personal communication.',
    features: ['Verified phone number', 'One-time payment', 'Instant access after payment'],
    badge: 'Most Popular',
  },
  {
    icon: '🏠',
    title: 'Home Visit Arrangement',
    price: '₹550',
    desc: 'Mediator arranges and facilitates a formal home visit between families.',
    features: ['Mediator coordination', 'Family introduction', 'Professional guidance'],
    badge: null,
  },
  {
    icon: '💍',
    title: 'Rishta Finalization',
    price: '₹1,000',
    desc: 'Complete assistance in finalizing the marriage proposal with both families.',
    features: ['Proposal coordination', 'Family mediation', 'Documentation support'],
    badge: null,
  },
  {
    icon: '💎',
    title: 'After Ring Ceremony',
    price: '₹15,000',
    desc: 'Comprehensive support and coordination after the ring ceremony.',
    features: ['Post-engagement support', 'Wedding planning guidance', 'Ongoing mediation'],
    badge: 'Premium',
  },
  {
    icon: '👰',
    title: 'After Marriage Completion',
    price: '₹15,000',
    desc: 'Full service package for successful marriage completion and settlement.',
    features: ['Marriage completion support', 'Legal documentation help', 'Post-marriage guidance'],
    badge: 'Premium',
  },
];

const policies = [
  'All payments are strictly non-refundable',
  'Phone numbers are revealed only after payment verification',
  'Admin/Mediator cannot read private chat messages',
  'All chats are encrypted for your privacy',
  'Profiles are verified before approval',
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge className="mb-4 bg-saffron-100 text-saffron-700 border-saffron-300 font-body">
            Smart Match Services
          </Badge>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Services & Charges
          </h1>
          <p className="font-body text-muted-foreground max-w-xl mx-auto">
            Transparent pricing for all our matrimonial services. All payments are secure and non-refundable.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service) => (
            <Card key={service.title} className="card-matrimonial hover:shadow-gold transition-all duration-300 relative overflow-hidden">
              {service.badge && (
                <div className="absolute top-4 right-4">
                  <Badge className={service.badge === 'Most Popular' ? 'bg-saffron-500 text-white' : 'bg-gold-500 text-white'}>
                    {service.badge === 'Most Popular' ? <Star className="w-3 h-3 mr-1" /> : null}
                    {service.badge}
                  </Badge>
                </div>
              )}
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="font-serif text-lg font-bold text-foreground mb-2 pr-16">{service.title}</h3>
                <div className="font-serif text-3xl font-bold text-saffron-600 mb-3">{service.price}</div>
                <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed">{service.desc}</p>
                <ul className="space-y-2">
                  {service.features.map(f => (
                    <li key={f} className="flex items-center gap-2 font-body text-xs text-foreground">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center mb-12">
          <img src="/assets/generated/divider-ornament.dim_800x60.png" alt="" className="w-full max-w-xl h-10 object-contain opacity-60" />
        </div>

        {/* Mediator Contact */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="card-matrimonial border-gold-400 shadow-gold">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-saffron-100 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-saffron-600" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Contact Our Mediator</h2>
              <p className="font-body text-muted-foreground mb-6">
                For any queries, assistance, or to discuss services, contact our trusted mediator directly.
              </p>
              <div className="font-serif text-3xl font-bold text-saffron-600 mb-6">6370081492</div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="tel:6370081492">
                  <Button className="bg-saffron-500 hover:bg-saffron-600 text-white font-body gap-2 px-8">
                    <Phone className="w-4 h-4" />
                    Call Now
                  </Button>
                </a>
                <a href="https://wa.me/916370081492" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50 font-body gap-2 px-8">
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </Button>
                </a>
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <p className="font-body text-xs text-muted-foreground mb-2">UPI Payment IDs:</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <code className="font-sans text-sm bg-secondary px-3 py-1 rounded">8456916064@ybl</code>
                  <code className="font-sans text-sm bg-secondary px-3 py-1 rounded">6370081492@ybl</code>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Policies */}
        <div className="max-w-2xl mx-auto">
          <h3 className="font-serif text-xl font-bold text-foreground mb-4 text-center">Important Policies</h3>
          <div className="space-y-3">
            {policies.map((policy, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-saffron-500 flex-shrink-0 mt-0.5" />
                <p className="font-body text-sm text-foreground">{policy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
