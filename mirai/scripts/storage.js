const storage = {
    checkIfStorageExists(storageKey) {
        const data = JSON.parse(localStorage.getItem(storageKey));
        return data !== null;
    },

    saveInStorage(storageKey, obj) {
        localStorage.setItem(storageKey, JSON.stringify(obj));
    },

    readFromStorage(storageKey) {
        const json = localStorage.getItem(storageKey)
        return (json) ? JSON.parse(json) : null;
    },

    readAnimesCollection() {
        return this.readFromStorage(CONST.STORAGE.ANIMECOLLECTION);
    },

    writeAnimesCollection(obj) {
        this.saveInStorage(CONST.STORAGE.ANIMECOLLECTION, obj);
    },

    readUserInfo() {
        return this.readFromStorage(CONST.STORAGE.USERINFO);
    },

    writeUserInfo(obj) {
        this.saveInStorage(CONST.STORAGE.USERINFO, obj);
    },

    clearAllStorage() {
        localStorage.removeItem(CONST.STORAGE.ANIMECOLLECTION);
        localStorage.removeItem(CONST.STORAGE.USERINFO);
    }
}