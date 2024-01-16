import { SVGIcon } from "../common/svg.ts";

export function createTop() {
  return (
    <div className="top --with-controller">
      <div className="top__label">Player&apos;s supplies</div>
      <div className="top__controller">
        <div className="selector">
          <SVGIcon className="selector__icon" icon="arrow-left" />
          <div className="selector__content">
            <span className="player-cube" style="--background: var(--color-player-cube-green)"></span>
            <span className="text">Łukasz</span>
          </div>
          <SVGIcon className="selector__icon" icon="arrow-right" />
        </div>
      </div>
    </div>
  );
}
