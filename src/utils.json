export const createPageUrl = (pageName) => {
    const paramsIndex = pageName.indexOf('?');
    if (paramsIndex !== -1) {
        const page = pageName.substring(0, paramsIndex);
        const params = pageName.substring(paramsIndex);
        return `/${page}${params}`;
    }
    return `/${pageName}`;
};