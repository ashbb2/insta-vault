module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/components/data/mockData.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "categories",
    ()=>categories,
    "collections",
    ()=>collections,
    "posts",
    ()=>posts
]);
const categories = [
    {
        id: 'c-unsorted',
        name: 'Unsorted'
    },
    {
        id: 'c-photo',
        name: 'Photography'
    },
    {
        id: 'c-food',
        name: 'Food'
    },
    {
        id: 'c-design',
        name: 'Design'
    },
    {
        id: 'c-travel',
        name: 'Travel'
    }
];
const collections = [
    {
        id: 'col-summer',
        name: 'Summer 2024'
    },
    {
        id: 'col-inspo',
        name: 'Inspo'
    },
    {
        id: 'col-favs',
        name: 'Favorites'
    }
];
const now = Date.now();
function daysAgo(n) {
    return new Date(now - n * 24 * 60 * 60 * 1000).toISOString();
}
const posts = [
    {
        id: 'p1',
        thumbnail: 'https://picsum.photos/400/400?random=1',
        author: '@alice',
        caption: 'Sunset over the hills',
        categoryId: 'c-photo',
        collectionIds: [
            'col-summer'
        ],
        savedAt: daysAgo(2)
    },
    {
        id: 'p2',
        thumbnail: 'https://picsum.photos/400/400?random=2',
        author: '@bob',
        caption: 'Delicious brunch',
        categoryId: 'c-food',
        collectionIds: [
            'col-inspo'
        ],
        savedAt: daysAgo(5)
    },
    {
        id: 'p3',
        thumbnail: 'https://picsum.photos/400/400?random=3',
        author: '@carla',
        caption: 'Modern poster design',
        categoryId: 'c-design',
        collectionIds: [
            'col-inspo',
            'col-favs'
        ],
        savedAt: daysAgo(7)
    },
    {
        id: 'p4',
        thumbnail: 'https://picsum.photos/400/400?random=4',
        author: '@dan',
        caption: 'City skyline',
        categoryId: 'c-photo',
        collectionIds: [],
        savedAt: daysAgo(10)
    },
    {
        id: 'p5',
        thumbnail: 'https://picsum.photos/400/400?random=5',
        author: '@ella',
        caption: 'Tasty pasta',
        categoryId: 'c-food',
        collectionIds: [
            'col-favs'
        ],
        savedAt: daysAgo(1)
    },
    {
        id: 'p6',
        thumbnail: 'https://picsum.photos/400/400?random=6',
        author: '@felix',
        caption: 'Minimal layout',
        categoryId: 'c-design',
        collectionIds: [],
        savedAt: daysAgo(3)
    },
    {
        id: 'p7',
        thumbnail: 'https://picsum.photos/400/400?random=7',
        author: '@gina',
        caption: 'Mountain trail',
        categoryId: 'c-travel',
        collectionIds: [
            'col-summer'
        ],
        savedAt: daysAgo(15)
    },
    {
        id: 'p8',
        thumbnail: 'https://picsum.photos/400/400?random=8',
        author: '@harry',
        caption: 'Street food corner',
        categoryId: 'c-food',
        collectionIds: [],
        savedAt: daysAgo(12)
    },
    {
        id: 'p9',
        thumbnail: 'https://picsum.photos/400/400?random=9',
        author: '@iris',
        caption: 'Architectural detail',
        categoryId: 'c-design',
        collectionIds: [
            'col-inspo'
        ],
        savedAt: daysAgo(20)
    },
    {
        id: 'p10',
        thumbnail: 'https://picsum.photos/400/400?random=10',
        author: '@jack',
        caption: 'Cafe vibes',
        categoryId: 'c-unsorted',
        collectionIds: [],
        savedAt: daysAgo(4)
    }
];
}),
"[project]/components/PostsProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PostsProvider",
    ()=>PostsProvider,
    "usePosts",
    ()=>usePosts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2f$mockData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/data/mockData.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const PostsContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function PostsProvider({ children }) {
    const [activeCategoryId, setActiveCategoryId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeCollectionId, setActiveCollectionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const posts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2f$mockData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["posts"], []);
    const categories = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2f$mockData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["categories"], []);
    const collections = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$data$2f$mockData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["collections"], []);
    const filteredPosts = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        return posts.filter((p)=>{
            if (activeCategoryId && p.categoryId !== activeCategoryId) return false;
            if (activeCollectionId && !p.collectionIds.includes(activeCollectionId)) return false;
            return true;
        });
    }, [
        posts,
        activeCategoryId,
        activeCollectionId
    ]);
    const value = {
        posts,
        categories,
        collections,
        activeCategoryId,
        activeCollectionId,
        setActiveCategory: setActiveCategoryId,
        setActiveCollection: setActiveCollectionId,
        filteredPosts
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PostsContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/PostsProvider.tsx",
        lineNumber: 46,
        columnNumber: 10
    }, this);
}
function usePosts() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(PostsContext);
    if (!ctx) throw new Error('usePosts must be used within PostsProvider');
    return ctx;
}
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        if ("TURBOPACK compile-time truthy", 1) {
            if ("TURBOPACK compile-time truthy", 1) {
                module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)");
            } else //TURBOPACK unreachable
            ;
        } else //TURBOPACK unreachable
        ;
    }
} //# sourceMappingURL=module.compiled.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime; //# sourceMappingURL=react-jsx-dev-runtime.js.map
}),
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].React; //# sourceMappingURL=react.js.map
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__44c4e95f._.js.map