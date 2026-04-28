// Script para inicializar dados padrão do sistema
// Executar uma vez para setup inicial

const USERS_STORAGE_KEY = 'libdb_users';

export function inicializarSistema() {
    const usuarios = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
    
    // Verificar se admin padrão já existe
    const adminExiste = usuarios.some(u => u.email === 'admin@boraler.com');
    
    if (!adminExiste && usuarios.length === 0) {
        // Criar admin padrão
        usuarios.push({
            email: 'admin@boraler.com',
            senha: btoa('admin123'), // Será pedido para mudar na primeira vez
            role: 'admin',
            criadoEm: new Date().toISOString()
        });
        
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usuarios));
        console.log('✅ Sistema inicializado! Admin padrão criado.');
        console.log('📧 Email: admin@boraler.com');
        console.log('🔑 Senha: admin123');
    }
}
