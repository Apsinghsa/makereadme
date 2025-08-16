export function trimZipRootDirectory(string){
    const slicedString = string.slice(string.indexOf('/')+1)
    return slicedString;
}