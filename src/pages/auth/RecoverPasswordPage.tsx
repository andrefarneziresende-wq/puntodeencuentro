import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../../components/layout';
import { Input, Button, Alert } from '../../components/ui';
import { useAuthStore } from '../../stores/authStore';

// Validar formato de email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function RecoverPasswordPage() {
  const navigate = useNavigate();
  const { recoverPassword, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setEmailError('Campo obligatorio.');
      return false;
    }
    
    if (!isValidEmail(email)) {
      setEmailError('Email no válido.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      return;
    }
    
    const success = await recoverPassword(email);
    if (success) {
      navigate('/recuperar-contrasena/revisar-email');
    }
  };

  const handleEmailBlur = () => {
    if (!email.trim()) {
      setEmailError('Campo obligatorio.');
    } else if (!isValidEmail(email)) {
      setEmailError('Email no válido.');
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) {
      setEmailError('');
    }
    if (error) {
      clearError();
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-5">
        <h2 className="text-[26px] font-bold text-[#333333] leading-tight">
          Recuperar la<br />contraseña
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            label="Email"
            type="email"
            placeholder="Introduce tu email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            onBlur={handleEmailBlur}
            autoComplete="email"
            hasError={!!emailError}
            error={emailError}
          />
          
          {error && (
            <Alert variant="error">
              {error}
            </Alert>
          )}
          
          <div className="flex flex-col items-center gap-3 pt-3">
            <Button type="submit" loading={isLoading}>
              RECUPERAR
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
