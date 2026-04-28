const CURRENT_USER_KEY = 'libdb_current_user';

export async function registrarUsuario(email, senha) {
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

    if (!emailNormalizado || !senhaNormalizada) {
        return { sucesso: false, mensagem: 'O e-mail e a senha são obrigatórios.' };
    }

        if (data.sucesso) {
            const userData = JSON.stringify({
                email: data.usuario.email,
                role: data.usuario.role
            });
            localStorage.setItem(CURRENT_USER_KEY, userData);
        }

    if (jaExiste) {
        return { sucesso: false, mensagem: 'Este e-mail já está cadastrado.' };
    }
}

export async function fazerLogin(email, senha) {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

    if (!emailNormalizado || !senhaNormalizada) {
        return { sucesso: false, mensagem: 'O e-mail e a senha são obrigatórios.' };
    }

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
