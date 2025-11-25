import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nome: "",
    email: "",
  });

  const [familia, setFamilia] = useState({
    id: null,
    nome: "",
    membros: 0,
    alimentosFamilia: 0,
    criadaEm: "",
  });

  const [alimentosUsuario, setAlimentosUsuario] = useState(0);

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao carregar dados do dashboard.");
        }

        const data = await response.json();

        setUsuario({
          nome: data.nomeUsuario,
          email: data.email,
        });

        setFamilia({
          id: data.idFamilia,
          nome: data.nomeFamilia,
          membros: data.qtdMembros,
          alimentosFamilia: data.qtdAlimentosFamilia ?? 0,
          criadaEm: data.criadaEm ?? "",
        });

        setAlimentosUsuario(data.qtdAlimentosUsuario ?? 0);
      } catch (err) {
        console.error(err);
        setErro("Não foi possível carregar suas informações.");
      } finally {
        setCarregando(false);
      }
    }

    carregarDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-gray-300 text-sm">Carregando suas informações...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center items-start py-10">
      <div className="w-full max-w-5xl bg-gray-800/80 border border-gray-700 rounded-2xl shadow-xl p-8">

        {/* Cabeçalho + logout */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Minhas informações</h1>
            <p className="text-gray-400 text-sm">
              Aqui você acompanha seus dados, sua família e o status dos seus alimentos.
            </p>
            {erro && (
              <p className="text-sm text-red-400 bg-red-900/30 border border-red-700 rounded px-3 py-2 mt-2">
                {erro}
              </p>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-500 transition-colors px-4 py-2 rounded-xl text-sm font-semibold"
          >
            Sair
          </button>
        </header>

        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Card usuário */}
          <section className="md:col-span-1 bg-gray-900/70 rounded-xl p-5 border border-gray-700">
            <h2 className="text-lg font-semibold mb-3">Meu perfil</h2>
            <div className="space-y-1 text-sm">
              <p className="text-gray-400">Nome</p>
              <p className="font-medium">{usuario.nome}</p>

              <p className="mt-3 text-gray-400">E-mail</p>
              <p className="font-medium break-all">{usuario.email}</p>
            </div>
          </section>

          {/* Card família */}
          <section className="md:col-span-1 bg-gray-900/70 rounded-xl p-5 border border-gray-700">
            <h2 className="text-lg font-semibold mb-3">Minha família</h2>

            {familia.id ? (
              <>
                <p className="text-xl font-bold mb-1">{familia.nome}</p>
                {familia.criadaEm && (
                  <p className="text-xs text-gray-400 mb-4">
                    criada em {familia.criadaEm}
                  </p>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Membros:</span>
                    <span className="font-medium">{familia.membros}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-400">Alimentos das família:</span>
                    <span className="font-medium">{familia.alimentosFamilia}</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-400">
                Você ainda não está vinculado a nenhuma família.
              </p>
            )}
          </section>

          {/* Card alimentos do usuário */}
          <section className="md:col-span-1 bg-gray-900/70 rounded-xl p-5 border border-gray-700 flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-3">Alimentos cadastrados</h2>
              <p className="text-4xl font-extrabold mb-2">
                {alimentosUsuario}
              </p>
              <p className="text-xs text-gray-400">
                Seus alimentos
              </p>
            </div>
          </section>
        </div>

        {/* Ações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            className="w-full bg-blue-600 hover:bg-blue-500 transition-colors p-4 rounded-xl font-semibold text-sm flex items-center justify-between"
            onClick={() => navigate("/familia")}
          >
            <span>Gerenciar família</span>
            <span className="text-xs text-gray-200">
              ver
            </span>
          </button>

          <button
            className="w-full bg-green-600 hover:bg-green-500 transition-colors p-4 rounded-xl font-semibold text-sm flex items-center justify-between"
            onClick={() => navigate("/alimentos")}
          >
            <span>Gerenciar alimentos</span>
            <span className="text-xs text-gray-200">
              ver
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}