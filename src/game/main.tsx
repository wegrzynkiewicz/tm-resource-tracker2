
// This import is required
import { h } from "tsx-dom";

export function createSupply(supply: Supply) {
  const { icon, hasProduction, name } = supply;
  return (
    <>
      <div className="supply --production">
        <input data-ref="production" class="box --counter" value="0" />
      </div>
      <div class="supply --icon">
        <img data-ref="icon" class="supply__icon" width="64" height="64" src="#" alt="supply-icon" />
      </div>
      <div class="supply --amount">
        <input data-ref="amount" class="box --counter" value="0" />
      </div>
    </>
  );
}

// jsx tags (<...>) always return an HTMLElement, so cast it to whatever type you need
const myImg = <img src="my/path.png" onClick={() => console.log("click")} /> as HTMLImageElement;

// Use it like any element created with document.createElement(...);
document.body.appendChild(myImg);
