import React from 'react';

const AuthForm = ({
  type,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  handleAuth,
  error,
  setStage,
}) => {
  return (
    <div className="max-w-sm mx-auto bg-card p-8 rounded-xl shadow-2xl border border-border">
      <div className="text-center space-y-6 animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-100">{type === 'login' ? 'Log In' : 'Sign Up'}</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleAuth(type); }} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
            required
          />
          {type === 'signup' && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              required
            />
          )}
          {error && <p className="text-red-500">{error}</p>}
          <button type="submit" className="w-full px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg shadow-lg hover:bg-primary/90 hover:scale-105 transform transition-all">
            {type === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>
        <button onClick={() => setStage(type === 'login' ? 'signup' : 'login')} className="text-primary hover:underline">
          {type === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;