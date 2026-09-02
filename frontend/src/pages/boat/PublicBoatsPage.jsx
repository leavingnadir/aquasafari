import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Ship, Loader2 } from "lucide-react";

export default function PublicBoatsPage() {
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get("/boats")
      .then((res) => setBoats(res.data))
      .catch((err) => console.error("Failed to load public boats", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 pt-24 pb-12 font-body text-content-primary">
      <div className="mb-8">
        <h1 className="font-display text-4xl mb-2">Our Fleet</h1>
        <p className="text-content-secondary">Explore our premium safari boats ready for your next aquatic adventure.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-brand-500" size={32} />
        </div>
      ) : boats.length === 0 ? (
        <p className="text-content-muted py-12 text-center">No boats currently available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {boats.map((boat) => (
            <div key={boat.boatId || boat.id} className="rounded-3xl border border-surface-800 bg-surface-900 overflow-hidden shadow-xl">
              <img 
                src={boat.imageUrl || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600"} 
                alt={boat.name} 
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="font-display text-xl mb-1">{boat.name}</h3>
                <p className="text-sm text-content-secondary mb-4">Capacity: {boat.passengerCapacity} passengers</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">
                    {boat.status || "Available"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
