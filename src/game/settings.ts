import { button_text, div_nodes, fieldset, form, input_props, label_props, legend_text } from "../common/dom.ts";
import { createSelector, colors } from "./selector.ts";

export function createPersonalInfo() {
  return fieldset('settings__fieldset', [
    legend_text('settings__legend', 'Personal info'),
    div_nodes('edit-box --input', [
      label_props({
        className: 'edit-box__label',
        for: 'player-name',
        textContent: 'Name'
      }),
      input_props({
        autocomplete: "off",
        className: 'edit-box__input',
        name: 'player-name',
        type: 'text',
        placeholder: 'Your name'
      }),
    ]),
    div_nodes('edit-box --selector', [
      label_props({
        className: 'edit-box__label',
        for: 'player-color',
        textContent: 'Color'
      }),
      createSelector(colors).root,
    ]),
  ]);
}

export function createGenerals() {
  let quit;
  const root = fieldset('settings__fieldset', [
    legend_text('settings__legend', 'Generals'),
    div_nodes('edit-box --input', [
      label_props({
        className: 'edit-box__label',
        for: 'game-id',
        textContent: 'GameID'
      }),
      input_props({
        readOnly: true,
        autocomplete: "off",
        className: 'edit-box__input',
        name: 'game-id',
        type: 'text',
        placeholder: 'GameID'
      }),
    ]),
    quit = button_text('box --button --action', 'Quit game'),
  ]);
  quit.addEventListener('click', (event) => {
    event.preventDefault();
  });
  return root;
}

export function createAdmin() {
  let production, subtract;
  const root = fieldset('settings__fieldset', [
    legend_text('settings__legend', 'Admin settings'),
    production = button_text('box --button --action', 'Turn to production phase'),
    div_nodes('edit-box --input', [
      label_props({
        className: 'edit-box__label',
        for: 'round',
        textContent: 'Round'
      }),
      input_props({
        autocomplete: "off",
        className: 'edit-box__input',
        name: 'round',
        type: 'number',
        placeholder: 'Round'
      }),
    ]),
    subtract = button_text('box --button --action', "Subtract each player's terraforming rate"),
  ]);
  return root;
}

export function createSettings() {
  return form({ className: 'settings__form' }, [
    createPersonalInfo(),
    createGenerals(),
    createAdmin(),
  ])
}
