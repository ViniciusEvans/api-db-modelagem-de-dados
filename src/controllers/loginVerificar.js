const conexao = require('../conection');
const jwt = require('jsonwebtoken');
require('dotenv').config()

async function verificarLogin(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization || authorization === "Bearer") return res.status(401).json({ "mensagem": 'token nao informado' })

    try {
        const token = authorization.replace('Bearer', '').trim();

        const { id } = jwt.verify(token, process.env.DB_SEGREDO);

        const queryToken = 'select * from usuarios where id = $1';
        const { rows, rowCount } = await conexao.query(queryToken, [id]);

        if (rowCount === 0)
            return res.status(404).json({ "mensagem": 'Usuário não encontrado.' });

        const { senha, ...usuario } = rows[0];

        req.usuario = usuario;

        next();
    } catch (error) {
        return res.status(400).json({ "mensagem": 'não foi possível validar o token' });
    }


}

module.exports = verificarLogin;