import { div_nodes, fieldset, form, input_props, label_props, legend_text } from "../common/dom.ts";
import { createSelector, colors } from "./selector.ts";

export function createSettings() {
  return form({ className: 'settings__form' }, [
    fieldset('settings__fieldset', [
      legend_text('settings__legend', 'Personal info'),
      div_nodes('edit-box --input', [
        label_props({
          className: 'edit-box__label',
          for: 'player-name',
          textContent: 'Name'
        }),
        input_props({
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
    ]),
  ])
}
