// URL Base da API Pública escolhida (Rick and Morty API)
const API_BASE_URL = 'https://rickandmortyapi.com/api/character';

// Elementos do DOM
const charactersGrid = document.getElementById('characters-grid');
const searchInput = document.getElementById('search-input');
const statusSelect = document.getElementById('status-select');
const btnSearch = document.getElementById('btn-search');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const pageIndicator = document.getElementById('page-indicator');
const loadingElement = document.getElementById('loading');
const noResultsElement = document.getElementById('no-results');

// Variáveis de Controle
let currentPage = 1;
let totalPages = 1;

// 1. Função Principal de Consumo da API usando fetch()
function fetchCharacters(page = 1) {
    const nameQuery = searchInput.value.trim();
    const statusQuery = statusSelect.value;

    // Constrói a URL com os parâmetros de busca
    let url = `${API_BASE_URL}/?page=${page}`;
    if (nameQuery) url += `&name=${encodeURIComponent(nameQuery)}`;
    if (statusQuery) url += `&status=${encodeURIComponent(statusQuery)}`;

    // Exibe estado de carregamento
    showLoading(true);
    clearGrid();

    // Requisição via Fetch API
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Personagem não encontrado ou erro na requisição');
            }
            return response.json();
        })
        .then(data => {
            showLoading(false);
            totalPages = data.info.pages;
            currentPage = page;
            updatePaginationUI();
            
            // Renderiza os dados retornados
            renderCards(data.results);
        })
        .catch(error => {
            showLoading(false);
            showNoResults(true);
            console.warn('Erro ao carregar dados:', error.message);
        });
}

// 2. Manipulação Dinâmica do DOM (document.createElement + appendChild)
function renderCards(characters) {
    showNoResults(false);

    characters.forEach(character => {
        // Criação da estrutura do Card
        const card = document.createElement('article');
        card.classList.add('card');

        // Imagem do Personagem
        const img = document.createElement('img');
        img.classList.add('card-image');
        img.src = character.image;
        img.alt = `Foto de ${character.name}`;

        // Conteúdo do Card
        const content = document.createElement('div');
        content.classList.add('card-content');

        // Título / Nome
        const title = document.createElement('h3');
        title.classList.add('card-title');
        title.textContent = character.name;

        // Badge de Status
        const statusBadge = document.createElement('div');
        statusBadge.classList.add('status-badge');

        const statusDot = document.createElement('span');
        statusDot.classList.add('status-dot');
        
        // Define a cor da bolinha de acordo com o status
        if (character.status.toLowerCase() === 'alive') {
            statusDot.classList.add('status-alive');
        } else if (character.status.toLowerCase() === 'dead') {
            statusDot.classList.add('status-dead');
        } else {
            statusDot.classList.add('status-unknown');
        }

        const statusText = document.createElement('span');
        statusText.textContent = `${character.status} - ${character.species}`;

        statusBadge.appendChild(statusDot);
        statusBadge.appendChild(statusText);

        // Origem
        const originLabel = document.createElement('span');
        originLabel.classList.add('card-info-label');
        originLabel.textContent = 'Origem:';

        const originValue = document.createElement('p');
        originValue.classList.add('card-info-value');
        originValue.textContent = character.origin.name;

        // Anexa os elementos criados ao Container
        content.appendChild(title);
        content.appendChild(statusBadge);
        content.appendChild(originLabel);
        content.appendChild(originValue);

        card.appendChild(img);
        card.appendChild(content);

        // Anexa o card completo ao Grid Principal no DOM
        charactersGrid.appendChild(card);
    });
}

// Funções Auxiliares de UI
function clearGrid() {
    charactersGrid.innerHTML = '';
}

function showLoading(isLoading) {
    loadingElement.style.display = isLoading ? 'block' : 'none';
}

function showNoResults(isNoResults) {
    noResultsElement.style.display = isNoResults ? 'block' : 'none';
    if (isNoResults) {
        btnPrev.disabled = true;
        btnNext.disabled = true;
        pageIndicator.textContent = 'Página 0 de 0';
    }
}

function updatePaginationUI() {
    pageIndicator.textContent = `Página ${currentPage} de ${totalPages}`;
    btnPrev.disabled = currentPage === 1;
    btnNext.disabled = currentPage >= totalPages;
}

// Event Listeners
btnSearch.addEventListener('click', () => fetchCharacters(1));

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchCharacters(1);
    }
});

btnPrev.addEventListener('click', () => {
    if (currentPage > 1) {
        fetchCharacters(currentPage - 1);
    }
});

btnNext.addEventListener('click', () => {
    if (currentPage < totalPages) {
        fetchCharacters(currentPage + 1);
    }
});

// Inicialização: Carrega a primeira página ao abrir a aplicação
document.addEventListener('DOMContentLoaded', () => {
    fetchCharacters(1);
});