import express from "express";

const servidor = express();
servidor.use(express.json());

const pets = [
  { id: 1, nome: "Rex", especie: "cachorro", idade: 5, adotado: true },
  { id: 2, nome: "Nina", especie: "gato", idade: 2, adotado: false },
  { id: 3, nome: "Cookie", especie: "coelho", idade: 1, adotado: false }
];

let proximoCodigo = 3;

function listarAnimais() {
  return [...pets];
}

function encontrarAnimal(codigo) {
  return pets.find(registro => registro.id === codigo);
}

function adicionarAnimal(nome, especie, idade) {
  const animalNovo = {
    id: ++proximoCodigo,
    nome: nome.trim(),
    especie: especie.trim(),
    idade: idade,
    adotado: false
  };

  pets.push(animalNovo);
  return animalNovo;
}

function alterarAnimal(codigo, novosDados) {
  const animalEncontrado = encontrarAnimal(codigo);

  if (!animalEncontrado) {
    return undefined;
  }

  Object.assign(animalEncontrado, novosDados);
  return animalEncontrado;
}

function apagarAnimal(codigo) {
  const posicaoEncontrada = pets.findIndex(registro => registro.id === codigo);

  if (posicaoEncontrada === -1) {
    return false;
  }

  pets.splice(posicaoEncontrada, 1);
  return true;
}

servidor.get("/pets", (req, res) => {
  return res.status(200).json(listarAnimais());
});

servidor.get("/pets/:id", (req, res) => {
  const codigoPet = Number(req.params.id);

  if (!Number.isInteger(codigoPet) || codigoPet <= 0) {
    return res.status(400).json({ mensagem: "ID invalido" });
  }

  const animalEncontrado = encontrarAnimal(codigoPet);

  if (!animalEncontrado) {
    return res.status(404).json({ mensagem: "Pet nao encontrado" });
  }

  return res.status(200).json(animalEncontrado);
});

servidor.post("/pets", (req, res) => {
  const { nome, especie, idade } = req.body;

  if (
    typeof nome !== "string" || nome.trim() === "" ||
    typeof especie !== "string" || especie.trim() === ""
  ) {
    return res.status(400).json({
      mensagem: "Informe o nome e a especie"
    });
  }

  if (
    typeof idade !== "number" ||
    !Number.isFinite(idade) ||
    idade < 0
  ) {
    return res.status(400).json({
      mensagem: "Idade invalida"
    });
  }

  const animalCadastrado = adicionarAnimal(nome, especie, idade);

  return res.status(201).json(animalCadastrado);
});

servidor.patch("/pets/:id", (req, res) => {
  const codigoPet = Number(req.params.id);

  if (!Number.isInteger(codigoPet) || codigoPet <= 0) {
    return res.status(400).json({ mensagem: "ID invalido" });
  }

  if (!encontrarAnimal(codigoPet)) {
    return res.status(404).json({ mensagem: "Pet nao encontrado" });
  }

  const { nome, especie, idade, adotado } = req.body;
  const camposAtualizados = {};

  if (nome !== undefined) {
    if (typeof nome !== "string" || nome.trim() === "") {
      return res.status(400).json({ mensagem: "Nome invalido" });
    }

    camposAtualizados.nome = nome.trim();
  }

  if (especie !== undefined) {
    if (typeof especie !== "string" || especie.trim() === "") {
      return res.status(400).json({ mensagem: "Especie invalida" });
    }

    camposAtualizados.especie = especie.trim();
  }

  if (idade !== undefined) {
    if (
      typeof idade !== "number" ||
      !Number.isFinite(idade) ||
      idade < 0
    ) {
      return res.status(400).json({ mensagem: "Idade invalida" });
    }

    camposAtualizados.idade = idade;
  }

  if (adotado !== undefined) {
    if (typeof adotado !== "boolean") {
      return res.status(400).json({ mensagem: "Adocao invalida" });
    }

    camposAtualizados.adotado = adotado;
  }

  if (Object.keys(camposAtualizados).length === 0) {
    return res.status(400).json({
      mensagem: "Informe um campo para alterar"
    });
  }

  const animalAlterado = alterarAnimal(codigoPet, camposAtualizados);

  return res.status(200).json(animalAlterado);
});

servidor.delete("/pets/:id", (req, res) => {
  const codigoPet = Number(req.params.id);

  if (!Number.isInteger(codigoPet) || codigoPet <= 0) {
    return res.status(400).json({ mensagem: "ID invalido" });
  }

  const foiApagado = apagarAnimal(codigoPet);

  if (!foiApagado) {
    return res.status(404).json({ mensagem: "Pet nao encontrado" });
  }

  return res.status(204).send();
});

servidor.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});