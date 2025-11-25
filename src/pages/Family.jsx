import { useState, useEffect } from "react";

export default function Family() {
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [familia, setFamilia] = useState(null);

  const [nomeFamilia, setNomeFamilia] = useState("");
  const [codigoAcesso, setCodigoAcesso] = useState("");

  const token = localStorage.getItem("token");

  // =============================
  // Buscar dados da família do usuário
  // =============================
  async function carregarFamilia() {
    try {
      setLoading(true);

      const response = await fetch("http://34.204.186.82:8080/familias/minha", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setFamilia(data);
      } else {
        setFamilia(null); // usuário não tem família
      }
    } catch {
      setFamilia(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarFamilia();
  }, []);

  // =============================
  // Criar família
  // =============================
  async function criarFamilia(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    try {
      const response = await fetch("http://34.204.186.82:8080/familias/criar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nomeFamilia }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.erro || "Erro ao criar família");
      }

      setSucesso("Família criada com sucesso!");
      setNomeFamilia("");

      carregarFamilia();
    } catch (err) {
      setErro(err.message);
    }
  }

  // =============================
  // Entrar em família
  // =============================
  async function entrarFamilia(e) {
    e.preventDefault();
    setErro("");
    setSucesso("");

    try {
      const response = await fetch("http://34.204.186.82:8080/familias/entrar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codigoAcesso }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.erro || "Erro ao entrar na família");
      }

      setSucesso("Você entrou na família!");
      setCodigoAcesso("");

      carregarFamilia();
    } catch (err) {
      setErro(err.message);
    }
  }

  // =============================
  // Sair da família
  // =============================
  async function sairFamilia() {
    if (!confirm("Deseja realmente sair da família?")) return;

    try {
      const response = await fetch("http://34.204.186.82:8080/familias/sair", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Erro ao sair da família");
      }

      setSucesso("Você saiu da família.");
      setFamilia(null);
    } catch (err) {
      setErro(err.message);
    }
  }

  // =============================
  // RENDERIZAÇÃO
  // =============================
  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Gerenciar Família</h1>

      {erro && <p className="bg-red-600 p-3 rounded mb-4">{erro}</p>}
      {sucesso && <p className="bg-green-600 p-3 rounded mb-4">{sucesso}</p>}

      {/* ============================
         USUÁRIO NÃO TEM FAMÍLIA
      ============================ */}
      {loading ? (
        <p>Carregando...</p>
      ) : !familia ? (
        <div className="space-y-10">

          {/* Criar nova família */}
          <div className="bg-gray-800 p-6 rounded">
            <h2 className="text-xl font-bold mb-3">Criar Família</h2>
            <form onSubmit={criarFamilia}>
              <label className="block mb-2">Nome da família</label>
              <input
                className="w-full p-2 rounded bg-gray-700 mb-3"
                value={nomeFamilia}
                onChange={(e) => setNomeFamilia(e.target.value)}
                required
              />
              <button className="bg-blue-600 px-4 py-2 rounded w-full">
                Criar
              </button>
            </form>
          </div>

          {/* Entrar em família */}
          <div className="bg-gray-800 p-6 rounded">
            <h2 className="text-xl font-bold mb-3">Entrar em Família</h2>
            <form onSubmit={entrarFamilia}>
              <label className="block mb-2">Código de acesso</label>
              <input
                className="w-full p-2 rounded bg-gray-700 mb-3"
                value={codigoAcesso}
                onChange={(e) => setCodigoAcesso(e.target.value)}
                required
              />
              <button className="bg-green-600 px-4 py-2 rounded w-full">
                Entrar
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* ============================
           USUÁRIO TEM FAMÍLIA
        ============================ */
        <div className="bg-gray-800 p-6 rounded">
          <h2 className="text-2xl font-bold mb-4">{familia.nomeFamilia}</h2>

          <p className="mb-3">
            <strong>Código de acesso:</strong> {familia.codigoAcesso}
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2">Membros</h3>

          {familia.membros.length === 0 ? (
            <p className="text-gray-400">Nenhum membro.</p>
          ) : (
            <ul className="space-y-2">
              {familia.membros.map((m, idx) => (
                <li key={idx} className="bg-gray-700 p-2 rounded">
                  {m}
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={sairFamilia}
            className="bg-red-600 px-4 py-2 rounded mt-6"
          >
            Sair da família
          </button>
        </div>
      )}
    </div>
  );
}
