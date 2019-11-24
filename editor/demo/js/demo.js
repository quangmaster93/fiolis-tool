var sheetText = document.getElementById('sheet-text');
var parcelText = document.getElementById('parcel-text');
var btnConvert = document.getElementById('btn-convert');
btnConvert.addEventListener('click', convert);

function convert() {
  var sheetNum = sheetText.value;
  var parcelNum = parcelText.value;
  convertLandInfo(sheetNum, parcelNum);
}

const convertGeojsonToSvg = function(geojson) {
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

  if (geojson) {
    svgData = geojson2svg(geojson, option);

    // After convert geojson to svg then open svg editor dialog
    $("#dialog").dialog({
      title: 'BIÊN TẬP SƠ ĐỒ THỬA ĐẤT',
      autoOpen: false,
      modal: true,
      width: 1200,
      height: 800,
      open: function(ev, ui){
        $('#svgEditor').attr('src','http://localhost:8000/editor/svg-editor-es.html');
      }
    });

    $('#dialog').dialog('open');

    $('svg-editor').css({ display: "block" });
  }
}

const convertLandInfo = function(sheetNum, parcelNum) {
  var request = new XMLHttpRequest();
  const key = `8bd33b7fd36d68baa96bf446c84011da`;
  request.open('GET', `https://api-fiolis.map4d.vn/v2/api/land/find-adjacent?code=001001003003&soTo=${sheetNum}&soThua=${parcelNum}&key=${key}`, true);
  request.onload = function() {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);

    if (request.status >= 200 && request.status < 400 &&
      data.result && data.result.features && data.result.features.length > 1) {
      // Only get geojson with format wgs84
      data.result.features.length = data.result.features.length / 2;
      convertGeojsonToSvg(data.result);
    } else {
      console.log('Occur error when request API');
    }
  }

  request.send();
};

function removeSpace(str) {
  return str.split('').filter(function (item) {
    return (item != ' ' && item != '\n');
  }).join('');
}