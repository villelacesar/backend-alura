import express from "express";
import multer from "multer";
import cors from "cors";
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js";

//CORS para q o front possa conectar ao back, pois o navegador por segurança, nao permite url diferente.
const corsOptions = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200
}

//precisa configurar pq é para Windows.
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

//no linux ou no mac
//const upload = multer({dest:"/.uploads"});

const upload = multer({dest:"/.uploads", storage});

const routes = (app) => {
    app.use(express.json());

    app.use(cors(corsOptions));
    
    app.get("/posts", listarPosts);

    app.post("/posts", postarNovoPost);

    app.post("/uploadImg", upload.single("imagem"), uploadImagem);

    app.put("/uploadImg/:id", atualizarNovoPost);
}

export default routes;