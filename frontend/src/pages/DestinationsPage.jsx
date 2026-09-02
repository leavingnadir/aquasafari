import { DESTINATIONS } from "../data/homeContent";
import { MapPin, Compass } from "lucide-react";

export default function DestinationsPage() {
  // Convert the DESTINATIONS object from homecontent.js into an array for mapping
  const destinationsList = Object.entries(DESTINATIONS).map(([name, details]) => ({
    name,
    location: `${name}, Sri Lanka`,
    tagline: details.tagline,
    description: details.copy,
    imageUrl: details.img,
    spots: details.spots,
  }));

  return (
    <div className="min-h-screen bg-surface-955 text-content-primary pt-28 pb-16 px-4 font-body">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-400 mb-4 border border-brand-500/20">
            <Compass size={14} />
            Explore Locations
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Our Safari Destinations
          </h1>
          <p className="text-content-secondary text-base">
            Discover the most breathtaking waterways, coastal sanctuaries, and marine habitats available for your next AquaSafari experience.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {destinationsList.map((dest) => (
            <div 
              key={dest.name} 
              className="group flex flex-col overflow-hidden rounded-[2rem] bg-surface-900 border border-surface-800 shadow-xl transition-all duration-300 hover:border-brand-500/40 hover:shadow-2xl"
            >
              {/* Image Section */}
              <div className="relative h-64 w-full overflow-hidden">
                <img 
                  src={dest.imageUrl} 
                  alt={dest.name} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/40 to-transparent" />
                
                {/* Location Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-surface-950/80 backdrop-blur-md px-3 py-1 text-xs font-medium text-content-primary border border-surface-800">
                  <MapPin size={12} className="text-brand-400" />
                  {dest.location}
                </div>
              </div>

              {/* Content Section */}
              <div className="flex grow flex-col p-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-400 mb-1">
                  {dest.tagline}
                </span>
                <h3 className="font-display text-2xl font-semibold mb-2 tracking-tight">
                  {dest.name}
                </h3>
                <p className="text-sm text-content-secondary leading-relaxed mb-4 line-clamp-3">
                  {dest.description}
                </p>

                {/* Key Spots Tags */}
                <div className="mb-6 flex flex-wrap gap-1.5">
                  {dest.spots.map((spot, idx) => (
                    <span key={idx} className="rounded-full bg-surface-800 px-2.5 py-1 text-[10px] font-medium text-content-secondary">
                      {spot}
                    </span>
                  ))}
                </div>

                {/* Footer CTA */}
                <div className="mt-auto pt-4 border-t border-surface-800 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] uppercase tracking-wider text-content-muted font-medium">Experience</span>
                    <span className="text-sm font-bold text-emerald-400">Guided Safari</span>
                  </div>
                  <button className="rounded-xl bg-brand-500 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-brand-600 hover:scale-105 active:scale-95 shadow-lg shadow-brand-500/20">
                    Book Trip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}