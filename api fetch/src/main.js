document.getElementById('btn').addEventListener('click', () => {
  document.querySelector('.contenedor').style.display = 'flex'; // Mostrar el contenedor
  const randomId = Math.floor(Math.random() * 1025) + 1;
  fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
    .then(response => response.json())
    .then(data => {
      const nombre = data.name;
      const id = data.id.toString().padStart(3, '0');
      const imagen = data.sprites.front_default;
      const habilidades = data.abilities.map(a => a.ability.name).join(', ');
      const tipos = data.types.map(t => t.type.name).join(', ');
      const altura = (data.height / 10).toFixed(2); // metros
      const peso = (data.weight / 10).toFixed(2);   // kilogramos
      const stats = data.stats.map(s => `${s.stat.name}: ${s.base_stat}`).join('<br>');

      document.getElementById('resultado').innerHTML = `
        <div class="info">
          <strong>Nombre:</strong> ${nombre} <span style="color:#888;">#${id}</span><br>
          <img src="${imagen}" alt="${nombre}"><br>
          <strong>Habilidades:</strong> ${habilidades}<br>
          <strong>Tipos:</strong> ${tipos}<br>
          <strong>Altura:</strong> ${altura} m<br>
          <strong>Peso:</strong> ${peso} kg<br>
        </div>
        <div class="stats-box">
          <strong>Estadísticas base:</strong><br>${stats}
        </div>
      `;
      document.getElementById('pokemonInput').value = '';
      sugerencias.innerHTML = '';
      sugerencias.style.display = 'none';
    })
    .catch(error => {
      document.getElementById('resultado').textContent = 'Error: ' + error;
    });
});

document.getElementById('buscador').addEventListener('submit', async function(e) {
  e.preventDefault();
  let inputValue = document.getElementById('pokemonInput').value.trim().toLowerCase();
  if (!inputValue) return;

  if (/^\d+$/.test(inputValue)) {
    inputValue = String(Number(inputValue));
  }

  document.querySelector('.contenedor').style.display = 'flex';
  const resultado = document.getElementById('resultado');
  resultado.innerHTML = 'Buscando...';

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${inputValue}`);
    if (!res.ok) throw new Error('Pokémon no encontrado');
    const data = await res.json();

    const nombre = data.name;
    const id = data.id.toString().padStart(3, '0');
    const imagen = data.sprites.front_default;
    const habilidades = data.abilities.map(a => a.ability.name).join(', ');
    const tipos = data.types.map(t => t.type.name).join(', ');
    const altura = (data.height / 10).toFixed(2);
    const peso = (data.weight / 10).toFixed(2);
    const stats = data.stats.map(s => `${s.stat.name}: ${s.base_stat}`).join('<br>');

    resultado.innerHTML = `
      <div class="info">
        <strong>Nombre:</strong> ${nombre} <span style="color:#2980b9;">#${id}</span><br>
        <img src="${imagen}" alt="${nombre}"><br>
        <strong>Habilidades:</strong> ${habilidades}<br>
        <strong>Tipos:</strong> ${tipos}<br>
        <strong>Altura:</strong> ${altura} m<br>
        <strong>Peso:</strong> ${peso} kg<br>
      </div>
      <div class="stats-box">
        <strong>Estadísticas base:</strong><br>${stats}
      </div>
    `;
    document.getElementById('pokemonInput').value = '';
    sugerencias.innerHTML = '';
    sugerencias.style.display = 'none';
  } catch (error) {
    resultado.innerHTML = 'Pokémon no encontrado.';
  }
});

let listaPokemons = [];

async function cargarPokemons() {
  if (listaPokemons.length > 0) return;
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
  const data = await res.json();
  listaPokemons = data.results.map(p => p.name);
}

const input = document.getElementById('pokemonInput');
const sugerencias = document.getElementById('sugerencias');

input.addEventListener('input', async function() {
  await cargarPokemons();
  const valor = input.value.trim().toLowerCase();
  sugerencias.innerHTML = '';
  if (!valor) {
    sugerencias.style.display = 'none';
    return;
  }

  const filtrados = listaPokemons.filter(nombre => nombre.startsWith(valor)).slice(0, 8);
  if (filtrados.length === 0) {
    sugerencias.style.display = 'none';
    return;
  }

  sugerencias.innerHTML = filtrados.map(nombre => `<div class="sugerencia-item">${nombre}</div>`).join('');
  sugerencias.style.display = 'block';
});

sugerencias.addEventListener('click', function(e) {
  if (e.target.classList.contains('sugerencia-item')) {
    input.value = e.target.textContent;
    sugerencias.innerHTML = '';
    sugerencias.style.display = 'none';
  }
});
input.addEventListener('blur', () => {
  setTimeout(() => {
    sugerencias.innerHTML = '';
    sugerencias.style.display = 'none';
  },100); 
});