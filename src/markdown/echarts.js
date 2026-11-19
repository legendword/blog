/**
 * The ECharts build used for ```echarts blocks: the common chart types on a
 * canvas. Components that render HTML or navigate (toolbox, data view, graphic,
 * HTML tooltips) are deliberately left out.
 */
import { init, use } from "echarts/core";
import { BarChart, LineChart, PieChart, RadarChart, ScatterChart } from "echarts/charts";
import {
    AriaComponent,
    DatasetComponent,
    GridComponent,
    LegendComponent,
    MarkLineComponent,
    MarkPointComponent,
    TitleComponent,
    TooltipComponent
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

use([
    BarChart, LineChart, PieChart, RadarChart, ScatterChart,
    AriaComponent, DatasetComponent, GridComponent, LegendComponent,
    MarkLineComponent, MarkPointComponent, TitleComponent, TooltipComponent,
    CanvasRenderer
]);

export { init };
