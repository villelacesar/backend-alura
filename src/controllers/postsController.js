import { getTodosPosts, criarPost, atualizarPost } from "../models/postsModel.js";
import gerarDescricaoComGemini from "../services/geminiService.js";
import fs from 'fs';

export async function listarPosts (req, res)
{
    const posts =  await getTodosPosts();
    res.status(200).json(posts);
}

export async function postarNovoPost(req, res) {
    const novoPost = req.body;
    try {
        const postCriado = await criarPost(novoPost);
        res.status(200).json(postCriado);
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({"Erro": "Falha na requisição!"});
    }
}

export async function uploadImagem(req, res) {
    const novoPost = {
        "descricao": "",
        "imgUrl": req.file.originalname,
        "imgAlt": ""    
    }

    try {
        const postCriado = await criarPost(novoPost);
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        fs.renameSync(req.file.path, imagemAtualizada); 
        res.status(200).json(postCriado);
    } catch(erro){
        console.error(erro.message);
        res.status(500).json({"Erro": "Falha na requisição!"})
    }
}

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const imgUrl = `http://localhost:3000/${id}.png`;
    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricaoImg = await gerarDescricaoComGemini(imgBuffer);    

        const atualizaPost = {
            "descricao": descricaoImg,
            "imgUrl": imgUrl,
            "imgAlt": req.body.imgAlt
        }
    
        const postCriado = await atualizarPost(id, atualizaPost);
        res.status(200).json(postCriado);
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({"Erro": "Falha na requisição!"});
    }
}