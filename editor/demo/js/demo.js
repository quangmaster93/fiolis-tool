var geojsonText = document.getElementById('geojson-text');
var btnConvert = document.getElementById('btn-convert');
btnConvert.addEventListener('click', convert);

function convert() {
  var option = {
    size: [512, 512],           // size[0] is svg width, size[1] is svg height
    padding: [10, 10, 10, 10],  // paddingTop, paddingRight, paddingBottom, paddingLeft, respectively
    output: 'element',           // output type: 'string' | 'element'(only supported in browser)
    precision: 3,               // svg coordinates precision
    stroke: '#000',              // stroke color
    strokeWidth: '1px',         // stroke width
    background: '#ccc',         // svg background color, and as the fill color of polygon hole
    fill: '#fff',               // fill color
    fillOpacity: 1,             // fill opacity
    radius: 5                   // only for `Point`, `MultiPoint`
  };

  // svgContainer.innerHTML = '';
  var geojsonStr = geojsonText.value;
  var optionStr = JSON.stringify(option);
  if (geojsonStr) {
    var geojson = JSON.parse(removeSpace(geojsonStr));
    var option = JSON.parse(removeSpace(optionStr));
    svgData = geojson2svg(geojson, option);

    // After convert geojson to svg then open svg editor dialog
    $("#dialog").dialog({
      autoOpen: false,
      modal: true,
      width: 1000,
      height: 600,
      open: function(ev, ui){
        $('#svgEditor').attr('src','http://localhost:8000/editor/svg-editor-es.html');
      }
    });

    $('#dialog').dialog('open');

    $('svg-editor').css({ display: "block" });
  }
}

function removeSpace(str) {
  return str.split('').filter(function (item) {
    return (item != ' ' && item != '\n');
  }).join('');
}