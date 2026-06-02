const USERS_STORAGE_KEY = 'libdb_users';
const CURRENT_USER_KEY = 'libdb_current_user';

function normalizarEmail(email = '') {
    return email.trim().toLowerCase();
}

export function registrarUsuario(email, senha) {
    const emailNormalizado = normalizarEmail(email);
    const senhaNormalizada = String(senha || '').trim();

    if (!emailNormalizado || !senhaNormalizada) {
        return { sucesso: false, mensagem: 'O e-mail e a senha são obrigatórios.' };
    }

    const usuarios = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
    const jaExiste = usuarios.some((usuario) => usuario.email === emailNormalizado);

    if (jaExiste) {
        return { sucesso: false, mensagem: 'Este e-mail já está cadastrado.' };
    }

    usuarios.push({
        email: emailNormalizado,
        senha: btoa(senhaNormalizada),
        criadoEm: new Date().toISOString()
    });

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usuarios));
    return { sucesso: true, mensagem: 'Cadastro realizado com sucesso!' };
}

export function fazerLogin(email, senha) {
    const emailNormalizado = normalizarEmail(email);
    const senhaNormalizada = String(senha || '').trim();

    if (!emailNormalizado || !senhaNormalizada) {
        return { sucesso: false, mensagem: 'O e-mail e a senha são obrigatórios.' };
    }

    const usuarios = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
    const usuario = usuarios.find(
        (item) => item.email === emailNormalizado && item.senha === btoa(senhaNormalizada)
    );

    if (!usuario) {
        return { sucesso: false, mensagem: 'Email ou senha invalidos.' };
    }

    localStorage.setItem(CURRENT_USER_KEY, usuario.email);
    return { sucesso: true, mensagem: 'Login realizado com sucesso!' };
}

export function fazerLogout() {
    localStorage.removeItem(CURRENT_USER_KEY);
}

export function obterUsuarioAtual() {
    return localStorage.getItem(CURRENT_USER_KEY);
}

export function estaLogado() {
    return Boolean(obterUsuarioAtual());
}

export function atualizarSenha(email, novaSenha) {
    const emailNormalizado = email.trim().toLowerCase();
    const senhaNormalizada = String(novaSenha || '').trim();

    if (!emailNormalizado || !senhaNormalizada) {
        return { sucesso: false, message: 'O e-mail e a nova senha são obrigatórios.' };
    }

    const usuarios = JSON.parse(localStorage.getItem('libdb_users')) || [];
    const usuarioIndex = usuarios.findIndex((item) => item.email === emailNormalizado);

    if (usuarioIndex === -1) {
        return { sucesso: false, mensagem: 'Este e-mail não está cadastrado em nosso sistema.' };
    }
    
    usuarios[usuarioIndex].senha = btoa(senhaNormalizada);
    usuarios[usuarioIndex].atualizadoEm = new Date().toISOString();

    localStorage.setItem('libdb_users', JSON.stringify(usuarios));
    return { sucesso: true, mensagem: 'Sua senha foi redefinida com sucesso!' };
}