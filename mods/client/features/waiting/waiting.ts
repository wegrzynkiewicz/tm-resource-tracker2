import { ServiceResolver } from "../../../common/dependency.ts";
import { button_text, div_empty, div_nodes, div_text } from "../../../frontend-framework/dom.ts";
import { Player, providePlayerData } from "../../../player/data.ts";
import { createEditBox } from "../../common/edit-box.ts";
import { ClientGameContext, provideClientGameContext } from "../game/context.ts";

export class WaitingView {
  public readonly $root: HTMLDivElement;

  public constructor(
    gameContext: ClientGameContext,
    player: Player,
  ) {
    const gameIdBox = createEditBox({
      label: "GameID",
      name: "gameId",
      placeholder: "GameID",
    });
    gameIdBox.$input.readOnly = true;
    gameIdBox.$input.value = gameContext.identifier.gameId;

    const $change = button_text("box _action", "Change name or color...");
    const $quitGame = button_text("box _action", "Quit game");
    const $start = button_text("box _action", "Start game");

    this.$root = div_nodes("waiting", [
      div_nodes("space", [
        div_nodes("space_container", [
          div_text("space_caption", "Waiting for players..."),
          gameIdBox.$root,
        ]),
        div_nodes("space_container", [
          div_text("space_caption", "You can also..."),
          $change,
          $quitGame,
          ...(player.isAdmin ? [$start] : []),
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
    resolver.resolve(provideClientGameContext),
    resolver.resolve(providePlayerData),
  );
}
