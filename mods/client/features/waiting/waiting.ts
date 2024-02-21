import { ServiceResolver } from "../../../common/dependency.ts";
import { button_text, div_empty, div_nodes, div_text } from "../../../frontend-framework/dom.ts";
import { Player, providePlayerData } from "../../../player/data.ts";
import { createEditBox } from "../../common/edit-box.ts";
import { ClientGameContext, provideClientGameContext } from "../game/context.ts";
import { Collection } from "../../../frontend-framework/store.ts";
import { ComponentFactory, Loop } from "../../../frontend-framework/loop.ts";
import { WaitingPlayer } from "../../../domain/waiting-players.ts";

export class WaitingPlayerFactory implements ComponentFactory<WaitingPlayer> {
  public create(player: WaitingPlayer): HTMLElement {
    const { name, colorKey } = player;
    const $root = div_nodes("history _background", [
      div_nodes("history_header", [
        div_empty(`player-cube _${colorKey}`),
        div_text("history_name", name),
      ]),
    ]);
    return $root;
  }
}

export function provideWaitingPlayersCollection() {
  return new Collection<WaitingPlayer>([]);
}

export class WaitingView {
  public readonly $root: HTMLDivElement;

  public constructor(
    gameContext: ClientGameContext,
    player: Player,
    players: Collection<WaitingPlayer>,
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

    const $loop = div_empty("waiting_players");
    new Loop<WaitingPlayer>($loop, players, new WaitingPlayerFactory());

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
          $loop,
        ]),
      ]),
    ]);
  }
}

export function provideWaitingView(resolver: ServiceResolver) {
  return new WaitingView(
    resolver.resolve(provideClientGameContext),
    resolver.resolve(providePlayerData),
    resolver.resolve(provideWaitingPlayersCollection),
  );
}
