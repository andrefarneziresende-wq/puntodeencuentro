import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

export function TestimonyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [testimony, setTestimony] = useState<Testimony | null>(null);
  const [relatedTestimonies, setRelatedTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadTestimony(id);
      loadRelated();
    }
  }, [id]);

  const loadTestimony = async (testimonyId: string) => {
    setLoading(true);
    const result = await api.getTestimony(testimonyId);
    if (result.data) {
      setTestimony(result.data.testimony);
    }
    setLoading(false);
  };

  const loadRelated = async () => {
    const result = await api.getHighlightedTestimonies();
    if (result.data) {
      setRelatedTestimonies(result.data.testimonies.slice(0, 2));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleToggleFavorite = async () => {
    if (!testimony) return;
    const result = await api.toggleFavorite(testimony.id);
    if (result.data) {
      setTestimony({
        ...testimony,
        isFavoriteByResponsible: result.data.testimony.isFavoriteByResponsible,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <AppHeader />
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4CAF50]"></div>
        </div>
      </div>
    );
  }

  if (!testimony) {
    return (
      <div className="min-h-screen bg-[#F5F5F5]">
        <AppHeader />
        <div className="text-center py-16">
          <p className="text-[#9E9E9E]">Testimonio no encontrado.</p>
          <Link to="/dashboard" className="text-[#4CAF50] mt-2 inline-block">
            Volver
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <AppHeader />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Back link */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-[#4CAF50] text-[14px] font-medium mb-4 hover:text-[#388E3C] transition-colors"
        >
          <span>←</span>
          <span>Testimonios</span>
        </Link>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-[13px] text-[#9E9E9E]">
              {formatDate(testimony.createdAt)}
            </p>
            {/* Highlight button */}
            <button
              onClick={handleToggleFavorite}
              className={`transition-opacity ${
                testimony.isFavoriteByResponsible 
                  ? 'opacity-100' 
                  : 'opacity-40 hover:opacity-70'
              }`}
              aria-label="Destacar"
            >
              <img 
                src="/icon-check.png" 
                alt="Destacar" 
                className="w-8 h-8"
              />
            </button>
          </div>

          {/* Title */}
          <h1 className="text-[24px] font-bold text-[#333333] mb-3 leading-snug">
            {testimony.title}
          </h1>

          {/* Group Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#72E6EA] text-white px-3 py-1 rounded-full text-[12px] font-medium mb-5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            {testimony.groupName}
          </div>

          {/* Content */}
          <div className="text-[15px] text-[#444444] leading-relaxed whitespace-pre-line">
            {testimony.content}
          </div>
        </div>

        {/* Related Testimonies */}
        {relatedTestimonies.length > 0 && (
          <div className="mt-8">
            <h2 className="text-[18px] font-bold text-[#333333] mb-4">
              Más testimonios destacados
            </h2>
            <div className="bg-white rounded-2xl shadow-sm p-5">
              {relatedTestimonies
                .filter(t => t.id !== testimony.id)
                .slice(0, 2)
                .map((related) => (
                  <TestimonyCard
                    key={related.id}
                    id={related.id}
                    title={related.title}
                    content={related.content}
                    groupName={related.groupName}
                    createdAt={related.createdAt}
                  />
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
