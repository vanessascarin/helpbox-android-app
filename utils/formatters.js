// Uma função simples que deixa o ID do ticket bonitinho
function formatarIdTicket(id) {
    if (!id) return 'N/A';
    return `TICKET-#${id}`;
}

module.exports = { formatarIdTicket };