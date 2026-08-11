class Tierlist {
    #id = null;
    #tiers = {};
    #title = "";

    constructor(title) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.tiers = {};
        this.addTier(new Tier("S", "#ffadad"));
        this.addTier(new Tier("A", "#ffd6a5"));
        this.addTier(new Tier("B", "#fdffb6"));
        this.addTier(new Tier("C", "#caffbf"));
        this.addTier(new Tier("D", "#9bf6ff"));
    }

    addTier(tier) {
        this.tiers[tier.getId()] = tier;
    }

    getTitle() {
        return this.title;
    }

    getTiers() {
        return this.tiers;
    }

    getTierByLabel(label) {
        const result = Object.values(this.tiers).filter(tier => tier.getLabel() === label);
        if(result.length > 0) {
            return result[0];
        }
        return null;
    }

    getTierById(id) {
        return this.tiers[id];
    }

    getNbTiers() {
        return this.tiers.length;
    }
}

class Tier {
    #id = null;
    #label = "";
    #color = "#000000";
    #items = {};
    #itemOrder = [];

    constructor(label, color) {
        this.id = crypto.randomUUID();
        this.label = label;
        this.color = color;
        this.items = {};
        this.itemOrder = [];
    }

    addItem(item, position=null) {
        this.items[item.getId()] = item;
        if(position >= 0) {
            this.itemOrder.splice(position, 0, item.getId());
        } else {
            this.itemOrder.push(item.getId());
        }
    }

    getItems() {
        return this.items;
    }

    getNbItems() {
        return this.items.length;
    }

    getColor() {
        return this.color;
    }

    getLabel() {
        return this.label;
    }

    getId() {
        return this.id;
    }

    removeItemById(id) {
        delete this.items[id];
        this.itemOrder.splice(this.itemOrder.indexOf(id), 1);
    }

    getItemById(id) {
        return this.items[id];
    }
    
    getItemIdAtPosition(position) {
        return this.itemOrder[position];
    }
}

class TierItem {
    #id = null;
    #title = "";
    #cover = "";
    #animeId = "";
    #anime = null;

    constructor(anime) {
        this.id = crypto.randomUUID();
        this.title = anime.media.title.english;
        this.cover = anime.media.coverImage.large;
        this.animeId = anime.media.id;
        this.anime = anime;
    }

    getTitle() {
        return this.title;
    }

    getCover() {
        return this.cover;
    }

    getId() {
        return this.id;
    }

    getAnime() {
        return this.anime;
    }
}

const tierlistRenderer = {
    currentTierlist: null,
    interfaceNode: null,
    tierlistDisplayNode: null,
    animeSelectionNode: null,
    previewNode: null,
    itemIdMoving: null,
    tierSourceMoving: null,

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
        for(const tier of Object.values(this.currentTierlist.getTiers())) {
            const tierNode = this.renderTier(tier);
            tiersNode.append(tierNode);
        }
        this.tierlistDisplayNode.append(tiersNode);

    },

    renderTier(tier) {
        const node = document.createElement("div");
        node.classList.add("tier-cont");
        node.id = tier.getId();

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
        bodyNode.id = tier.getId() + "-body";
        bodyNode.setAttribute("tier-id", tier.getId());
        for(const item of Object.values(tier.getItems())) {
            const itemNode = this.createItem(item, tier.getId());
            bodyNode.append(itemNode);
        }

        bodyNode.addEventListener("dragover", function(ev) {
            ev.preventDefault();
            ev.stopPropagation();
            if(ev.currentTarget !== ev.target) {
                return;
            }
            tierlistRenderer.clearPreview();
            const nodeToMove = document.getElementById(tierlistRenderer.itemIdMoving);

            let previewNode = document.createElement("div");
            previewNode.classList.add("tierlist-anime-item", "preview");
            previewNode.style.backgroundImage = nodeToMove.style.backgroundImage;

            const position = tierlistRenderer.calculatePosition(ev, nodeToMove);
            const idNodeAtRight = tierlistRenderer.currentTierlist.getTierById(ev.target.getAttribute("tier-id")).getItemIdAtPosition(position);
            previewNode.setAttribute("position", position);
            ev.target.insertBefore(previewNode, document.getElementById(idNodeAtRight));
            tierlistRenderer.previewOnList = true;
            tierlistRenderer.previewNode = previewNode;
        })

        bodyNode.addEventListener("drop", function(ev) {
            ev.preventDefault();
            
            const nodeToMove = document.getElementById(tierlistRenderer.itemIdMoving);
            nodeToMove.setAttribute("tier-id", ev.currentTarget.getAttribute("tier-id"));
            let item;
            if(tierlistRenderer.tierSourceMoving !== "0") {
                item = tierlistRenderer.currentTierlist.getTierById(tierlistRenderer.tierSourceMoving).getItemById(tierlistRenderer.itemIdMoving);
            } else {
                item = animeSelector.getItemById(tierlistRenderer.itemIdMoving)
            }

            let position = null;
            if(ev.currentTarget !== ev.target) {
                position = tierlistRenderer.previewNode.getAttribute("position");
            } else {
                position = tierlistRenderer.calculatePosition(ev, nodeToMove);
            }

            if(tierlistRenderer.tierSourceMoving !== "0") {
                tierlistRenderer.currentTierlist.getTierById(tierlistRenderer.tierSourceMoving).removeItemById(tierlistRenderer.itemIdMoving);
            } else {
                animeSelector.removeItemById(tierlistRenderer.itemIdMoving);
            }
            
            const idNodeAtRight = tierlistRenderer.currentTierlist.getTierById(ev.currentTarget.getAttribute("tier-id")).getItemIdAtPosition(position);
            ev.currentTarget.insertBefore(nodeToMove, document.getElementById(idNodeAtRight));
            tierlistRenderer.currentTierlist.getTierById(ev.currentTarget.getAttribute("tier-id")).addItem(item, position);
            tierlistRenderer.clearPreview();
        })

        node.append(bodyNode);

        return node;
    },

    savePicture() {
        domtoimage.toBlob(this.interfaceNode, {style: {"overflow": "visible"}, bgcolor: "#0b1622"}).then(blob => {
                let now = new Date();
                const imagename = 'test_' + now.getFullYear() + "_" + (now.getMonth()+1) + "_" + now.getDate() + "_" + now.getHours() + now.getMinutes() + now.getSeconds() + ".png";
                let blobUrl = URL.createObjectURL(blob);
                let link = document.createElement("a");
                link.href = blobUrl;
                link.download = imagename;
                document.body.appendChild(link);
                link.click()
                document.body.removeChild(link);
        });
    },

    copyPicture() {
        domtoimage.toBlob(this.interfaceNode, {style: {"overflow": "visible"}, bgcolor: "#0b1622"}).then(blob => {
            navigator.clipboard.write([new ClipboardItem({[blob.type]: blob})]).then(e => {
                const button = document.getElementById("copy-tierlist-button");
                const before = button.innerHTML;
                button.innerHTML = ICONS.CHECKED + " Copied";
                setTimeout(function() {
                    document.getElementById("copy-tierlist-button").innerHTML = before;
                }, 3000);
            });
        });
    },

    calculatePosition(ev, nodeToMove) {
        const widthOfItems = nodeToMove.offsetWidth + parseInt(getComputedStyle(nodeToMove).marginLeft.replace("px", ""));
        const heightOfItems = nodeToMove.offsetHeight + parseInt(getComputedStyle(nodeToMove).marginTop.replace("px", ""));
        const maxItemsOnRow = Math.floor(ev.target.offsetWidth / widthOfItems);
        let position = (Math.floor(ev.offsetX / widthOfItems) + ((maxItemsOnRow) * (Math.floor(ev.offsetY / heightOfItems))));
        if(position >= maxItemsOnRow) {
            position = position - (Math.floor(position / maxItemsOnRow))
        }
        return position;
    },

    clearPreview() {
        if(this.previewNode) {
            this.previewNode.remove();
            this.previewNode = null;
        }
    },

    createItem(item, tierId) {
        const itemNode = document.createElement("div");
        itemNode.classList.add("tierlist-anime-item");
        itemNode.style.backgroundImage = "url(" + item.getCover() + ")";
        itemNode.title = item.getTitle();
        itemNode.id = item.getId();
        itemNode.setAttribute("tier-id", tierId);
        itemNode.draggable = true;

        itemNode.addEventListener("dragstart", function (ev) {
            const tierId = ev.target.getAttribute("tier-id")
            const itemId = ev.target.id;
            tierlistRenderer.itemIdMoving = itemId;
            tierlistRenderer.tierSourceMoving = tierId;
        })

        itemNode.addEventListener("dragend", function (ev) {
            tierlistRenderer.itemIdMoving = null;
            tierlistRenderer.tierSourceMoving = null;
            tierlistRenderer.clearPreview();
        })

        itemNode.addEventListener("dblclick", function(ev) {
            ev.preventDefault();
            sidePanel.showAnimeDetails(item.anime);
        })
        return itemNode;
    }

}

const animeSelector = {
    filteredAnimes: {},
    filters: {
        season: CONST.SEASONS.SUMMER,
        year: dateUtils.getCurrentYear(),
        alreadyPlaced: [],
        nodes: {
            season: null,
            year: null
        }
    },
    node: null,
    bodyNode: null,

    applyFilters() {
        const filtered = animes.filter(anime => {
            return anime.media && anime.media.season === this.filters.season
            && anime.media.seasonYear === this.filters.year
            && !this.filters.alreadyPlaced.includes(anime.media.id);
        });
        let filteredItems = {};
        for(const anime of filtered) {
            const item = new TierItem(anime);
            filteredItems[item.getId()] = item;
        }
        this.filteredAnimes = filteredItems;
    },

    renderButtons() {
        const buttonsCont = document.createElement("div");
        buttonsCont.classList.add("anime-selector-actions");

        const seasonFilterNode = document.createElement("div");
        seasonFilterNode.classList.add("tierlist-filter");
        const seasonFilterLabel = document.createElement("span");
        seasonFilterLabel.innerText = "Season";
        seasonFilterLabel.classList.add("tierlist-filter-label");
        seasonFilterNode.append(seasonFilterLabel);
        const seasonFilterInput = document.createElement("select");
        seasonFilterInput.classList.add("tierlist-filter-select");
        for(const season of Object.values(CONST.SEASONS)) {
            const option = document.createElement("option");
            option.value = season;
            option.innerText = textUtils.capitalize(season);
            if(this.filters.season === season) {
                option.selected = true;
            }
            seasonFilterInput.append(option);
        }
        seasonFilterInput.addEventListener("change", function() {
            animeSelector.filters.season = animeSelector.filters.nodes.season.value;
            animeSelector.fillAnime();
        });
        this.filters.nodes.season = seasonFilterInput;
        seasonFilterNode.append(seasonFilterInput);
        buttonsCont.append(seasonFilterNode);

        const yearFilterNode = document.createElement("div");
        yearFilterNode.classList.add("tierlist-filter");
        const yearFilterLabel = document.createElement("span");
        yearFilterLabel.innerText = "Year";
        yearFilterLabel.classList.add("tierlist-filter-label");
        yearFilterNode.append(yearFilterLabel);
        const yearFilterInput = document.createElement("input");
        yearFilterInput.classList.add("tierlist-filter-select");
        yearFilterInput.value = this.filters.year;
        yearFilterInput.addEventListener("change", function() {
            animeSelector.filters.year = parseInt(animeSelector.filters.nodes.year.value);
            animeSelector.fillAnime();
        });
        this.filters.nodes.year = yearFilterInput;
        yearFilterNode.append(yearFilterInput);
        buttonsCont.append(yearFilterNode);

        const savePictureNode = document.createElement("button");
        savePictureNode.classList.add("button");
        savePictureNode.innerHTML = ICONS.PICTURE + " Save as PNG";
        savePictureNode.addEventListener("click", function() {
            tierlistRenderer.savePicture();
        })
        buttonsCont.append(savePictureNode);

        const copyPictureNode = document.createElement("button");
        copyPictureNode.classList.add("button");
        copyPictureNode.innerHTML = ICONS.COPY + " Copy picture";
        copyPictureNode.id = "copy-tierlist-button";
        copyPictureNode.addEventListener("click", function() {
            tierlistRenderer.copyPicture();
        })
        buttonsCont.append(copyPictureNode);

        return buttonsCont;
    },

    renderEmpty() {
        const node = document.createElement("div");
        node.id = "anime-selector-cont";
        node.append(this.renderButtons());

        const bodyNode = document.createElement("div");
        bodyNode.id = "anime-selector-body";
        this.bodyNode = bodyNode;

        node.append(bodyNode);
        this.node = node;

        this.fillAnime();
        return node;
    },

    fillAnime() {
        this.applyFilters();
        this.bodyNode.innerText = "";
        for(const anime of Object.values(this.filteredAnimes)) {
            const itemNode = tierlistRenderer.createItem(anime, "0");
            this.bodyNode.append(itemNode);
        }
    },

    getItemById(id) {
        return this.filteredAnimes[id];
    },

    removeItemById(id) {
        this.filters.alreadyPlaced.push(this.filteredAnimes[id].animeId);
        delete this.filteredAnimes[id];
    }
}