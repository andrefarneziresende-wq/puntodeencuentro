import { useState, FormEvent, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AuthLayout } from '../../components/layout';
import { Input, Button, Alert } from '../../components/ui';
import { useAuthStore } from '../../stores/authStore';

export function NewPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, isLoading, error, clearError } = useAuthStore();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const validateForm = (): boolean => {
    let isValid = true;
    
    if (!password.trim()) {
      setPasswordError('Campo obligatorio.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Mínimo 6 caracteres.');
      isValid = false;
    }
    
    if (!confirmPassword.trim()) {
      setConfirmError('Campo obligatorio.');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmError('Las contraseñas no coinciden.');
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      return;
    }

    if (!token) {
      setPasswordError('Token inválido. Solicita un nuevo enlace.');
      return;
    }
    
    const success = await resetPassword(token, password);
    if (success) {
      navigate('/login');
    }
  };

  const handlePasswordBlur = () => {
    if (!password.trim()) {
      setPasswordError('Campo obligatorio.');
    } else if (password.length < 6) {
      setPasswordError('Mínimo 6 caracteres.');
    }
  };

  const handleConfirmBlur = () => {
    if (!confirmPassword.trim()) {
      setConfirmError('Campo obligatorio.');
    } else if (password !== confirmPassword) {
      setConfirmError('Las contraseñas no coinciden.');
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError) setPasswordError('');
    if (confirmError && value === confirmPassword) setConfirmError('');
  };

  const handleConfirmChange = (value: string) => {
    setConfirmPassword(value);
    if (confirmError) setConfirmError('');
  };

  return (
    <AuthLayout>
      <div className="space-y-5">
        <h2 className="text-[26px] font-bold text-[#333333] leading-tight">
          Nueva<br />contraseña
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Contraseña nueva"
            placeholder="Contraseña nueva"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            onBlur={handlePasswordBlur}
            showPasswordToggle
            autoComplete="new-password"
            hasError={!!passwordError}
            error={passwordError}
          />
          
          <Input
            label="Repetir contraseña nueva"
            placeholder="Repetir contraseña nueva"
            value={confirmPassword}
            onChange={(e) => handleConfirmChange(e.target.value)}
            onBlur={handleConfirmBlur}
            showPasswordToggle
            autoComplete="new-password"
            hasError={!!confirmError}
            error={confirmError}
          />
          
          {error && (
            <Alert variant="error">
              {error}
            </Alert>
          )}
          
          <div className="flex flex-col items-center gap-3 pt-3">
            <Button type="submit" loading={isLoading}>
              GUARDAR
            </Button>
            
            <Link
              to="/login"
              className="text-[#4CAF50] hover:text-[#388E3C] text-[14px] font-medium transition-colors"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
