import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppHeader } from '../../components/layout';
import { Input, Button, Alert } from '../../components/ui';
import { api } from '../../services/api';

export function NewTestimonyPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [groupName, setGroupName] = useState('Casa de Samuel');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');

  const validateForm = (): boolean => {
    let isValid = true;

    if (!title.trim()) {
      setTitleError('Campo obligatorio.');
      isValid = false;
    }

    if (!content.trim()) {
      setContentError('Campo obligatorio.');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await api.createTestimony({ title, content, groupName });
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    navigate('/dashboard');
  };

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

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h1 className="text-[24px] font-bold text-[#333333] mb-6">
            Nuevo testimonio
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              label="Título"
              placeholder="Un título para tu testimonio"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError('');
              }}
              onBlur={() => {
                if (!title.trim()) setTitleError('Campo obligatorio.');
              }}
              hasError={!!titleError}
              error={titleError}
            />

            <div>
              <label className="block text-[14px] font-semibold text-[#333333] mb-1.5">
                Grupo
              </label>
              <select
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#E0E0E0] rounded-lg text-[#333333] text-[15px] bg-white focus:outline-none focus:border-[#4CAF50]"
              >
                <option value="Casa de Samuel">Casa de Samuel</option>
                <option value="Casa de María">Casa de María</option>
                <option value="Casa de José">Casa de José</option>
                <option value="Casa de David">Casa de David</option>
              </select>
            </div>

            <div>
              <label className="block text-[14px] font-semibold text-[#333333] mb-1.5">
                Testimonio
              </label>
              <textarea
                placeholder="Escribe tu testimonio aquí..."
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (contentError) setContentError('');
                }}
                onBlur={() => {
                  if (!content.trim()) setContentError('Campo obligatorio.');
                }}
                rows={8}
                className={`
                  w-full px-4 py-3 border-2 rounded-lg
                  text-[#333333] text-[15px]
                  placeholder:text-[#BDBDBD]
                  bg-white resize-none
                  focus:outline-none
                  ${contentError 
                    ? 'border-[#E91E63] focus:border-[#E91E63]' 
                    : 'border-[#E0E0E0] focus:border-[#4CAF50]'
                  }
                `}
              />
              {contentError && (
                <p className="mt-1 text-[13px] text-[#E91E63]">{contentError}</p>
              )}
            </div>

            {error && (
              <Alert variant="error">{error}</Alert>
            )}

            <div className="flex flex-col items-center gap-3 pt-3">
              <Button type="submit" loading={loading}>
                PUBLICAR TESTIMONIO
              </Button>
              <Link
                to="/dashboard"
                className="text-[#9E9E9E] hover:text-[#666666] text-[14px] transition-colors"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
