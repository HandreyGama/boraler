// Script de inicialização do banco de dados local
// Execute uma única vez: node initialize.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_DIR = path.join(__dirname, 'db');
const USERS_FILE = path.join(DB_DIR, 'users.json');

// Criar diretório se não existir
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
}

// Função para codificar senha (mesmo do frontend)
function encodePassword(password) {
    return Buffer.from(password).toString('base64');
}

// Inicializar usuários
if (!fs.existsSync(USERS_FILE)) {
    const users = [
        {
            email: 'admin@boraler.com',
            senha: encodePassword('admin123'),
            role: 'admin',
            criadoEm: new Date().toISOString()
        }
    ];
    
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
    console.log('✅ Banco de dados inicializado!');
    console.log('📧 Admin padrão criado:');
    console.log('   Email: admin@boraler.com');
    console.log('   Senha: admin123');
} else {
    console.log('✅ Banco de dados já existe.');
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    console.log(`📊 Total de usuários: ${users.length}`);
    console.log('👥 Usuários:');
    users.forEach(u => {
        console.log(`   - ${u.email} (${u.role})`);
    });
}
