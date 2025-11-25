import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({ nome: "", email: "" });

  const [familia, setFamilia] = useState({
    id: null,
    nome: "",
    membros: 0,
    alimentosFamilia: 0,
    vencidosFamilia: 0,
    criadaEm: "",
  });

  const [alimentosUsuario, setAlimentosUsuario] = useState(0);
  const [vencidosUsuario, setVencidosUsuario] = useState(0);

  const [temAlimentosVencendo, setTemAlimentosVencendo] = useState(false);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    async function carregarDashboard() {
      try {
        setErro("");

        const response = await fetch("http://localhost:8080/dashboard/resumo", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Erro ao carregar dados do dashboard.");

        const data = await response.json();

        setUsuario({ nome: data.nomeUsuario, email: data.email });
        setAlimentosUsuario(data.qtdAlimentosUsuario ?? 0);
        setVencidosUsuario(data.qtdVencidosUsuario ?? 0);

        setFamilia({
          id: data.idFamilia,
          nome: data.nomeFamilia,
          membros: data.qtdMembros,
          alimentosFamilia: data.qtdAlimentosFamilia ?? 0,
          vencidosFamilia: data.qtdVencidosFamilia ?? 0,
          criadaEm: data.criadaEm ?? "",
        });

        setTemAlimentosVencendo(data.temAlimentosVencendo || false);

      } catch (err) {
        console.error(err);
        setErro("Não foi possível carregar suas informações.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDashboard();
  }, [navigate]);

  async function enviarAviso() {
    const token = localStorage.getItem("token");

    try {
      await fetch("http://localhost:8080/dashboard/enviar-aviso", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Aviso enviado para o seu e-mail!");
    } catch (err) {
      alert("Erro ao enviar aviso: " + err.message);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-300 text-sm">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-start py-10">
      <div className="w-full max-w-5xl bg-gray-800/80 border border-gray-700 rounded-2xl shadow-xl p-8">

        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Minhas informações</h1>
            <p className="text-gray-400 text-sm">
              Status da sua conta e dos seus alimentos.
            </p>

            {erro && (
              <p className="text-sm text-red-400 bg-red-900/30 border border-red-700 rounded px-3 py-2 mt-2">
                {erro}
              </p>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl text-sm font-semibold"
          >
            Sair
          </button>
        </header>

        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Perfil */}
          <section className="bg-gray-900/70 border border-gray-700 rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-3">Meu perfil</h2>
            <p className="text-gray-400 text-sm">Nome</p>
            <p className="font-medium">{usuario.nome}</p>

            <p className="text-gray-400 text-sm mt-3">E-mail</p>
            <p className="font-medium break-all">{usuario.email}</p>
          </section>

          {/* Família */}
          <section className="bg-gray-900/70 border border-gray-700 rounded-xl p-5">
            <h2 className="text-lg font-semibold mb-3">Minha família</h2>

            {familia.id ? (
              <>
                <p className="text-xl font-bold">{familia.nome}</p>

                <div className="space-y-2 text-sm mt-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Membros:</span>
                    <span className="font-medium">{familia.membros}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Alimentos:</span>
                    <span className="font-medium">{familia.alimentosFamilia}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Vencidos:</span>
                    <span className="font-medium text-red-400">
                      {familia.vencidosFamilia}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-sm">Nenhuma família vinculada.</p>
            )}
          </section>

          {/* Alimentos do usuário */}
          <section className="bg-gray-900/70 border border-gray-700 rounded-xl p-5 flex flex-col justify-between">
            <h2 className="text-lg font-semibold mb-3">Seus alimentos</h2>

            <p className="text-4xl font-extrabold">{alimentosUsuario}</p>

            <p className="text-sm text-red-400 mt-2">
              Vencidos: {vencidosUsuario}
            </p>
          </section>
        </div>

        {/* Ações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

          <button
            className="w-full bg-blue-600 hover:bg-blue-500 p-4 rounded-xl font-semibold text-sm flex justify-between"
            onClick={() => navigate("/familia")}
          >
            <span>Gerenciar família</span>
            <span className="text-xs text-gray-200">ver</span>
          </button>

          <button
            className="w-full bg-green-600 hover:bg-green-500 p-4 rounded-xl font-semibold text-sm flex justify-between"
            onClick={() => navigate("/alimentos")}
          >
            <span>Gerenciar alimentos</span>
            <span className="text-xs text-gray-200">ver</span>
          </button>
        </div>

        {/* Botão envio aviso */}
        <button
          disabled={!temAlimentosVencendo}
          onClick={enviarAviso}
          className={`w-full p-4 rounded-xl text-sm font-semibold transition-colors 
            ${temAlimentosVencendo ? "bg-yellow-600 hover:bg-yellow-500" : "bg-gray-700 cursor-not-allowed"}`}
        >
          Enviar aviso de alimentos prestes a vencer
        </button>

      </div>
    </div>
  );
}
