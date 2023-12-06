document.getElementById('mobile-menu').addEventListener('click', function() {
    var navbarMenu = document.querySelector('.navbar-menu');
    navbarMenu.classList.toggle('active');
});

document.getElementById('finance-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Obter os valores do formulário
    var date = document.getElementById('date').value;
    var category = document.getElementById('category').value;
    var description = document.getElementById('description').value;
    var amount = parseFloat(document.getElementById('amount').value);
    var type = document.getElementById('type').value;

    // Criar o objeto com os dados
    var financeData = { date, category, description, amount, type };

    // Enviar os dados para o servidor JSON
    await fetch('https://jsonserver.luizsaud.repl.co/finances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(financeData)
    });

    // Atualizar a tabela
    fetchAndDisplayFinances();

    // Limpar o formulário
    document.getElementById('finance-form').reset();

    fetchAndPopulateFilters();


});

function checkNewCategory() {
    var categorySelect = document.getElementById('category');
    var newCategoryContainer = document.getElementById('new-category-container');
    
    if (categorySelect.value === 'add-new') {
        newCategoryContainer.style.display = 'block';
    } else {
        newCategoryContainer.style.display = 'none';
    }
}

async function addNewCategory() {
    var newCategoryName = document.getElementById('new-category').value;
    if (newCategoryName) {
        // Enviar a nova categoria para o servidor
        await fetch('https://jsonserver.luizsaud.repl.co/categorias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newCategoryName })
        });

        // Limpar o campo e esconder o container
        document.getElementById('new-category').value = '';
        document.getElementById('new-category-container').style.display = 'none';

        // Atualizar a lista de categorias
        fetchAndPopulateFilters();

        // Atualizar a lista de categorias no formulário
        loadCategories();
        
    }
}

async function loadCategories() {
    const response = await fetch('https://jsonserver.luizsaud.repl.co/categories');
    const categories = await response.json();

    const categorySelect = document.getElementById('category');
    categorySelect.innerHTML = '<option value="">Escolha uma Categoria</option>';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

// Chame essa função ao carregar a página
loadCategories();
/*
async function fetchAndDisplayFinances() {
    const response = await fetch('https://jsonserver.luizsaud.repl.co/finances');
    const finances = await response.json();

    const tableBody = document.getElementById('finance-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Limpar a tabela

    let total = 0;

    finances.forEach(finance => {
        const row = tableBody.insertRow();
        const amount = finance.type === 'income' ? finance.amount : -finance.amount;
        total += amount;

        row.innerHTML = `
            <td>${finance.date}</td>
            <td>${finance.description}</td>
            <td>${finance.category}</td>
            <td class="${finance.type === 'income' ? 'value-income' : 'value-expense'}">${finance.amount.toFixed(2)}</td>
        `;
    });

    // Adicionar linha com o total
    const totalRow = tableBody.insertRow();
    totalRow.innerHTML = `
        <td colspan="3">Total</td>
        <td class="${total >= 0 ? 'value-income' : 'value-expense'}">${total.toFixed(2)}</td>
        <td colspan="2"></td>
    `;
}
*/
// Não se esqueça de chamar fetchAndDisplayFinances para carregar os dados inicialmente
fetchAndDisplayFinances();

async function fetchAndPopulateFilters() {
    const response = await fetch('https://jsonserver.luizsaud.repl.co/finances');
    const finances = await response.json();

    const dates = new Set();
    const categories = new Set();

    finances.forEach(finance => {
        dates.add(finance.date);
        categories.add(finance.category);
    });

    populateFilterOptions('filter-date', dates);
    populateFilterOptions('filter-category', categories);
}

function populateFilterOptions(filterId, optionsSet) {
    const filter = document.getElementById(filterId);
    filter.innerHTML = '<option value="">Selecione</option>';
    optionsSet.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        filter.appendChild(optionElement);
    });
}

// Chame essa função ao carregar a página
fetchAndPopulateFilters();


document.getElementById('apply-filters').addEventListener('click', () => {
    fetchAndDisplayFinances();
});

async function fetchAndDisplayFinances() {
    const response = await fetch('https://jsonserver.luizsaud.repl.co/finances');
    let finances = await response.json();

    // Aplicar Filtros
    const filterDate = document.getElementById('filter-date').value;
    const filterCategory = document.getElementById('filter-category').value;
    const filterType = document.getElementById('filter-type').value;

    if (filterDate) {
        finances = finances.filter(finance => finance.date === filterDate);
    }
    if (filterCategory) {
        finances = finances.filter(finance => finance.category === filterCategory);
    }
    if (filterType) {
        finances = finances.filter(finance => finance.type === filterType);
    }

    // Aplicar Ordenação
    const sortOption = document.getElementById('sort-option').value;
    if (sortOption) {
        finances.sort((a, b) => {
            if (sortOption === 'date') {
                return new Date(a.date) - new Date(b.date);
            } else if (sortOption === 'category') {
                return a.category.localeCompare(b.category);
            } else if (sortOption === 'type') {
                return a.type.localeCompare(b.type);
            }
        });
    }

    // Atualizar Tabela
    updateFinanceTable(finances);
}

function updateFinanceTable(finances) {
    const tableBody = document.getElementById('finance-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Limpar a tabela

    let total = 0;

    finances.forEach(finance => {
        const row = tableBody.insertRow();
        const amount = finance.type === 'income' ? finance.amount : -finance.amount;
        total += amount;
        
        row.innerHTML = `
            <td>${finance.date}</td>
            <td>${finance.description}</td>
            <td>${finance.category}</td>
            <td class="${finance.type === 'income' ? 'value-income' : 'value-expense'}">${finance.amount.toFixed(2)}</td>
            <td><button class="delete-btn" data-id="${finance.id}">Deletar</button></td>
            `;
    });
            // Adicionar linha com o total
        const totalRow = tableBody.insertRow();
        totalRow.innerHTML = `
        <td colspan="4">Saldo</td>
        <td class="${total >= 0 ? 'value-income' : 'value-expense'}">${total.toFixed(2)}</td>
    `;

}

fetchAndDisplayFinances(); // Chamar esta função para carregar os dados inicialmente

async function deleteFinance(id) {
    await fetch(`https://jsonserver.luizsaud.repl.co/finances/${id}`, {
        method: 'DELETE'
    });

    fetchAndDisplayFinances(); // Atualizar a tabela após a exclusão
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-btn')) {
        const id = event.target.getAttribute('data-id');
        deleteFinance(id);
    }
});

// Abra o modal ao clicar no botão
document.getElementById('open-modal').addEventListener('click', function() {
    document.getElementById('category-modal').style.display = 'block';
});

// Feche o modal ao clicar no botão "X"
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('category-modal').style.display = 'none';
});

// Adicione a nova categoria ao clicar no botão "Adicionar" dentro do modal
document.getElementById('add-category').addEventListener('click', async function() {
    const newCategoryInput = document.getElementById('new-category');
    const newCategory = newCategoryInput.value.trim(); // Obtenha o valor da nova categoria

    if (newCategory === '') {
        alert('Por favor, insira um nome válido para a nova categoria.');
        return;
    }

    // Crie um objeto com a nova categoria
    const newCategoryObj = { name: newCategory, id: newCategory.toLowerCase() };

    // Envie os dados da nova categoria para o servidor JSON
    await fetch('https://jsonserver.luizsaud.repl.co/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategoryObj)
    });

    // Atualize a lista de categorias
    loadCategories();

    fetchAndPopulateFilters();

    fetchAndDisplayFinances();

    // Limpe o campo de entrada da nova categoria
    newCategoryInput.value = '';

    // Feche o modal
    document.getElementById('category-modal').style.display = 'none';
});