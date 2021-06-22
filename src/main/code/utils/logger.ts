const debug = false;

export const log = (...msg:any[]) => {
    if(debug) {
        console.log(...msg);
    }
}