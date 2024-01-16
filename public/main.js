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
function __throws(message, data) {
    throw new Breaker(message, data);
}
function assertNonNull(value, message, data) {
    if (value === null) {
        __throws(message, data);
    }
}
function getElementById(id) {
    const node = document.getElementById(id);
    assertNonNull(node, '');
    return node;
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
function mapFragments(array, map) {
    const fragment = document.createDocumentFragment();
    for (const item of array){
        const data = map(item);
        fragment.appendChild(data);
    }
    return fragment;
}
function ProjectComponent({ name }) {
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
function ProjectsComponent() {
    return jsx("div", {
        className: "panel__item",
        children: jsx("div", {
            className: "projects",
            children: mapFragments(projects, ProjectComponent)
        })
    });
}
function ProjectsPanelComponent() {
    return jsx("div", {
        className: "panel",
        children: mapFragments([
            1,
            2,
            3,
            4
        ], ProjectsComponent)
    });
}
const root = getElementById("app-content");
root.appendChild(ProjectsPanelComponent());
const options = {
    root: getElementById("app-scroll-viewport"),
    threshold: [
        1.0
    ]
};
const callback = (entries)=>{
    for (const entry of entries){
        const target = entry.target;
        const shadow = getElementById(`app-shadow-${target.dataset.detector}`);
        shadow.classList.toggle(`--enabled`, !entry.isIntersecting);
    }
};
const observer = new IntersectionObserver(callback, options);
observer.observe(getElementById("app-shadow-detector-top"));
observer.observe(getElementById("app-shadow-detector-bottom"));
function update(stage) {}
const nodes = document.querySelectorAll("[data-toolbar]");
nodes.forEach((node)=>{
    node.addEventListener("click", ()=>{
        update;
    });
});
export { hydroState as hydroState };
export { ProjectComponent as ProjectComponent };
