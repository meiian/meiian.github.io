class Tierlist {
    #id = null;
    #tiers = [];
    #title = "";

    constructor(title) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.tiers = [];
        this.addTier(new Tier("S", "#ffadad"));
        this.addTier(new Tier("A", "#ffd6a5"));
        this.addTier(new Tier("B", "#fdffb6"));
        this.addTier(new Tier("C", "#caffbf"));
        this.addTier(new Tier("D", "#9bf6ff"));
    }

    addTier(tier) {
        this.tiers.push(tier);
    }

    getTitle() {
        return this.title;
    }

    getTiers() {
        return this.tiers;
    }

    getNbTiers() {
        return this.tiers.length;
    }
}

class Tier {
    #label = "";
    #color = "#000000";
    #items = [];

    constructor(label, color) {
        this.label = label;
        this.color = color;
        this.items = [];
    }

    addItem(item) {
        this.items.push(item);
    }

    getItems() {
        return this.items;
    }

    getNbItems() {
        return this.items.lenght;
    }

    getColor() {
        return this.color;
    }

    getLabel() {
        return this.label;
    }
}

class TierItem {
    #title = "";
    #cover = "";

    constructor(title, cover) {
        this.title = title;
        this.cover = cover;
    }

    getTitle() {
        return this.title;
    }

    getCover() {
        return this.cover;
    }
}

const tierlistRenderer = {
    currentTierlist: null,
    interfaceNode: null,
    tierlistDisplayNode: null,
    animeSelectionNode: null,

    init() {
        const interface = document.createElement("div");
        interface.id = "tierlist-interface";
        
        const tierlistDisplay = document.createElement("div");
        tierlistDisplay.id = "tierlist-display";

        interface.append(tierlistDisplay);
        this.tierlistDisplayNode = tierlistDisplay;
        this.interfaceNode = interface;
    },

    getInterface() {
        return this.interfaceNode;
    },

    createDefaultTierlist() {
        let tierlist = new Tierlist("New Tierlist");
        for(let i = 0; i < 1; i++) {
            tierlist.getTiers()[0].addItem(new TierItem("Young Ladies Don't Play Fighting Games", "https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx128757-Iqc6hTjEYIz4.png"));
        }
        return tierlist;
    },

    openTierlist(tierlist) {
        this.currentTierlist = tierlist;
        this.displayTierlist();
    },

    displayTierlist() {
        this.tierlistDisplayNode.innerText = "";

        const titleNode = document.createElement("span");
        titleNode.classList.add("tierlist-display-title");
        titleNode.innerText = this.currentTierlist.getTitle();
        this.tierlistDisplayNode.appendChild(titleNode);

        const tiersNode = document.createElement("div");
        tiersNode.classList.add("tierlist-tiers-cont");
        for(const tier of this.currentTierlist.getTiers()) {
            const tierNode = this.renderTier(tier);
            tiersNode.append(tierNode);
        }
        this.tierlistDisplayNode.append(tiersNode);

    },

    renderTier(tier) {
        const node = document.createElement("div");
        node.classList.add("tier-cont");

        const headerNode = document.createElement("div");
        headerNode.classList.add("tier-header");
        headerNode.style.backgroundColor = tier.getColor();
        
        const headerLabelCont = document.createElement("div");
        headerLabelCont.classList.add("tier-header-label");
        const headerLabel = document.createElement("span");
        headerLabel.innerText = tier.getLabel();
        headerLabel.contentEditable = "true";
        headerLabelCont.append(headerLabel);
        headerNode.append(headerLabelCont);
        node.append(headerNode);

        const bodyNode = document.createElement("div");
        bodyNode.classList.add("tier-body");
        for(const item of tier.getItems()) {
            const itemNode = document.createElement("div");
            itemNode.classList.add("tierlist-anime-item");
            itemNode.style.backgroundImage = "url(" + item.getCover() + ")";
            itemNode.title = item.getTitle();
            itemNode.draggable = true;
            bodyNode.append(itemNode);
        }
        node.append(bodyNode);

        return node;
    }

}