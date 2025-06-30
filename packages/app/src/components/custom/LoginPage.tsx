import { useLocation } from 'react-router-dom';
import { useApi, githubAuthApiRef } from '@backstage/core-plugin-api';
import { Button, Container, Typography } from '@material-ui/core';

export const CustomLoginPage = () => {
  const authApi = useApi(githubAuthApiRef);
  const location = useLocation();

  // Obtener 'from' o asignar ruta por defecto
  const searchParams = new URLSearchParams(location.search);
  const from = searchParams.get('from') || '/catalog';

  const onLogin = async () => {
    try {
      await authApi.signIn();
      window.location.href = from;  // redireccionar a ruta válida
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <header style={{ marginBottom: 24 }}>
        <img src="https://tuempresa.com/logo.png" alt="Logo" style={{ width: 120 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Bienvenido a la plataforma personalizada
        </Typography>
        <Typography variant="subtitle1">
          Accede con tu cuenta corporativa para continuar
        </Typography>
      </header>

      <Button variant="contained" color="primary" onClick={onLogin}>
        Iniciar sesión con GitHub
      </Button>
    </div>
  );
};
