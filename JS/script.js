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

    // Variáveis
    let franquias = {};
    let franquiaAtual = '';

    // Funções de dropdown
    franquiasBtn.addEventListener('click', () => {
        toggleDropdown(franquiasMenu);
        closeDropdown(progressaoMenu);
    });

    progressaoBtn.addEventListener('click', () => {
        toggleDropdown(progressaoMenu);
        closeDropdown(franquiasMenu);
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

    formFranquia.addEventListener('submit', (event) => {
        event.preventDefault();
        const franquiaName = franquiaNameInput.value.trim();
        if (franquiaName) {
            franquias[franquiaName] = [];
            atualizarListas();
            franquiaNameInput.value = '';
            franquiaForm.classList.remove('active');
        }
    });

    // Atualizar listas de franquias e progressão
    function atualizarListas() {
        atualizarListaFranquias();
        atualizarListaProgressao();
    }

    function atualizarListaFranquias() {
        listaFranquias.innerHTML = '';
        Object.keys(franquias).forEach((franquia, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${franquia}
                <button class="edit" data-index="${index}">Editar</button>
                <button class="remove" data-index="${index}">Remover</button>
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

    function atualizarListaProgressao() {
        listaProgressao.innerHTML = '';
        Object.keys(franquias).forEach(franquia => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${franquia}
                <button class="franquia-btn" onclick="abrirMenuLateral('${franquia}')">Gerenciar</button>
            `;
            listaProgressao.appendChild(li);
        });
    }

    // Funções de edição e remoção de franquia
    function editarFranquia(event) {
        const index = event.target.dataset.index;
        const franquiaSelecionada = Object.keys(franquias)[index];
        const novoNome = prompt('Editar nome da franquia:', franquiaSelecionada);
        if (novoNome && novoNome.trim()) {
            franquias[novoNome] = franquias[franquiaSelecionada];
            delete franquias[franquiaSelecionada];
            atualizarListas();
        }
    }

    function removerFranquia(event) {
        const index = event.target.dataset.index;
        const franquiaSelecionada = Object.keys(franquias)[index];
        delete franquias[franquiaSelecionada];
        atualizarListas();
    }

    // Menu lateral e jogos
    window.abrirMenuLateral = function(franquia) {
        franquiaAtual = franquia;
        franquiaSelecionada.textContent = `Franquia: ${franquia}`;
        atualizarListaJogos(franquia);
        menuLateral.classList.add('active');
    };

    formJogo.addEventListener('submit', (event) => {
        event.preventDefault();
        const jogoName = jogoNameInput.value.trim();
        if (jogoName) {
            franquias[franquiaAtual].push(jogoName);
            atualizarListaJogos(franquiaAtual);
            jogoNameInput.value = '';
        }
    });

    function atualizarListaJogos(franquia) {
        listaJogos.innerHTML = '';
        franquias[franquia].forEach((jogo, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${jogo}
                <div class="jogo-actions">
                    <button class="edit-jogo" data-index="${index}">Editar</button>
                    <button class="remove-jogo" data-index="${index}">Remover</button>
                </div>
            `;
            listaJogos.appendChild(li);
        });

        adicionarEventosLista('edit-jogo', editarJogo);
        adicionarEventosLista('remove-jogo', removerJogo);
    }

    function editarJogo(event) {
        const index = event.target.dataset.index;
        const jogoSelecionado = franquias[franquiaAtual][index];
        const novoNome = prompt('Editar nome do jogo:', jogoSelecionado);
        if (novoNome && novoNome.trim()) {
            franquias[franquiaAtual][index] = novoNome;
            atualizarListaJogos(franquiaAtual);
        }
    }

    function removerJogo(event) {
        const index = event.target.dataset.index;
        franquias[franquiaAtual].splice(index, 1);
        atualizarListaJogos(franquiaAtual);
    }

    // Fechar o menu lateral ao clicar fora
    document.addEventListener('click', (event) => {
        if (!event.target.closest('#menu-lateral') && !event.target.closest('.dropdown-menu')) {
            menuLateral.classList.remove('active');
        }
    });
});
