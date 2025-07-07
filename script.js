const pecas = {
  "Relação com retentor": [158.00, 20000],
  "Pneu dianteiro": [120.00, 12000],
  "Pneu traseiro": [150.00, 12000],
  "Pastilha dianteira": [25.00, 6000],
  "Pastilha traseira": [25.00, 6000],
  "Vela": [30.00, 12000],
  "Filtro de combustível": [20.00, 12000],
  "Filtro de ar": [18.00, 12000],
  "Cabo de embreagem": [40.00, 45000],
  "Cabo do acelerador": [35.00, 45000],
  "Óleo do motor": [45.00, 3000]
};

function formatarReal(valor) {
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

function parseValor(texto) {
  return parseFloat(texto.replace(",", "."));
}

function criarInputs() {
  const container = document.getElementById("pecasInputs");
  for (let nome in pecas) {
    const preco = pecas[nome][0].toFixed(2).replace(".", ",");
    const durab = pecas[nome][1];
    const html = `
      <div class="peca-row">
        <label>${nome}</label>
        <div>
          <button type="button" onclick="ajustarValor('${nome}', -1)">-</button>
          <input type="text" id="${nome}" value="${preco}" />
          <button type="button" onclick="ajustarValor('${nome}', 1)">+</button>
          <input type="number" id="${nome}_durab" value="${durab}" style="width:80px" title="Durabilidade em km"/>
          <span style="font-size:12px;">km</span>
        </div>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", html);
  }
}

function ajustarValor(nome, direcao) {
  const input = document.getElementById(nome);
  let valor = parseValor(input.value);
  if (isNaN(valor)) valor = 0;
  valor += direcao;
  input.value = valor.toFixed(2).replace(".", ",");
}

document.addEventListener("DOMContentLoaded", criarInputs);

document.getElementById("calcForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const km = parseValor(document.getElementById("km").value);
  const consumo = parseValor(document.getElementById("consumo").value);
  const precoGasolina = parseValor(document.getElementById("gasolina").value);

  if (isNaN(km) || isNaN(consumo) || isNaN(precoGasolina)) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  let totalPecas = 0;
  let detalhes = "";

  for (let nome in pecas) {
    const preco = parseValor(document.getElementById(nome).value);
    const durabilidade = parseFloat(document.getElementById(`${nome}_durab`).value);
    if (preco > 0 && durabilidade > 0) {
      const custo = (preco / durabilidade) * km;
      totalPecas += custo;
      detalhes += `<li>${nome}: ${formatarReal(custo)}</li>`;
    }
  }

  const litros = km / consumo;
  const gastoGasolina = litros * precoGasolina;
  const total = totalPecas + gastoGasolina;

  document.getElementById("resultado").innerHTML = `
    <h3>Resultado</h3>
    <ul>${detalhes}</ul>
    <p><strong>Gasolina:</strong> ${formatarReal(gastoGasolina)}</p>
    <p><strong>Total peças:</strong> ${formatarReal(totalPecas)}</p>
    <p><strong>TOTAL:</strong> ${formatarReal(total)}</p>
    <p><strong>💡 Guarde hoje para manutenção futura:</strong> ${formatarReal(totalPecas)}</p>
    <p><em>Custo por km:</em> ${formatarReal(total / km)} / km</p>
  `;
});
