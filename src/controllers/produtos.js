const conexao = require('../conexao');

const produtos = {

    cadastrarProduto: async(req, res) => {
        const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
        const { usuario } = req;

        if (!nome) return res.status(404).json({ "mensagem": 'O campo nome é obrigatório!' });
        if (!quantidade || quantidade < 1) return res.status(404).json('O campo quantidade é obrigatório!');
        if (!preco) return res.status(404).json({ "mensagem": 'O campo preco é obrigatório!' });
        if (!imagem) return res.status(404).json({ "mensagem": 'O campo imagem é obrigatório!' });

        try {
            const query = 'insert into produtos (usuario_id, nome, quantidade, categoria, preco, descricao, imagem) values ($1, $2, $3, $4, $5, $6, $7)';
            const cadastroProduto = await conexao.query(query, [usuario.id, nome, quantidade, categoria, preco, descricao, imagem]);

            if (cadastroProduto.rowCount === 0)
                return res.status(400).json({ "mensagem": "não foi possível cadastrar o produto" });

            return res.status(204).json();
        } catch (error) {
            return res.status(400).send(error.message);
        }
    },
    listarProduto: async(req, res) => {
        const { usuario } = req;

        try {
            const query = 'select * from produtos where usuario_id = $1';
            const lista = await conexao.query(query, [usuario.id]);

            if (lista.rowCount === 0)
                return res.status(404).json({ "mensagem": "Não foi possível listar os produtos" });

            return res.status(200).json(lista.rows);
        } catch (error) {
            return res.status(400).json(error.message);
        }
    },
    detalharProduto: async(req, res) => {
        const { id } = req.params;
        const { usuario } = req;

        try {
            const query = 'select * from produtos where id = $1 and usuario_id = $2';
            const produto = await conexao.query(query, [id, usuario.id]);

            if (produto.rowCount === 0)
                return res.status(404).json({ "mensagem": 'Não foi possível encontrar o produto' });

            return res.status(200).json(produto.rows);
        } catch (error) {
            return res.status(400).json(error.message);
        }
    },
    atualizarProduto: async(req, res) => {
        const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;
        const { usuario, params } = req;

        if (!nome) return res.status(404).json({ "mensagem": 'O campo nome é obrigatório!' });
        if (!quantidade || quantidade < 1) return res.status(404).json({ "mensagem": 'O campo quantidade é obrigatório!' });
        if (!preco) return res.status(404).json({ "mensagem": 'O campo preco é obrigatório!' });
        if (!descricao) return res.status(404).json({ "mensagem": 'O campo descricao é obrigatório!' });

        try {
            const query =
                'update produtos set nome = $1, quantidade = $2, categoria = $3, preco = $4, descricao = $5, imagem = $6 where id = $7 and usuario_id = $8';
            const atualizarUsuario = await conexao.query(query, [nome, quantidade, categoria, preco, descricao, imagem, params.id, usuario.id]);

            if (atualizarUsuario.rowCount === 0)
                return res.status(404).json({ "mensagem": "não foi possível atualizar o produto" });

            return res.status(200).json(atualizarUsuario.rows);
        } catch (error) {
            return res.status(400).json(error.message);
        }
    },
    excluirProduto: async(req, res) => {
        const { id } = req.params;
        const { usuario } = req;

        try {
            const query = 'delete from produtos * where id = $1 and usuario_id = $2'
            const usuarioDeletado = await conexao.query(query, [id, usuario.id]);

            if (usuarioDeletado.rowCount === 0)
                return res.status(404).json({ "mensagem": "Não existe produto para o ID " + id + "." })

            return res.status(204).json({})
        } catch (error) {
            return res.status(400).json(error.message);
        }
    }

}

module.exports = produtos;