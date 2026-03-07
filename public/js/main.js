const P = {
    parse(n) {
        const t = n.split(`
`);
        let e = "";
        const r = [];
        for (const s of t) {
            const o = s.trim();
            if (o === "" || o.startsWith("# "))
                continue;
            const d = Math.floor((s.length - s.trimStart().length) / 2), l = d > 0 ? ` style="margin-left: ${d}rem"` : "";
            if (o.startsWith("+ ")) {
                const a = o.substring(2);
                e += `<p${l}><strong>${this.escapeHtml(a)}</strong></p>
`;
            } else if (o.includes(" = ")) {
                const [a, h] = o.split(" = ").map((m) => m.trim()), i = h.split("#")[0].trim(), c = i.endsWith(".html") ? "html" : "lore";
                e += `<p${l}><a href="#" class="link-${c}" data-path="${i}">${this.escapeHtml(a)}</a></p>
`, r.push({ text: a, path: i, type: c });
            } else if (o.includes(" > ")) {
                const [a, h] = o.split(" > ").map((c) => c.trim()), i = h.split("#")[0].trim();
                e += `<p${l}><a href="#" class="link-md" data-path="${i}">${this.escapeHtml(a)}</a></p>
`, r.push({ text: a, path: i, type: "md" });
            } else if (o.includes(" | ")) {
                const [a, h] = o.split(" | ").map((c) => c.trim()), i = h.split("#")[0].trim();
                e += `<p${l}><a href="#" class="link-external" data-path="${i}">${this.escapeHtml(a)}</a></p>
`, r.push({ text: a, path: i, type: "external" });
            } else
                e += `<p${l}>${this.escapeHtml(o)}</p>
`;
        }
        return { html: e, links: r };
    },
    escapeHtml(n) {
        const t = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };
        return n.replace(/[&<>"']/g, (e) => t[e] || e);
    }
}, $ = (n) => ({
    loreToFileSystem(t) {
        let e = t.startsWith(":") ? t.slice(1) : t;
        return e = e.replace(/:/g, "/"), t.endsWith("_") || t.endsWith(":_") ? (e = e.replace(/_$/, ""), `${n.rootDir}/${e}/local.lore`) : `${n.rootDir}/${e}.lore`;
    },
    getFileSystemPathFromUrl(t = window.location.pathname) {
        if (t === "/" || t === "/index.html")
            return `${n.rootDir}/local.lore`;
        if (t.endsWith("/"))
            return `${n.rootDir}${t}local.lore`;
        if (t.endsWith(".html")) {
            const e = t.replace(/\.html$/, "");
            return `${n.rootDir}${e}.lore`;
        }
        return `${n.rootDir}${t}.lore`;
    },
    isMarkdownPath(t) {
        return t.startsWith("/") && t.endsWith("/") && t.length > 2 && !t.startsWith(n.rootDir) && !t.includes(".");
    },
    normalizePath(t) {
        return t.replace(/\/+/g, "/");
    }
}), W = (n) => ({
    async loadLore(t, e) {
        try {
            const r = await fetch(t);
            if (!r.ok)
                throw new Error(`HTTP ${r.status} - ${t}`);
            const s = await r.text(), { html: o, links: d } = P.parse(s), l = document.getElementById("lore-content");
            if (!l)
                throw new Error("未找到 #lore-content 容器");
            l.innerHTML = o, l.querySelectorAll("[data-path]").forEach((h, i) => {
                var w;
                const c = h, m = c.dataset.path, p = (w = d[i]) == null ? void 0 : w.type;
                !m || !p || c.addEventListener("click", (y) => {
                    y.preventDefault(), y.stopPropagation(), p === "md" ? window.location.href = m : p === "external" || p === "html" ? window.open(m, "_blank") : e(m, p);
                });
            });
        } catch (r) {
            const s = document.getElementById("lore-content");
            s && (s.innerHTML = `<div class="lore-error">加载失败: ${r}</div>`);
        }
    }
}), v = (n) => {
    const t = $(n), e = W();
    return {
        async navigate(r, s) {
            if (s === "md") {
                window.location.href = t.normalizePath(r.startsWith("/") ? r : "/" + r);
                return;
            }
            if (s === "lore") {
                const o = t.loreToFileSystem(r), d = o.replace(n.rootDir, "").replace(/\.lore$/, ".html").replace(/\/local\.lore$/, "/");
                window.history.pushState({}, "", d), await e.loadLore(o, this.navigate.bind(this));
            }
        },
        async handlePopState() {
            const r = window.location.pathname;
            if (t.isMarkdownPath(r)) {
                window.location.reload();
                return;
            }
            const s = t.getFileSystemPathFromUrl(r);
            await e.loadLore(s, this.navigate.bind(this));
        }
    };
}, S = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    LoreParser: P,
    createLoader: W,
    createNavigator: v,
    createPathUtils: $
}, Symbol.toStringTag, { value: "Module" })), f = {
    rootDir: "/lore"
}, g = $(f), u = v(f);
async function k() {
    const n = window.location.pathname;
    if (g.isMarkdownPath(n))
        return;
    const t = g.getFileSystemPathFromUrl(n);
    await (await Promise.resolve().then(() => S)).createLoader(f).loadLore(t, u.navigate.bind(u)), window.addEventListener("popstate", u.handlePopState.bind(u));
}
k();