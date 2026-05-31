// Obter todos os usuários para admin gerenciar
export async function obterTodosUsuarios() {
    try {
        const response = await fetch('/api/users');
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        return [];
    }
}

// Fazer usuário virar admin
export async function promoverParaAdmin(email) {
    try {
        const response = await fetch('/api/user/promote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        return await response.json();
    } catch (error) {
        console.error('Erro ao promover usuário:', error);
        return { sucesso: false, mensagem: 'Erro ao conectar' };
    }
}

// Remover admin (voltar para user)
export async function rebaixarDeAdmin(email) {
    try {
        const response = await fetch('/api/user/demote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        return await response.json();
    } catch (error) {
        console.error('Erro ao rebaixar usuário:', error);
        return { sucesso: false, mensagem: 'Erro ao conectar' };
    }
}

// Deletar usuário
export async function deletarUsuario(email) {
    try {
        const response = await fetch(`/api/user/${encodeURIComponent(email)}`, { method: 'DELETE' });
        return await response.json();
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        return { sucesso: false, mensagem: 'Erro ao conectar' };
    }
}

// Obter usuário específico
export async function obterUsuarioPorEmail(email) {
    try {
        const response = await fetch(`/api/user/${encodeURIComponent(email)}`);
        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return null;
    }
}
