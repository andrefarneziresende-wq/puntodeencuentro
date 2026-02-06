import { Link } from 'react-router-dom';

interface TestimonyCardProps {
  id: string;
  title: string;
  content: string;
  groupName: string;
  createdAt: string;
}

export function TestimonyCard({
  id,
  title,
  content,
  groupName,
  createdAt,
}: TestimonyCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  return (
    <div className="border-t border-[#E0E0E0] py-4 first:border-t-0">
      {/* Date */}
      <p className="text-[13px] text-[#9E9E9E] mb-2">
        {formatDate(createdAt)}
      </p>

      {/* Title */}
      <h3 className="text-[16px] font-bold text-[#333333] mb-2 leading-snug">
        {title}
      </h3>

      {/* Group Badge */}
      <div className="inline-flex items-center gap-1.5 bg-[#72E6EA] text-black px-3 py-1 rounded-full text-[12px] font-medium mb-3 underline">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        {groupName}
      </div>

      {/* Content Preview */}
      <p className="text-[14px] text-[#666666] leading-relaxed mb-3">
        {truncateText(content)}
      </p>

      {/* Actions */}
      <div className="flex items-center">
        <Link
          to={`/dashboard/testimonio/${id}`}
          className="text-[#4CAF50] text-[14px] font-semibold hover:text-[#388E3C] transition-colors"
        >
          LEER TODO
        </Link>
      </div>
    </div>
  );
}
