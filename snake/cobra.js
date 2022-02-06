// Jogo da Cobra (Snake Game)
// Autor: Jan Bodnar
// Adaptado por: Saulo Mélo e Pietro Gama
// Código fonte original: http://zetcode.com/javascript/snake/


// Declaração de variáveis e constantes

var tela;
var tela2;
var ctx;
var ctx2;
var score = 0;

var Current_player_id = " ";
var Current_player_score;

var jogadores;

if(!localStorage.getItem("jogador")){  // cria se n for criado

    jogadores = {

        nomes: [],
        pontos: [],
    }

    localStorage.setItem("jogador", JSON.stringify(jogadores))
}
else{  // pega o existente
    jogadores = JSON.parse(localStorage.getItem("jogador"))
    console.log(jogadores,"batata333");
}

var cabeca;
var maca;
var bola;

var vida = 5;
var comeu_maca = 0;

var segundos = 10;
var minutos = 1;
var tempo = "0" + minutos + " : " + segundos.toString().padStart(2, "0");

var pontos;
var maca_x = [];
var maca_y = [];

var pedra_x = [];
var pedra_y = [];
var quant_pedra = 0;
var quant_maca = 0;

var paraEsquerda;
var paraDireita;
var paraCima;
var paraBaixo;
var noJogo = true;


const C_ALTURA = 600;
const C_LARGURA = 600;
const TAMANHO_PONTO = 20;
const ALEATORIO_MAXIMO_X = ((C_LARGURA / 20) - 1);
const ALEATORIO_MAXIMO_Y = ((C_ALTURA / 20) - 1);
const ATRASO = 110;

const TECLA_ESQUERDA = 37;
const TECLA_DIREITA = 39;
const TECLA_ACIMA = 38;
const TECLA_ABAIXO = 40;

var x = [];
var y = [];

const fundo1 = new Audio('fundocerto.mp3');
const bateu = new Audio('perdeu.mp3');
const comeu = new Audio('mordida.mp3');
const baterpedra = new Audio('pedra.mp3');

onkeydown = verificarTecla; // Define função chamada ao se pressionar uma tecla

iniciar(); // Chama função inicial do jogo


// Definição das funções

fundo1.play();

function bater() {
    bateu.play();
}

function comer() {
    comeu.play();
}

function bateupedra() {
    baterpedra.play()
}

function iniciar() {
    tela = document.getElementById("tela");
    ctx = tela.getContext("2d");

    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, C_LARGURA, C_ALTURA);


    tela2 = document.getElementById("tela2");
    ctx2 = tela2.getContext("2d");

    ctx2.fillStyle = "gray";
    ctx2.fillRect(0, 0, 200, 600);

    direcaoInicial();
    carregarImagens();
    criarCobra();
    localizarMaca();
    localizarPedra();
    setTimeout("cicloDeJogo()", ATRASO);
    setInterval(timer, 1000);

}

function direcaoInicial() {      // define para qual direção a cobra vai iniciar

    var d = (Math.round(Math.random() * 3))    // resultados possíveis = 0, 1, 2, 3

    if (d == 0) {
        paraEsquerda = true;
        paraDireita = false;
        paraCima = false;
        paraBaixo = false;
    }
    else if (d == 1) {
        paraEsquerda = false;
        paraDireita = true;
        paraCima = false;
        paraBaixo = false;
    }
    else if (d == 2) {
        paraEsquerda = false;
        paraDireita = false;
        paraCima = true;
        paraBaixo = false;
    }
    else if (d == 3) {
        paraEsquerda = false;
        paraDireita = false;
        paraCima = false;
        paraBaixo = true;
    }
}

function carregarImagens() {
    cabeca = new Image();
    cabeca.src = "cabeca.png";

    bola = new Image();
    bola.src = "ponto.png";

    maca = new Image();
    maca.src = "maca.png";

    macascore = new Image();
    macascore.src = "macascore.png";

    pedra = new Image();
    pedra.src = "pedra.png";

    coracao = new Image();
    coracao.src = "coracao.png"
}

function criarCobra() {
    pontos = 3;

    for (var z = 0; z < pontos; z++) {
        x[z] = (C_LARGURA / 2) - z * TAMANHO_PONTO;
        y[z] = (C_ALTURA / 2);

    }
}

function portal() {  // permite a cobra passar de um lado para o outro da tela

    if (y[0] >= C_ALTURA) { // baixo
        y[0] = 0
        noJogo = true;
    }
    if (y[0] < 0) {  // cima
        y[0] = C_ALTURA
        noJogo = true;
    }
    if (x[0] >= C_LARGURA) {  // direita
        x[0] = 0
        noJogo = true;
    }
    if (x[0] < 0) {   // esquerda
        x[0] = C_LARGURA
        noJogo = true;
    }

}

function existe(x, y, vx, vy) {
    for (i = 0; i < vx.length; i++) {
        if (x == vx[i] && y == vy[i]) {
            return true;
        }
    }

    return false;
}

function localizarMaca() {  // cria a posição das 15 maçãs

    while (quant_maca < 15) {

        var rx = Math.floor(Math.random() * ALEATORIO_MAXIMO_X) * TAMANHO_PONTO;
        var ry = Math.floor(Math.random() * ALEATORIO_MAXIMO_Y) * TAMANHO_PONTO;

        var existe_maca = existe(rx, ry, maca_x, maca_y);

        if (!existe_maca) {
            maca_x[quant_maca] = rx;
            maca_y[quant_maca] = ry;
            quant_maca++;
        }
    }
}

function localizarPedra() {  // cria a posição das 10 pedras

    while (quant_pedra < 10) {

        var rx = Math.floor(Math.random() * ALEATORIO_MAXIMO_X) * TAMANHO_PONTO;
        var ry = Math.floor(Math.random() * ALEATORIO_MAXIMO_Y) * TAMANHO_PONTO;

        var existe_maca = existe(rx, ry, maca_x, maca_y);
        var existe_pedra = existe(rx, ry, pedra_x, pedra_y);

        if (!existe_maca && !existe_pedra) {
            pedra_x[quant_pedra] = rx;
            pedra_y[quant_pedra] = ry;
            quant_pedra++;
        }
    }
}

function cicloDeJogo() {  // executador de funções
    if (noJogo) {
        verificarMaca();
        verificarPedra();
        verificarVida();
        portal();
        verificarColisao();
        mover();
        fazerDesenho_ctx();
        fazerDesenho_ctx2()
        setTimeout("cicloDeJogo()", ATRASO);
        VerificarVitoria();

    }
    else {
        fazerDesenho_ctx2()
    }
}

function verificarMaca() {   // verifica se a maçã foi comida

    for (i = 0; i < 15; i++) {
        if ((x[0] == maca_x[i]) && (y[0] == maca_y[i])) {
            pontos++;
            score++;
            comeu_maca++;
            comer();
            maca_x[i] = 1001
            maca_y[i] = 0
        }
    }
}

function verificarPedra() {  // verifica se a cobrinha bateu na pedra

    for (i = 0; i < 10; i++) {
        if ((x[0] == pedra_x[i]) && (y[0] == pedra_y[i])) {

            vida--;
            bateupedra()
            pedra_x[i] = 1001
            pedra_y[i] = 0

        }
    }
}

function verificarColisao() {     // verifica se a cobrinha bateu nela mesma
    for (var z = pontos; z > 0; z--) {
        if ((z > 3) && (x[0] == x[z]) && (y[0] == y[z])) {
            fundo1.pause();
            bater();
            noJogo = false;
        }
    }
}

function mover() {    // faz a movimentação da cobra
    for (var z = pontos; z > 0; z--) {
        x[z] = x[z - 1];
        y[z] = y[z - 1];
    }

    if (paraEsquerda) {
        x[0] -= TAMANHO_PONTO;
    }

    if (paraDireita) {
        x[0] += TAMANHO_PONTO;
    }

    if (paraCima) {
        y[0] -= TAMANHO_PONTO;
    }

    if (paraBaixo) {
        y[0] += TAMANHO_PONTO;
    }
}


function fazerDesenho_ctx() {               //  cria o fundo das telas e imprime os textos da tela 2

    ctx.clearRect(0, 0, C_LARGURA, C_ALTURA);
    ctx.fillRect(0, 0, C_LARGURA, C_ALTURA);

    if (noJogo) {

        for (i = 0; i < 15; i++) {                  // desenha as maçãs e as pedras
            ctx.drawImage(maca, maca_x[i], maca_y[i]);
        }
        for (i = 0; i < 10; i++) {
            ctx.drawImage(pedra, pedra_x[i], pedra_y[i]);
        }

        for (var z = 0; z < pontos; z++) {
            if (z == 0) {
                ctx.drawImage(cabeca, x[z], y[z]);
            } else {
                ctx.drawImage(bola, x[z], y[z]);
            }
        }
    } else {
        fimDeJogo();
    }

}

function fazerDesenho_ctx2() {

    ctx2.fillStyle = "gray";
    ctx2.fillRect(0, 0, 200, 600);

    ctx2.font = 'normal bold 24px serif';
    ctx2.fillStyle = "white";

    ctx2.font = 'normal bold 24px serif';
    ctx2.fillStyle = "white";
    ctx2.fillText(tempo, 75, 60);

    ctx2.drawImage(macascore, 50, 120)               // desenha a maçã na tela 2
    ctx2.fillText("=   " + score, 110, 150);

    ctx2.drawImage(coracao, 50, 180)           // desenha o coração na tela 2
    ctx2.fillText("=   " + vida, 110, 210);
}

function bubbleSort(jogadores) {
    let n = jogadores.pontos.length;

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {

            if (jogadores.pontos[j] < jogadores.pontos[j + 1]) {

                jogadores.pontos = trocas(jogadores.pontos, j);
                jogadores.nomes = trocas(jogadores.nomes, j);
            }
        }
    }
    return {
        pontos: jogadores.pontos.slice(0, 5),
        nomes: jogadores.nomes.slice(0, 5),
    };
}

function trocas(array, j) {

    let t = array[j];
    array[j] = array[j + 1];
    array[j + 1] = t;

    return array;
}

function fimDeJogo() {                           // exibição da tela de fim de jogo (game over)
    ctx.clearRect(0, 0, C_LARGURA, C_ALTURA);
    ctx.fillRect(0, 0, C_LARGURA, C_ALTURA);

    ctx.fillStyle = "white";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.font = "normal bold 30px serif";
    ctx.fillText("Fim de Jogo", C_LARGURA / 2, C_ALTURA / 6);

    addJogador();
    mostraTabela();
}

function VerificarVitoria() {                         // exibição da tela de Vitoria

    if (score == 15) {

        noJogo = false;

        ctx.fillStyle = "black";
        ctx.clearRect(0, 0, C_LARGURA, C_ALTURA);
        ctx.fillRect(0, 0, C_LARGURA, C_ALTURA);

        ctx.fillStyle = "white";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.font = "normal bold 30px serif";
        ctx.fillText("Vitória", C_LARGURA / 2, C_ALTURA / 6);

        addJogador();
        mostraTabela();
    }
}

function addJogador() {

    while (Current_player_id.length != 3) {

        Current_player_id = prompt("Iniciais do jogador (apenas 3 letras)");
        Current_player_score = score;
    }

    jogadores.nomes.push(Current_player_id);
    jogadores.pontos.push(Current_player_score);

    jogadores = bubbleSort(jogadores);

    localStorage.setItem("jogador", JSON.stringify(jogadores))

    console.log(jogadores,"batata");
}

function mostraTabela(){

    let count = 64

    for(let i = 0; i < 5; i++){
        
        let nome = jogadores.nomes[i]
        let pontos = jogadores.pontos[i]
        let posicao = i + 1;


        ctx.fillStyle = "white";
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.font = "normal bold 28px serif";
        ctx.fillText(`${posicao}º  ${nome}  ${pontos}`, C_LARGURA/2, ((C_ALTURA ) / 4) + count);
        
        count += 52;
    }
}

function verificarVida() {      // verifica a adição de vidas e a falta de vida

    if (comeu_maca == 3) {
        vida++;
        comeu_maca = 0;
    }

    if (vida == 0) {
        noJogo = false;
        bater()
    }
}

function timer() {  // cria o timer no canto superior direito da tela

    if (segundos > 0 && minutos >= 0 && noJogo == true) {

        segundos--;

        if (segundos == 0) {
            minutos--;
            segundos = 59
        }

        var texto_minutos = minutos.toString().padStart(2, "0")
        var texto_segundos = segundos.toString().padStart(2, "0")


        if (segundos == 59 && minutos == -1) {


            fundo1.pause();
            bater();

            noJogo = false;
            fimDeJogo();

            texto_minutos = "00";
            texto_segundos = "00";

        }


        tempo = (texto_minutos + " : " + texto_segundos)
    }


    return tempo;
}

function verificarTecla(e) {  // verifica qual tecla foi pressionada pelo usuário e define a direção da cobrinha
    var tecla = e.keyCode;

    if ((tecla == TECLA_ESQUERDA) && (!paraDireita)) {
        paraEsquerda = true;
        paraCima = false;
        paraBaixo = false;
    }

    if ((tecla == TECLA_DIREITA) && (!paraEsquerda)) {
        paraDireita = true;
        paraCima = false;
        paraBaixo = false;
    }

    if ((tecla == TECLA_ACIMA) && (!paraBaixo)) {
        paraCima = true;
        paraDireita = false;
        paraEsquerda = false;
    }

    if ((tecla == TECLA_ABAIXO) && (!paraCima)) {
        paraBaixo = true;
        paraDireita = false;
        paraEsquerda = false;
    }
}