import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_DIR = path.join(__dirname, 'tmp/db');
const USERS_FILE = path.join(DB_DIR, 'users.json');

// Garantir que o diretório existe
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
}

function loadUsers() {
    try {
        if (!fs.existsSync(USERS_FILE)) {
            return [];
        }
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    } catch (error) {
        console.error('Erro ao ler usuários:', error);
        return [];
    }
}

function saveUsers(users) {
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Erro ao salvar usuários:', error);
    }
}

export function obterTodosUsuarios() {
    return loadUsers();
}

export function obterUsuarioPorEmail(email) {
    const usuarios = loadUsers();
    return usuarios.find(u => u.email === email);
}

export function registrarUsuario(email, senha) {
    const usuarios = loadUsers();
    
    if (usuarios.some(u => u.email === email)) {
        return { sucesso: false, mensagem: 'Email já cadastrado' };
    }
    
    usuarios.push({
        email,
        senha,
        role: 'user',
        criadoEm: new Date().toISOString()
    });
    
    saveUsers(usuarios);
    return { sucesso: true, mensagem: 'Usuário registrado' };
}

export function atualizarUsuario(email, updates) {
    const usuarios = loadUsers();
    const usuario = usuarios.find(u => u.email === email);
    
    if (!usuario) {
        return { sucesso: false, mensagem: 'Usuário não encontrado' };
    }
    
    Object.assign(usuario, updates);
    saveUsers(usuarios);
    return { sucesso: true, mensagem: 'Usuário atualizado' };
}

export function deletarUsuario(email) {
    const usuarios = loadUsers();
    const index = usuarios.findIndex(u => u.email === email);
    
    if (index === -1) {
        return { sucesso: false, mensagem: 'Usuário não encontrado' };
    }
    
    usuarios.splice(index, 1);
    saveUsers(usuarios);
    return { sucesso: true, mensagem: 'Usuário deletado' };
}
