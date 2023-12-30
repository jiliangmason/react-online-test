export const isSubString = (str1: string, str2: string) => {
    for (const s of str1) {
        if (!str2.includes(s)) {
            return false
        }
    }
    return true
}