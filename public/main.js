// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const Fragment = Symbol("JSXFragment");
function processChildren(element, value) {
    if (Array.isArray(value)) {
        for (const child of value){
            processChildren(element, child);
        }
        return;
    }
    switch(typeof value){
        case "object":
            {
                if (value === null) {
                    return;
                }
                element.appendChild(value);
                return;
            }
        case "boolean":
        case "number":
        case "string":
            {
                const string = value.toString();
                const text = document.createTextNode(string);
                element.appendChild(text);
                return;
            }
        case "function":
            {
                const result = value(element);
                processChildren(element, result);
                return;
            }
        case "undefined":
        default:
            {
                return;
            }
    }
}
function createFragment(children) {
    const fragment = document.createDocumentFragment();
    processChildren(fragment, children);
    return fragment;
}
function createElement(tag, attributes, children) {
    const element = document.createElement(tag);
    if (attributes !== null) {
        for (const [key, value] of Object.entries(attributes)){
            switch(typeof value){
                case "string":
                    {
                        if (key === 'className') {
                            element.className = value;
                            break;
                        }
                        element.setAttribute(key, value);
                        break;
                    }
                case "number":
                    {
                        element.setAttribute(key, value.toString());
                        break;
                    }
                case "boolean":
                    {
                        element.setAttribute(key, "");
                        break;
                    }
                case "function":
                    {
                        const listener = value;
                        if (key.startsWith("on:")) {
                            element.addEventListener(key.substring(3), listener);
                        }
                        element[key] = value;
                        break;
                    }
                default:
                    {
                        element[key] = value;
                    }
            }
        }
    }
    processChildren(element, children);
    return element;
}
function jsx(input, properties) {
    const { children, ...attributes } = properties;
    if (typeof input === "string") {
        return createElement(input, attributes, children);
    }
    if (typeof input === "function") {
        return input(properties);
    }
    if (input === Fragment) {
        return createFragment(children);
    }
}
const jsxs = jsx;
class Channel {
    subscribers = new Set();
    dispatch(event) {
        for (const subscriber of this.subscribers){
            subscriber(event);
        }
    }
}
class Breaker extends Error {
    options;
    constructor(message, data){
        const { error, cause, ...others } = data ?? {};
        super(message);
        this.name = "Breaker";
        this.options = data ?? {};
        const json = JSON.stringify(others);
        this.stack += `\n    with parameters ${json}.`;
        if (error) {
            this.stack += `\n    cause error:\n${error instanceof Error ? error.stack : error}.`;
        }
    }
}
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
function mapToFragment(array, map) {
    const fragment = document.createDocumentFragment();
    for (const item of array){
        const data = map(item);
        fragment.appendChild(data);
    }
    return fragment;
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
    return jsxs("div", {
        className: "project",
        children: [
            jsx("button", {
                className: "box --button --project",
                children: "-"
            }),
            jsx("img", {
                className: "project__icon",
                width: "40",
                height: "40",
                src: `/images/projects/${name}.png`
            }),
            jsx("div", {
                className: "box --counter",
                children: "0"
            }),
            jsx("button", {
                className: "box --button --project",
                children: "+"
            })
        ]
    });
}
function createProjectsList() {
    return jsx("div", {
        className: "panel__item",
        children: jsx("div", {
            className: "projects",
            children: mapToFragment(projects, createProject)
        })
    });
}
function createProjectsPanel() {
    return jsx("div", {
        className: "panel",
        children: mapToFragment([
            1,
            2,
            3,
            4
        ], createProjectsList)
    });
}
const supplies = [
    {
        name: "points"
    },
    {
        name: "gold"
    },
    {
        name: "steel"
    },
    {
        name: "titan"
    },
    {
        name: "plant"
    },
    {
        name: "energy"
    },
    {
        name: "heat"
    }
];
function createSupply({ name }) {
    return jsxs(Fragment, {
        children: [
            jsx("div", {
                class: `box --counter supply --production --${name}`,
                children: "0"
            }),
            jsx("img", {
                class: `supply --icon --${name}`,
                width: "64",
                height: "64",
                alt: "supply-icon",
                src: `/images/supplies/${name}.svg`
            }),
            jsx("div", {
                class: `box --counter supply --amount --${name}`,
                children: "0"
            })
        ]
    });
}
function createSupplies() {
    return jsx("div", {
        class: "panel__item",
        children: jsxs("div", {
            class: "supplies",
            children: [
                jsx("div", {
                    class: "supplies__production"
                }),
                mapToFragment(supplies, createSupply)
            ]
        })
    });
}
function createSuppliesPanel() {
    return jsx("div", {
        className: "panel",
        children: mapToFragment([
            1,
            2,
            3,
            4
        ], createSupplies)
    });
}
const createSVGElement = (tag)=>document.createElementNS("http://www.w3.org/2000/svg", tag);
function SVGIcon({ className, icon }) {
    const svg = createSVGElement("svg");
    svg.setAttribute("class", className);
    const use = createSVGElement("use");
    use.setAttribute("href", `/images/symbols.svg#icon-${icon}`);
    svg.appendChild(use);
    return svg;
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
        key: "history",
        icon: "clock",
        name: "History"
    },
    {
        key: "settings",
        icon: "gear",
        name: "Settings"
    }
];
function createToolbarButton(button, whenClickChannel) {
    const { key, icon, name } = button;
    const root = jsxs("button", {
        className: "toolbar__item",
        "on:click": ()=>whenClickChannel.dispatch({
                key
            }),
        children: [
            jsx(SVGIcon, {
                className: "toolbar__icon",
                icon: icon
            }),
            jsx("span", {
                className: "toolbar__label",
                children: name
            })
        ]
    });
    return {
        button,
        root
    };
}
function createToolbar(whenClickChannel) {
    const elements = buttons.map((button)=>createToolbarButton(button, whenClickChannel));
    whenClickChannel.subscribers.add(({ key })=>{
        for (const { button, root } of elements){
            root.classList.toggle("--active", button.key === key);
        }
    });
    return jsx("div", {
        className: "toolbar",
        children: mapToFragment(elements, ({ root })=>root)
    });
}
function createTop() {
    return jsxs("div", {
        className: "top --with-controller",
        children: [
            jsx("div", {
                className: "top__label",
                children: "Player's supplies"
            }),
            jsx("div", {
                className: "top__controller",
                children: jsxs("div", {
                    className: "selector",
                    children: [
                        jsx(SVGIcon, {
                            className: "selector__icon",
                            icon: "arrow-left"
                        }),
                        jsxs("div", {
                            className: "selector__content",
                            children: [
                                jsx("span", {
                                    className: "player-cube",
                                    style: "--background: var(--color-player-cube-green)"
                                }),
                                jsx("span", {
                                    className: "text",
                                    children: "Łukasz"
                                })
                            ]
                        }),
                        jsx(SVGIcon, {
                            className: "selector__icon",
                            icon: "arrow-right"
                        })
                    ]
                })
            })
        ]
    });
}
function createScroll() {
    const detectorTop = jsx("div", {
        "data-detector": "top"
    });
    const content = jsx("div", {
        class: "app__content"
    });
    const detectorBottom = jsx("div", {
        "data-detector": "bottom"
    });
    const root = jsx("div", {
        class: "app__main scroll",
        children: jsxs("div", {
            class: "scroll__container",
            children: [
                detectorTop,
                content,
                detectorBottom
            ]
        })
    });
    const shadowTop = jsx("div", {
        class: "app__shadow --top"
    });
    const shadowBottom = jsx("div", {
        class: "app__shadow --bottom"
    });
    const fragment = jsxs(Fragment, {
        children: [
            root,
            shadowTop,
            shadowBottom
        ]
    });
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
            shadow.classList.toggle(`--enabled`, !entry.isIntersecting);
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
function createApp() {
    const top = createTop();
    const scroll = createScroll();
    const switcher = new ElementSwitcher(scroll.content);
    switcher.elements.set("projects", createProjectsPanel());
    switcher.elements.set("supplies", createSuppliesPanel());
    const channel = new Channel();
    const toolbar = createToolbar(channel);
    channel.subscribers.add(({ key })=>{
        switcher.switch(key);
    });
    channel.dispatch({
        key: "supplies"
    });
    return jsxs("div", {
        id: "app",
        class: "app --with-toolbar",
        children: [
            top,
            scroll.fragment,
            toolbar
        ]
    });
}
function hydroState(state) {
    let startYPosition = 0;
    let startValue = 50;
    let current = 50;
    const update = ()=>{
        state.value = current.toString();
    };
    state.addEventListener("touchstart", (event)=>{
        const currentYPosition = event.touches.item(0).clientY;
        startYPosition = currentYPosition;
        startValue = current;
        event.preventDefault();
    });
    state.addEventListener("touchmove", (event)=>{
        const currentYPosition = event.touches.item(0).clientY;
        const result = currentYPosition - startYPosition;
        current = startValue + Math.floor(result / 20);
        update();
        event.preventDefault();
    });
    update();
}
document.body.appendChild(createApp());
export { hydroState as hydroState };
