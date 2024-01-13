import energySVGPath from "../images/supplies/energy.svg";
import goldSVGPath from "../images/supplies/gold.svg";
import heatSVGPath from "../images/supplies/heat.svg";
import plantSVGPath from "../images/supplies/plant.svg";
import pointsSVGPath from "../images/supplies/points.svg";
import steelSVGPath from "../images/supplies/steel.svg";
import titanSVGPath from "../images/supplies/titan.svg";

export interface Supply {
  name: string;
  icon: string;
  hasProduction?: boolean;
}

export const supplies: Supply[] = [
  {
    name: 'points',
    icon: pointsSVGPath,
    hasProduction: false,
  },
  {
    name: 'gold',
    icon: goldSVGPath,
  },
  {
    name: 'steel',
    icon: steelSVGPath,
  },
  {
    name: 'titan',
    icon: titanSVGPath,
  },
  {
    name: 'plant',
    icon: plantSVGPath,
  },
  {
    name: 'energy',
    icon: energySVGPath,
  },
  {
    name: 'heat',
    icon: heatSVGPath,
  },
];
