import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { obterTodosUsuarios, obterUsuarioPorEmail, registrarUsuario, atualizarUsuario, deletarUsuario } from './db-manager.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
app.use(express.static('public'))
app.use(express.json())

// ============ ROTAS DE AUTENTICAÇÃO ============
app.post('/api/login', (req, res) => {
    const { email = '', senha = '' } = req.body || {};
    const emailNormalizado = String(email).trim().toLowerCase();
    const senhaNormalizada = String(senha).trim();

    if (!emailNormalizado || !senhaNormalizada) {
        return res.status(400).json({ sucesso: false, mensagem: 'Email e senha são obrigatórios' });
    }

    const usuario = obterUsuarioPorEmail(emailNormalizado);
    const senhaBase64 = Buffer.from(senhaNormalizada).toString('base64');
    const senhaConfere = usuario && (usuario.senha === senhaBase64 || usuario.senha === senhaNormalizada);

    if (!usuario || !senhaConfere) {
        return res.status(401).json({ sucesso: false, mensagem: 'Email ou senha inválidos' });
    }

    res.json({
        sucesso: true,
        mensagem: 'Login realizado com sucesso!',
        usuario: {
            email: usuario.email,
            role: usuario.role
        }
    });
});

app.post('/api/register', (req, res) => {
    const { email = '', senha = '' } = req.body || {};
    const emailNormalizado = String(email).trim().toLowerCase();
    const senhaNormalizada = String(senha).trim();

    if (!emailNormalizado || !senhaNormalizada) {
        return res.status(400).json({ sucesso: false, mensagem: 'Email e senha são obrigatórios' });
    }

    if (obterUsuarioPorEmail(emailNormalizado)) {
        return res.status(400).json({ sucesso: false, mensagem: 'Este email já está cadastrado' });
    }

    const senhaEncodada = Buffer.from(senhaNormalizada).toString('base64');
    const resultado = registrarUsuario(emailNormalizado, senhaEncodada);

    if (resultado.sucesso) {
        res.json({
            sucesso: true,
            mensagem: 'Cadastro realizado com sucesso!',
            usuario: {
                email: emailNormalizado,
                role: 'user'
            }
        });
    } else {
        res.status(400).json(resultado);
    }
});

app.get('/api/users', (req, res) => {
    const usuarios = obterTodosUsuarios().map(u => ({
        email: u.email,
        role: u.role,
        criadoEm: u.criadoEm
    }));
    res.json(usuarios);
});

app.get('/api/user/:email', (req, res) => {
    const usuario = obterUsuarioPorEmail(req.params.email);
    if (!usuario) {
        return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
    }
    res.json({
        email: usuario.email,
        role: usuario.role,
        criadoEm: usuario.criadoEm
    });
});

app.post('/api/user/promote', (req, res) => {
    const { email } = req.body;
    const resultado = atualizarUsuario(email, { role: 'admin' });
    res.json(resultado);
});

app.post('/api/user/demote', (req, res) => {
    const { email } = req.body;
    const resultado = atualizarUsuario(email, { role: 'user' });
    res.json(resultado);
});

app.delete('/api/user/:email', (req, res) => {
    const resultado = deletarUsuario(req.params.email);
    res.json(resultado);
});

// ============ ROTAS DE PÁGINAS ============
app.get('/', (req,res) =>{
    res.sendFile('/templates/login/login.html', { root: path.join(__dirname, 'public') })
})
app.get('/register', (req,res) =>{
    res.sendFile('/templates/login/cadastro.html', { root: path.join(__dirname, 'public') })
})
app.get('/home', (req,res) =>{
    res.sendFile('/templates/home/home.html', { root: path.join(__dirname, 'public') })
})
app.get('/book', (req,res) =>{
    res.sendFile('/templates/book/book.html', { root: path.join(__dirname, 'public') })
})
app.get('/admin/home', (req, res) => {
    res.sendFile('/templates/admin/admin-home.html', { 
        root: path.join(__dirname, 'public') 
    });
});
app.get('/admin/user-library', (req, res) => {
    res.sendFile('/templates/admin/user-library.html', { 
        root: path.join(__dirname, 'public') 
    });
});
app.get('/admin/books-management', (req, res) => {
    res.sendFile('/templates/admin/books-management.html', { 
        root: path.join(__dirname, 'public') 
    });
});
app.listen(3000, () => console.log(' *http://localhost:3000!'));
