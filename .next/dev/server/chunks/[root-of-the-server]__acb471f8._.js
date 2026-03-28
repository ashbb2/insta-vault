module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[project]/lib/repos/dbRepo.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "dbRepo",
    ()=>dbRepo,
    "default",
    ()=>__TURBOPACK__default__export__,
    "loadAll",
    ()=>loadAll,
    "saveAll",
    ()=>saveAll
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$better$2d$sqlite3$29$__ = __turbopack_context__.i("[externals]/better-sqlite3 [external] (better-sqlite3, cjs, [project]/node_modules/better-sqlite3)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
;
;
;
const DB_PATH = process.env.DATABASE_URL ? process.env.DATABASE_URL.replace(/^file:\/\//, '') : __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), 'dev.sqlite');
function ensureDb() {
    const dir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].dirname(DB_PATH);
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(dir)) __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(dir, {
        recursive: true
    });
    const db = new __TURBOPACK__imported__module__$5b$externals$5d2f$better$2d$sqlite3__$5b$external$5d$__$28$better$2d$sqlite3$2c$__cjs$2c$__$5b$project$5d2f$node_modules$2f$better$2d$sqlite3$29$__["default"](DB_PATH);
    // schema
    db.exec(`
    CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY, name TEXT);
    CREATE TABLE IF NOT EXISTS collections (id TEXT PRIMARY KEY, name TEXT, description TEXT);
    CREATE TABLE IF NOT EXISTS posts (id TEXT PRIMARY KEY, thumbnail TEXT, author TEXT, caption TEXT, transcript TEXT, notes TEXT, sourceUrl TEXT, categoryId TEXT, savedAt TEXT, editedAt TEXT);
    CREATE TABLE IF NOT EXISTS post_collections (id TEXT PRIMARY KEY, postId TEXT, collectionId TEXT);
    CREATE TABLE IF NOT EXISTS tags (id TEXT PRIMARY KEY, name TEXT UNIQUE);
    CREATE TABLE IF NOT EXISTS post_tags (id TEXT PRIMARY KEY, postId TEXT, tagId TEXT);
  `);
    return db;
}
async function loadAll() {
    const db = ensureDb();
    const postsRaw = db.prepare('SELECT * FROM posts ORDER BY savedAt DESC').all();
    const categoriesRaw = db.prepare('SELECT * FROM categories').all();
    const collectionsRaw = db.prepare('SELECT * FROM collections').all();
    const posts = postsRaw.map((p)=>{
        const collectionRows = db.prepare('SELECT collectionId FROM post_collections WHERE postId = ?').all(p.id);
        const tagRows = db.prepare('SELECT t.name FROM post_tags pt JOIN tags t ON pt.tagId = t.id WHERE pt.postId = ?').all(p.id);
        return {
            id: p.id,
            thumbnail: p.thumbnail,
            author: p.author,
            caption: p.caption,
            transcript: p.transcript || undefined,
            notes: p.notes || undefined,
            sourceUrl: p.sourceUrl || undefined,
            categoryId: p.categoryId,
            collectionIds: collectionRows.map((r)=>r.collectionId),
            tags: tagRows.map((r)=>r.name),
            savedAt: p.savedAt,
            editedAt: p.editedAt || undefined
        };
    });
    db.close();
    return {
        posts,
        categories: categoriesRaw,
        collections: collectionsRaw
    };
}
async function saveAll(payload) {
    const db = ensureDb();
    const insertCategory = db.prepare('INSERT OR REPLACE INTO categories (id, name) VALUES (?, ?)');
    const insertCollection = db.prepare('INSERT OR REPLACE INTO collections (id, name, description) VALUES (?, ?, ?)');
    const insertPost = db.prepare('INSERT OR REPLACE INTO posts (id, thumbnail, author, caption, transcript, notes, sourceUrl, categoryId, savedAt, editedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const insertTag = db.prepare('INSERT OR IGNORE INTO tags (id, name) VALUES (?, ?)');
    const insertPostTag = db.prepare('INSERT OR REPLACE INTO post_tags (id, postId, tagId) VALUES (?, ?, ?)');
    const insertPostCollection = db.prepare('INSERT OR REPLACE INTO post_collections (id, postId, collectionId) VALUES (?, ?, ?)');
    const tx = db.transaction(()=>{
        for (const c of payload.categories){
            insertCategory.run(c.id, c.name);
        }
        for (const col of payload.collections){
            insertCollection.run(col.id, col.name, col.description || null);
        }
        for (const p of payload.posts){
            insertPost.run(p.id, p.thumbnail, p.author, p.caption, p.transcript ?? null, p.notes ?? null, p.sourceUrl ?? null, p.categoryId, p.savedAt, p.editedAt ?? null);
            // tags: ensure tag exists and link
            if (p.tags && p.tags.length) {
                for (const t of p.tags){
                    const tagId = `tag-${t.replace(/\s+/g, '-').toLowerCase()}`;
                    insertTag.run(tagId, t);
                    insertPostTag.run(`${p.id}-${tagId}`, p.id, tagId);
                }
            }
            // collections
            if (p.collectionIds && p.collectionIds.length) {
                for (const colId of p.collectionIds){
                    insertPostCollection.run(`${p.id}-${colId}`, p.id, colId);
                }
            }
        }
    });
    tx();
    db.close();
}
const dbRepo = {
    loadAll,
    saveAll
};
const __TURBOPACK__default__export__ = dbRepo;
}),
"[project]/app/api/posts/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
async function GET() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { dbRepo } = __turbopack_context__.r("[project]/lib/repos/dbRepo.ts [app-route] (ecmascript)");
        const data = await dbRepo.loadAll();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            posts: data.posts
        });
    } catch (err) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'DB not configured'
        }, {
            status: 501
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        // simple create flow using dbRepo.saveAll: load existing, prepend new, save
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { dbRepo } = __turbopack_context__.r("[project]/lib/repos/dbRepo.ts [app-route] (ecmascript)");
        const existing = await dbRepo.loadAll();
        const newPost = body;
        await dbRepo.saveAll({
            posts: [
                newPost,
                ...existing.posts
            ],
            categories: existing.categories,
            collections: existing.collections
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true
        });
    } catch (err) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'DB not configured or bad payload'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__acb471f8._.js.map