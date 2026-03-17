import { useState } from 'react';
import './LoginPage.css';

const USUARIOS_MOCK = [
  { id: 1, username: 'admin', label: 'Administrador' },
  { id: 2, username: 'usuario', label: 'Usuario Estándar' }
];

export default function LoginPage() {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(USUARIOS_MOCK[0].username);
  const [clave, setClave] = useState('');

  const manejarEnvio = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Intentando iniciar sesión con:', { usuario: usuarioSeleccionado, clave });
  };

  return (
    <div className="login-contenedor">
      <div className="login-tarjeta">
        <div className="login-cabecera">
          <h2>Iniciar Sesión</h2>
          <p>Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={manejarEnvio} className="login-formulario">

          <div className="campo-grupo">
            <label htmlFor="usuario">Usuario</label>
            <select
              id="usuario"
              value={usuarioSeleccionado}
              onChange={(e) => setUsuarioSeleccionado(e.target.value)}
              className="login-input"
            >
              {USUARIOS_MOCK.map((user) => (
                <option key={user.id} value={user.username}>
                  {user.label} ({user.username})
                </option>
              ))}
            </select>
          </div>

          <div className="campo-grupo">
            <label htmlFor="clave">Contraseña</label>
            <input
              type="password"
              id="clave"
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              placeholder="••••••••"
              required
              className="login-input"
            />
          </div>

          <button type="submit" className="login-boton">
            Ingresar
          </button>

        </form>
      </div>
    </div>
  );
}