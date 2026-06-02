import { pegar_livros_por_autor } from './api.js'

const GLOBAL_BOOKS_KEY = 'libdb_global_books_v1'

function normalizeText(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
}

function inferirCategoria(item) {
    const assuntos = [
        ...(item?.subject || []),
        ...(item?.subjects || []),
        ...(item?.subject_key || []),
        item?.first_subject || '',
        item?.title || '',
        item?.author_name?.[0] || ''
    ]
        .map((entry) => normalizeText(entry))
        .filter(Boolean)

    const has = (termos) => termos.some((t) => assuntos.some((s) => s.includes(t)))

    if (has(['biography', 'autobiography', 'memoir', 'biografia'])) return 'biografia'
    if (has(['science fiction', 'sci-fi', 'ficcao cientifica', 'distopia'])) return 'ficcao-cientifica'
    if (has(['fantasy', 'fantasia', 'wizard', 'magic', 'dragon'])) return 'fantasia'
    if (has(['mystery', 'detective', 'crime', 'misterio', 'thriller'])) return 'misterio'
    if (has(['poetry', 'poesia', 'poems'])) return 'poesia'
    if (has(['drama', 'theater', 'teatro', 'tragedia'])) return 'drama'
    if (has(['children', 'juvenile', 'young adult', 'infanto', 'infantil'])) return 'infantojuvenil'
    if (has(['nonfiction', 'nao ficcao', 'history', 'essay', 'science'])) return 'nao-ficcao'
    if (has(['romance', 'love', 'relationship', 'amor', 'marriage'])) return 'romance'
    return 'ficcao'
}

function montarCapaUrl(item) {
    if (item?.cover_edition_key) {
        return `https://covers.openlibrary.org/b/olid/${item.cover_edition_key}-M.jpg`
    }

    if (item?.edition_key?.[0]) {
        return `https://covers.openlibrary.org/b/olid/${item.edition_key[0]}-M.jpg`
    }

    const coverId = item?.cover_i || item?.cover_id
    if (coverId) {
        return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    }

    return ''
}

function toLivro(item) {
    const titulo = String(item?.title || item?.titulo || '').trim()
    if (!titulo) return null

    const autor =
        item?.author_name?.[0] ||
        item?.authors?.[0]?.name ||
        item?.autor ||
        item?.author ||
        'Autor desconhecido'

    const id =
        item?.key ||
        item?.cover_edition_key ||
        item?.edition_key?.[0] ||
        `manual-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

    const descricao =
        typeof item?.description === 'string'
            ? item.description
            : item?.description?.value ||
              item?.first_sentence ||
              item?.first_sentence?.[0] ||
              ''

    return {
        id,
        titulo,
        autor,
        descricao,
        capaUrl: montarCapaUrl(item) || item?.capaUrl || item?.cover_url || '',
        categoria: item?.categoria || inferirCategoria(item),
        assuntos: Array.isArray(item?.assuntos)
            ? item.assuntos.slice(0, 8)
            : [
                  ...(item?.subject || []),
                  ...(item?.subjects || []),
                  ...(item?.subject_key || [])
              ]
                  .filter((s) => typeof s === 'string' && s.trim())
                  .slice(0, 8),
        ano: item?.first_publish_year || item?.publish_year?.[0] || item?.ano || null,
        idioma: item?.language?.[0] || item?.idioma || 'pt',
        paginas: item?.number_of_pages_median || item?.number_of_pages || item?.paginas || null,
        isbn: item?.isbn?.[0] || item?.isbn || null,
        origem: item?.origem || 'openlibrary',
        criadoEm: item?.criadoEm || new Date().toISOString(),
        atualizadoEm: new Date().toISOString()
    }
}

function dedupeBooks(list) {
    const map = new Map()
    list.forEach((item) => {
        const livro = toLivro(item)
        if (!livro) return
        if (!map.has(livro.id)) {
            map.set(livro.id, livro)
        }
    })
    return Array.from(map.values())
}

function saveBooks(list) {
    localStorage.setItem(GLOBAL_BOOKS_KEY, JSON.stringify(list))
}

export function obterLivrosGlobais() {
    try {
        const raw = localStorage.getItem(GLOBAL_BOOKS_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

export async function sincronizarLivrosGlobais({ forceRefresh = false } = {}) {
    const atuais = obterLivrosGlobais()
    if (atuais.length > 0 && !forceRefresh) {
        return atuais
    }

    let agregados = []

    try {
        const fallbackResponse = await fetch('/data/livros_fallback.json')
        const fallbackData = await fallbackResponse.json()
        agregados = agregados.concat(fallbackData?.docs || [])
    } catch (error) {
        console.error('Falha ao carregar fallback para admin:', error)
    }

    try {
        const autoresResponse = await fetch('/data/autores.json')
        const autoresData = await autoresResponse.json()
        const autores = Array.isArray(autoresData?.autores) ? autoresData.autores : []

        const MAX_PAGES_PER_AUTHOR = 3
        const PAGE_LIMIT = 100

        for (const autor of autores) {
            for (let page = 1; page <= MAX_PAGES_PER_AUTHOR; page += 1) {
                const res = await pegar_livros_por_autor(autor, { page, limit: PAGE_LIMIT })
                const docs = res?.docs || []

                if (!docs.length) {
                    break
                }

                agregados = agregados.concat(docs)

                // Se retornou menos do que o limite, nao ha mais paginas uteis.
                if (docs.length < PAGE_LIMIT) {
                    break
                }
            }
        }
    } catch (error) {
        console.error('Falha ao importar livros da Open Library para admin:', error)
    }

    const livros = dedupeBooks(agregados)
    saveBooks(livros)
    return livros
}

export function adicionarLivroGlobal(livroInput) {
    const livros = obterLivrosGlobais()
    const novo = toLivro({ ...livroInput, origem: livroInput?.origem || 'manual' })

    if (!novo) {
        return { sucesso: false, mensagem: 'Livro inválido' }
    }

    if (livros.some((l) => l.id === novo.id)) {
        return { sucesso: false, mensagem: 'Livro já existe' }
    }

    livros.unshift(novo)
    saveBooks(livros)
    return { sucesso: true, mensagem: 'Livro adicionado', livro: novo }
}

export function atualizarLivroGlobal(id, updates) {
    const livros = obterLivrosGlobais()
    const idx = livros.findIndex((l) => l.id === id)

    if (idx === -1) {
        return { sucesso: false, mensagem: 'Livro não encontrado' }
    }

    const atual = livros[idx]
    const next = {
        ...atual,
        ...updates,
        titulo: String((updates?.titulo ?? atual.titulo ?? '')).trim(),
        autor: String((updates?.autor ?? atual.autor ?? '')).trim(),
        atualizadoEm: new Date().toISOString()
    }

    livros[idx] = next
    saveBooks(livros)
    return { sucesso: true, mensagem: 'Livro atualizado', livro: next }
}

export function deletarLivroGlobal(id) {
    const livros = obterLivrosGlobais()
    const idx = livros.findIndex((l) => l.id === id)

    if (idx === -1) {
        return { sucesso: false, mensagem: 'Livro não encontrado' }
    }

    livros.splice(idx, 1)
    saveBooks(livros)
    return { sucesso: true, mensagem: 'Livro removido' }
}

export function obterLivroGlobalPorId(id) {
    return obterLivrosGlobais().find((livro) => livro.id === id) || null
}
