import { ServiceResolver } from "../../../common/dependency.ts";
import { button_text, div_empty, div_nodes, div_text } from "../../../frontend-framework/dom.ts";
import { createEditBox } from "../../common/edit-box.ts";
import { ClientGameContext, provideClientGameContext } from "../game/client-game.ts";

export class WaitingView {
  public readonly $root: HTMLDivElement;
  public constructor(
    
    gameContext: ClientGameContext,
  ) {
    const gameIdBox = createEditBox({
      label: "GameID",
      name: "gameId",
      placeholder: "GameID",
    });
    gameIdBox.$input.readOnly = true;
    gameIdBox.$input.value = gameContext.gameId;

    const $change = button_text("box _action", "Change name or color...");
    const $quitGame = button_text("box _action", "Quit game");
    const $start = button_text("box _action", "Start game");

    this.$root = div_nodes("waiting", [
      div_nodes("space", [
        div_nodes("space_container", [
          div_text("space_caption", "Waiting for players..."),
          gameIdBox.$root,
          $change,
          $quitGame,
          ...(gameContext.isAdmin ? [$start] : []),
        ]),
        div_nodes("space_container", [
          div_text("space_caption", "Joining players:"),
          div_nodes("history _background", [
            div_nodes("history_header", [
              div_empty(`player-cube _red`),
              div_text("history_name", "Łukasz"),
            ]),
          ]),
        ]),
      ]),
    ]);


  }
}

export function provideWaitingView(resolver: ServiceResolver) {
  return new WaitingView(
    resolver.resolve(provideClientGameContext)
  );
}
