import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.erro || "Erro no login.");
      }

      const token = await response.text(); // backend retorna token como string
      localStorage.setItem("token", token);

      window.location.href = "/dashboard";
    } catch (err) {
      setErro(err.message || "Erro desconhecido.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-8 rounded-xl w-96 shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>

        {erro && <p className="bg-red-500 p-2 rounded mb-3">{erro}</p>}

        <label className="block mb-2">Email</label>
        <input
          type="email"
          required
          className="w-full p-2 rounded bg-gray-700 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block mb-2">Senha</label>
        <input
          type="password"
          required
          className="w-full p-2 rounded bg-gray-700 mb-6"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded font-bold"
          type="submit"
        >
          Entrar
        </button>

        <p className="text-center mt-4 text-sm text-gray-400">
          Ainda não possui conta?{" "}
          <a className="underline" href="/register">
            Criar conta
          </a>
        </p>
      </form>
    </div>
  );
}