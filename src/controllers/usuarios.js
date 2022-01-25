const conexao = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const segredo = require('../segredo');

const usuario = {

    logar: async(req, res) => {
        const { email, senha } = req.body;

        if (!email || !senha) return res.status(404).json({ "mensagem": 'Email e senha são obrigatórios!' });

        try {

            const queryVerificar = 'select * from usuarios where email = $1';
            const { rows, rowCount } = await conexao.query(queryVerificar, [email]);

            if (rowCount === 0)
                return res.status(400).json({ "mensagem": 'Usuario não encontrado!' });

            const usuario = rows[0];

            const senhaVerificada = await bcrypt.compare(senha, usuario.senha);

            if (!senhaVerificada)
                return res.status(404).json({ "mensagem": 'Email ou senha não existem!' });

            const token = jwt.sign({ id: usuario.id }, segredo, { expiresIn: '8d' });

            const { senha: senhausuario, ...dadosUsuario } = usuario;
            return res.status(200).json({
                usuario: dadosUsuario,
                token
            });
        } catch (error) {

            return res.status(400).json(error.message);
        }
    },
    cadastrar: async(req, res) => {
        const { nome, nome_loja, email, senha } = req.body;

        if (!nome) return res.status(404).json({ "mensagem": 'O campo nome é obrigatório!' });
        if (!nome_loja) return res.status(404).json({ "mensagem": 'O campo nome_loja é obrigatório!' });
        if (!email) return res.status(404).json({ "mensagem": 'O campo email é obrigatório!' });
        if (!senha) return res.status(404).json({ "mensagem": 'O campo senha é obrigatório!' });

        try {
            const queryConsultaEmail = 'select  * from usuarios where email = $1';
            const { rowCount: quantidaDeEmails } = await conexao.query(queryConsultaEmail, [email])

            if (quantidaDeEmails > 0) return res.status(400).json('O email já existe!');

            const hashSenha = await bcrypt.hash(senha.toString(), 10);

            const query = 'insert into usuarios (nome, nome_loja, email, senha) values ($1, $2, $3, $4)'
            const cadastroUsuario = await conexao.query(query, [nome, nome_loja, email, hashSenha]);

            if (cadastroUsuario.rowCount === 0)
                return res.status(400).json({ "mensagem": 'Não foi possível cadastrar usuário' });

            return res.status(200).json({ "mensagem": 'Usuário cadastrado com sucesso!' });
        } catch (error) {
            return res.status(404).json(error.message);
        }
    },
    detalhar: async(req, res) => {
        const { usuario } = req;

        try {
            if (!usuario) return res.status(404).json({ "mensagem": "não existe conta com esse id" });

            return res.status(200).json(usuario);
        } catch (error) {
            return res.status(400).json(error.message);
        }
    },
    atualizar: async(req, res) => {
        const { nome, email, senha, nome_loja } = req.body;
        const { usuario } = req;

        if (!nome) return res.status(400).json({ "mensagem": "O campo nome deve ser preenchido!" });
        if (!email) return res.status(400).json({ "mensagem": "O campo email deve ser preenchido!" });
        if (!senha) return res.status(400).json({ "mensagem": "O campo senha deve ser preenchido!" });
        if (!nome_loja) return res.status(400).json({ "mensagem": "O campo nome_loja deve ser preenchido!" });

        try {
            const queryEmail = 'select * from usuarios where email = $1';
            const response = await conexao.query(queryEmail, [email]);

            if (response.rows[0].id !== usuario.id)
                return res.status(401).json({ "mensagem": "O e-mail informado já está sendo utilizado por outro usuário." });

            const hashSenha = await bcrypt.hash(senha.toString(), 10);

            const query = 'update usuarios set nome = $1, email = $2, senha = $3, nome_loja = $4 where id = $5';
            const atualizarUsuario = await conexao.query(query, [nome, email, hashSenha, nome_loja, usuario.id]);

            if (atualizarUsuario.rowCount === 0)
                return res.status(400).json({ "mensagem": 'não foi possível atualizar postagem' });

            return res.status(200).json();
        } catch (error) {
            return res.status(400).json(error.message);
        }
    }
}

module.exports = usuario;