    document
        .querySelector('header button') // Fazendo a ligação entre o JS e o HTML
        .addEventListener('click', function() { /* Adicionando um evento de "click" ao botão, e uma 
        ação a função. Tem que especificar qual a funcionalidade a ser adicionada. Quando ouvir o click
        ele vai realizar a função */
        document 
            .querySelector('.form') // Fazendo a ligação do formulário 
            .classList.toggle('hide') /* com o classList adiciono a classe que eu desejo que sofra a ação,
            e com o toggle (alternar, trocar) eu consigo alternar entre habilitar e desabilitar essa classe.
            Ou seja, ele faz e desfaz a ação. Nesse caso a classe é a hide. */

})