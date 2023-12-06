var bd = {

    aportes: [ {investimentoInicial: '', aportesMensais: '', periodo: '', mesesAnos: ''} ],

    taxas: [
        {selicEfetiva: 12.65, cdi: 12.65, ipcaAno: 4.00, trMes: 0.0841},
        {selicEfetiva: '', cdi: '', ipcaAno: '', trMes: ''},
    ],

    retornos: [ {jurosNominalTesouro: 10.5, jurosRealTesouro: 5.5, taxaCustoriaTesouro: 0.2, rentabilidadePoupanca: 0.6070, rentabilidadeCdb: 100, rentabilidadeLciLca: 86},
    {jurosNominalTesouro: '', jurosRealTesouro: '', taxaCustoriaTesouro: '', rentabilidadePoupanca: '', rentabilidadeCdb: '', rentabilidadeLciLca: ''} ],

    resultado: [ {totalinvestido: '', poupanca: '', ipca: '', lcilca: '', cdb: '', tesouroSelic: '', tesouroPrefixado:'', tesouroIpca: ''} ]
}


function mostrarValores() {
    document.getElementById("selicAno").value = bd.taxas[0].selicEfetiva;
    document.getElementById("cdiAno").value = bd.taxas[0].cdi;
    document.getElementById("ipcaAno").value = bd.taxas[0].ipcaAno;
    document.getElementById("trMes").value = bd.taxas[0].trMes;

    document.getElementById("jurosNominalTesouro").value = bd.retornos[0].jurosNominalTesouro;
    document.getElementById("jurosRealTesouro").value = bd.retornos[0].jurosRealTesouro;
    document.getElementById("taxaCustoriaTesouro").value = bd.retornos[0].taxaCustoriaTesouro;
    document.getElementById("rentabilidadePoupanca").value = bd.retornos[0].rentabilidadePoupanca;
    document.getElementById("rentabilidadeCdb").value = bd.retornos[0].rentabilidadeCdb;
    document.getElementById("rentabilidadeLciLca").value = bd.retornos[0].rentabilidadeLciLca;
}

function addAporte() {

    let investimentoInicial = document.getElementById("investimentoInicial").value;
    let aportesMensais = document.getElementById("aportesMensais").value;
    let mesesAnos = document.getElementById("mesesAnos").value;
    let periodo = document.getElementById("periodo").value * mesesAnos;


    let aporte = {investimentoInicial: investimentoInicial, aportesMensais: aportesMensais, periodo: periodo};

    bd.aportes = aporte;

    console.log(bd.aportes);    
}

function addTaxas() {

    let slc = document.getElementById("selicAno").value;
    let cdn = document.getElementById("cdiAno").value;
    let pcn = document.getElementById("ipcaAno").value;
    let trm = document.getElementById("trMes").value;

    let txs = { selicEfetiva: slc, cdi: cdn, ipcaAno: pcn, trMes: trm };

    bd.taxas[1] = txs;

    console.log(bd.taxas);

}
 
function addRetorto() {
    let jurosNominalTesouro = document.getElementById("jurosNominalTesouro").value;
    let jurosRealTesouro = document.getElementById("jurosRealTesouro").value;
    let taxaCustoriaTesouro = document.getElementById("taxaCustoriaTesouro").value;
    let rentabilidadePoupanca = document.getElementById("rentabilidadePoupanca").value;
    let rentabilidadeCdb = document.getElementById("rentabilidadeCdb").value;
    let rentabilidadeLciLca = document.getElementById("rentabilidadeLciLca").value;

    let ret = { jurosNominalTesouro: jurosNominalTesouro, jurosRealTesouro: jurosRealTesouro, taxaCustoriaTesouro: taxaCustoriaTesouro, rentabilidadePoupanca: rentabilidadePoupanca, rentabilidadeCdb: rentabilidadeCdb, rentabilidadeLciLca: rentabilidadeLciLca };

    bd.retornos[1] = ret;

    console.log(bd.retornos);
}

function calcularPoupanca() {

    let investimentoInicial = parseFloat(bd.aportes.investimentoInicial);
    let aportesMensais = bd.aportes.aportesMensais;
    let periodo = parseInt(bd.aportes.periodo);
    let rentabilidadePoupanca = 1 + parseFloat(bd.retornos[1].rentabilidadePoupanca) / 100;
    let resultado = investimentoInicial;

    if (aportesMensais != 0) {

        aportesMensais = parseFloat(aportesMensais);

        for (let index = 0; index < periodo; index++) {
    
            resultado = resultado * rentabilidadePoupanca + aportesMensais;
        }
        
    }

    else
    {
        resultado = resultado * Math.pow(rentabilidadePoupanca, periodo);
    }

    bd.resultado[0].poupanca = resultado;

}

function calcularCorrecaoIPCA() {

    let investimentoInicial = parseFloat(bd.aportes.investimentoInicial);
    let aportesMensais = bd.aportes.aportesMensais;
    let periodo = parseInt(bd.aportes.periodo);
    let ipcaMes = 1 + parseFloat(bd.taxas[1].ipcaAno) / 1200;
    let resultado = investimentoInicial;


    if (aportesMensais != 0) {

        aportesMensais = parseFloat(aportesMensais);

        for (let index = 0; index < periodo; index++) {
    
            resultado = resultado * ipcaMes + aportesMensais;

        }
        
    }

    else
    {
        resultado = resultado * Math.pow(ipcaMes, periodo);
    }

    bd.resultado[0].ipca = resultado;
}

function calcularLcaLci() {
    
    let investimentoInicial = parseFloat(bd.aportes.investimentoInicial);
    let aportesMensais = bd.aportes.aportesMensais;
    let periodo = parseInt(bd.aportes.periodo);

    let opcaoLciLca = document.getElementById("DropdownLciLca").value;

    let cdiMes = 0;
    let rentabilidadeLciLca = 0;

    if (opcaoLciLca == 1) {
        
        cdiMes = parseFloat(bd.taxas[1].cdi) / 12;
        rentabilidadeLciLca = 1 + (parseFloat(bd.retornos[1].rentabilidadeLciLca) * cdiMes / 10000);

    }

    if (opcaoLciLca == 2) {
        cdiMes = parseFloat(bd.retornos[1].rentabilidadeLciLca) / 12;
        rentabilidadeLciLca = 1 + (cdiMes / 100);
    }

    if (opcaoLciLca == 3) {
        cdiMes = (parseFloat(bd.taxas[1].ipcaAno) + parseFloat(bd.retornos[1].rentabilidadeLciLca)) / 12;
        rentabilidadeLciLca = 1 + (cdiMes / 100);
    }


    let resultado = investimentoInicial;

    if (aportesMensais != 0) {

        aportesMensais = parseFloat(aportesMensais);

        for (let index = 0; index < periodo; index++) {
    
            resultado = resultado * rentabilidadeLciLca + aportesMensais;

        }
        
    }

    else
    {
        resultado = resultado * Math.pow(rentabilidadeLciLca, periodo);
    }

    bd.resultado[0].lcilca = resultado;

}

function calcularCdb() {
    let investimentoInicial = parseFloat(bd.aportes.investimentoInicial);
    let aportesMensais = bd.aportes.aportesMensais;
    let periodo = parseInt(bd.aportes.periodo);

    let totalInvestido = investimentoInicial;

    let resultado = investimentoInicial;

    let opcaoCdb = document.getElementById("DropdownCdb").value;

    let cdbMes = 0;

    let rentabilidadeCdb = 0;

    if (opcaoCdb == 1) {
        
        cdbMes = parseFloat(bd.taxas[1].cdi) / 12;

        rentabilidadeCdb = 1 + (parseFloat(bd.retornos[1].rentabilidadeCdb) * cdbMes / 10000);

    }

    if (opcaoCdb == 2) {
        cdbMes = parseFloat(bd.retornos[1].rentabilidadeCdb) / 12;

        rentabilidadeCdb = 1 + (cdbMes / 100);
    }

    if (opcaoCdb == 3) {
        cdbMes = (parseFloat(bd.taxas[1].ipcaAno) + parseFloat(bd.retornos[1].rentabilidadeCdb)) / 12;

        rentabilidadeCdb = 1 + (cdbMes / 100);
    }


    if (aportesMensais != 0) {

        aportesMensais = parseFloat(aportesMensais);

        for (let index = 0; index < periodo; index++) {
    
            resultado = resultado * rentabilidadeCdb + aportesMensais;

            totalInvestido = totalInvestido + aportesMensais;

        }
        
    }

    else
    {
        resultado = resultado * Math.pow(rentabilidadeCdb, periodo);
    }

    let impostoRenda = 0;

    if (periodo < 6) {
        impostoRenda = 0.775
    }

    else if (periodo >= 6 && periodo < 12) {
        impostoRenda = 0.8
    }

    else if (periodo >= 12 && periodo < 24) {
        impostoRenda = 0.825
    }

    else {
        impostoRenda = 0.85
    }


    impostoRenda =  (resultado - totalInvestido) * impostoRenda


    resultado = totalInvestido + impostoRenda


    bd.resultado[0].cdb = resultado;
}

function calcularTesouroSelic() {
    let investimentoInicial = parseFloat(bd.aportes.investimentoInicial);
    let aportesMensais = bd.aportes.aportesMensais;
    let periodo = parseInt(bd.aportes.periodo);

    let totalInvestido = investimentoInicial;

    let taxaCustodiaTesouroMes = parseFloat(bd.retornos[1].taxaCustoriaTesouro) / 1200;

    let selicMes = parseFloat(bd.taxas[1].selicEfetiva) / 12;

    let rentabilidadeTesouroSelic = 1 + (selicMes / 100);

    let resultado = investimentoInicial;

    if (aportesMensais != 0) {

        aportesMensais = parseFloat(aportesMensais);

        for (let index = 0; index < periodo; index++) {
    
            resultado = resultado * rentabilidadeTesouroSelic + aportesMensais;

            totalInvestido = totalInvestido + aportesMensais;

        }
        
    }

    else
    {
        resultado = resultado * Math.pow(rentabilidadeTesouroSelic, periodo);
    }

    let impostoRenda = 0;

    if (periodo < 6) {
        impostoRenda = 0.775
    }

    else if (periodo >= 6 && periodo < 12) {
        impostoRenda = 0.8
    }

    else if (periodo >= 12 && periodo < 24) {
        impostoRenda = 0.825
    }

    else {
        impostoRenda = 0.85
    }


    taxaCustodiaTesouroMes = resultado * taxaCustodiaTesouroMes * periodo;

    impostoRenda =(resultado - totalInvestido) * impostoRenda;


    resultado = totalInvestido + impostoRenda - taxaCustodiaTesouroMes;

    bd.resultado[0].tesouroSelic = resultado;
}

function calcularTesouroPrefixado(){

    let investimentoInicial = parseFloat(bd.aportes.investimentoInicial);
    let aportesMensais = bd.aportes.aportesMensais;
    let periodo = parseInt(bd.aportes.periodo);

    let totalInvestido = investimentoInicial;

    let taxaCustodiaTesouroMes = parseFloat(bd.retornos[1].taxaCustoriaTesouro) / 1200;

    let prefixadoMes = parseFloat(bd.retornos[1].jurosNominalTesouro) / 12;

    let rentabilidadeTesouroPrefixado = 1 + (prefixadoMes / 100);

    let resultado = investimentoInicial;

    if (aportesMensais != 0) {

        aportesMensais = parseFloat(aportesMensais);

        for (let index = 0; index < periodo; index++) {
    
            resultado = resultado * rentabilidadeTesouroPrefixado + aportesMensais;

            totalInvestido = totalInvestido + aportesMensais;

        }
        
    }

    else
    {
        resultado = resultado * Math.pow(rentabilidadeTesouroPrefixado, periodo);
    }

    let impostoRenda = 0;

    if (periodo < 6) {
        impostoRenda = 0.775
    }

    else if (periodo >= 6 && periodo < 12) {
        impostoRenda = 0.8
    }

    else if (periodo >= 12 && periodo < 24) {
        impostoRenda = 0.825
    }

    else {
        impostoRenda = 0.85
    }

    taxaCustodiaTesouroMes = resultado * taxaCustodiaTesouroMes * periodo;

    impostoRenda =(resultado - totalInvestido) * impostoRenda;


    resultado = totalInvestido + impostoRenda - taxaCustodiaTesouroMes;

    bd.resultado[0].tesouroPrefixado = resultado;

}

function calcularTesouroIpca(){

    let investimentoInicial = parseFloat(bd.aportes.investimentoInicial);
    let aportesMensais = bd.aportes.aportesMensais;
    let periodo = parseInt(bd.aportes.periodo);

    let totalInvestido = investimentoInicial;

    let taxaCustodiaTesouroMes = parseFloat(bd.retornos[1].taxaCustoriaTesouro) / 1200;

    let ipcaMaisMes = (parseFloat(bd.taxas[1].ipcaAno) + parseFloat(bd.retornos[1].jurosRealTesouro)) / 12;

    let rentabilidadeTesouroIpcaMais = 1 + (ipcaMaisMes / 100);

    let resultado = investimentoInicial;

    if (aportesMensais != 0) {

        aportesMensais = parseFloat(aportesMensais);

        for (let index = 0; index < periodo; index++) {
    
            resultado = resultado * rentabilidadeTesouroIpcaMais + aportesMensais;

            totalInvestido = totalInvestido + aportesMensais;

        }
        
    }

    else
    {
        resultado = resultado * Math.pow(rentabilidadeTesouroIpcaMais, periodo);
    }

    let impostoRenda = 0;

    if (periodo < 6) {
        impostoRenda = 0.775
    }

    else if (periodo >= 6 && periodo < 12) {
        impostoRenda = 0.8
    }

    else if (periodo >= 12 && periodo < 24) {
        impostoRenda = 0.825
    }

    else {
        impostoRenda = 0.85
    }

    taxaCustodiaTesouroMes = resultado * taxaCustodiaTesouroMes * periodo;

    impostoRenda =(resultado - totalInvestido) * impostoRenda;


    resultado = totalInvestido + impostoRenda - taxaCustodiaTesouroMes;

    bd.resultado[0].totalinvestido = totalInvestido;

    bd.resultado[0].tesouroIpca = resultado;
}


function exibirResultados() {
    tableResultados = document.getElementById("grid-resultados");

    tableResultados.innerHTML = "";

    tableResultados.innerHTML = `
                                <tr>
                                <th scope="col">Total Investido</th>
                                <td>R$ ${bd.resultado[0].totalinvestido.toFixed(2)}</td>
                                </tr>
                                <tr>
                                <th scope="col">Total Corrigido pelo IPCA</th>
                                <td>R$ ${bd.resultado[0].ipca.toFixed(2)}</td>
                                </tr> 
                                <tr>
                                <th scope="col">Poupança</th>
                                <td>R$ ${bd.resultado[0].poupanca.toFixed(2)}</td>
                                </tr>  
                                <tr>
                                <th scope="col">CDB</th>
                                <td>R$ ${bd.resultado[0].cdb.toFixed(2)}</td>
                                </tr>  
                                <tr>
                                <th scope="col">LCI/LCA</th>
                                <td>R$ ${bd.resultado[0].lcilca.toFixed(2)}</td>
                                </tr>
                                <tr>
                                <th scope="col">Tesouro Selic</th>
                                <td>R$ ${bd.resultado[0].tesouroSelic.toFixed(2)}</td>
                                </tr>
                                <tr>
                                <th scope="col">Tesouro Pré-fixado</th>
                                <td>R$ ${bd.resultado[0].tesouroPrefixado.toFixed(2)}</td>
                                </tr>
                                <tr>
                                <th scope="col">Tesouro Ipca+</th>
                                <td>R$ ${bd.resultado[0].tesouroIpca.toFixed(2)}</td>
                                </tr>`;
}


function calcularBotao(){
    addAporte();
    addTaxas();
    addRetorto();
    calcularPoupanca();
    calcularCorrecaoIPCA();
    calcularLcaLci();
    calcularCdb();
    calcularTesouroSelic();
    calcularTesouroPrefixado();
    calcularTesouroIpca();
    exibirResultados();
}


