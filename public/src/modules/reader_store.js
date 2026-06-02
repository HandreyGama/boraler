import { obterEmailUsuarioAtual } from './auth.js'

const LEGACY_STORAGE_KEY = 'libdb_reader_state_v1'

function getStorageKey(email) {
    return `libdb_reader_state_${String(email || '').trim().toLowerCase()}`
}

function parseReaderState(raw) {
    const parsed = JSON.parse(raw)
    return {
        selectedBookId: parsed?.selectedBookId || null,
        books: parsed?.books || {},
        listOrder: Array.isArray(parsed?.listOrder) ? parsed.listOrder : []
    }
}

export function getInitialReaderState() {
    return {
        selectedBookId: null,
        books: {},
        listOrder: []
    }
}

export function loadReaderStateForUser(email) {
    try {
        const storageKey = getStorageKey(email)
        const raw = localStorage.getItem(storageKey)
        if (!raw) {
            // Migra estado legado para o usuario atual quando aplicavel.
            const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
            if (legacy && normalizeEmail(email) === normalizeEmail(obterEmailUsuarioAtual())) {
                const migrated = parseReaderState(legacy)
                localStorage.setItem(storageKey, JSON.stringify(migrated))
                return migrated
            }
            return getInitialReaderState()
        }

        return parseReaderState(raw)
    } catch (error) {
        console.error('Falha ao carregar estado do leitor:', error)
        return getInitialReaderState()
    }
}

function normalizeEmail(email) {
    return String(email || '').trim().toLowerCase()
}

export function loadReaderState() {
    return loadReaderStateForUser(obterEmailUsuarioAtual())
}

export function saveReaderStateForUser(email, state) {
    localStorage.setItem(getStorageKey(email), JSON.stringify(state))
}

export function saveReaderState(state) {
    saveReaderStateForUser(obterEmailUsuarioAtual(), state)
}

export function upsertBook(book) {
    return addBookToMyList({ ...book, inMyList: false }, true)
}

export function addBookToMyList(book, selectBook = false) {
    const state = loadReaderState()
    const current = state.books?.[book.id] || {}
    const merged = {
        ...current,
        ...book,
        readingProgress: Number(current.readingProgress || 0),
        inMyList: current.inMyList ?? true,
        favorite: current.favorite ?? false,
        status: current.status || 'quero-ler',
        notes: current.notes || '',
        highlights: Array.isArray(current.highlights) ? current.highlights : [],
        rating: Number(current.rating ?? 0),
        updatedAt: new Date().toISOString()
    }

    const books = {
        ...(state.books || {}),
        [book.id]: merged
    }

    const listOrder = Array.isArray(state.listOrder) ? [...state.listOrder] : []
    if (!listOrder.includes(book.id)) {
        listOrder.unshift(book.id)
    }

    const nextState = {
        ...state,
        selectedBookId: selectBook ? book.id : (state.selectedBookId || null),
        books,
        listOrder
    }

    saveReaderState(nextState)
    return nextState
}

export function getMyLibraryBooks(state = loadReaderState()) {
    return (state.listOrder || [])
        .map((id) => state.books?.[id])
        .filter((book) => Boolean(book) && book.inMyList !== false)
}

export function getMyLibraryCount(state = loadReaderState()) {
    return getMyLibraryBooks(state).length
}

export function updateBookById(bookId, updater) {
    const state = loadReaderState()
    const base = state.books?.[bookId]
    if (!base) {
        return state
    }

    const nextBook = updater(base)
    const nextState = {
        ...state,
        books: {
            ...state.books,
            [bookId]: {
                ...nextBook,
                updatedAt: new Date().toISOString()
            }
        }
    }

    saveReaderState(nextState)
    return nextState
}

export function setSelectedBook(bookId) {
    const state = loadReaderState()
    const nextState = {
        ...state,
        selectedBookId: bookId
    }
    saveReaderState(nextState)
    return nextState
}

export function removeBookFromMyList(bookId) {
    const state = loadReaderState()
    const book = state.books?.[bookId]
    if (!book) {
        return state
    }

    const nextState = {
        ...state,
        books: {
            ...state.books,
            [bookId]: {
                ...book,
                inMyList: false,
                updatedAt: new Date().toISOString()
            }
        },
        listOrder: state.listOrder.filter((id) => id !== bookId)
    }

    saveReaderState(nextState)
    return nextState
}
