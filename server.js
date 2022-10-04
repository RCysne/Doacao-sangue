// CONFIGURANDO O SERVIDOR

// variável express pedindo ao NODE - NODE, pega no node_modules e colocar o express aqui nessa variável para eu poder manipulá-lo
const express = require("express");
// Criando a variável server e ela vai recerber a funcionalidade express, com isso trabalha para criar o servidor
const server = express();

// CONFIGURAR O SERVIDOR PARA APRESENTAR ARQUIVOS ESTÁTICOS NA PASTA PUBLIC
// "Express, eu preciso que arquivos estáticos fiquem numa pasta chamada public (criar pasta e colocar arquivos )"
// Os arquivos estáticos são os HTMLs, os CSSs e as imagens
server.use(express.static('public')) //"use" é uma funcionalidade

// Habilitar body (corpo) do formulário
//Express, sabe o urlencoded (funcionalidade já configurada), use as configurações existentes dele e extenda, utilize tudo que ele tem, e dentro desses poderes está o body
server.use(express.urlencoded({extended: true}))

// CONFIGURAR A CONEXÃO COM O BANCO DE DADOS
// Pool - é um tipo de conexão que mantém a conexão ativa, sem precisar ficar conectando e desconectando e sem ficar colocando a senha
const Pool = require('pg').Pool 

// db - Data Base nome escolhido para a variável e new Pool é uma forma de criar uma configuração para o Pool - e colocando um NEW no JS, você cria um novo objeto 
// Aqui criamos o objeto com todos os dados da conexão dentro do Pool e adicionando na variável db
// const db = {} - em vez de fazer dessa forma, com o new foi criado uma função recebendo um objeto
const db = new Pool({
    user: 'postgres',
    password: 'lu',
    host: 'localhost',
    port: 5432,
    database: 'doeSangue'
})


// CONFIGURANDO A TEMPLATE ENGINE - NÃO ESTÁ CONFIGURANDO O SERVIDOR, SOMENTE A TEMPLATE NESSES COMANDO ABAIXO

const nunjucks = require('nunjucks')
nunjucks.configure('./', { // nunjucks, meu arquivo html está na pasta raiz ./ e o caminho dele é esse objeto
    express: server, // propriedade e valor - nunjucks, você vai usar o express e aplicar o server nele
    noCache: true, //Boolean ou booleano e aqui ele tem o comando de não fazer o cache
})



/* Lista abaixo utilizada antes de criar o banco de dados. Nessa estratégia, como foi criado um banco de dados e os dados 
agora vem dele, essa lista de doadores ficou obsoleta

// AGRUPAMENTO DAS INFORMAÇÕES CAPTADAS E GERADAS NA TELA COMO OS ÚLTIMOS DOADORES
// A constante vai receber a informação dos 4 últimos doadores
// Lista de doadores - Vetor ou Array, recebendo os objetos

const doadores = [
    {
        nome: 'X',
        sangue: 'A+'
    },
    {
        nome: 'Y',
        sangue: 'O+'
    },
    {
        nome: 'Z',
        sangue: 'A+'
    },
] */


// CONFIGURAR A APRESENTAÇÃO DA PÁGINA E VERIFICANDO AS ROTAS, OS CAMINHOS

/* No server (127.0.0.1:3000) aparece a mensagem "Cannot Get /", mostrando o que está faltando e esse comando 
abaixo serve para adicionar a barra após a colocarção da barra, vamos adicionar uma funcionalidade que nesse 
caso é um req (requisição de algo), e um res(uma resposta dessa requisição). Na função vamos ter o retorno com
 a resposta e o envio dela (send). */
// Comando de pegar a barra e executar as funcionalidades que existem. Como a barra e a função como parâmetros
// troquei o send por RENDER e colocquei o caminho para ele renderizar (INDEX.HTML)
 server.get("/", function(req, res){ // nesse servidor foi utilizado o RES, tornando um servidor de resposta
    /*Variável trocada pela consulta do banco de dados abaixo -  const doadores = [] // essa variável abaixo {doadores} foi apagada, então ele criou um array vazio para na hora que o programa rode essa array, como está vazia ele passe direto */
    db.query("SELECT * FROM doadores", function (err, result) { // Consulta do banco de dados e uma função para chamar essa consulta e prever algum erro
        if (err) return res.send('Erro no banco de dados!');

        const doadores = result.rows; // Puxando o parâmetro da função, já que não aconteceu o erro, ele retorna um resultado da query que são as linhas (rows) do banco de dados com as informações das tabelas
        return res.render('index.html', {doadores}); // Objeto doadores colocado para que o ele seja lido pelo HTML quando for solicitado
    })
    
})

server.post('/', function(req, res){ // nesse servidor foi utilizado o REQ, que vai pegar, requisitar os dados do formulário
    // pegar dados do formulário
    const nome = req.body.nome;
    const email = req.body.email;
    const sangue = req.body.sangue;


    //REGRA DE NEGÓCIO PAR ANÃO ACESSAR O BANCO DE DADOS SEM AS INFORMAÇÕES DEVIDAMENTE PREENCHIDAS (para não gerar conflito)
    // Se o nome for igual a vazio, ou o email for igual a vazio, ou o sangue for igual a vazio
    if(nome == ""|| email == "" || sangue == ""){
    //Retorno uma resposta(res) e envio(send) a mensagem TODOS OS CAMPOS SÃO OBRIGATÓRIOS
        return res.send('TODOS OS CAMPOS SÃO OBRIGATÓRIOS!');
    }

    /* Funcionalidade também alterada. Os valores em vez de irem para dentro do array, agora vão para dentro do banco de dados abaixo
    // Colocando valores dentro do array   
    // Estrutura para mostrar os dados na tela - abaixo
    // Push é uma funcionalidade que está indo ao array e adicionando um novo valor que é um objeto (doadores), que em vez de colocar manualmente, ele coloca automaticamente
    doadores.push({
        nome: nome,
        sangue: sangue
    }) */

    // COLOCANDO OS VALORES NO BANCO DE DADOS
    // Utilizando a sintaxe de consulta (query).
    /* Para organizar melhor vou quebrar a sintaxe antiga abaixo, usando uma variável 
    db.query(`INSERT INTO doadores ("nome", "email", "sangue") VALUES ('estava faltando completar na hora da quebra')`) 
    // Consulta igual a utilizada no Postbird */
    const query = 
        `INSERT INTO doadores ("nome", "email", "sangue")
        VALUES ($1, $2, $3)`
        /* Nos valores da variável, posso colocar o sinal de dólar e os números de identificação, pois depois eu consigo 
        substituir esses valores na função query, colocando os parâmetro na hora de chamar a função */

    const values = [nome, email, sangue]
    db.query(query, values, function(err){
        // fluxo de erro - caso tenha alguma coisa digitada errada
        if (err) return res.send ('erro no banco de dados.')

        //fluxo ideal
        // Sempre tem que ter umas resposta, essa é de redirecionamento para a pasta raiz
        return res.redirect('/')
    })
    
    
})


// LIGAR O SERVIDOR E PERMITIR O ACESSO NA PORTA 3000


// 3000 é a porta. É como ele falasse: Server, escute a porta 3000.
/* colocando a funcionalidade listen (iniciando) o servidor. Posso também colocar uma funcionalidade como
 parâmetro, mas não é obrigatório. */


// AQUI É O FINAL, A ENTREGA DO SERVIDOR, A INICIAÇÃO DO SERVIDOR
 server.listen(3000, function(){
    console.log('Servidor iniciado.');
}) 
