const apiUrl = 'https://jsonserverraquel.raquelsantos150.repl.co/meta'; 

function displayMessage(mensagem) {
    msg = document.getElementById('msg');
    msg.innerHTML = '<div class="alert alert-warning">' + mensagem + '</div>';
}

function readMeta(processaDados) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            processaDados(data);
        })
        .catch(error => {
            console.error('Erro ao ler metas via API JSONServer:', error);
            displayMessage("Erro ao ler metas");
        });
}

function createMeta(meta, refreshFunction) {
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(meta),
    })
        .then(response => response.json())
        .then(data => {
            displayMessage("Meta inserida com sucesso");
            if (refreshFunction)
                refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao inserir meta via API JSONServer:', error);
            displayMessage("Erro ao inserir meta");
        });
}

function updateMeta(id, meta, refreshFunction) {
    fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(meta),
    })
        .then(response => response.json())
        .then(data => {
            displayMessage("Meta alterada com sucesso");
            if (refreshFunction)
                refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao atualizar meta via API JSONServer:', error);
            displayMessage("Erro ao atualizar meta");
        });
}

function deleteMeta(id, refreshFunction) {
    fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            displayMessage("Meta removida com sucesso");
            if (refreshFunction)
                refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao remover meta via API JSONServer:', error);
            displayMessage("Erro ao remover meta");
        });
}