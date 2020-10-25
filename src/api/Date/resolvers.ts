export default {
    unix: (parent: number): number => parent,
    string: (parent: number): string => {
        let date = new Date(parent)
        return date.toISOString().slice(0,10);;
    }
}