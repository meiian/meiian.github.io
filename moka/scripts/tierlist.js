class Tierlist {
    #id = null;
    #tiers = {};
    #title = "";
    #tags = [];
    #lastModified = null;

    constructor(title) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.tiers = {};
        this.addTier(new Tier("S", "#ffadad"));
        this.addTier(new Tier("A", "#ffd6a5"));
        this.addTier(new Tier("B", "#fdffb6"));
        this.addTier(new Tier("C", "#caffbf"));
        this.addTier(new Tier("D", "#9bf6ff"));
        this.tags = [];
        this.lastModified = new Date();
    }

    addTier(tier) {
        this.tiers[tier.getId()] = tier;
    }

    removeTierById(id) {
        delete this.tiers[id];
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

    toJSON() {
        let obj = {
            id: this.id,
            title: this.title,
            tags: this.tags,
            lastModified: this.lastModified,
            tiers: {}
        }
        for(const tier of Object.values(this.tiers)) {
            obj.tiers[tier.getId()] = tier.toJSON();
        }
        return obj;
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

    setColor(color) {
        this.color = color;
    }

    setLabel(label) {
        this.label = label;
    }

    toJSON() {
        let obj = {
            id: this.id,
            label: this.label,
            color: this.color,
            items: {},
            itemsOrder: this.itemOrder
        }
        for(const item of Object.values(this.items)) {
            obj.items[item.getId()] = item.toJSON();
        }
        return obj;
    }
}

class TierItem {
    #id = null;
    #title = "";
    #cover = "";
    #animeId = "";
    #anime = null;
    #deleteEvent = false;

    constructor(anime) {
        this.id = crypto.randomUUID();
        this.title = anime.media.title.english;
        this.cover = anime.media.coverImage.large;
        this.animeId = anime.media.id;
        this.anime = anime;
        this.deleteEvent = false;
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

    getAnimeId() {
        return this.animeId;
    }

    getDeleteEvent() {
        return this.deleteEvent;
    }

    activateDeleteEvent() {
        this.deleteEvent = true;
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            cover: this.cover,
            animeId: this.animeId
        }
    }
}

const tierlistRenderer = {
    currentTierlist: null,
    interfaceNode: null,
    tierlistDisplayNode: null,
    tiersContNode: null,
    animeSelectionNode: null,
    previewNode: null,
    itemIdMoving: null,
    tierSourceMoving: null,
    gapNode: null,

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
        this.tiersContNode = tiersNode;
        this.tierlistDisplayNode.append(tiersNode);

    },

    renderTier(tier) {
        const node = document.createElement("div");
        node.classList.add("tier-cont");
        node.id = tier.getId();
        node.style.setProperty("--bg-color", tier.getColor())

        const headerNode = document.createElement("div");
        headerNode.classList.add("tier-header");
        
        const headerLabelCont = document.createElement("div");
        headerLabelCont.classList.add("tier-header-label");
        const headerLabel = document.createElement("span");
        headerLabel.innerText = tier.getLabel();
        headerLabel.contentEditable = "true";
        headerLabel.addEventListener("keyup", function(ev) {
            tier.setLabel(headerLabel.innerText);
        });
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

            if(!item.getDeleteEvent()) {
                nodeToMove.addEventListener("contextmenu", function(ev) {
                    ev.preventDefault();
                    tierlistRenderer.currentTierlist.getTierById(ev.target.getAttribute("tier-id")).removeItemById(item.id);
                    nodeToMove.remove();
                    animeSelector.removeFromAnimeSelected({"item": item});
                })
                item.activateDeleteEvent();
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
        this.gapNode.style.display = "none";
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
                this.gapNode.style.display = "inline-block";
        });
    },

    copyPicture() {
        this.gapNode.style.display = "none";
        domtoimage.toBlob(this.interfaceNode, {style: {"overflow": "visible"}, bgcolor: "#0b1622"}).then(blob => {
            navigator.clipboard.write([new ClipboardItem({[blob.type]: blob})]).then(e => {
                const button = document.getElementById("copy-tierlist-button");
                const before = button.innerHTML;
                button.innerHTML = ICONS.CHECKED + " Copied";
                setTimeout(function() {
                    document.getElementById("copy-tierlist-button").innerHTML = before;
                }, 3000);
                this.gapNode.style.display = "inline-block";
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
    },

    removeTierById(id) {
        this.currentTierlist.removeTierById(id);
        document.getElementById(id).remove();
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
    popupNode: null,

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

        const filtersCont = document.createElement("div");
        filtersCont.classList.add("anime-selector-filters");
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
        filtersCont.append(seasonFilterNode);

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
        filtersCont.append(yearFilterNode);
        buttonsCont.append(filtersCont);

        const actionsCont = document.createElement("div");
        actionsCont.classList.add("anime-selector-buttons");
        const savePictureNode = document.createElement("button");
        savePictureNode.classList.add("button");
        savePictureNode.innerHTML = ICONS.PICTURE + " Save as PNG";
        savePictureNode.addEventListener("click", function() {
            tierlistRenderer.savePicture();
        })
        actionsCont.append(savePictureNode);

        const copyPictureNode = document.createElement("button");
        copyPictureNode.classList.add("button");
        copyPictureNode.innerHTML = ICONS.COPY + " Copy picture";
        copyPictureNode.id = "copy-tierlist-button";
        copyPictureNode.addEventListener("click", function() {
            tierlistRenderer.copyPicture();
        })
        actionsCont.append(copyPictureNode);

        const optionsNode = document.createElement("button");
        optionsNode.classList.add("button");
        optionsNode.innerHTML = ICONS.SETTINGS + " Options";
        optionsNode.addEventListener("click", function() {
            // show options
            renderIn("page-cont", animeSelector.showOptionsPopup(), false);
        })
        actionsCont.append(optionsNode);

        const infoNode = document.createElement("button");
        infoNode.classList.add("button");
        infoNode.innerHTML = ICONS.INFO + " Info";
        infoNode.addEventListener("click", function() {
            // show options
            renderIn("page-cont", animeSelector.showInfoPopup(), false);
        })
        actionsCont.append(infoNode);
        buttonsCont.append(actionsCont);

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

    addOverflowGap() {
        const height = this.node.offsetHeight;
        const gapNode = document.createElement("div");
        gapNode.style.setProperty("--gap-size", height + "px");
        gapNode.classList.add("vertical-gap");
        tierlistRenderer.gapNode = gapNode;
        tierlistRenderer.interfaceNode.append(gapNode);
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
    },

    showOptionsPopup() {
        const cont = document.createElement("div");
        cont.id = "popup-cont";
        cont.addEventListener("click", function(ev) {
            ev.stopPropagation();
            if(ev.target !== ev.currentTarget) {
                return ;
            }
            animeSelector.closePopup();
        })

        const popup = document.createElement("div");
        popup.id = "tierlist-options-popup";
        popup.classList.add("modal");

        const title = document.createElement("span");
        title.classList.add("modal-title");
        title.innerText = "Options";
        popup.appendChild(title);

        const tiersSubtitle = document.createElement("span");
        tiersSubtitle.classList.add("modal-subtitle");
        tiersSubtitle.innerText = "Tiers";
        popup.appendChild(tiersSubtitle);

        const tiersCont = document.createElement("div");
        tiersCont.classList.add("tierlist-options-tiers-cont");
        for (const tier of Object.values(tierlistRenderer.currentTierlist.getTiers())) {
            const tierNode = this.renderTierOption(tier);
            tiersCont.appendChild(tierNode);
        }
        popup.appendChild(tiersCont);

        const addTierButton = document.createElement("button");
        addTierButton.classList.add("button");
        addTierButton.innerHTML = "Add new tier";
        addTierButton.addEventListener("click", function(ev) {
            const newTier = new Tier("New tier", "#ffffff");
            tierlistRenderer.currentTierlist.addTier(newTier);
            tierlistRenderer.tiersContNode.appendChild(tierlistRenderer.renderTier(newTier));
            const tierNode = animeSelector.renderTierOption(newTier);
            tiersCont.appendChild(tierNode);
        });
        popup.appendChild(addTierButton);

        cont.appendChild(popup);

        this.popupNode = cont;

        return cont;
    },

    showInfoPopup() {
        const cont = document.createElement("div");
        cont.id = "popup-cont";
        cont.addEventListener("click", function(ev) {
            ev.stopPropagation();
            if(ev.target !== ev.currentTarget) {
                return ;
            }
            animeSelector.closePopup();
        })

        const popup = document.createElement("div");
        popup.id = "tierlist-infos-popup";
        popup.classList.add("modal");

        const title = document.createElement("span");
        title.classList.add("modal-title");
        title.innerText = "Info";
        popup.appendChild(title);

        const commandsSubtitle = document.createElement("span");
        commandsSubtitle.classList.add("modal-subtitle");
        commandsSubtitle.innerText = "Commands";
        popup.appendChild(commandsSubtitle);

        const commandsParagraph = document.createElement("div");
        commandsParagraph.classList.add("modal-paragraph");
        commandsParagraph.innerHTML = `
            <ul>
                <li>Add an anime in the list : <b>Drag and drop</b></li>
                <li>Remove an anime from the list : <b>Right click</b></li>
                <li>See anime info : <b>Double left click</b></li>
            </ul>
        `
        popup.appendChild(commandsParagraph);

        cont.appendChild(popup);

        this.popupNode = cont;

        return cont;
    },

    removeFromAnimeSelected(animes) {
        for(const anime of Object.values(animes)) {
            this.filters.alreadyPlaced.splice(this.filters.alreadyPlaced.indexOf(anime.getAnimeId()), 1);
        }
        this.fillAnime();
    },

    closePopup() {
        this.popupNode.remove();
        this.popupNode = null;
    },

    renderTierOption(tier) {
        const tierNode = document.createElement("div");
        tierNode.classList.add("tierlist-options-tier");
        tierNode.style.backgroundColor = tier.getColor();

        const tiersLabel = document.createElement("span");
        tiersLabel.innerText = tier.getLabel();
        tierNode.append(tiersLabel);

        const tierActions = document.createElement("div");
        tierActions.classList.add("tierlist-options-tier-actions");

        const tiersColor = document.createElement("input");
        tiersColor.value = tier.getColor();
        tiersColor.setAttribute("tier-id", tier.getId());
        tiersColor.addEventListener("change", function (ev) {
            tierlistRenderer.currentTierlist.getTierById(ev.target.getAttribute("tier-id")).setColor(ev.target.value);
            document.getElementById(ev.target.getAttribute("tier-id")).style.setProperty("--bg-color", ev.target.value);
            tierNode.style.backgroundColor = ev.target.value;
        });
        tierActions.append(tiersColor);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("tierlist-options-tier-delete");
        deleteButton.innerHTML = ICONS.CLOSE;
        deleteButton.addEventListener("click", function() {
            animeSelector.removeFromAnimeSelected(tier.getItems());
            tierlistRenderer.removeTierById(tier.getId());
            tierNode.remove();
        })
        tierActions.append(deleteButton);

        tierNode.append(tierActions);
        return tierNode;
    }
}


const tierlistStorageRenderer = {
    tierlistInStorage: {},
    interfaceNode: null,
    tierlistDisplayNode: null,

    init() {
        const interface = document.createElement("div");
        interface.id = "tierlist-storage-interface";
        
        const tierlistStorageDisplay = document.createElement("div");
        tierlistStorageDisplay.id = "tierlist-storage-display";

        interface.append(tierlistStorageDisplay);
        this.tierlistDisplayNode = tierlistStorageDisplay;
        this.interfaceNode = interface;
        this.readStorage();
    },

    readStorage() {
        const tierlists = storage.readTierlistCollection();
        if(tierlists) {
            this.tierlistInStorage = tierlists;
        }
    }
}