import { useState } from "react";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          senha,
          dataNascimento,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || "Erro ao registrar usuário.");
      }

      setSucesso("Conta criada com sucesso! Redirecionando...");
      setTimeout(() => (window.location.href = "/"), 1500);

    } catch (error) {
      setErro(error.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form
        onSubmit={handleRegister}
        className="bg-gray-800 p-8 rounded-xl w-96 shadow-lg"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Criar Conta</h1>

        {erro && <p className="bg-red-500 p-2 rounded mb-3">{erro}</p>}
        {sucesso && <p className="bg-green-600 p-2 rounded mb-3">{sucesso}</p>}

        <label className="block mb-2">Nome completo</label>
        <input
          type="text"
          required
          className="w-full p-2 rounded bg-gray-700 mb-4"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

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
          className="w-full p-2 rounded bg-gray-700 mb-4"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <label className="block mb-2">Data de nascimento</label>
        <input
          type="date"
          required
          className="w-full p-2 rounded bg-gray-700 mb-6"
          value={dataNascimento}
          onChange={(e) => setDataNascimento(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 hover:bg-blue-500 p-2 rounded font-bold"
          type="submit"
        >
          Registrar
        </button>

        <p className="text-center mt-4 text-sm text-gray-400">
          Já possui conta?{" "}
          <a href="/" className="underline">
            Fazer login
          </a>
        </p>
      </form>
    </div>
  );
}
