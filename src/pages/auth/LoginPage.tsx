import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/layout';
import { Input, Button, Alert } from '../../components/ui';
import { useAuthStore } from '../../stores/authStore';

// Validar formato de email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [_touched, setTouched] = useState({ email: false, password: false });

  const validateForm = (): boolean => {
    let isValid = true;
    
    if (!email.trim()) {
      setEmailError('Campo obligatorio.');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Email no válido.');
      isValid = false;
    }
    
    if (!password.trim()) {
      setPasswordError('Campo obligatorio.');
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setHasError(false);
    setTouched({ email: true, password: true });
    
    if (!validateForm()) {
      return;
    }
    
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setHasError(true);
    }
  };

  const handleEmailBlur = () => {
    setTouched(prev => ({ ...prev, email: true }));
    if (!email.trim()) {
      setEmailError('Campo obligatorio.');
    } else if (!isValidEmail(email)) {
      setEmailError('Email no válido.');
    }
  };

  const handlePasswordBlur = () => {
    setTouched(prev => ({ ...prev, password: true }));
    if (!password.trim()) {
      setPasswordError('Campo obligatorio.');
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (emailError) {
      setEmailError('');
    }
    if (hasError) {
      setHasError(false);
      clearError();
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError) {
      setPasswordError('');
    }
    if (hasError) {
      setHasError(false);
      clearError();
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <Input
          label="Usuario"
          type="email"
          placeholder="Introduce tu email"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          onBlur={handleEmailBlur}
          autoComplete="email"
          hasError={hasError || !!emailError}
          error={emailError}
        />
        
        <Input
          label="Contraseña"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => handlePasswordChange(e.target.value)}
          onBlur={handlePasswordBlur}
          showPasswordToggle
          autoComplete="current-password"
          hasError={hasError || !!passwordError}
          error={passwordError}
        />
        
        {/* Error message - between password and button */}
        {error && (
          <Alert variant="error">
            {error}
          </Alert>
        )}
        
        <div className="flex flex-col items-center gap-4 pt-3">
          <Button type="submit" loading={isLoading}>
            INICIAR SESIÓN
          </Button>
          
          <Link
            to="/recuperar-contrasena"
            className="text-[#4CAF50] hover:text-[#388E3C] text-[14px] transition-colors"
          >
            Ups! He olvidado mi contraseña.
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
