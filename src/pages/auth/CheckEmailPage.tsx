import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/layout';
import { Button } from '../../components/ui';

export function CheckEmailPage() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/login');
  };

  return (
    <AuthLayout>
      <div className="space-y-4">
        <div>
          <h2 className="text-[26px] font-bold text-[#333333] leading-tight">
            Recuperar la contraseña.
          </h2>
          <h3 className="text-[26px] font-bold text-[#4CAF50] leading-tight">
            Revisa tu email.
          </h3>
        </div>
        
        <p className="text-[#757575] text-[15px] leading-relaxed">
          Te hemos enviado un email para que puedas crear una contraseña nueva.
        </p>
        
        <div className="flex flex-col items-center pt-3">
          <Button onClick={handleClose}>
            CERRAR
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}
