document.addEventListener('DOMContentLoaded', () => {
    // Dropdowns
    const franquiasBtn = document.getElementById('franquias-btn');
    const progressaoBtn = document.getElementById('progressao-btn');
    const franquiasMenu = document.getElementById('franquias-menu');
    const progressaoMenu = document.getElementById('progressao-menu');

    // Formulários e listas
    const adicionarFranquiaBtn = document.getElementById('adicionar-franquia');
    const franquiaForm = document.getElementById('franquia-form');
    const listaFranquias = document.getElementById('lista-franquias');
    const listaProgressao = document.getElementById('lista-progressao');
    const formFranquia = document.getElementById('form-franquia');
    const franquiaNameInput = document.getElementById('franquia-name');

    // Menu lateral
    const menuLateral = document.getElementById('menu-lateral');
    const franquiaSelecionada = document.getElementById('franquia-selecionada');
    const formJogo = document.getElementById('form-jogo');
    const jogoNameInput = document.getElementById('jogo-name');
    const listaJogos = document.getElementById('lista-jogos');

    // Botão de fechar o menu lateral
    const fecharMenuLateralBtn = document.getElementById('fechar-menu-lateral');

    // Variáveis
    let franquias = {};  // Armazena as franquias e seus jogos com status de progresso
    let franquiaAtual = '';  // Armazena a franquia atual selecionada

    // Funções de dropdown
    franquiasBtn.addEventListener('click', () => {
        toggleDropdown(franquiasMenu);
        closeDropdown(progressaoMenu);
    });

    progressaoBtn.addEventListener('click', () => {
        toggleDropdown(progressaoMenu);
        closeDropdown(franquiasMenu);
        atualizarListaProgressao();  // Atualiza a lista de progressão ao abrir
    });

    function toggleDropdown(menu) {
        menu.classList.toggle('active');
    }

    function closeDropdown(menu) {
        menu.classList.remove('active');
    }

    // Formulário de franquia
    adicionarFranquiaBtn.addEventListener('click', () => {
        franquiaForm.classList.toggle('active');
    });

    // Atualizar listas de franquias e progressão
    function atualizarListas() {
        atualizarListaFranquias();
        atualizarListaProgressao();  // Certifique-se de atualizar a lista de progressão aqui também!
        salvarFranquias();  // Salva as franquias no localStorage
    }

    function atualizarListaFranquias() {
        listaFranquias.innerHTML = '';
        Object.keys(franquias).forEach((franquia, index) => {
            const li = document.createElement('li');
            li.classList.add('franquia-entry');
            li.innerHTML = `
                <strong>${franquia}</strong>
                <div class="franquia-actions">
                    <button class="edit" data-index="${index}">Editar</button>
                    <button class="remove" data-index="${index}">Remover</button>
                </div>
            `;
            listaFranquias.appendChild(li);
        });

        adicionarEventosLista('edit', editarFranquia);
        adicionarEventosLista('remove', removerFranquia);
    }

    function adicionarEventosLista(classe, callback) {
        document.querySelectorAll(`.${classe}`).forEach(button => {
            button.addEventListener('click', callback);
        });
    }

    // Função unificada para atualizar a lista de progressão
    function atualizarListaProgressao() {
        listaProgressao.innerHTML = '';  // Limpa a lista de progressão

        Object.keys(franquias).forEach(franquia => {
            const li = document.createElement('li');
            li.classList.add('progressao-entry');  // Usando a classe exclusiva de progressão
            li.innerHTML = `
                <strong>${franquia}</strong>
                <button class="abrir-menu-lateral" data-franquia="${franquia}">Ver Jogos</button>
            `;
            listaProgressao.appendChild(li);
        });

        // Adiciona eventos aos botões "Ver Jogos" para abrir o menu lateral
        document.querySelectorAll('.abrir-menu-lateral').forEach(button => {
            button.addEventListener('click', (event) => {
                const franquia = event.target.dataset.franquia;
                abrirMenuLateral(franquia);  // Abre o menu lateral para a franquia
            });
        });

        // Adiciona eventos aos botões de edição de status
        adicionarEventosLista('editar-status', editarStatusJogo);
    }

    // Função para atualizar a lista de jogos no menu lateral
    function atualizarListaJogos(franquia) {
        listaJogos.innerHTML = '';  // Limpa a lista de jogos

        franquias[franquia].forEach((jogo, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${jogo.nome}
                <div class="status-jogo">${jogo.status}</div>
                <div class="jogo-actions">
                    <button class="editar-status" data-index="${index}">Editar Status</button>
                    <button class="remove-jogo" data-index="${index}">Remover</button>
                    <button class="editar-nome" data-index="${index}">Editar Nome</button>
                </div>
            `;
            listaJogos.appendChild(li);
        });

        adicionarEventosLista('editar-status', editarStatusJogo);  // Adiciona eventos aos botões de edição de status
        adicionarEventosLista('remove-jogo', removerJogo);  // Adiciona eventos aos botões de remoção de jogo
        adicionarEventosLista('editar-nome', editarNomeJogo);  // Adiciona eventos para editar o nome
    }

    // Função para editar o status de um jogo
    function editarStatusJogo(event) {
        const index = event.target.dataset.index;
        const novoStatus = prompt('Digite o novo status para o jogo:', franquias[franquiaAtual][index].status);

        if (novoStatus && novoStatus.trim()) {
            franquias[franquiaAtual][index].status = novoStatus;  // Atualiza o status do jogo
            atualizarListaJogos(franquiaAtual);  // Atualiza a lista de jogos no menu lateral
            salvarFranquias();  // Salva as franquias e jogos no localStorage
            mostrarNotificacao('Status atualizado com sucesso!');
        }
    }

    // Função para remover um jogo
    function removerJogo(event) {
        const index = event.target.dataset.index;
        franquias[franquiaAtual].splice(index, 1);  // Remove o jogo da franquia
        atualizarListaJogos(franquiaAtual);  // Atualiza a lista de jogos
        atualizarListaProgressao();  // Atualiza a lista de progressão
        salvarFranquias();  // Salva no localStorage
    }

    // Função para editar o nome do jogo
    function editarNomeJogo(event) {
        const index = event.target.dataset.index;
        const novoNome = prompt('Digite o novo nome do jogo:', franquias[franquiaAtual][index].nome);

        if (novoNome && novoNome.trim()) {
            franquias[franquiaAtual][index].nome = novoNome;  // Atualiza o nome do jogo
            atualizarListaJogos(franquiaAtual);  // Atualiza a lista de jogos no menu lateral
            salvarFranquias();  // Salva as franquias e jogos no localStorage
            mostrarNotificacao('Nome do jogo atualizado com sucesso!');
        }
    }

    // Função para editar uma franquia
    function editarFranquia(event) {
        const index = event.target.dataset.index;
        const franquiaSelecionada = Object.keys(franquias)[index];
        const novoNome = prompt('Editar nome da franquia:', franquiaSelecionada);

        if (novoNome && novoNome.trim()) {
            // Evitar duplicação de franquias com o mesmo nome
            if (franquias[novoNome]) {
                alert('Já existe uma franquia com esse nome!');
                return;
            }

            franquias[novoNome] = franquias[franquiaSelecionada]; // Transferir jogos para o novo nome
            delete franquias[franquiaSelecionada]; // Remover a franquia antiga
            atualizarListas();  // Atualizar as listas com o novo nome
        }
    }

    // Função para remover uma franquia
    function removerFranquia(event) {
        const index = event.target.dataset.index;
        const franquiaSelecionada = Object.keys(franquias)[index];

        // Verifica se a franquia atual é a que está sendo removida e fecha o menu lateral se for o caso
        if (franquiaSelecionada === franquiaAtual) {
            menuLateral.classList.remove('active');  // Fecha o menu lateral
        }    
        
        delete franquias[franquiaSelecionada];  // Remove a franquia
        
        atualizarListas();  // Atualiza as listas
        salvarFranquias();  // Salva no localStorage
    }    

    // Função para abrir o menu lateral com os jogos da franquia selecionada
    function abrirMenuLateral(franquia) {
        franquiaAtual = franquia;  // Define a franquia atual
        franquiaSelecionada.textContent = `Franquia: ${franquia}`;  // Atualiza o nome no menu lateral
        atualizarListaJogos(franquia);  // Atualiza a lista de jogos
        menuLateral.classList.add('active');  // Exibe o menu lateral
    }

    // Fecha o menu lateral ao clicar no botão "Fechar"
    fecharMenuLateralBtn.addEventListener('click', () => {
        menuLateral.classList.remove('active');
    });
    
    // Função para salvar franquias e jogos no localStorage
    function salvarFranquias() {
        localStorage.setItem('franquias', JSON.stringify(franquias));  // Armazena as franquias e seus jogos no localStorage
    }

    // Função para carregar franquias e jogos do localStorage
    function carregarFranquias() {
        const franquiasSalvas = localStorage.getItem('franquias');
        if (franquiasSalvas) {
            franquias = JSON.parse(franquiasSalvas);  // Converte de volta para objeto
            atualizarListas();  // Atualiza as listas de franquias e progressão
        }
    }

    // Lida com o envio do formulário de franquia
    formFranquia.addEventListener('submit', (event) => {
        event.preventDefault();
        const franquiaName = franquiaNameInput.value.trim();
        if (franquiaName && !franquias[franquiaName]) {  // Verifica se a franquia não existe
            franquias[franquiaName] = [];  // Adiciona franquia com lista de jogos vazia
            atualizarListas();  // Atualiza as listas de franquias e progressão
            franquiaNameInput.value = '';  // Limpa o campo de input
            franquiaForm.classList.remove('active');
            salvarFranquias();  // Salva no localStorage
            mostrarNotificacao('Franquia adicionada com sucesso!');
        } else {
            mostrarNotificacao('Essa franquia já existe ou o nome está vazio!', 'erro');
        }
    });

    // Ao adicionar um jogo, chama salvarFranquias para garantir a persistência dos dados
    formJogo.addEventListener('submit', (event) => {
        event.preventDefault();
        const jogoName = jogoNameInput.value.trim();
        if (jogoName && !franquias[franquiaAtual].some(jogo => jogo.nome === jogoName)) {  // Verifica se o jogo já existe
            franquias[franquiaAtual].push({ nome: jogoName, status: 'Em progresso' });  // Adiciona o jogo com status padrão
            atualizarListaJogos(franquiaAtual);  // Atualiza a lista de jogos
            atualizarListaProgressao();  // Atualiza a lista de progressão
            jogoNameInput.value = '';  // Limpa o campo de input
            salvarFranquias();  // Salva no localStorage
            mostrarNotificacao('Jogo adicionado com sucesso!');
        } else {
            mostrarNotificacao('Esse jogo já existe ou o nome está vazio!', 'erro');
        }
    });

    // Função de notificação
    function mostrarNotificacao(mensagem, tipo = '') {
        const notificacao = document.createElement('div');
        notificacao.textContent = mensagem;
        notificacao.classList.add('notificacao');
        if (tipo === 'erro') {
            notificacao.classList.add('erro');
        }
        document.body.appendChild(notificacao);
        setTimeout(() => {
            notificacao.remove();
        }, 5000);  // Remove após 3 segundos
    }

    // Carrega as franquias e jogos ao iniciar a página
    document.addEventListener('DOMContentLoaded', carregarFranquias);

    // Carrega as franquias do localStorage ao carregar a página
    carregarFranquias();

});