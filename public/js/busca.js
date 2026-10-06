const busca = document.getElementById('busca')
let temporizador
busca.addEventListener('input', () => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => {
        buscarDados(busca.value)
    }, 300)
})
const conCadastros = document.getElementById('container-cadastros')

async function buscarDados(texto) {
    try {
        const resposta = await fetch('/acesso/api/cadastros?busca=' + encodeURIComponent(texto))

        if(!resposta.ok){
            throw new Error('Erro na requisição: ' + resposta.status)
        }

        const dados = await resposta.json()

        desenharLista(dados)
    } catch (error) {
        console.error('Deu erro aqui: ', error)
        if(error){
            conCadastros.textContent = ''
            const msg = document.createElement('p')
            msg.classList.add('alerta', 'alerta-erro')
            msg.textContent = 'Não foi possível buscar os cadastros.'
            conCadastros.append(msg)
        }
    }
}

function desenharLista(cadastros){
    conCadastros.textContent = ''

    if(cadastros.length === 0){
        const msg = document.createElement('p')
        msg.classList.add('alerta', 'alerta-erro')
        msg.textContent = 'Não foi possível buscar os cadastros'
        conCadastros.append(msg)
        return
    }

    for(const cadastro of cadastros){
        const divBusca = document.createElement('div')
        const h2Busca = document.createElement('h2')
        const linkCadastro = document.createElement('a')

        h2Busca.textContent = cadastro.name

        linkCadastro.href = '/acesso/cadastro/' + cadastro.idcadastros
        linkCadastro.textContent = 'Ver cadastro'

        divBusca.append(h2Busca, linkCadastro)

        conCadastros.append(divBusca)
    }
}
