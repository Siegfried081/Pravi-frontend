import { useState, useEffect } from "react";

export default function Foods() {
  const [tab, setTab] = useState("meus");

  const [meusAlimentos, setMeusAlimentos] = useState([]);
  const [familiaAlimentos, setFamiliaAlimentos] = useState([]);

  const [temFamilia, setTemFamilia] = useState(false);

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const [novoNome, setNovoNome] = useState("");
  const [novaValidade, setNovaValidade] = useState("");
  const [novaCategoria, setNovaCategoria] = useState("");
  const [novaQuantidade, setNovaQuantidade] = useState(1);

  const token = localStorage.getItem("token");

  // =============================
  // VERIFICAR SE O USUÁRIO TEM FAMÍLIA
  // =============================
  async function verificarFamilia() {
    try {
      const response = await fetch("http://localhost:8080/usuarios/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error();

      const data = await response.json();

      setTemFamilia(Boolean(data.idFamilia));
    } catch {
      setTemFamilia(false);
    }
  }

  // =============================
  // Carregar alimentos do usuário
  // =============================
  async function carregarMeusAlimentos() {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/alimentos", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Erro ao carregar seus alimentos");

      const data = await response.json();
      setMeusAlimentos(data);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  // =============================
  // Carregar alimentos da família
  // =============================
  async function carregarFamiliaAlimentos() {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:8080/alimentos/familia", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok)
        throw new Error("Erro ao carregar alimentos da família");

      const data = await response.json();
      setFamiliaAlimentos(data);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Carrega na abertura da página
  useEffect(() => {
    verificarFamilia();
    carregarMeusAlimentos();
  }, []);

  // =============================
  // Registrar alimento
  // =============================
  async function registrarAlimento(e) {
    e.preventDefault();
    setErro("");

    try {
      const response = await fetch("http://localhost:8080/alimentos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: novoNome,
          dataValidade: novaValidade,
          categoria: novaCategoria,
          quantidade: novaQuantidade,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.erro || "Erro ao registrar alimento");
      }

      setNovoNome("");
      setNovaValidade("");
      setNovaCategoria("");
      setNovaQuantidade(1);

      setTab("meus");
      carregarMeusAlimentos();
    } catch (err) {
      setErro(err.message);
    }
  }

  // =============================
  // Deletar alimento
  // =============================
  async function deletarAlimento(id) {
  if (!confirm("Deseja excluir este alimento?")) return;

  try {
    const response = await fetch(
      `http://localhost:8080/alimentos/${id}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) throw new Error("Erro ao deletar alimento");

    carregarMeusAlimentos();

    // 🔥 SÓ CARREGA ALIMENTOS DA FAMÍLIA SE O USUÁRIO TIVER FAMÍLIA
    if (temFamilia) {
      carregarFamiliaAlimentos();
    }

    } catch (err) {
      setErro(err.message);
    }
  }


  // =============================
  // Componente de lista
  // =============================
  function Lista({ dados }) {
    if (loading) return <p>Carregando...</p>;
    if (!dados.length)
      return <p className="text-gray-400">Nenhum alimento encontrado.</p>;

    return (
      <ul className="space-y-3">
        {dados.map((a) => (
          <li
            key={a.idAlimento}
            className="bg-gray-800 p-4 rounded flex justify-between"
          >
            <div>
              <h2 className="text-lg font-bold">{a.nome}</h2>
              <p>Validade: {a.dataValidade}</p>
              <p>Quantidade: {a.quantidade}</p>
              <p>Categoria: {a.categoria}</p>
            </div>

            <button
              onClick={() => deletarAlimento(a.idAlimento)}
              className="bg-red-600 px-4 py-2 rounded"
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    );
  }

  // =============================
  // RENDER
  // =============================
  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Gerenciar Alimentos</h1>

      {erro && <p className="bg-red-500 p-3 rounded mb-4">{erro}</p>}

      {!temFamilia && (
        <p className="bg-yellow-600 p-3 mb-4 rounded">
          Você ainda não faz parte de uma família. Vá até "Gerenciar Família" para criar ou entrar em uma.
        </p>
      )}

      {/* Abas */}
      <div className="flex gap-3 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            tab === "meus" ? "bg-blue-600" : "bg-gray-700"
          }`}
          onClick={() => {
            setTab("meus");
            carregarMeusAlimentos();
          }}
        >
          Meus alimentos
        </button>

        <button
          className={`px-4 py-2 rounded ${
            tab === "familia" ? "bg-blue-600" : "bg-gray-700"
          } ${!temFamilia && "opacity-40 cursor-not-allowed"}`}
          disabled={!temFamilia}
          onClick={() => {
            if (temFamilia) {
              setTab("familia");
              carregarFamiliaAlimentos();
            }
          }}
        >
          Alimentos da família
        </button>

        <button
          className={`px-4 py-2 rounded ${
            tab === "registrar" ? "bg-blue-600" : "bg-gray-700"
          }`}
          onClick={() => setTab("registrar")}
        >
          Registrar alimento
        </button>
      </div>

      {/* Conteúdo */}
      {tab === "meus" && <Lista dados={meusAlimentos} />}
      {tab === "familia" && temFamilia && <Lista dados={familiaAlimentos} />}

      {tab === "registrar" && (
        <form onSubmit={registrarAlimento} className="bg-gray-800 p-4 rounded">
          <label className="block mb-2">Nome</label>
          <input
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            required
            className="w-full bg-gray-700 p-2 rounded mb-3"
          />

          <label className="block mb-2">Data de validade</label>
          <input
            type="date"
            value={novaValidade}
            onChange={(e) => setNovaValidade(e.target.value)}
            required
            className="w-full bg-gray-700 p-2 rounded mb-3"
          />

          <label className="block mb-2">Categoria</label>
          <select
            value={novaCategoria}
            onChange={(e) => setNovaCategoria(e.target.value)}
            required
            className="w-full bg-gray-700 p-2 rounded mb-3"
          >
            <option value="">Selecione...</option>
            <option value="GRAO">Grão</option>
            <option value="LATICINIO">Laticínio</option>
            <option value="BEBIDA">Bebida</option>
            <option value="CARNE">Carne</option>
            <option value="FRUTA">Fruta</option>
            <option value="VEGETAL">Vegetal</option>
          </select>

          <label className="block mb-2">Quantidade</label>
          <input
            type="number"
            min="1"
            value={novaQuantidade}
            onChange={(e) => setNovaQuantidade(e.target.value)}
            className="w-full bg-gray-700 p-2 rounded mb-3"
          />

          <button className="w-full bg-green-600 p-2 rounded">
            Registrar
          </button>
        </form>
      )}
    </div>
  );
}
