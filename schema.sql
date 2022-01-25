drop if exists database market_cubos;

database create market_cubos;

create table if not exists usuarios(
    id serial primary key,
    nome text not null,
    nome_loja text not null,
    email varchar(50) not null unique,
    senha text not null
);

create table if not exists produtos(
    id serial primary key,
    usuario_id integer not null references usuarios (id),
    nome text not null,
    quantidade integer not null,
    categoria text,
    preco integer not null,
    descricao text,
    imagem text not null
);