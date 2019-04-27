// gauge1 uses the default liquid gauge setting
var gauge1 = loadLiquidFillGauge("fillgauge1", 55);
 
// gauge2 uses the custom gauge setting
var config1 = liquidFillGaugeDefaultSettings();
config1.circleColor = "#178BCA";
config1.textColor = "#222224";
config1.waveTextColor = "#222224";
config1.waveColor = "#d64d4d";
config1.circleThickness = 0.05;
config1.textVertPosition = 0.2;
config1.waveAnimateTime = 1000;
var gauge2 = loadLiquidFillGauge("fillgauge2", 28, config1);

// gauge3 uses the custom gauge setting
var config2 = liquidFillGaugeDefaultSettings();
config2.circleColor = "#178BCA";
config2.textColor = "#222224";
config2.waveTextColor = "#222224";
config2.waveColor = "#9ed670";
config1.circleThickness = 0.05;
config2.textVertPosition = 0.2;
config2.waveAnimateTime = 1000;
var gauge3 = loadLiquidFillGauge("fillgauge3", 72, config2);


// gauge onclick responds to random fill percentages.
function NewValue() {
  return Math.round(Math.random() * 100);
  if (Math.random() > .5) {
    return Math.round(Math.random() * 100);
  } else {
    return (Math.random() * 100).toFixed(1);
  }
}