const debug = true;

export const log = (...msg:any[]) => {
    if(debug) {
        console.log(...msg);
    }
}