import { useState } from 'react';
import { createPromiseClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
// Importa desde los archivos generados por protoc
import { AuthService } from './proto/auth/v1/auth_connect';

const transport = createConnectTransport({
  baseUrl: 'http://localhost:8080',
});

const client = createPromiseClient(AuthService, transport);

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(null);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSession(null);
    try {
      const response = await client.login({ username, password });
      setSession(response);
    } catch (err) {
      setError(err.message || 'Error de autenticación');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h2>Control de Acceso Central - Login</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxWidth: '320px' }}>
        <input
          type="text"
          placeholder="Usuario (ej. estudiante)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña (ej. 123456)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Ingresar al Sistema</button>
      </form>

      {session && (
        <div style={{ marginTop: '1.5rem', background: '#e6ffe6', padding: '1rem', borderRadius: '6px' }}>
          <h3>Sesión Iniciada</h3>
          <p><strong>Rol:</strong> {session.role}</p>
          <p><strong>User ID:</strong> {session.userId}</p>
          <p><strong>Token:</strong> {session.token}</p>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '1.5rem', background: '#ffe6e6', padding: '1rem', borderRadius: '6px', color: 'red' }}>
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}
    </div>
  );
}

export default App;