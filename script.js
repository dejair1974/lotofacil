async function carregarResultados() {
  const containerResultados = document.getElementById("resultados");
  const containerFrequencia = document.getElementById("frequencia");

  containerResultados.innerHTML = "Carregando...";
  containerFrequencia.innerHTML = "";

  const totalConcursos = 10; // você pode mudar para 20, 30 etc.
  const resultados = [];

  // Pega o concurso mais recente
  const ultimo = await fetch('https://loteriascaixa-api.herokuapp.com/api/lotofacil/latest')
    .then(res => res.json());

  const numeroInicial = ultimo.concurso - totalConcursos + 1;

  // Loop para buscar os concursos anteriores
  for (let i = numeroInicial; i <= ultimo.concurso; i++) {
    try {
      const dados = await fetch(`https://loteriascaixa-api.herokuapp.com/api/lotofacil/${i}`)
        .then(r => r.json());

      resultados.push(dados);

      containerResultados.innerHTML += `
        <div class="concurso">
          <strong>Concurso ${dados.concurso}</strong><br/>
          Data: ${dados.data}<br/>
          Dezenas: ${dados.dezenas.join(', ')}
        </div>
      `;
    } catch (err) {
      console.error("Erro no concurso", i);
    }
  }

  analisarFrequencia(resultados);
}

// Calcula a frequência dos números
function analisarFrequencia(resultados) {
  const contador = {};

  resultados.forEach(c => {
    c.dezenas.forEach(n => {
      const num = parseInt(n);
      contador[num] = (contador[num] || 0) + 1;
    });
  });

  // Ordena pela frequência
  const ordenado = Object.entries(contador).sort((a, b) => b[1] - a[1]);

  // Exibe os mais frequentes
  let html = "<h3>Números mais frequentes</h3><ul>";
  ordenado.forEach(([num, freq]) => {
    html += `<li>Número ${num}: ${freq}x</li>`;
  });
  html += "</ul>";

  document.getElementById("frequencia").innerHTML = html;
}
