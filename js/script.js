let enderecoCompleto = {};

async function buscarCep() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    const url = `https://viacep.com.br/ws/${cep}/json/`;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();

        if (dados.erro) {
            alert("CEP não foi encontrado.");
        } else {
            enderecoCompleto = {
                logradouro: dados.logradouro,
                bairro: dados.bairro,
                cidade: dados.localidade,
                estado: dados.uf
            };

            document.getElementById('logradouro').value = enderecoCompleto.logradouro;
            document.getElementById('bairro').value = enderecoCompleto.bairro;
            document.getElementById('cidade').value = enderecoCompleto.cidade;
            document.getElementById('uf').value = enderecoCompleto.estado;
        }
    } catch (error) {
        alert('Erro ao buscar CEP');
    }
}

async function buscarCoord() {
    const numero = document.getElementById('num').value;

    if (!numero || !enderecoCompleto.logradouro) {
        alert("Preencha o CEP e busque o endereço.");
        return;
    }

    const enderecoBusca = `${enderecoCompleto.logradouro} ${numero}, ${enderecoCompleto.cidade} ${enderecoCompleto.estado}`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(enderecoBusca)}&format=json`;

    try {
        const resposta = await fetch(url, {
            headers: {
                'User-Agent': 'ExemploUsoApi/1.0'
            }
        });

        const dados = await resposta.json();
        const divResultado = document.getElementById('resultado');
        divResultado.innerHTML = '';

        if (dados.length > 0) {
            const local = dados[0];
            const lat = local.lat;
            const long = local.lon;

            divResultado.innerHTML = `
                <p><strong>Endereço completo:</strong> ${local.display_name}</p>
                <p><strong>Latitude:</strong> ${lat}</p>
                <p><strong>Longitude:</strong> ${long}</p>
            `;

            buscarTemp(lat, long);
        } else {
            divResultado.innerHTML = `<p>Endereço não encontrado</p>`;
        }
    } catch (erro) {
        alert('Erro ao carregar localização');
    }
}

async function buscarTemp(lat, long) {
    const url_temp = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current_weather=true`

    try {
        const resposta = await fetch(url_temp);
        const dados_temp = await resposta.json();

        if (dados_temp.erro) {
            alert("Coordenadas não encontradas!");
        } else {
            const temperatura = dados_temp.current_weather.temperature

            document.getElementById('resultado').innerHTML += `
            <p><strong>Temperatura:</strong> ${temperatura}°C</p>
            `;
        }
    } catch (erro) {
        document.getElementById('resultado').innerHTML += `
            <p><strong>Temperatura não encontrada</strong></p>
            `;
    }

}