import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppHeader } from '../../components/layout';
import { TestimonyCard } from '../../components/ui';
import { api } from '../../services/api';

interface Testimony {
  id: string;
  title: string;
  content: string;
  groupName: string;
  createdAt: string;
  isFavoriteByResponsible: boolean;
  isHighlighted: boolean;
}

export function TestimoniesPage() {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonies();
  }, []);

  const loadTestimonies = async () => {
    setLoading(true);
    const result = await api.getTestimonies();
    if (result.data) {
      setTestimonies(result.data.testimonies);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <AppHeader />

      <main className="max-w-2xl mx-auto px-5 py-6">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-[28px] font-bold text-[#333333]">Testimonios</h1>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4CAF50]"></div>
            </div>
          ) : testimonies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#9E9E9E] text-[15px] mb-4">
                No hay testimonios todavía.
              </p>
              <Link
                to="/dashboard/nuevo-testimonio"
                className="text-[#4CAF50] font-semibold hover:text-[#388E3C] transition-colors"
              >
                Añadir el primero
              </Link>
            </div>
          ) : (
            <div>
              {testimonies.map((testimony) => (
                <TestimonyCard
                  key={testimony.id}
                  id={testimony.id}
                  title={testimony.title}
                  content={testimony.content}
                  groupName={testimony.groupName}
                  createdAt={testimony.createdAt}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
