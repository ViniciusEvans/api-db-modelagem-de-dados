const express = require('express');
const usuario = require("./controllers/usuarios");
const produto = require("./controllers/produtos");
const verificarLogin = require('./controllers/loginVerificar');

const rotas = express();

rotas.post('/login', usuario.logar);
rotas.post('/cadastrar', usuario.cadastrar);
rotas.use(verificarLogin);
rotas.get('/usuario', usuario.detalhar);
rotas.put('/usuario', usuario.atualizar);
rotas.post('/produtos', produto.cadastrarProduto);
rotas.get('/produtos', produto.listarProduto);
rotas.get('/produtos/:id', produto.detalharProduto);
rotas.put('/produtos/:id', produto.atualizarProduto);
rotas.delete('/produtos/:id', produto.excluirProduto);


module.exports = rotas;