// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

Promise.withResolvers = function() {
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
};
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
function assertRequiredString(value, message, data) {
    if (typeof value !== "string" || value === "") {
        __throws(message, data);
    }
}
function onClick(element, listener) {
    element.addEventListener('click', (event)=>{
        event.preventDefault();
        event.stopPropagation();
        listener(event);
    });
}
function createElement(tag, className = '') {
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
    return (props)=>{
        const node = createElement(tag);
        Object.assign(node, props);
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
function fragment() {
    return document.createDocumentFragment();
}
function fragment_nodes(children) {
    const node = fragment();
    node.append(...children);
    return node;
}
const button_nodes = createTagNodes('button');
const button_text = createTagText('button');
const div_empty = createTagEmpty('div');
const div_text = createTagText('div');
const div_nodes = createTagNodes('div');
createTagProps('div');
createTagAdvanced('div');
const form = createTagAdvanced('form');
const fieldset = createTagNodes('fieldset');
const input_props = createTagProps('input');
const label_props = createTagProps('label');
const legend_text = createTagText('legend');
const img_props = createTagProps('img');
const span_empty = createTagEmpty('span');
createTagProps('span');
const span_text = createTagText('span');
class Channel {
    subscribers = new Set();
    on(subscriber) {
        this.subscribers.add(subscriber);
    }
    emit(event) {
        for (const subscriber of this.subscribers){
            subscriber(event);
        }
    }
}
class Store {
    updates = new Channel();
    update() {
        this.updates.emit(this);
    }
}
class Signal {
    value;
    updates;
    constructor(value){
        this.value = value;
        this.updates = new Channel();
    }
    update() {
        this.updates.emit(this.value);
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
const colors = [
    {
        color: "green",
        key: "green",
        name: "Green"
    },
    {
        color: "red",
        key: "red",
        name: "Red"
    },
    {
        color: "blue",
        key: "blue",
        name: "Blue"
    },
    {
        color: "yellow",
        key: "yellow",
        name: "Yellow"
    },
    {
        color: "black",
        key: "black",
        name: "Black"
    }
];
function createSelectorOption(option) {
    const { color, key, name } = option;
    const content = div_nodes("selector_panel-item", [
        span_empty(`player-cube _${color}`),
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
    dec() {
        if (this.index > 0) {
            this.index -= 1;
            this.update();
        }
    }
    inc() {
        if (this.index < this.options.length - 1) {
            this.index += 1;
            this.update();
        }
    }
}
function createSelector(options) {
    const store = new SelectorStore(options);
    const left = svg_icon("selector_icon", "arrow-left");
    const right = svg_icon("selector_icon", "arrow-right");
    const panel = div_nodes("selector_panel", [
        div_nodes('selector_panel-container', options.map(createSelectorOption))
    ]);
    const root = div_nodes("selector", [
        left,
        panel,
        right
    ]);
    store.updates.on(({ index })=>{
        panel.style.setProperty("--index", `${index}`);
        left.classList.toggle("_disabled", index === 0);
        right.classList.toggle("_disabled", index === options.length - 1);
    });
    store.update();
    left.addEventListener("click", ()=>store.dec());
    right.addEventListener("click", ()=>store.inc());
    return {
        root,
        $root: root,
        store
    };
}
function createEditBox({ label, name, placeholder }) {
    const $input = input_props({
        autocomplete: "off",
        className: 'edit-box_input',
        name,
        type: 'text',
        placeholder: placeholder ?? ''
    });
    const $root = div_nodes('edit-box _input', [
        label_props({
            className: 'edit-box_label',
            for: name,
            textContent: label
        }),
        $input
    ]);
    return {
        $root,
        $input
    };
}
function createJoinModal() {
    const $cancel = div_text('box _button', 'Cancel');
    const $join = div_text('box _button', 'Join');
    const $root = div_nodes("modal", [
        div_nodes("modal_background", [
            div_nodes("modal_container", [
                div_text('modal_title', "Type game ID and your details:"),
                createEditBox({
                    label: 'Game ID',
                    name: 'gameId',
                    placeholder: 'Ask your friend'
                }).$root,
                createEditBox({
                    label: 'Name',
                    name: 'player-name',
                    placeholder: 'Your name'
                }).$root,
                div_nodes('edit-box _selector', [
                    label_props({
                        className: 'edit-box_label',
                        for: 'player-color',
                        textContent: 'Color'
                    }),
                    createSelector(colors).root
                ]),
                div_nodes('modal_buttons', [
                    $cancel,
                    $join
                ])
            ])
        ])
    ]);
    const { promise, resolve } = Promise.withResolvers();
    onClick($cancel, ()=>{
        resolve({
            type: 'cancel'
        });
    });
    onClick($join, ()=>{
        resolve({
            type: 'confirm',
            value: {
                player: {
                    name: 'John',
                    color: 'red'
                },
                gameId: '12345'
            }
        });
    });
    return {
        promise,
        $root
    };
}
class ModalManager {
    root = div_empty('app_content-overlay');
    mount(modal) {
        this.root.classList.add("_enabled");
        this.root.appendChild(modal.$root);
        modal.promise.then(()=>{
            this.root.removeChild(modal.$root);
            this.root.classList.remove("_enabled");
        });
    }
}
const modalManager = new ModalManager();
class ElementSwitcher {
    root;
    currentElement;
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
        if (this.currentElement === element) {
            return;
        }
        if (this.currentElement) {
            this.currentElement.remove();
        }
        this.root.appendChild(element);
        this.currentElement = element;
    }
}
function createPanel(nodes) {
    return div_nodes("panel", nodes.map((node)=>div_nodes("panel_item", [
            node
        ])));
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
        span_text('resource_label', formatCount(count)),
        img_props({
            className: 'resource_icon',
            width: "32",
            height: "32",
            alt: `${type} icon`,
            src: `/images/supplies/${type}.svg`
        })
    ]);
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
function createPersonalInfo() {
    return fieldset('settings_fieldset', [
        legend_text('settings_legend', 'Personal info'),
        div_nodes('edit-box _input', [
            label_props({
                className: 'edit-box_label',
                for: 'player-name',
                textContent: 'Name'
            }),
            input_props({
                autocomplete: "off",
                className: 'edit-box_input',
                name: 'player-name',
                type: 'text',
                placeholder: 'Your name'
            })
        ]),
        div_nodes('edit-box _selector', [
            label_props({
                className: 'edit-box_label',
                for: 'player-color',
                textContent: 'Color'
            }),
            createSelector(colors).root
        ])
    ]);
}
function createGenerals() {
    let quit;
    const root = fieldset('settings_fieldset', [
        legend_text('settings_legend', 'Generals'),
        div_nodes('edit-box _input', [
            label_props({
                className: 'edit-box_label',
                for: 'game-id',
                textContent: 'GameID'
            }),
            input_props({
                readOnly: true,
                autocomplete: "off",
                className: 'edit-box_input',
                name: 'game-id',
                type: 'text',
                placeholder: 'GameID'
            })
        ]),
        quit = button_text('box _action', 'Quit game')
    ]);
    quit.addEventListener('click', (event)=>{
        event.preventDefault();
    });
    return root;
}
function createAdmin() {
    let production, subtract;
    const root = fieldset('settings_fieldset', [
        legend_text('settings_legend', 'Admin settings'),
        production = button_text('box _action', 'Turn to production phase'),
        subtract = button_text('box _action', "Subtract each player's terraforming rate")
    ]);
    return root;
}
function createSettings() {
    return form({
        className: 'settings_form'
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
function createCalculatorButton(digit) {
    const root = button_text('box _button _project', digit.toString());
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
    }
    getValue() {
        return parseInt(this.digits) * (this.positive ? 1 : -1);
    }
}
function createSupplyModal(options) {
    const { target, type, count } = options;
    const min = resourcesByType[type].targets[target].min;
    const $input = div_text('box _counter _wide', "0");
    const $cancel = button_text('box _button', 'Cancel');
    const $confirm = button_text('box _button', 'Confirm');
    const $operator = button_text('box _button _project', '-');
    const $clear = button_text('box _button _project', 'C');
    const $calculator = div_nodes('calculator', [
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
                div_text('modal_title', `Change your ${target}:`),
                div_nodes('modal_target', [
                    div_nodes(`modal_target-supply _${target}`, [
                        div_text('box _counter', count.toString())
                    ]),
                    img_props({
                        className: 'modal_target-icon',
                        width: "64",
                        height: "64",
                        alt: "supply-icon",
                        src: `/images/supplies/${type}.svg`
                    })
                ]),
                div_nodes('modal_count', [
                    span_text('modal_count-label _left', 'by'),
                    $input,
                    span_text('modal_count-label _right', 'units')
                ]),
                $calculator,
                div_nodes('modal_buttons', [
                    $cancel,
                    $confirm
                ])
            ])
        ])
    ]);
    const store = new CalculatorStore();
    store.updates.on((store)=>{
        const { digits, positive } = store;
        $input.textContent = `${positive ? '' : '-'}${digits}`;
        $operator.textContent = positive ? '-' : '+';
        const valid = count + store.getValue() < min;
        $confirm.toggleAttribute('disabled', valid);
    });
    onClick($calculator, (event)=>{
        const $target = event.target;
        const digit = $target.dataset.digit;
        assertRequiredString(digit, "required-dataset-digit");
        store.append(digit);
        store.update();
    });
    onClick($operator, ()=>{
        store.positive = !store.positive;
        store.update();
    });
    onClick($clear, ()=>{
        store.positive = true;
        store.digits = "0";
        store.update();
    });
    const { promise, resolve } = Promise.withResolvers();
    onClick($cancel, ()=>{
        resolve({
            type: 'cancel'
        });
    });
    onClick($confirm, ()=>{
        resolve({
            type: 'confirm',
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
function createSupply(type, signal, channel) {
    const { amount, production } = signal.value[type];
    const $production = div_text('box _counter', production);
    const $amount = div_text('box _counter', amount);
    const $root = fragment_nodes([
        div_nodes(`supply _production _${type}`, [
            $production
        ]),
        div_nodes(`supply _icon _${type}`, [
            img_props({
                className: 'supply_icon',
                width: "64",
                height: "64",
                alt: "supply-icon",
                src: `/images/supplies/${type}.svg`
            })
        ]),
        div_nodes(`supply _amount _${type}`, [
            $amount
        ])
    ]);
    signal.updates.on(()=>{
        const { amount, production } = signal.value[type];
        $amount.textContent = amount.toString();
        $production.textContent = production.toString();
    });
    onClick($amount, ()=>channel.emit({
            type,
            target: "amount"
        }));
    onClick($production, ()=>channel.emit({
            type,
            target: "production"
        }));
    return $root;
}
function createSupplies() {
    const signal = new Signal(createResourceGroup(20));
    const channel = new Channel();
    channel.on(async ({ type, target })=>{
        const count = signal.value[type][target];
        const modal = createSupplyModal({
            type,
            target,
            count
        });
        modalManager.mount(modal);
        const result = await modal.promise;
        if (result.type === "cancel") {
            return;
        }
        signal.value[type][target] = result.value;
        signal.update();
    });
    return div_nodes("panel_item", [
        div_nodes("supplies", [
            div_empty("supplies_production"),
            div_text("supplies_round", "0"),
            ...resources.map(({ type })=>{
                return createSupply(type, signal, channel);
            })
        ])
    ]);
}
function createSuppliesPanel() {
    return div_nodes("panel", [
        1,
        2,
        3
    ].map(createSupplies));
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
function createTop() {
    return div_nodes("top _with-controller", [
        div_text("top_label", "Player's supplies"),
        div_nodes("top_controller", [])
    ]);
}
function createScroll() {
    let content, detectorBottom, detectorTop, root, shadowBottom, shadowTop;
    const fragment = fragment_nodes([
        root = div_nodes("app_main scroll", [
            div_nodes("scroll_container", [
                detectorTop = div_empty("scroll_detector _top"),
                content = div_empty("app_content"),
                detectorBottom = div_empty("scroll_detector _bottom")
            ])
        ]),
        shadowTop = div_empty("app_shadow _top"),
        shadowBottom = div_empty("app_shadow _bottom")
    ]);
    const map = new WeakMap([
        [
            detectorTop,
            shadowTop
        ],
        [
            detectorBottom,
            shadowBottom
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
        root,
        threshold: [
            1.0
        ]
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(detectorTop);
    observer.observe(detectorBottom);
    return {
        fragment,
        content
    };
}
const appState = new Channel();
function createHomepage() {
    const $create = button_text("box _action", "New Game");
    const $join = button_text("box _action", "Join the Game");
    const $about = button_text("box _action", "About");
    const $root = div_nodes("homepage", [
        $create,
        $join,
        $about
    ]);
    onClick($create, ()=>{
        appState.emit("work");
    });
    onClick($join, async ()=>{
        const modal = createJoinModal();
        modalManager.mount(modal);
        const result = await modal.promise;
        if (result.type === "cancel") {
            return;
        }
    });
    return $root;
}
function createApp() {
    const top = createTop();
    const scroll = createScroll();
    const $toolbar = createToolbar();
    const switcher = new ElementSwitcher(scroll.content);
    switcher.elements.set("homepage", createHomepage());
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
    const $root = div_nodes("app", [
        top,
        scroll.fragment,
        modalManager.root,
        $toolbar
    ]);
    appState.on((state)=>{
        if (state === "homepage") {
            $root.classList.remove('_with-toolbar');
            $toolbar.classList.add('_hidden');
            toolbarClickChannel.emit({
                key: "homepage"
            });
        } else if (state === "work") {
            $root.classList.add('_with-toolbar');
            $toolbar.classList.remove('_hidden');
            toolbarClickChannel.emit({
                key: "settings"
            });
        }
    });
    appState.emit("homepage");
    return $root;
}
document.body.appendChild(createApp());
const response = await fetch('http://localhost:3008/game/create', {
    method: 'POST'
});
const data = await response.json();
console.log(data);
