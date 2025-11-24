const bcrypt = require('bcrypt');

const senhaParaCriptografar = '123456'; // A senha que você quer usar
const saltRounds = 10;

console.log('Gerando hash para a senha:', senhaParaCriptografar);

bcrypt.hash(senhaParaCriptografar, saltRounds, function(err, hash) {
    if (err) {
        console.error(err);
    } else {
        console.log('--------------------------------------------------');
        console.log('COPIE O CÓDIGO ABAIXO E COLE NO SQL SERVER:');
        console.log(hash);
        console.log('--------------------------------------------------');
    }
});