const { formatarIdTicket } = require('../utils/formatters');

// AQUI ESTÁ O SEU TESTE UNITÁRIO
test('Deve formatar o ID do ticket corretamente adicionando o prefixo', () => {
    const entrada = 123;
    const resultadoEsperado = 'TICKET-#123';

    const resultadoReal = formatarIdTicket(entrada);

    expect(resultadoReal).toBe(resultadoEsperado);
});