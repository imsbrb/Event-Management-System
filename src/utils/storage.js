const KEY = 'evently-state';

export function loadState(){
    try{
        const saved = localStorage.getItem(KEY);
        return saved ? JSON.parse(saved): undefined;
    } catch {
        return undefined;
    }
}

export function saveState(state){
    try{
        localStorage.setItem(KEY,JSON.stringify(state));
    } catch{
        // storage full or blocked; the app still works without it
    }
}