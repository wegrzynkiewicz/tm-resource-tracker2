import { colors } from "../../../domain/colors.ts";
import {
  button_text,
  div_nodes,
  fieldset,
  form,
  input_props,
  label_props,
  legend_text,
} from "../../../common/frontend-framework/dom.ts";
import { createSelector } from "./selector.ts";

export function createPersonalInfo() {
  return fieldset("space_container", [
    legend_text("space_caption", "Personal info"),
    div_nodes("edit-box _input", [
      label_props({
        className: "edit-box_label",
        for: "player-name",
        textContent: "Name",
      }),
      input_props({
        autocomplete: "off",
        className: "edit-box_input",
        name: "player-name",
        type: "text",
        placeholder: "Your name",
      }),
    ]),
    div_nodes("edit-box _selector", [
      label_props({
        className: "edit-box_label",
        for: "player-color",
        textContent: "Color",
      }),
      createSelector(colors).$root,
    ]),
  ]);
}

export function createGenerals() {
  let quit;
  const root = fieldset("space_container", [
    legend_text("space_caption", "Generals"),
    div_nodes("edit-box _input", [
      label_props({
        className: "edit-box_label",
        for: "game-id",
        textContent: "GameID",
      }),
      input_props({
        readOnly: true,
        autocomplete: "off",
        className: "edit-box_input",
        name: "game-id",
        type: "text",
        placeholder: "GameID",
      }),
    ]),
    quit = button_text("box _action", "Quit game"),
  ]);
  quit.addEventListener("click", (event) => {
    event.preventDefault();
  });
  return root;
}

export function createAdmin() {
  let production, subtract;
  const root = fieldset("space_container", [
    legend_text("space_caption", "Admin settings"),
    production = button_text("box _action", "Turn to production phase"),
    subtract = button_text("box _action", "Subtract each player's terraforming rate"),
  ]);
  return root;
}

export function createSettings() {
  return form({ className: "space" }, [
    createPersonalInfo(),
    createGenerals(),
    createAdmin(),
  ]);
}
