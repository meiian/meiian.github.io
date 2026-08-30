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

    readTierlistCollection() {
        return this.readFromStorage(CONST.STORAGE.TIERLISTCOLLECTION);
    },

    writeTierListCollection(obj) {
        this.saveInStorage(CONST.STORAGE.TIERLISTCOLLECTION, obj);
    },

    readLastVersion() {
        return this.readFromStorage(CONST.STORAGE.LASTVERSION);
    },

    writeLastVersion(obj) {
        this.saveInStorage(CONST.STORAGE.LASTVERSION, obj);
    },

    readSettings() {
        return this.readFromStorage(CONST.STORAGE.SETTINGS);
    },

    writeSettings(obj) {
        this.saveInStorage(CONST.STORAGE.SETTINGS, obj);
    },

    readActivities() {
        return this.readFromStorage(CONST.STORAGE.ACTIVITIES);
    },

    writeActivities(obj) {
        this.saveInStorage(CONST.STORAGE.ACTIVITIES, obj);
    },

    clearAllStorage() {
        localStorage.removeItem(CONST.STORAGE.ANIMECOLLECTION);
        localStorage.removeItem(CONST.STORAGE.USERINFO);
        this.saveInStorage(CONST.STORAGE.ACTIVITIES, obj);
    }
}