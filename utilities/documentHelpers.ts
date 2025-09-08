export const getExtension = (name: string) => {
    const lastDot = name.lastIndexOf('.');
    if (lastDot === -1) return '';
    return name.slice(lastDot);
};

export const nameWithoutExtension = (name: string) => {
    const lastDot = name.lastIndexOf('.');
    return lastDot === -1 ? name : name.slice(0, lastDot);
};

export const applyPrefixSuffix = (name: string, prefix: string, suffix: string) => {
    const ext = getExtension(name);
    const base = nameWithoutExtension(name);
    return `${prefix || ''}${base}${suffix || ''}${ext}`;
};

// naive but OK for typical file name lengths
export const longestCommonSubstring = (strings: string[]) => {
    if (!strings.length) return '';
    let shortest = strings.reduce((a, b) => (a.length <= b.length ? a : b));
    let best = '';
    for (let i = 0; i < shortest.length; i++) {
        for (let j = i + 1; j <= shortest.length; j++) {
            const sub = shortest.slice(i, j);
            if (sub.length <= best.length) continue;
            if (strings.every((s) => s.includes(sub))) best = sub;
        }
    }
    return best;
};
