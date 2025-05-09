export function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

export function makeDash(s: string) {
    return s.trim().replace(/ /g, "-")
}