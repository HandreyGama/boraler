const CURRENT_USER_KEY = 'libdb_current_user';

// ==========================================
// OPERAÇÕES ASSÍNCRONAS (API / SERVIDOR)
// ==========================================

export async function registrarUsuario(email, senha) {
    const emailNormalizado = String(email).trim().toLowerCase();
    const senhaNormalizada = String(senha).trim();

    if (!emailNormalizado || !senhaNormalizada) {
        return { sucesso: false, mensagem: 'O e-mail e a senha são obrigatórios.' };
    }

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailNormalizado, senha: senhaNormalizada })
        });

        const data = await response.json();

        if (data.sucesso) {
            const userData = JSON.stringify({
                email: data.usuario.email,
                role: data.usuario.role
            });
            localStorage.setItem(CURRENT_USER_KEY, userData);
        }

        return data;
    } catch (error) {
        console.error('Erro no registro:', error);
        return { sucesso: false, mensagem: 'Erro ao conectar com o servidor' };
    }
}

export async function fazerLogin(email, senha) {
    const emailNormalizado = String(email).trim().toLowerCase();
    const senhaNormalizada = String(senha).trim();

    if (!emailNormalizado || !senhaNormalizada) {
        return { sucesso: false, mensagem: 'O e-mail e a senha são obrigatórios.' };
    }

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailNormalizado, senha: senhaNormalizada })
        });

        const data = await response.json();

        if (data.sucesso) {
            const userData = JSON.stringify({
                email: data.usuario.email,
                role: data.usuario.role
            });
            localStorage.setItem(CURRENT_USER_KEY, userData);
        }

        return data;
    } catch (error) {
        console.error('Erro no login:', error);
        return { sucesso: false, mensagem: 'Erro ao conectar com o servidor' };
    }
}

// ==========================================
// GERENCIAMENTO DE SESSÃO LOCAL (LOCALSTORAGE)
// ==========================================

export function fazerLogout() {
    localStorage.removeItem(CURRENT_USER_KEY);
}

export function obterUsuarioAtual() {
    try {
        const user = localStorage.getItem(CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
}

export function obterEmailUsuarioAtual() {
    const user = obterUsuarioAtual();
    return user?.email || null;
}

export function obterRoleUsuarioAtual() {
    const user = obterUsuarioAtual();
    return user?.role || 'user';
}

export function estaLogado() {
    return Boolean(obterUsuarioAtual());
}

export function isAdmin() {
    return obterRoleUsuarioAtual() === 'admin';
}

// ==========================================
// RECOVERY / ATUALIZAÇÕES DE CONTA
// ==========================================

// ==========================================
// RECOVERY / ATUALIZAÇÕES DE CONTA
// ==========================================

export async function atualizarSenha(email, novaSenha) {
    const emailNormalizado = String(email).trim().toLowerCase();
    const senhaNormalizada = String(novaSenha || '').trim();

    // Corrigido de 'message' para 'mensagem' para manter o padrão do seu projeto
    if (!emailNormalizado || !senhaNormalizada) {
        return { sucesso: false, mensagem: 'O e-mail e a nova senha são obrigatórios.' };
    }

    try {
        // Agora envia o comando para a API do seu servidor redefinir no banco de dados
        const response = await fetch('/api/update-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailNormalizado, senha: senhaNormalizada })
        });

        const data = await response.json();
        return data; // Retorna a resposta que vier do servidor (sucesso ou erro)
        
    } catch (error) {
        console.error('Erro ao atualizar senha:', error);
        return { sucesso: false, mensagem: 'Erro ao conectar com o servidor' };
    }
}