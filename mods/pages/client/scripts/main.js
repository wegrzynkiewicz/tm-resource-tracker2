// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

class Breaker extends Error {
    options;
    constructor(message, data){
        const { error, cause, ...others } = data ?? {};
        super(message, {
            cause: cause ?? error
        });
        this.name = "Breaker";
        this.options = data ?? {};
        const json = JSON.stringify(others);
        this.stack += `\n    with parameters ${json}.`;
        if (error) {
            this.stack += `\n    cause error:\n${error instanceof Error ? error.stack : error}.`;
        }
    }
}
function __throws(message, data) {
    throw new Breaker(message, data);
}
function assertObject(value, message, data) {
    if (typeof value !== "object" || value === null) {
        throw new Breaker(message, data);
    }
}
function assertRequiredString(value, message, data) {
    if (typeof value !== "string" || value === "") {
        __throws(message, data);
    }
}
class ServiceResolver {
    parent;
    constructor(parent = null){
        this.parent = parent;
        this.instances = new Map();
    }
    instances;
    inject(provider, instance) {
        this.instances.set(provider, instance);
    }
    get(provider) {
        const existingInstances = this.instances.get(provider);
        if (existingInstances) {
            return existingInstances;
        }
        if (this.parent) {
            return this.parent.get(provider);
        }
        return undefined;
    }
    resolve(provider) {
        const existingInstances = this.get(provider);
        if (existingInstances) {
            return existingInstances;
        }
        try {
            const instance = provider(this);
            this.instances.set(provider, instance);
            return instance;
        } catch (error) {
            throw new Breaker("error-when-resolving-provider", {
                provider: provider.name,
                error
            });
        }
    }
}
function provideGlobalContext() {
    throw new Breaker("global-context-must-be-injected");
}
function createGlobalContext() {
    const resolver = new ServiceResolver();
    const context = {
        descriptor: "/",
        identifier: {
            type: "global"
        },
        resolver
    };
    resolver.inject(provideGlobalContext, context);
    return context;
}
function createElement(tag, className = "") {
    const node = document.createElement(tag);
    node.className = className;
    return node;
}
function createTagEmpty(tag) {
    return (className)=>createElement(tag, className);
}
function createTagText(tag) {
    return (className, textContent)=>{
        const node = createElement(tag, className);
        node.textContent = textContent.toString();
        return node;
    };
}
function createTagNodes(tag) {
    return (className, children)=>{
        const node = createElement(tag, className);
        node.append(...children);
        return node;
    };
}
function createTagProps(tag) {
    return (props, attributes)=>{
        const node = createElement(tag);
        Object.assign(node, props);
        if (attributes) {
            for (const [attribute, value] of Object.entries(attributes)){
                node.setAttribute(attribute, value.toString());
            }
        }
        return node;
    };
}
function createTagAdvanced(tag) {
    return (props, children)=>{
        const node = createElement(tag);
        Object.assign(node, props);
        node.append(...children);
        return node;
    };
}
function comment(data) {
    return document.createComment(data);
}
function fragment() {
    return document.createDocumentFragment();
}
function fragment_nodes(children) {
    const node = fragment();
    node.append(...children);
    return node;
}
const button_nodes = createTagNodes("button");
const button_text = createTagText("button");
const div_empty = createTagEmpty("div");
const div_text = createTagText("div");
const div_nodes = createTagNodes("div");
createTagProps("div");
createTagAdvanced("div");
const form = createTagAdvanced("form");
const fieldset = createTagNodes("fieldset");
const input_props = createTagProps("input");
const label_props = createTagProps("label");
const legend_text = createTagText("legend");
const img_props = createTagProps("img");
const span_empty = createTagEmpty("span");
const span_props = createTagProps("span");
const span_text = createTagText("span");
class ElementSwitcher {
    root;
    elements;
    constructor(root){
        this.root = root;
        this.elements = new Map();
    }
    switch(key) {
        const element = this.elements.get(key);
        if (element === undefined) {
            throw new Breaker("not-found-element-to-switch", {
                key
            });
        }
        this.root.replaceChildren(element);
    }
}
function createPanel(nodes) {
    const $root = div_nodes("panel", nodes.map((node)=>div_nodes("panel_item", [
            node
        ])));
    $root.addEventListener("pointerdown", (event)=>{
        console.log("panel pointerdown", event);
    });
    $root.addEventListener("pointerup", (event)=>{
        console.log("panel pointerup", event);
    });
    $root.addEventListener("pointermove", (event)=>{
        console.log("panel pointermove", event);
    });
    return $root;
}
function formatCount(count) {
    if (count >= 0) {
        return `+${count}`;
    }
    return count.toString();
}
function createResource(resource) {
    const { count, target, type } = resource;
    return div_nodes(`resource _${target}`, [
        span_text("resource_label", formatCount(count)),
        img_props({
            className: "resource_icon",
            width: "32",
            height: "32",
            alt: `${type} icon`,
            src: `/images/supplies/${type}.svg`
        })
    ]);
}
class Channel {
    handlers = new Set();
    on(handle) {
        this.handlers.add({
            handle
        });
    }
    emit(event) {
        for (const handler of this.handlers){
            handler.handle(event);
        }
    }
}
const historyEntryCreatedChannel = new Channel();
function formatDate(date) {
    return date.toISOString().substring(11, 19);
}
function createHistorySingleEntry(entry) {
    const { player, resource, time } = entry;
    return div_nodes("history _background", [
        div_nodes("history_header", [
            div_empty(`player-cube _${player.color}`),
            div_text("history_name", player.name),
            createResource(resource),
            div_text("history_time", formatDate(time))
        ])
    ]);
}
function createHistorySummaryEntry(entry) {
    const { player, resources, time } = entry;
    return div_nodes("history _background", [
        div_nodes("history_header", [
            div_empty(`player-cube _${player.color}`),
            div_text("history_name", player.name),
            div_text("history_time", formatDate(time))
        ]),
        div_nodes("history_body", resources.map(createResource))
    ]);
}
function createHistoryGenerationEntry(entry) {
    const { count } = entry;
    return div_nodes("history", [
        div_text("history_generation", count.toString())
    ]);
}
function createHistoryEntry(entry) {
    switch(entry.type){
        case "single":
            return createHistorySingleEntry(entry);
        case "summary":
            return createHistorySummaryEntry(entry);
        case "generation":
            return createHistoryGenerationEntry(entry);
    }
}
function canPaintPlayerHistoryEntry(entry, panelPlayerId) {
    if (panelPlayerId === null) {
        return true;
    }
    if (entry.type === "generation") {
        return true;
    }
    if (entry.player.playerId === panelPlayerId) {
        return true;
    }
    return false;
}
function createPlayerHistory(panelPlayerId) {
    const container = div_empty("histories");
    historyEntryCreatedChannel.on((entry)=>{
        if (canPaintPlayerHistoryEntry(entry, panelPlayerId)) {
            const element = createHistoryEntry(entry);
            container.appendChild(element);
        }
    });
    return container;
}
function createHistoriesPanel() {
    return createPanel([
        createPlayerHistory(null),
        ...[
            "1"
        ].map(createPlayerHistory)
    ]);
}
const projects = [
    {
        name: "buildings"
    },
    {
        name: "energy"
    },
    {
        name: "harvest"
    },
    {
        name: "animals"
    },
    {
        name: "microbes"
    },
    {
        name: "science"
    },
    {
        name: "space"
    },
    {
        name: "saturn"
    },
    {
        name: "venus"
    },
    {
        name: "earth"
    },
    {
        name: "city"
    },
    {
        name: "event"
    }
];
function createProject({ name }) {
    return div_nodes("project", [
        button_text("box _button _project", "-"),
        img_props({
            className: "project_icon",
            width: "40",
            height: "40",
            src: `/images/projects/${name}.png`
        }),
        div_text("box _counter", "0"),
        button_text("box _button _project", "+")
    ]);
}
function createProjectsList() {
    return div_nodes("panel_item", [
        div_nodes("projects", projects.map(createProject))
    ]);
}
function createProjectsPanel() {
    return div_nodes("panel", [
        1,
        2,
        3,
        4
    ].map(createProjectsList));
}
const colors = [
    {
        key: "black",
        name: "Black"
    },
    {
        key: "blue",
        name: "Blue"
    },
    {
        key: "green",
        name: "Green"
    },
    {
        key: "red",
        name: "Red"
    },
    {
        key: "yellow",
        name: "Yellow"
    }
];
const colorByKeys = new Map(colors.map((color)=>[
        color.key,
        color
    ]));
function assertColor(key, msg) {
    assertRequiredString(key, 'color-must-be-required-string');
    const color = colorByKeys.get(key);
    assertObject(color, msg);
}
class Store {
    handlers = new Set();
    on(handler) {
        this.handlers.add(handler);
        handler(this);
    }
    emit() {
        for (const handler of this.handlers){
            handler(this);
        }
    }
}
class Collection {
    items;
    updates;
    constructor(items){
        this.items = items;
        this.updates = new Channel();
    }
    update() {
        this.updates.emit(this.items);
    }
}
class Signal {
    value;
    handlers;
    constructor(value){
        this.value = value;
        this.handlers = new Set();
    }
    on(handler) {
        this.handlers.add(handler);
        handler(this.value);
    }
    emit() {
        for (const handler of this.handlers){
            handler(this.value);
        }
    }
}
const createSVGElement = (tag)=>document.createElementNS("http://www.w3.org/2000/svg", tag);
function svg_icon(className, icon) {
    const svg = createSVGElement("svg");
    svg.setAttribute("class", className);
    const use = createSVGElement("use");
    use.setAttribute("href", `/images/symbols.svg#icon-${icon}`);
    svg.appendChild(use);
    return svg;
}
function onClick(element, listener) {
    element.addEventListener("click", function onClickWrapper(event) {
        event.preventDefault();
        event.stopPropagation();
        listener.call(this, event);
    });
}
function createSelectorOption(option) {
    const { key, name } = option;
    const content = div_nodes("selector_panel-item", [
        span_empty(`player-cube _${key}`),
        span_text("text", name)
    ]);
    content.dataset.key = key;
    return content;
}
class SelectorStore extends Store {
    options;
    index;
    constructor(options){
        super();
        this.options = options;
        this.index = 0;
    }
    setValue(value) {
        const index = this.options.findIndex((option)=>option.key === value);
        if (index !== -1) {
            this.index = index;
            this.emit();
        }
    }
    getValue() {
        return this.options[this.index];
    }
    dec() {
        if (this.index > 0) {
            this.index -= 1;
            this.emit();
        }
    }
    inc() {
        if (this.index < this.options.length - 1) {
            this.index += 1;
            this.emit();
        }
    }
}
function createSelector(options) {
    const store = new SelectorStore(options);
    const $left = svg_icon("selector_icon", "arrow-left");
    const $right = svg_icon("selector_icon", "arrow-right");
    const $panel = div_nodes("selector_panel", [
        div_nodes("selector_panel-container", options.map(createSelectorOption))
    ]);
    const $root = div_nodes("selector", [
        $left,
        $panel,
        $right
    ]);
    store.on(({ index })=>{
        $panel.style.setProperty("--index", `${index}`);
        $left.classList.toggle("_disabled", index === 0);
        $right.classList.toggle("_disabled", index === options.length - 1);
    });
    onClick($left, ()=>store.dec());
    onClick($right, ()=>store.inc());
    return {
        $root,
        store
    };
}
function createPersonalInfo() {
    return fieldset("space_container", [
        legend_text("space_caption", "Personal info"),
        div_nodes("edit-box _input", [
            label_props({
                className: "edit-box_label",
                for: "player-name",
                textContent: "Name"
            }),
            input_props({
                autocomplete: "off",
                className: "edit-box_input",
                name: "player-name",
                type: "text",
                placeholder: "Your name"
            })
        ]),
        div_nodes("edit-box _selector", [
            label_props({
                className: "edit-box_label",
                for: "player-color",
                textContent: "Color"
            }),
            createSelector(colors).$root
        ])
    ]);
}
function createGenerals() {
    let quit;
    const root = fieldset("space_container", [
        legend_text("space_caption", "Generals"),
        div_nodes("edit-box _input", [
            label_props({
                className: "edit-box_label",
                for: "game-id",
                textContent: "GameID"
            }),
            input_props({
                readOnly: true,
                autocomplete: "off",
                className: "edit-box_input",
                name: "game-id",
                type: "text",
                placeholder: "GameID"
            })
        ]),
        quit = button_text("box _action", "Quit game")
    ]);
    quit.addEventListener("click", (event)=>{
        event.preventDefault();
    });
    return root;
}
function createAdmin() {
    let production, subtract;
    const root = fieldset("space_container", [
        legend_text("space_caption", "Admin settings"),
        production = button_text("box _action", "Turn to production phase"),
        subtract = button_text("box _action", "Subtract each player's terraforming rate")
    ]);
    return root;
}
function createSettings() {
    return form({
        className: "space"
    }, [
        createPersonalInfo(),
        createGenerals(),
        createAdmin()
    ]);
}
function createResourceDefinitionItem({ type, minAmount, minProd, processor }) {
    return {
        type,
        targets: {
            production: {
                min: minProd ?? 0,
                processor: processor ?? processNormalProduction
            },
            amount: {
                min: minAmount ?? 0
            }
        }
    };
}
function processNormalProduction(store, type) {
    store[type].amount += store[type].production;
}
function processPointsProduction(store) {
    store.gold.amount += store.points.amount;
}
function processEnergyProduction(store) {
    store.heat.amount += store.energy.amount;
    store.energy.amount = store.energy.production;
}
const resources = [
    createResourceDefinitionItem({
        type: "points",
        minAmount: 1,
        processor: processPointsProduction
    }),
    createResourceDefinitionItem({
        type: "gold",
        minProd: -5
    }),
    createResourceDefinitionItem({
        type: "steel"
    }),
    createResourceDefinitionItem({
        type: "titan"
    }),
    createResourceDefinitionItem({
        type: "plant"
    }),
    createResourceDefinitionItem({
        type: "energy",
        processor: processEnergyProduction
    }),
    createResourceDefinitionItem({
        type: "heat"
    })
];
const resourcesByType = {
    points: resources[0],
    gold: resources[1],
    steel: resources[2],
    titan: resources[3],
    plant: resources[4],
    energy: resources[5],
    heat: resources[6]
};
function createResourceTargets(amount = 0, production = 0) {
    return {
        amount,
        production
    };
}
function createResourceGroup(points) {
    return {
        points: createResourceTargets(points),
        gold: createResourceTargets(),
        steel: createResourceTargets(),
        titan: createResourceTargets(),
        plant: createResourceTargets(),
        energy: createResourceTargets(),
        heat: createResourceTargets()
    };
}
function indent(data, delimiter) {
    return data.split("\n").map((line)=>`${delimiter}${line}`).join("\n");
}
function withResolvers() {
    let resolve, reject;
    const promise = new Promise((res, rej)=>{
        resolve = res;
        reject = rej;
    });
    return {
        promise,
        resolve,
        reject
    };
}
function sleep(duration) {
    return new Promise((resolve)=>setTimeout(resolve, duration));
}
function createCalculatorButton(digit) {
    const root = button_text("box _button _project", digit.toString());
    root.dataset.digit = digit.toString();
    return root;
}
class CalculatorStore extends Store {
    digits = "0";
    positive = true;
    append(digit) {
        if (this.digits.length >= 3) {
            return;
        }
        this.digits = this.digits === "0" ? digit : `${this.digits}${digit}`;
        this.emit();
    }
    clear() {
        this.digits = "0";
        this.positive = true;
        this.emit();
    }
    reverse() {
        this.positive = !this.positive;
        this.emit();
    }
    getValue() {
        return parseInt(this.digits) * (this.positive ? 1 : -1);
    }
}
function createSupplyModal(options) {
    const { target, type, count } = options;
    const min = resourcesByType[type].targets[target].min;
    const $input = div_text("box _counter _wide", "0");
    const $cancel = button_text("box _button", "Cancel");
    const $confirm = button_text("box _button", "Confirm");
    const $operator = button_text("box _button _project", "-");
    const $clear = button_text("box _button _project", "C");
    const $calculator = div_nodes("calculator", [
        ...[
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9
        ].map(createCalculatorButton),
        $operator,
        createCalculatorButton(0),
        $clear
    ]);
    const $root = div_nodes("modal", [
        div_nodes("modal_background", [
            div_nodes("modal_container", [
                div_text("modal_title", `Change your ${target}:`),
                div_nodes("modal_target", [
                    div_nodes(`modal_target-supply _${target}`, [
                        div_text("box _counter", count.toString())
                    ]),
                    img_props({
                        className: "modal_target-icon",
                        width: "64",
                        height: "64",
                        alt: "supply-icon",
                        src: `/images/supplies/${type}.svg`
                    })
                ]),
                div_nodes("modal_count", [
                    span_text("modal_count-label _left", "by"),
                    $input,
                    span_text("modal_count-label _right", "units")
                ]),
                $calculator,
                div_nodes("modal_buttons", [
                    $cancel,
                    $confirm
                ])
            ])
        ])
    ]);
    const store = new CalculatorStore();
    store.on((store)=>{
        const { digits, positive } = store;
        $input.textContent = `${positive ? "" : "-"}${digits}`;
        $operator.textContent = positive ? "-" : "+";
        const valid = count + store.getValue() < min;
        $confirm.toggleAttribute("disabled", valid);
    });
    onClick($calculator, (event)=>{
        const $target = event.target;
        const digit = $target.dataset.digit;
        if (digit === undefined) {
            return;
        }
        store.append(digit);
    });
    onClick($operator, ()=>store.reverse());
    onClick($clear, ()=>store.clear());
    const { promise, resolve } = withResolvers();
    onClick($cancel, ()=>{
        resolve({
            type: "cancel"
        });
    });
    onClick($confirm, ()=>{
        resolve({
            type: "confirm",
            value: store.getValue(),
            resource: options
        });
    });
    return {
        promise,
        $root,
        store
    };
}
class ModalManager {
    $root = comment('modal-manager-anchor');
    $overlay = div_empty("app_content-overlay");
    style = getComputedStyle(this.$overlay);
    async mount(modal) {
        const { $root, $overlay } = this;
        $root.after($overlay);
        await sleep(1);
        $overlay.classList.add("_enabled");
        $overlay.appendChild(modal.$root);
        await modal.promise;
        $overlay.classList.remove("_enabled");
        await sleep(200);
        $overlay.replaceChildren();
        $overlay.remove();
    }
}
function provideModalManager() {
    return new ModalManager();
}
class Supplies {
    modalManager;
    $root;
    signal;
    constructor(modalManager){
        this.modalManager = modalManager;
        this.signal = new Signal(createResourceGroup(20));
        this.$root = div_nodes("supplies", [
            div_empty("supplies_production"),
            div_text("supplies_round", "0"),
            ...this.generateSupplies()
        ]);
    }
    async whenSupplyClicked({ type, target }) {
        const count = this.signal.value[type][target];
        const modal = createSupplyModal({
            type,
            target,
            count
        });
        this.modalManager.mount(modal);
        const result = await modal.promise;
        if (result.type === "cancel") {
            return;
        }
        this.signal.value[type][target] = result.value;
        this.signal.emit();
    }
    *generateSupplies() {
        for (const { type } of resources){
            yield this.createSupply("production", type);
            yield div_nodes(`supply _icon _${type}`, [
                img_props({
                    className: "supply_icon",
                    width: "64",
                    height: "64",
                    alt: "supply-icon",
                    src: `/images/supplies/${type}.svg`
                })
            ]);
            yield this.createSupply("amount", type);
        }
    }
    createSupply(target, type) {
        const $counter = div_text("box _counter", "0");
        const $root = div_nodes(`supply _${target} _${type}`, [
            $counter
        ]);
        this.signal.on((value)=>{
            const count = value[type][target];
            $counter.textContent = count.toString();
        });
        onClick($counter, ()=>this.whenSupplyClicked({
                type,
                target
            }));
        return $root;
    }
}
function createSuppliesPanel() {
    const modalManager = new ModalManager();
    return createPanel([
        1,
        2,
        3
    ].map(()=>new Supplies(modalManager).$root));
}
const buttons = [
    {
        key: "supplies",
        icon: "box",
        name: "Supplies"
    },
    {
        key: "projects",
        icon: "projects",
        name: "Projects"
    },
    {
        key: "histories",
        icon: "clock",
        name: "History"
    },
    {
        key: "settings",
        icon: "gear",
        name: "Settings"
    }
];
const toolbarClickChannel = new Channel();
function createToolbarButton(button) {
    const { key, icon, name } = button;
    const root = button_nodes("toolbar_item", [
        svg_icon("toolbar_icon", icon),
        span_text("toolbar_label", name)
    ]);
    root.addEventListener("click", ()=>{
        toolbarClickChannel.emit({
            key
        });
    });
    toolbarClickChannel.on(({ key })=>{
        root.classList.toggle("_active", button.key === key);
    });
    return root;
}
function createToolbar() {
    return div_nodes("toolbar", buttons.map(createToolbarButton));
}
function createScroll() {
    const $detectorTop = div_empty("scroll_detector _top");
    const $content = div_empty("app_content");
    const $detectorBottom = div_empty("scroll_detector _bottom");
    const $root = div_nodes("app_main scroll", [
        div_nodes("scroll_container", [
            $detectorTop,
            $content,
            $detectorBottom
        ])
    ]);
    const $shadowTop = div_empty("app_shadow _top");
    const $shadowBottom = div_empty("app_shadow _bottom");
    const $fragment = fragment_nodes([
        $root,
        $shadowTop,
        $shadowBottom
    ]);
    const map = new WeakMap([
        [
            $detectorTop,
            $shadowTop
        ],
        [
            $detectorBottom,
            $shadowBottom
        ]
    ]);
    const callback = (entries)=>{
        for (const entry of entries){
            const target = entry.target;
            const shadow = map.get(target);
            shadow.classList.toggle(`_enabled`, !entry.isIntersecting);
        }
    };
    const options = {
        root: $root,
        threshold: [
            1.0
        ]
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe($detectorTop);
    observer.observe($detectorBottom);
    return {
        $fragment,
        $content
    };
}
class TopView {
    $root;
    $label;
    $controller;
    constructor(){
        this.$label = div_text("top_label", "TM Resource Tracker v2");
        const color = createSelector(colors);
        this.$controller = div_nodes("top_controller", [
            color.$root
        ]);
        this.$root = div_nodes("top", [
            this.$label
        ]);
    }
    setLabel(label) {
        this.$label.textContent = label;
    }
}
function provideTopView() {
    return new TopView();
}
function createLoading() {
    const $root = div_text("loading", "Loading...");
    return $root;
}
function createEditBox({ label, name, placeholder }) {
    const $input = input_props({
        autocomplete: "off",
        className: "edit-box_input",
        id: name,
        name,
        type: "text",
        placeholder: placeholder ?? ""
    });
    const $root = div_nodes("edit-box _input", [
        label_props({
            className: "edit-box_label",
            textContent: label
        }, {
            for: name
        }),
        $input
    ]);
    return {
        $root,
        $input
    };
}
function createColorSelectorBox() {
    const color = createSelector(colors);
    const $root = div_nodes("edit-box _selector", [
        span_props({
            className: "edit-box_label",
            textContent: "Color"
        }),
        color.$root
    ]);
    return {
        $root,
        store: color.store
    };
}
function createJoinModal() {
    const gameBox = createEditBox({
        label: "Game ID",
        name: "gameId",
        placeholder: "Ask your friend"
    });
    const nameBox = createEditBox({
        label: "Name",
        name: "player-name",
        placeholder: "Your name"
    });
    const colorBox = createColorSelectorBox();
    const $cancel = div_text("box _button", "Cancel");
    const $join = div_text("box _button", "Join");
    const $root = div_nodes("modal", [
        div_nodes("modal_background", [
            div_nodes("modal_container", [
                div_text("modal_title", "Type game ID and your details:"),
                gameBox.$root,
                nameBox.$root,
                colorBox.$root,
                div_nodes("modal_buttons", [
                    $cancel,
                    $join
                ])
            ])
        ])
    ]);
    const { promise, resolve } = withResolvers();
    onClick($cancel, ()=>{
        resolve({
            type: "cancel"
        });
    });
    onClick($join, ()=>{
        const gameId = gameBox.$input.value;
        const name = nameBox.$input.value;
        const color = colorBox.store.getValue().key;
        assertColor(color, "color-must-be-valid-key");
        assertRequiredString(name, "name-must-be-required-string");
        assertRequiredString(gameId, "game-id-must-be-required-string");
        const value = {
            color,
            gameId,
            name
        };
        resolve({
            type: "confirm",
            value
        });
    });
    return {
        promise,
        $root
    };
}
function provideCreateGameChannel() {
    return new Channel();
}
function provideJoinGameChannel() {
    return new Channel();
}
function createPlayerModal(input) {
    const { name, color } = input ?? {};
    const nameBox = createEditBox({
        label: "Name",
        name: "name",
        placeholder: "Your name"
    });
    nameBox.$input.value = name ?? '';
    const colorBox = createColorSelectorBox();
    color && colorBox.store.setValue(color);
    const $cancel = div_text("box _button", "Cancel");
    const $create = div_text("box _button", "Create");
    const $root = form({
        className: "modal"
    }, [
        div_nodes("modal_background", [
            div_nodes("modal_container", [
                div_text("modal_title", "Type your name and choose a color:"),
                nameBox.$root,
                colorBox.$root,
                div_nodes("modal_buttons", [
                    $cancel,
                    $create
                ])
            ])
        ])
    ]);
    const { promise, resolve } = withResolvers();
    onClick($cancel, ()=>{
        resolve({
            type: "cancel"
        });
    });
    onClick($create, ()=>{
        const name = nameBox.$input.value;
        const color = colorBox.store.getValue().key;
        assertColor(color, "color-must-be-valid-key");
        assertRequiredString(name, "name-must-be-required-string");
        const value = {
            color,
            name
        };
        resolve({
            type: "confirm",
            value
        });
    });
    return {
        promise,
        $root
    };
}
class HomepageView {
    modalManager;
    createGameChannel;
    joinGameChannel;
    $root;
    constructor(modalManager, createGameChannel, joinGameChannel){
        this.modalManager = modalManager;
        this.createGameChannel = createGameChannel;
        this.joinGameChannel = joinGameChannel;
        const $create = button_text("box _action", "New Game");
        const $join = button_text("box _action", "Join the Game");
        const $about = button_text("box _action", "About");
        this.$root = div_nodes("homepage", [
            $create,
            $join,
            $about
        ]);
        onClick($create, ()=>this.whenCreateGameClicked());
        onClick($join, ()=>this.whenJoinGameClicked());
    }
    async whenCreateGameClicked() {
        const modal = createPlayerModal();
        this.modalManager.mount(modal);
        const result = await modal.promise;
        if (result.type === "cancel") {
            return;
        }
        this.createGameChannel.emit(result.value);
    }
    async whenJoinGameClicked() {
        const modal = createJoinModal();
        this.modalManager.mount(modal);
        const result = await modal.promise;
        if (result.type === "cancel") {
            return;
        }
        this.joinGameChannel.emit(result.value);
    }
}
function provideHomepageView(resolver) {
    return new HomepageView(resolver.resolve(provideModalManager), resolver.resolve(provideCreateGameChannel), resolver.resolve(provideJoinGameChannel));
}
function provideClientConfig() {
    return {
        apiUrl: "http://localhost:3008",
        title: "TM Resource Tracker v2",
        wsURL: "ws://localhost:3008"
    };
}
const examples = [
    {
        historyEntryId: "1",
        player: {
            playerId: "1",
            name: "Player 1",
            color: "red"
        },
        type: "single",
        resource: {
            count: -22,
            target: "amount",
            type: "gold"
        },
        time: new Date()
    },
    {
        historyEntryId: "2",
        player: {
            playerId: "2",
            name: "Player 2",
            color: "blue"
        },
        type: "summary",
        resources: [
            {
                count: 24,
                target: "amount",
                type: "gold"
            },
            {
                count: 2,
                target: "amount",
                type: "steel"
            },
            {
                count: 2,
                target: "amount",
                type: "points"
            }
        ],
        time: new Date()
    },
    {
        historyEntryId: "4",
        type: "generation",
        count: 14,
        time: new Date()
    },
    {
        historyEntryId: "3",
        player: {
            playerId: "3",
            name: "Bardzo długie imię gracza, żę jooo i trochę",
            color: "green"
        },
        type: "single",
        resource: {
            count: -11,
            target: "production",
            type: "titan"
        },
        time: new Date()
    }
];
new Channel();
class AppView {
    clientConfig;
    homepageView;
    modalManager;
    top;
    $root;
    $content;
    $toolbar;
    $loading;
    constructor(clientConfig, homepageView, modalManager, top){
        this.clientConfig = clientConfig;
        this.homepageView = homepageView;
        this.modalManager = modalManager;
        this.top = top;
        this.$loading = createLoading();
        const scroll = createScroll();
        this.$content = scroll.$content;
        this.$toolbar = createToolbar();
        const switcher = new ElementSwitcher(scroll.$content);
        switcher.elements.set("loading", createLoading());
        switcher.elements.set("supplies", createSuppliesPanel());
        switcher.elements.set("projects", createProjectsPanel());
        switcher.elements.set("histories", createHistoriesPanel());
        switcher.elements.set("settings", createSettings());
        historyEntryCreatedChannel.emit(examples[0]);
        historyEntryCreatedChannel.emit(examples[1]);
        historyEntryCreatedChannel.emit(examples[2]);
        historyEntryCreatedChannel.emit(examples[3]);
        toolbarClickChannel.on(({ key })=>{
            switcher.switch(key);
        });
        this.$root = div_nodes("app", [
            top.$root,
            scroll.$fragment,
            this.modalManager.$root,
            this.$toolbar
        ]);
        this.loading();
    }
    mount($element) {
        this.$content.replaceChildren($element);
    }
    showToolbar() {
        this.$root.classList.add("_with-toolbar");
        this.$toolbar.classList.remove("_hidden");
    }
    hideToolbar() {
        this.$root.classList.remove("_with-toolbar");
        this.$toolbar.classList.add("_hidden");
    }
    homepage() {
        this.top.setLabel(this.clientConfig.title);
        this.mount(this.homepageView.$root);
        this.hideToolbar();
    }
    loading() {
        this.top.setLabel(this.clientConfig.title);
        this.mount(this.$loading);
        this.hideToolbar();
    }
}
function provideAppView(resolver) {
    return new AppView(resolver.resolve(provideClientConfig), resolver.resolve(provideHomepageView), resolver.resolve(provideModalManager), resolver.resolve(provideTopView));
}
function provideQuitGameChannel() {
    return new Channel();
}
function createQuitGameModal() {
    const $cancel = div_text("box _button", "Cancel");
    const $quit = div_text("box _button", "Quit");
    const $root = form({
        className: "modal"
    }, [
        div_nodes("modal_background", [
            div_nodes("modal_container", [
                div_text("modal_title", "Do you want to quit the game?"),
                div_nodes("modal_buttons", [
                    $cancel,
                    $quit
                ])
            ])
        ])
    ]);
    const { promise, resolve } = withResolvers();
    onClick($cancel, ()=>{
        resolve({
            type: "cancel"
        });
    });
    onClick($quit, ()=>{
        resolve({
            type: "confirm",
            value: null
        });
    });
    return {
        promise,
        $root
    };
}
var LogSeverity;
(function(LogSeverity) {
    LogSeverity[LogSeverity["SILLY"] = 1] = "SILLY";
    LogSeverity[LogSeverity["DEBUG"] = 2] = "DEBUG";
    LogSeverity[LogSeverity["INFO"] = 3] = "INFO";
    LogSeverity[LogSeverity["NOTICE"] = 4] = "NOTICE";
    LogSeverity[LogSeverity["WARN"] = 5] = "WARN";
    LogSeverity[LogSeverity["ERROR"] = 6] = "ERROR";
    LogSeverity[LogSeverity["FATAL"] = 7] = "FATAL";
})(LogSeverity || (LogSeverity = {}));
const logSeverityNames = {
    [1]: "SILLY",
    [2]: "DEBUG",
    [3]: "INFO",
    [4]: "NOTICE",
    [5]: "WARN",
    [6]: "ERROR",
    [7]: "FATAL"
};
const mapSeverityToConsoleMethod = {
    [1]: console.debug,
    [2]: console.debug,
    [3]: console.info,
    [4]: console.info,
    [5]: console.warn,
    [6]: console.error,
    [7]: console.error
};
function provideLogger() {
    throw new Breaker("logger-must-be-injected");
}
function readyStateToString(readyState) {
    switch(readyState){
        case WebSocket.CONNECTING:
            return "CONNECTING";
        case WebSocket.OPEN:
            return "OPEN";
        case WebSocket.CLOSING:
            return "CLOSING";
        case WebSocket.CLOSED:
            return "CLOSED";
        default:
            return "UNKNOWN";
    }
}
class WebSocketChannel {
    logger;
    ws;
    ready;
    opens;
    closes;
    messages;
    errors;
    constructor(logger, ws){
        this.logger = logger;
        this.ws = ws;
        this.opens = new Channel();
        this.closes = new Channel();
        this.messages = new Channel();
        this.errors = new Channel();
        const open = withResolvers();
        this.ready = open.promise;
        ws.addEventListener("open", (event)=>{
            const readyState = readyStateToString(ws.readyState);
            this.logger.silly("open-web-socket-channel", {
                readyState
            });
            open.resolve();
            try {
                this.opens.emit(event);
            } catch (error) {
                this.logger.error("error-inside-web-socket-channel-open-listener", {
                    error,
                    readyState
                });
            }
        });
        ws.addEventListener("close", (event)=>{
            const readyState = readyStateToString(ws.readyState);
            const { code, reason } = event;
            this.logger.silly("close-web-socket-channel", {
                code,
                readyState,
                reason
            });
            try {
                this.closes.emit(event);
            } catch (error) {
                this.logger.error("error-inside-web-socket-channel-close-listener", {
                    code,
                    error,
                    readyState,
                    reason
                });
            }
        });
        ws.addEventListener("message", (event)=>{
            const readyState = readyStateToString(ws.readyState);
            const data = typeof event.data === "string" ? event.data : "binary";
            this.logger.silly("incoming-message-web-socket-channel", {
                data,
                readyState
            });
            try {
                this.messages.emit(event);
            } catch (error) {
                this.logger.error("error-inside-web-socket-channel-message-listener", {
                    data,
                    error,
                    readyState
                });
            }
        });
        ws.addEventListener("error", (event)=>{
            const readyState = readyStateToString(ws.readyState);
            this.logger.silly("error-web-socket-channel", {
                readyState
            });
            try {
                this.errors.emit(event);
            } catch (error) {
                this.logger.error("error-inside-web-socket-channel-error-listener", {
                    error,
                    readyState
                });
            }
        });
    }
    send(data) {
        const readyState = readyStateToString(this.ws.readyState);
        this.logger.silly("outgoing-message-web-socket-channel", {
            data,
            readyState
        });
        this.ws.send(data);
    }
    close() {
        this.ws.close();
    }
}
function provideWebSocket() {
    throw new Error('web-socket-must-be-injected');
}
function provideWebSocketChannel(resolver) {
    return new WebSocketChannel(resolver.resolve(provideLogger), resolver.resolve(provideWebSocket));
}
class GADispatcher {
    logger;
    webSocketChannel;
    constructor(logger, webSocketChannel){
        this.logger = logger;
        this.webSocketChannel = webSocketChannel;
    }
    send(definition, body) {
        const { kind } = definition;
        body = body ?? {};
        const envelope = {
            kind,
            body
        };
        this.logger.debug(`dispatcher-send`, {
            envelope
        });
        const data = JSON.stringify(envelope);
        this.webSocketChannel.send(data);
    }
}
function provideGADispatcher(resolver) {
    return new GADispatcher(resolver.resolve(provideLogger), resolver.resolve(provideWebSocketChannel));
}
const URL_SAFE_CHARACTERS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~".split("");
const NUMERIC_CHARACTERS = "0123456789".split("");
const DISTINGUISHABLE_CHARACTERS = "CDEHKMPRTUWXY012458".split("");
const ASCII_PRINTABLE_CHARACTERS = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~".split("");
const ALPHANUMERIC_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
const ALLOWED_TYPES = [
    undefined,
    "hex",
    "base64",
    "url-safe",
    "numeric",
    "distinguishable",
    "ascii-printable",
    "alphanumeric"
];
const hexTable = new TextEncoder().encode("0123456789abcdef");
function encodedLen(n) {
    return n * 2;
}
function encode(src) {
    const dst = new Uint8Array(encodedLen(src.length));
    for(let i = 0; i < dst.length; i++){
        const v = src[i];
        dst[i * 2] = hexTable[v >> 4];
        dst[i * 2 + 1] = hexTable[v & 0x0f];
    }
    return dst;
}
function encodeToString(src) {
    return new TextDecoder().decode(encode(src));
}
const base64abc = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "/"
];
function encode1(data) {
    const uint8 = typeof data === "string" ? new TextEncoder().encode(data) : data instanceof Uint8Array ? data : new Uint8Array(data);
    let result = "", i;
    const l = uint8.length;
    for(i = 2; i < l; i += 3){
        result += base64abc[uint8[i - 2] >> 2];
        result += base64abc[(uint8[i - 2] & 0x03) << 4 | uint8[i - 1] >> 4];
        result += base64abc[(uint8[i - 1] & 0x0f) << 2 | uint8[i] >> 6];
        result += base64abc[uint8[i] & 0x3f];
    }
    if (i === l + 1) {
        result += base64abc[uint8[i - 2] >> 2];
        result += base64abc[(uint8[i - 2] & 0x03) << 4];
        result += "==";
    }
    if (i === l) {
        result += base64abc[uint8[i - 2] >> 2];
        result += base64abc[(uint8[i - 2] & 0x03) << 4 | uint8[i - 1] >> 4];
        result += base64abc[(uint8[i - 1] & 0x0f) << 2];
        result += "=";
    }
    return result;
}
const MAX_RANDOM_VALUES = 65536;
function randomBytes(size) {
    if (size > 4294967295) {
        throw new RangeError(`The value of "size" is out of range. It must be >= 0 && <= ${4294967295}. Received ${size}`);
    }
    const bytes = new Uint8Array(size);
    if (size > 65536) {
        for(let generated = 0; generated < size; generated += MAX_RANDOM_VALUES){
            crypto.getRandomValues(bytes.subarray(generated, generated + 65536));
        }
    } else {
        crypto.getRandomValues(bytes);
    }
    return bytes;
}
const generateForCustomCharacters = (length, characters)=>{
    const characterCount = characters.length;
    const maxValidSelector = Math.floor(0x10000 / characterCount) * characterCount - 1;
    const entropyLength = 2 * Math.ceil(1.1 * length);
    let string = "";
    let stringLength = 0;
    while(stringLength < length){
        const entropy = randomBytes(entropyLength);
        let entropyPosition = 0;
        while(entropyPosition < entropyLength && stringLength < length){
            const entropyValue = new DataView(entropy.buffer, entropy.byteOffset, entropy.byteLength).getUint16(entropyPosition, true);
            entropyPosition += 2;
            if (entropyValue > maxValidSelector) {
                continue;
            }
            string += characters[entropyValue % characterCount];
            stringLength++;
        }
    }
    return string;
};
const generateRandomBytes = (byteLength, type, length)=>{
    const bytes = randomBytes(byteLength);
    const str = type === "base64" ? encode1(bytes) : encodeToString(bytes);
    return str.slice(0, length);
};
const createGenerator = (generateForCustomCharacters, generateRandomBytes)=>({ length, type, characters })=>{
        if (!(length >= 0 && Number.isFinite(length))) {
            throw new TypeError("Expected a `length` to be a non-negative finite number");
        }
        if (type !== undefined && characters !== undefined) {
            throw new TypeError("Expected either `type` or `characters`");
        }
        if (characters !== undefined && typeof characters !== "string") {
            throw new TypeError("Expected `characters` to be string");
        }
        if (!ALLOWED_TYPES.includes(type)) {
            throw new TypeError(`Unknown type: ${type}`);
        }
        if (type === undefined && characters === undefined) {
            type = "hex";
        }
        if (type === "hex") {
            return generateRandomBytes(Math.ceil(length * 0.5), "hex", length);
        }
        if (type === "base64") {
            return generateRandomBytes(Math.ceil(length * 0.75), "base64", length);
        }
        if (type === "url-safe") {
            return generateForCustomCharacters(length, URL_SAFE_CHARACTERS);
        }
        if (type === "numeric") {
            return generateForCustomCharacters(length, NUMERIC_CHARACTERS);
        }
        if (type === "distinguishable") {
            return generateForCustomCharacters(length, DISTINGUISHABLE_CHARACTERS);
        }
        if (type === "ascii-printable") {
            return generateForCustomCharacters(length, ASCII_PRINTABLE_CHARACTERS);
        }
        if (type === "alphanumeric") {
            return generateForCustomCharacters(length, ALPHANUMERIC_CHARACTERS);
        }
        if (characters !== undefined && characters.length === 0) {
            throw new TypeError("Expected `characters` string length to be greater than or equal to 1");
        }
        if (characters !== undefined && characters.length > 0x10000) {
            throw new TypeError("Expected `characters` string length to be less or equal to 65536");
        }
        return generateForCustomCharacters(length, characters.split(""));
    };
createGenerator(generateForCustomCharacters, generateRandomBytes);
class BasicLogger {
    channel;
    logBus;
    params;
    constructor(channel, logBus, params){
        this.channel = channel;
        this.logBus = logBus;
        this.params = params;
    }
    log(severity, message, data = {}) {
        this.logBus.dispatch({
            channel: this.channel,
            date: new Date(),
            severity,
            message,
            data: {
                ...this.params,
                ...data
            }
        });
    }
    silly(message, data) {
        this.log(LogSeverity.SILLY, message, data);
    }
    debug(message, data) {
        this.log(LogSeverity.DEBUG, message, data);
    }
    info(message, data) {
        this.log(LogSeverity.INFO, message, data);
    }
    notice(message, data) {
        this.log(LogSeverity.NOTICE, message, data);
    }
    warn(message, data) {
        this.log(LogSeverity.WARN, message, data);
    }
    error(message, data) {
        this.log(LogSeverity.ERROR, message, data);
    }
    fatal(message, data) {
        this.log(LogSeverity.FATAL, message, data);
    }
}
class BasicLogFilter {
    minSeverity;
    constructor(minSeverity){
        this.minSeverity = minSeverity;
    }
    filter(log) {
        if (log.severity < this.minSeverity) {
            return false;
        }
        return true;
    }
}
class BasicLogSubscriber {
    filter;
    formatter;
    constructor(filter, formatter){
        this.filter = filter;
        this.formatter = formatter;
    }
    async subscribe(log) {
        if (this.filter.filter(log) === false) {
            return;
        }
        const formatted = this.formatter.format(log);
        console.log(formatted);
    }
}
class BrowserLogSubscriber {
    filter;
    constructor(filter){
        this.filter = filter;
    }
    async subscribe(log) {
        if (this.filter.filter(log) === false) {
            return;
        }
        const { channel, data, severity, message } = log;
        const method = mapSeverityToConsoleMethod[severity];
        method.call(console, `[${channel}] ${message}`, data);
    }
}
class PrettyLogFormatter {
    format(log) {
        const { channel, data, date, severity, message } = log;
        const severityName = logSeverityNames[severity];
        const dateTime = date.toISOString();
        const params = this.formatData(data);
        return `${dateTime} [${severityName}] [${channel}] ${message}${params}`;
    }
    formatData(data) {
        if (Object.keys(data).length === 0) {
            return `\n`;
        }
        const { error, ...others } = data;
        let msg = `\n`;
        if (Object.keys(others).length > 0) {
            const json = JSON.stringify(others, null, 2);
            msg += `${indent(json, "  ")}\n`;
        }
        if (error instanceof Error) {
            msg += `${indent(error.stack ?? "", "  ")}\n`;
        }
        return msg;
    }
}
class MainLogBus {
    subscribers = new Set();
    async dispatch(log) {
        for (const subscriber of this.subscribers){
            subscriber.subscribe(log);
        }
    }
}
function provideMainLogBus() {
    const bus = new MainLogBus();
    if (typeof Deno === "object") {
        const subscriber = new BasicLogSubscriber(new BasicLogFilter(LogSeverity.SILLY), new PrettyLogFormatter());
        bus.subscribers.add(subscriber);
    } else {
        const subscriber = new BrowserLogSubscriber(new BasicLogFilter(LogSeverity.SILLY));
        bus.subscribers.add(subscriber);
    }
    return bus;
}
class LoggerFactory {
    logBus;
    constructor(logBus){
        this.logBus = logBus;
    }
    createLogger(channel, params = {}) {
        return new BasicLogger(channel, this.logBus, params);
    }
}
function provideLoggerFactory(resolver) {
    return new LoggerFactory(resolver.resolve(provideMainLogBus));
}
function providePlayer() {
    throw new Breaker('player-must-be-injected');
}
function provideReceivingGABus() {
    return new Channel();
}
class GADecoder {
    gaBus;
    constructor(gaBus){
        this.gaBus = gaBus;
    }
    handle(event) {
        const { data } = event;
        assertRequiredString(data, "invalid-ga-envelope");
        const envelope = JSON.parse(data);
        const { kind } = envelope;
        assertRequiredString(kind, "invalid-ga-envelope-kind");
        try {
            this.gaBus.emit(envelope);
        } catch (error) {
            throw new Breaker("error-inside-ga-decoder", {
                envelope,
                error,
                kind
            });
        }
    }
}
function provideGADecoder(resolver) {
    return new GADecoder(resolver.resolve(provideReceivingGABus));
}
class GAProcessor {
    handlers = new Map();
    handle(envelope) {
        const { kind, body } = envelope;
        const handler = this.handlers.get(kind);
        if (!handler) {
            return;
        }
        try {
            handler.handle(body);
        } catch (error) {
            throw new Breaker("error-inside-game-action-processor", {
                kind,
                envelope,
                error
            });
        }
    }
}
function provideGAProcessor() {
    return new GAProcessor();
}
let playerIdCounter = 0;
class ServerPlayerManager {
    players = new Map();
    createPlayer(input) {
        const { color, isAdmin, name } = input;
        const playerId = ++playerIdCounter;
        const player = {
            color,
            isAdmin,
            name,
            playerId
        };
        this.players.set(playerId, player);
        return player;
    }
    deletePlayer(playerId) {
        const playerData = this.players.get(playerId);
        if (playerData === undefined) {
            return;
        }
        this.players.delete(playerId);
    }
}
class Loop {
    $root;
    collection;
    factory;
    nodes;
    constructor($root, collection, factory){
        this.$root = $root;
        this.collection = collection;
        this.factory = factory;
        this.nodes = new WeakMap();
        collection.updates.on(()=>{
            this.update();
        });
        this.update();
    }
    update() {
        const nodes = this.collection.items.map((item)=>{
            const node = this.nodes.get(item);
            if (node === undefined) {
                const node = this.factory.create(item);
                this.nodes.set(item, node);
                return node;
            }
            return node;
        });
        this.$root.replaceChildren(...nodes);
    }
    static create(collection, factory) {
        const $root = div_empty("");
        return new Loop($root, collection, factory);
    }
}
function provideClientGameContext() {
    throw new Breaker('client-game-context-must-be-injected');
}
const gameStageGADef = {
    kind: 'game-stage'
};
const playerDataUpdateGADef = {
    kind: 'player-data-update'
};
class PlayerUpdater {
    dispatcher;
    constructor(dispatcher){
        this.dispatcher = dispatcher;
    }
    updatePlayer(data) {
        this.dispatcher.send(playerDataUpdateGADef, data);
    }
}
function providePlayerUpdater(resolver) {
    return new PlayerUpdater(resolver.resolve(provideGADispatcher));
}
class WaitingPlayerFactory {
    create(player) {
        const { name, color } = player;
        const $root = div_nodes("history _background", [
            div_nodes("history_header", [
                div_empty(`player-cube _${color}`),
                div_text("history_name", name)
            ])
        ]);
        return $root;
    }
}
function provideWaitingPlayersCollection() {
    return new Collection([]);
}
class WaitingView {
    player;
    modalManager;
    quitGameChannel;
    playerDataUpdater;
    $root;
    constructor(gameContext, player, players, modalManager, quitGameChannel, playerDataUpdater){
        this.player = player;
        this.modalManager = modalManager;
        this.quitGameChannel = quitGameChannel;
        this.playerDataUpdater = playerDataUpdater;
        const gameIdBox = createEditBox({
            label: "GameID",
            name: "gameId",
            placeholder: "GameID"
        });
        gameIdBox.$input.readOnly = true;
        gameIdBox.$input.value = gameContext.identifier.gameId;
        const $change = button_text("box _action", "Change name or color...");
        const $quitGame = button_text("box _action", "Quit game");
        const $start = button_text("box _action", "Start game");
        const $loop = div_empty("waiting_players");
        new Loop($loop, players, new WaitingPlayerFactory());
        this.$root = div_nodes("waiting", [
            div_nodes("space", [
                div_nodes("space_container", [
                    div_text("space_caption", "Waiting for players..."),
                    gameIdBox.$root
                ]),
                div_nodes("space_container", [
                    div_text("space_caption", "You can also..."),
                    $change,
                    $quitGame,
                    ...player.isAdmin ? [
                        $start
                    ] : []
                ]),
                div_nodes("space_container", [
                    div_text("space_caption", "Joining players:"),
                    $loop
                ])
            ])
        ]);
        onClick($quitGame, ()=>{
            this.whenQuidGameClicked();
        });
        onClick($change, ()=>{
            this.whenChanged();
        });
    }
    async whenQuidGameClicked() {
        const modal = createQuitGameModal();
        this.modalManager.mount(modal);
        const result = await modal.promise;
        if (result.type === "cancel") {
            return;
        }
        this.quitGameChannel.emit(result.value);
    }
    async whenChanged() {
        const modal = createPlayerModal(this.player);
        this.modalManager.mount(modal);
        const result = await modal.promise;
        if (result.type === "cancel") {
            return;
        }
        this.playerDataUpdater.updatePlayer(result.value);
    }
}
function provideWaitingView(resolver) {
    return new WaitingView(resolver.resolve(provideClientGameContext), resolver.resolve(providePlayer), resolver.resolve(provideWaitingPlayersCollection), resolver.resolve(provideModalManager), resolver.resolve(provideQuitGameChannel), resolver.resolve(providePlayerUpdater));
}
class GameStageGAHandler {
    appView;
    waitingView;
    constructor(appView, waitingView){
        this.appView = appView;
        this.waitingView = waitingView;
    }
    async handle(action) {
        if (action.stage === 'waiting') {
            this.appView.mount(this.waitingView.$root);
        }
    }
}
function provideGameStageGAHandler(resolver) {
    return new GameStageGAHandler(resolver.resolve(provideAppView), resolver.resolve(provideWaitingView));
}
const waitingPlayersGADef = {
    kind: 'waiting-players'
};
class WaitingPlayersGAHandler {
    players;
    constructor(players){
        this.players = players;
    }
    async handle(action) {
        this.players.items.splice(0, this.players.items.length, ...action.players);
        this.players.update();
    }
}
function provideWaitingPlayersGAHandler(resolver) {
    return new WaitingPlayersGAHandler(resolver.resolve(provideWaitingPlayersCollection));
}
function feedClientGAProcessor(resolver, gaProcessor) {
    const handlers = gaProcessor.handlers;
    handlers.set(gameStageGADef.kind, resolver.resolve(provideGameStageGAHandler));
    handlers.set(waitingPlayersGADef.kind, resolver.resolve(provideWaitingPlayersGAHandler));
}
class PlayerState {
    resources = createResourceGroup(20);
    buildings = new Map();
}
class ClientGameContextManager {
    config;
    globalContext;
    loggerFactory;
    context;
    constructor(config, globalContext, loggerFactory){
        this.config = config;
        this.globalContext = globalContext;
        this.loggerFactory = loggerFactory;
        this.context = null;
    }
    createClientGameContext(input) {
        const { gameId, player, token } = input;
        const { playerId } = player;
        const resolver = new ServiceResolver(this.globalContext.resolver);
        const context = {
            descriptor: `/client-game/${gameId}/player/${playerId}`,
            identifier: {
                gameId,
                playerId
            },
            resolver
        };
        const url = new URL(this.config.wsURL);
        url.pathname = `/games/socket/${token}`;
        url.searchParams.set('time', Date.now().toString());
        const socket = new WebSocket(url.toString());
        const logger = this.loggerFactory.createLogger('CLIENT', {
            gameId,
            playerId
        });
        resolver.inject(provideClientGameContext, context);
        resolver.inject(provideLogger, logger);
        resolver.inject(provideWebSocket, socket);
        resolver.inject(providePlayer, player);
        const webSocketChannel = resolver.resolve(provideWebSocketChannel);
        {
            const gaDecoder = resolver.resolve(provideGADecoder);
            webSocketChannel.messages.handlers.add(gaDecoder);
        }
        const receivingGABus = resolver.resolve(provideReceivingGABus);
        {
            const gaProcessor = resolver.resolve(provideGAProcessor);
            feedClientGAProcessor(resolver, gaProcessor);
            receivingGABus.handlers.add(gaProcessor);
        }
        this.context = context;
        return context;
    }
    deleteClientGameContext() {
        if (this.context === null) {
            return;
        }
        const { resolver } = this.context;
        const socket = resolver.resolve(provideWebSocket);
        if (socket.readyState === WebSocket.OPEN) {
            socket.close();
        }
        this.context = null;
    }
}
function provideClientGameContextManager(resolver) {
    return new ClientGameContextManager(resolver.resolve(provideClientConfig), resolver.resolve(provideGlobalContext), resolver.resolve(provideLoggerFactory));
}
class GameState {
    players = new Map();
}
class ClientGameManager {
    appView;
    config;
    clientGameContextManager;
    constructor(appView, config, clientGameContextManager, createGameChannel, joinGameChannel, quitGameChannel){
        this.appView = appView;
        this.config = config;
        this.clientGameContextManager = clientGameContextManager;
        createGameChannel.on((input)=>this.createGame(input));
        joinGameChannel.on((input)=>this.joinGame(input));
        quitGameChannel.on(()=>this.quitGame());
    }
    async createGame(request) {
        const { apiUrl } = this.config;
        const envelope = await fetch(`${apiUrl}/games/create`, {
            method: "POST",
            headers: {
                ["Content-Type"]: "application/json"
            },
            body: JSON.stringify(request)
        });
        const data = await envelope.json();
        const response = data;
        localStorage.setItem("token", response.token);
        this.clientGameContextManager.createClientGameContext(response);
    }
    async joinGame(request) {
        const { apiUrl } = this.config;
        const envelope = await fetch(`${apiUrl}/games/join`, {
            method: "POST",
            headers: {
                ["Content-Type"]: "application/json"
            },
            body: JSON.stringify(request)
        });
        const data = await envelope.json();
        const response = data;
        localStorage.setItem("token", response.token);
        this.clientGameContextManager.createClientGameContext(response);
    }
    async quitGame() {
        this.clientGameContextManager.deleteClientGameContext();
        const token = localStorage.getItem('token');
        if (token === null) {
            this.appView.homepage();
            return;
        }
        const { apiUrl } = this.config;
        await fetch(`${apiUrl}/games/quit`, {
            method: "POST",
            headers: {
                ["Authorization"]: `Bearer ${token}`
            }
        });
        localStorage.removeItem('token');
        this.appView.homepage();
    }
    async bootstrap() {
        const { apiUrl } = this.config;
        const token = localStorage.getItem('token');
        if (token === null) {
            this.appView.homepage();
            return;
        }
        const envelope = await fetch(`${apiUrl}/games/read`, {
            method: "GET",
            headers: {
                ["Authorization"]: `Bearer ${token}`
            }
        });
        const data = await envelope.json();
        if (data.error) {
            localStorage.removeItem('token');
            this.appView.homepage();
            return;
        }
        const response = data;
        this.clientGameContextManager.createClientGameContext(response);
    }
}
function provideClientGameManager(resolver) {
    return new ClientGameManager(resolver.resolve(provideAppView), resolver.resolve(provideClientConfig), resolver.resolve(provideClientGameContextManager), resolver.resolve(provideCreateGameChannel), resolver.resolve(provideJoinGameChannel), resolver.resolve(provideQuitGameChannel));
}
async function start() {
    const { resolver } = createGlobalContext();
    const app = resolver.resolve(provideAppView);
    document.body.appendChild(app.$root);
    const game = resolver.resolve(provideClientGameManager);
    await game.bootstrap();
}
start();
