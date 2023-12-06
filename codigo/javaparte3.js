(async function() {
    var bancos;

     function carregarBancos() {
        try {
            console.log('Iniciando carregarBancos...');
            const response = await fetch('jasonparte3.json');
            bancos = await response.json();
            
            const selectBanco = document.getElementById('banco');
    
            bancos.forEach(banco => {
                const option = document.createElement('option');
                option.value = banco.codigo;
                option.text = `${banco.nome} (${(banco.taxaJurosAoMes * 100).toFixed(2)}%)`;
                selectBanco.appendChild(option);
            });
            
            console.log('Bancos carregados com sucesso:', bancos);
        } catch (error) {
            console.error('Erro ao carregar bancos:', error);
        }
    }

    function formatarMoeda(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function calcularEmprestimo() {
        console.log('Iniciando calcularEmprestimo...');
        if (!bancos) {
            alert('Bancos não carregados. Tente novamente.');
            return;
        }

        var valor = parseFloat(document.getElementById('valor').value);
        var parcelas = parseInt(document.getElementById('parcelas').value);
        var codigoBanco = document.getElementById('banco').value;

        const banco = bancos.find(b => b.codigo === codigoBanco);

        if (!banco) {
            alert('Banco não encontrado.');
            return;
        }

        var taxaJurosAoMes = banco.taxaJurosAoMes;

        var valorTotal = valor * Math.pow((1 + taxaJurosAoMes), parcelas);
        var valorParcela = valorTotal / parcelas;

        var resultado = "Banco: " + banco.nome +
                        "<br>Valor do Empréstimo: " + formatarMoeda(valor) +
                        "<br>Número de Parcelas: " + parcelas +
                        "<br>Valor Total a Pagar: " + formatarMoeda(valorTotal) +
                        "<br>Valor da Parcela: " + formatarMoeda(valorParcela);

        document.getElementById('resultado').innerHTML = resultado;

        console.log('Emprestimo calculado com sucesso:', resultado);
    }

    console.log('Chamou iniciarSimulador()');
    await carregarBancos();

    document.querySelector('button').addEventListener('click', calcularEmprestimo);
})();


